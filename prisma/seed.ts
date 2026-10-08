import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { scryptSync } from "node:crypto";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// ---------------------------------------------------------------------------
// Konstanta & data seed
// ---------------------------------------------------------------------------

const PASSWORD_SALT = "asietex-demo-salt"; // hanya untuk demo
const CATALOG_URL = "https://e-catalog.asietex.web.id";

const PAGE_SLUGS = ["home", "about", "products", "network", "contact"] as const;

const DIVISION_SLUGS = [
  "spinning",
  "twisting",
  "knitting",
  "weaving",
  "dyeing",
  "yarn-dyeing",
  "garment",
  "printing",
  "finishing",
] as const;

const LOCALES = ["en", "id", "pt"] as const;
type Locale = (typeof LOCALES)[number];

const COPY: Record<Locale, { title: string; body: string }> = {
  en: {
    title: "Integrated textile manufacturer",
    body: "Example CMS content. Replace with approved commercial material before publishing.",
  },
  id: {
    title: "Produsen tekstil terintegrasi",
    body: "Konten contoh CMS. Ganti dengan materi komersial yang telah disetujui sebelum publikasi.",
  },
  pt: {
    title: "Fabricante têxtil integrado",
    body: "Conteúdo de exemplo do CMS. Substitua pelo material comercial aprovado antes da publicação.",
  },
};

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function hashPassword(value: string) {
  const hash = scryptSync(value, PASSWORD_SALT, 64).toString("hex");
  return `${PASSWORD_SALT}:${hash}`;
}

function getSeedEnv() {
  const {
    SEED_ADMIN_EMAIL: adminEmail,
    SEED_ADMIN_PASSWORD: adminPassword,
    SEED_STAFF_EMAIL: staffEmail,
    SEED_STAFF_PASSWORD: staffPassword,
  } = process.env;

  if (!adminEmail || !adminPassword || !staffEmail || !staffPassword) {
    throw new Error(
      "Set SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_STAFF_EMAIL, and SEED_STAFF_PASSWORD before running the seed."
    );
  }

  return { adminEmail, adminPassword, staffEmail, staffPassword };
}

// ---------------------------------------------------------------------------
// Seeder
// ---------------------------------------------------------------------------

async function seedSiteSetting() {
  await prisma.siteSetting.upsert({
    where: { id: "site" },
    create: { id: "site", catalogUrl: CATALOG_URL, catalogOn: true },
    update: {},
  });
}

async function seedUser(
  name: string,
  email: string,
  password: string,
  role: "ADMIN" | "STAFF"
) {
  const passwordHash = hashPassword(password);

  await prisma.user.upsert({
    where: { email },
    create: { name, email, passwordHash, role },
    update: { active: true, passwordHash, role },
  });
}

async function seedPages() {
  for (const slug of PAGE_SLUGS) {
    const page = await prisma.page.upsert({
      where: { slug },
      create: { slug, status: "PUBLISHED" },
      update: {},
    });

    for (const locale of LOCALES) {
      const { title, body } = COPY[locale];

      await prisma.translation.upsert({
        where: { pageId_locale: { pageId: page.id, locale } },
        create: {
          pageId: page.id,
          locale,
          title: slug === "home" ? title : `${title} — ${slug}`,
          body,
        },
        update: {},
      });
    }
  }
}

async function seedDivisions() {
  for (const [index, slug] of DIVISION_SLUGS.entries()) {
    const division = await prisma.division.upsert({
      where: { slug },
      create: {
        slug,
        order: index + 1,
        capacity: slug === "dyeing" ? "50,000 t / yr" : "To be provided",
        products: ["Example product A", "Example product B"],
        machinery: "Asian and European machinery",
        status: "PUBLISHED",
      },
      update: {},
    });

    for (const locale of LOCALES) {
      await prisma.translation.upsert({
        where: { divisionId_locale: { divisionId: division.id, locale } },
        create: {
          divisionId: division.id,
          locale,
          title: slug.replaceAll("-", " "),
          body: COPY[locale].body,
        },
        update: {},
      });
    }
  }
}

async function main() {
  const { adminEmail, adminPassword, staffEmail, staffPassword } = getSeedEnv();

  await seedSiteSetting();
  await seedUser("Asietex Admin", adminEmail, adminPassword, "ADMIN");
  await seedUser("Asietex Staff", staffEmail, staffPassword, "STAFF");
  await seedPages();
  await seedDivisions();
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
