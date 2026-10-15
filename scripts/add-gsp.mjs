import fs from 'node:fs';

const GSP = `
export function generateStaticParams() {
  return [{ locale: 'id' }, { locale: 'en' }, { locale: 'pt' }];
}

`;

const files = [
  'app/(site)/[locale]/about/page.tsx',
  'app/(site)/[locale]/career/page.tsx',
  'app/(site)/[locale]/contact/page.tsx',
  'app/(site)/[locale]/marketing-contact/page.tsx',
  'app/(site)/[locale]/products/page.tsx',
];

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  // Insert right before the first `export async function`
  c = c.replace(/(export async function )/, GSP + '$1');
  fs.writeFileSync(f, c, 'utf8');
  console.log('Updated:', f);
}
