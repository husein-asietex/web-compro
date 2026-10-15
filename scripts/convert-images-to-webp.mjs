import fs from 'node:fs';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import sharp from 'sharp';

const TARGET_DIR = path.resolve(process.cwd(), process.argv[2] || 'out');
const EXTENSIONS_TO_CONVERT = new Set(['.png', '.jpg', '.jpeg']);
const REFERENCE_EXTENSIONS = new Set(['.html', '.js', '.css', '.json', '.ts', '.tsx']);

async function getFiles(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Retry deleting a file up to `retries` times with a delay between each attempt.
 * Also strips the read-only flag (Windows EPERM) before each attempt.
 */
async function unlinkWithRetry(filePath, retries = 5, delayMs = 300) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await fs.promises.chmod(filePath, 0o666);
      await fs.promises.unlink(filePath);
      return;
    } catch (err) {
      if ((err.code === 'EPERM' || err.code === 'EACCES') && attempt < retries) {
        await sleep(delayMs * attempt);
      } else {
        throw err;
      }
    }
  }
}

/**
 * Update all image extension references (.jpg, .jpeg, .png) → .webp
 * inside HTML, JS, CSS, and JSON files within out/.
 */
async function updateReferencesInOutDir(allFiles) {
  console.log('\n🔗 Updating image references in HTML/JS/CSS/JSON files...');

  // Regex: match .jpg, .jpeg, .png NOT followed by another word char
  // Handles query strings, quotes, spaces, closing tags, etc.
  const refRegex = /\.(jpg|jpeg|png)(?=[^a-zA-Z0-9]|$)/gi;

  const referenceFiles = allFiles.filter((f) =>
    REFERENCE_EXTENSIONS.has(path.extname(f).toLowerCase()),
  );

  let updatedCount = 0;

  for (const filePath of referenceFiles) {
    const original = await fs.promises.readFile(filePath, 'utf8');
    const updated = original.replace(refRegex, '.webp');

    if (updated !== original) {
      await fs.promises.writeFile(filePath, updated, 'utf8');
      const relPath = path.relative(TARGET_DIR, filePath);
      console.log(`  ✔ Updated references in: ${relPath}`);
      updatedCount++;
    }
  }

  console.log(`  → ${updatedCount} file(s) had references updated.`);
}

async function convertAllImages() {
  console.log('🔍 Converting images in out/ to .webp format...');

  if (!fs.existsSync(TARGET_DIR)) {
    console.error('❌ out/ directory not found. Run `next build` first.');
    process.exit(1);
  }

  const allFiles = await getFiles(TARGET_DIR);
  const imagesToConvert = allFiles.filter((filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    return EXTENSIONS_TO_CONVERT.has(ext);
  });

  if (imagesToConvert.length === 0) {
    console.log('✅ No JPG/PNG images found in out/. Nothing to convert.');
    await updateReferencesInOutDir(allFiles);
    return;
  }

  console.log(`🚀 Found ${imagesToConvert.length} image(s) to convert to .webp...`);

  let successCount = 0;
  let failCount = 0;

  async function convertImage(filePath) {
    const parsed = path.parse(filePath);
    const targetWebpPath = path.join(parsed.dir, `${parsed.name}.webp`);
    const relPath = path.relative(TARGET_DIR, filePath);

    try {
      await sharp(filePath).webp({ quality: 85, effort: 4 }).toFile(targetWebpPath);
      await unlinkWithRetry(filePath);
      console.log(`  ✔ ${relPath} → ${parsed.name}.webp`);
      successCount++;
    } catch (err) {
      console.error(`  ❌ Failed to convert/remove ${relPath}: ${err.message}`);
      failCount++;
    }
  }

  // Sharp runs independently per image. A small pool keeps conversion fast
  // enough for CI while avoiding the memory spike of converting all images.
  const concurrency = 8;
  for (let index = 0; index < imagesToConvert.length; index += concurrency) {
    await Promise.all(
      imagesToConvert.slice(index, index + concurrency).map(convertImage),
    );
  }

  console.log(`\n✨ Converted: ${successCount}, Failed: ${failCount}.`);

  if (failCount > 0) {
    process.exit(1);
  }

  // After converting images, update all references in HTML/JS/CSS/JSON
  await updateReferencesInOutDir(allFiles);

  console.log('\n🎉 Done! out/ is ready to deploy to cPanel.');
}

convertAllImages().catch((err) => {
  console.error('Fatal error during image conversion:', err);
  process.exit(1);
});
