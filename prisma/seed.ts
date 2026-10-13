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

const PAGE_SLUGS = ["home", "about", "products", "career", "contact"] as const;

const PRODUCT_SLUGS = [
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
    about: {
      title: "A connected textile partner, built for continuity.",
      body: "Asietex brings people, facilities, and expertise together to support a dependable journey from yarn to finished fabric.",
    },
    products: {
      title: "Nine products. One connected production chain.",
      body: "Explore the products behind Asietex, from spinning and twisting to dyeing, printing, garment, and finishing.",
    },
    contact: {
      title: "Let's talk about your next textile project.",
      body: "Reach our team in Jakarta for product questions, sample discussions, and commercial enquiries.",
    },
    career: {
      title: "Build the next thread of Asietex.",
      body: "Join an Asietex team shaped by curiosity, care, and disciplined work across the textile chain. Send us your profile and tell us how your craft can move us forward.",
    },
  },
  id: {
    about: {
      title: "Mitra tekstil terhubung yang dibangun untuk kesinambungan.",
      body: "Asietex menyatukan manusia, fasilitas, dan keahlian untuk mendukung perjalanan yang andal dari benang hingga kain jadi.",
    },
    products: {
      title: "Sembilan produk. Satu rantai produksi yang terhubung.",
      body: "Jelajahi produk Asietex, mulai dari spinning dan twisting hingga dyeing, printing, garment, dan finishing.",
    },
    contact: {
      title: "Mari bicarakan proyek tekstil Anda berikutnya.",
      body: "Hubungi tim kami di Jakarta untuk pertanyaan produk, diskusi sampel, dan kebutuhan komersial.",
    },
    career: {
      title: "Bangun benang masa depan Asietex.",
      body: "Bergabunglah dengan tim Asietex yang menghubungkan manusia, proses, dan peluang di sepanjang rantai tekstil. Kirimkan profil Anda dan ceritakan bagaimana keahlian Anda dapat mendorong kami maju.",
    },
  },
  pt: {
    about: {
      title: "Um parceiro têxtil ligado, construído para dar continuidade.",
      body: "A Asietex reúne pessoas, instalações e conhecimento para apoiar uma jornada fiável, do fio ao tecido acabado.",
    },
    products: {
      title: "Nove produtos. Uma cadeia de produção ligada.",
      body: "Explore os produtos da Asietex, desde a fiação e torção até ao tingimento, impressão, confeção e acabamento.",
    },
    contact: {
      title: "Vamos falar sobre o seu próximo projeto têxtil.",
      body: "Contacte a nossa equipa em Jacarta para questões sobre produtos, amostras e conversas comerciais.",
    },
    career: {
      title: "Construa o próximo fio da Asietex.",
      body: "Junte-se à equipa da Asietex, que liga pessoas, processos e possibilidades em toda a cadeia têxtil. Envie o seu perfil e diga-nos como a sua experiência pode fazer-nos avançar.",
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
    catalogPlacements: ["home", "product", "footer"],
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
      const translation = {
        title:
          PAGE_COPY[locale][slug]?.title ||
          (slug === "home" ? title : `${title} - ${slug}`),
        body: PAGE_COPY[locale][slug]?.body || body,
      };

      await prisma.translation.upsert({
        where: { pageId_locale: { pageId: page.id, locale } },
        create: {
          pageId: page.id,
          locale,
          ...translation,
        },
        update: translation,
      });
    }
  }
}

async function seedProducts() {
  for (const [index, slug] of PRODUCT_SLUGS.entries()) {
    const productData = {
      order: index + 1,
      capacity: slug === "dyeing" ? "50,000 t / yr" : "To be provided",
      products: [
        `${slug.replaceAll("-", " ")} product range`,
        "Custom textile production",
      ],
      machinery: "Asian and European machinery",
      gallery: [
        `${DUMMY_IMAGE_BASE}?text=${encodeURIComponent(`${slug} production`)}`,
        `${DUMMY_IMAGE_BASE}?text=${encodeURIComponent(`${slug} products`)}`,
      ],
      status: "PUBLISHED" as const,
    };

    const product = await prisma.product.upsert({
      where: { slug },
      create: {
        slug,
        ...productData,
      },
      update: productData,
    });

    for (const locale of LOCALES) {
      const translation = {
        title: slug.replaceAll("-", " "),
        body: `${slug.replaceAll("-", " ")} products for connected textile production.`,
      };

      await prisma.translation.upsert({
        where: { productId_locale: { productId: product.id, locale } },
        create: {
          productId: product.id,
          locale,
          ...translation,
        },
        update: translation,
      });
    }

    const mediaUrl = `${DUMMY_IMAGE_BASE}?text=${encodeURIComponent(`${slug} product`)}`;
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
          productId: product.id,
        },
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
  await seedProducts();
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
