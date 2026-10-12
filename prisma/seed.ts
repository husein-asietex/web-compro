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
const DUMMY_IMAGE_BASE = "https://placehold.co/1200x800/png";

const PAGE_SLUGS = [
  "home",
  "about",
  "products",
  "network",
  "career",
  "contact",
] as const;

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

const PAGE_COPY: Record<
  Locale,
  Partial<Record<(typeof PAGE_SLUGS)[number], { title: string; body: string }>>
> = {
  en: {
    career: {
      title: "Build the next thread of Asietex.",
      body: "Careers at Asietex are shaped by curiosity, care, and the discipline to make good work repeatable. Join a team connecting people, process, and possibility across the textile chain.\n\nWe are building a growing team across production, quality, engineering, commercial, and operations. Send us your profile and tell us where your craft can move the work forward.",
    },
  },
  id: {
    career: {
      title: "Bangun benang masa depan Asietex.",
      body: "Karier di Asietex dibentuk oleh rasa ingin tahu, kepedulian, dan disiplin untuk membuat pekerjaan baik dapat diulang. Bergabunglah dengan tim yang menghubungkan manusia, proses, dan peluang di sepanjang rantai tekstil.\n\nKami membangun tim di bidang produksi, kualitas, engineering, komersial, dan operasional. Kirimkan profil Anda dan ceritakan bagaimana keahlian Anda dapat mendorong pekerjaan ini maju.",
    },
  },
  pt: {
    career: {
      title: "Construa o próximo fio da Asietex.",
      body: "As carreiras na Asietex são feitas de curiosidade, cuidado e disciplina para tornar o bom trabalho repetível. Junte-se a uma equipa que liga pessoas, processos e possibilidades em toda a cadeia têxtil.\n\nEstamos a formar uma equipa nas áreas de produção, qualidade, engenharia, comercial e operações. Envie o seu perfil e diga-nos como a sua experiência pode fazer o trabalho avançar.",
    },
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
      "Set SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_STAFF_EMAIL, and SEED_STAFF_PASSWORD before running the seed.",
    );
  }

  return { adminEmail, adminPassword, staffEmail, staffPassword };
}

// ---------------------------------------------------------------------------
// Seeder
// ---------------------------------------------------------------------------

async function seedSiteSetting() {
  const settings = {
    catalogUrl: CATALOG_URL,
    catalogOn: true,
    catalogLabelEn: "Explore e-catalog",
    catalogLabelId: "Buka e-catalog",
    catalogLabelPt: "Ver e-catalog",
    catalogPlacements: [
      "home",
      "about",
      "products",
      "division",
      "network",
      "career",
      "contact",
      "footer",
    ],
    catalogOpenNewTab: true,
  };

  await prisma.siteSetting.upsert({
    where: { id: "site" },
    create: { id: "site", ...settings },
    update: settings,
  });
}

async function seedUser(
  name: string,
  email: string,
  password: string,
  role: "ADMIN" | "STAFF",
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
          title:
            PAGE_COPY[locale][slug]?.title ||
            (slug === "home" ? title : `${title} — ${slug}`),
          body: PAGE_COPY[locale][slug]?.body || body,
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
        gallery: [
          `${DUMMY_IMAGE_BASE}?text=${encodeURIComponent(`${slug} production`)}`,
          `${DUMMY_IMAGE_BASE}?text=${encodeURIComponent(`${slug} products`)}`,
        ],
        status: "PUBLISHED",
      },
      update: {
        gallery: [
          `${DUMMY_IMAGE_BASE}?text=${encodeURIComponent(`${slug} production`)}`,
          `${DUMMY_IMAGE_BASE}?text=${encodeURIComponent(`${slug} products`)}`,
        ],
      },
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

    const mediaUrl = `${DUMMY_IMAGE_BASE}?text=${encodeURIComponent(`${slug} division`)}`;
    const existingMedia = await prisma.mediaAsset.findFirst({
      where: { url: mediaUrl },
    });

    if (!existingMedia) {
      await prisma.mediaAsset.create({
        data: {
          url: mediaUrl,
          altEn: `${slug} textile production`,
          altId: `Produksi tekstil ${slug}`,
          altPt: `Produção têxtil ${slug}`,
          credit: "Dummy placeholder — replace before production",
          approved: true,
          divisionId: division.id,
        },
      });
    }
  }
}

async function seedNetworkLocations() {
  const locations = [
    {
      slug: "indonesia-hq",
      name: "Asietex Headquarters & Factory",
      country: "Indonesia",
      city: "Jakarta",
      address: "Dummy address — replace with approved company address",
      kind: "HQ & Factory",
      order: 1,
    },
    {
      slug: "europe-warehouse",
      name: "Europe Warehouse",
      country: "Portugal",
      city: "Porto",
      address: "Dummy address — replace before production",
      kind: "Warehouse",
      order: 2,
    },
  ];

  for (const location of locations) {
    await prisma.networkLocation.upsert({
      where: { slug: location.slug },
      create: { ...location, status: "PUBLISHED" },
      update: location,
    });
  }
}

async function main() {
  const { adminEmail, adminPassword, staffEmail, staffPassword } = getSeedEnv();

  await seedSiteSetting();
  await seedUser("Asietex Admin", adminEmail, adminPassword, "ADMIN");
  await seedUser("Asietex Staff", staffEmail, staffPassword, "STAFF");
  await seedPages();
  await seedDivisions();
  await seedNetworkLocations();
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
