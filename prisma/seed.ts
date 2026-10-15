import "dotenv/config";
import { Prisma, PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { scryptSync } from "node:crypto";

import { ABOUT_CONTENT } from "./seed-data/about";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

const prisma = new PrismaClient({ adapter: new PrismaMariaDb(databaseUrl) });

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
type ProductSlug = (typeof PRODUCT_SLUGS)[number];

const PRODUCT_GALLERIES: Record<ProductSlug, [string, string]> = {
  spinning: ["/products/1-spinning-4.webp", "/products/1-spinning-3.webp"],
  twisting: ["/products/IMG_3588.webp", "/products/IMG_3589.webp"],
  knitting: ["/products/3-knitting.webp", "/products/3-knitting-2.webp"],
  weaving: ["/products/4-weaving-1.webp", "/products/4-weaving-2.webp"],
  dyeing: ["/products/IMG_4017.webp", "/products/IMG_4022.webp"],
  "yarn-dyeing": ["/products/IMG_3726-yarn.webp", "/products/IMG_3733.webp"],
  garment: ["/products/IMG_3025.webp", "/products/IMG_3028.webp"],
  printing: ["/products/IMG_3063.webp", "/products/IMG_3065.webp"],
  finishing: ["/products/IMG_3548.webp", "/products/IMG_3557.webp"],
};

const PRODUCT_TITLES: Record<Locale, Record<ProductSlug, string>> = {
  en: {
    spinning: "Spinning",
    twisting: "Twisting",
    knitting: "Knitting",
    weaving: "Weaving",
    dyeing: "Dyeing",
    "yarn-dyeing": "Yarn Dyeing",
    garment: "Garment",
    printing: "Printing",
    finishing: "Finishing",
  },
  id: {
    spinning: "Pemintalan",
    twisting: "Pemuntiran",
    knitting: "Perajutan",
    weaving: "Pertenunan",
    dyeing: "Pencelupan",
    "yarn-dyeing": "Pencelupan Benang",
    garment: "Garmen",
    printing: "Pencetakan",
    finishing: "Penyempurnaan",
  },
  pt: {
    spinning: "Fiação",
    twisting: "Torção",
    knitting: "Malharia",
    weaving: "Tecelagem",
    dyeing: "Tingimento",
    "yarn-dyeing": "Tingimento de Fios",
    garment: "Vestuário",
    printing: "Estamparia",
    finishing: "Acabamento",
  },
};

const PRODUCT_DETAIL_COPY: Record<
  Locale,
  {
    body: (title: string) => string;
    range: (title: string) => string;
    custom: string;
    capacityPending: string;
    machinery: string;
  }
> = {
  en: {
    body: (title) => `${title} products for connected textile production.`,
    range: (title) => `${title} product range`,
    custom: "Custom textile production",
    capacityPending: "To be provided",
    machinery: "Asian and European machinery",
  },
  id: {
    body: (title) =>
      `Produk ${title.toLowerCase()} untuk rantai produksi tekstil yang terintegrasi.`,
    range: (title) => `Ragam produk ${title.toLowerCase()}`,
    custom: "Produksi tekstil sesuai kebutuhan",
    capacityPending: "Akan diinformasikan",
    machinery: "Mesin berteknologi Asia dan Eropa",
  },
  pt: {
    body: (title) =>
      `Produtos de ${title.toLowerCase()} para uma produção têxtil integrada.`,
    range: (title) => `Gama de produtos de ${title.toLowerCase()}`,
    custom: "Produção têxtil personalizada",
    capacityPending: "A fornecer",
    machinery: "Maquinaria asiática e europeia",
  },
};

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
      title: "Company profile",
      body: "We has been a constant & reassuring presence during the entire history of our business. Asietex origins can be traced back to 1985, since then we evolved to become a recognized and important presence on all domestic and international markets. Asietex is an integrated textile company engaged in the manufacture of textile products from yarn to fabrics. 85% of the fabrics topline comes from cotton/ rayon fabrics, the balance comes from polyester. The factory equiped with a sophisticated machineries, a combination of Asian & European technology which has given us a competitive advantage and our workforce is well trained. With these, we ensures the most effective and efficient use of resources. We are strongly competitive and proud to delivery a variety of high quality products to meet the demand of the global market.",
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
      title: "Profil perusahaan",
      body: "Kami telah menjadi sosok yang konsisten dan dapat diandalkan sepanjang perjalanan bisnis kami. Asietex bermula pada tahun 1985, dan sejak saat itu kami terus berkembang hingga menjadi pemain penting yang diakui di pasar domestik maupun internasional. Asietex adalah perusahaan tekstil terintegrasi yang bergerak di bidang manufaktur produk tekstil, mulai dari tahap pemintalan benang hingga produksi kain. Sebanyak 85% dari pendapatan penjualan kain kami berasal dari bahan katun/rayon, sementara sisanya berasal dari bahan poliester. Pabrik kami dilengkapi dengan mesin-mesin canggih perpaduan teknologi Asia dan Eropa yang memberikan kami keunggulan kompetitif, serta didukung oleh tenaga kerja yang terlatih dengan baik. Berkat hal-hal tersebut, kami dapat memastikan penggunaan sumber daya yang paling efektif dan efisien. Kami memiliki daya saing yang kuat dan bangga dapat menghadirkan beragam produk berkualitas tinggi untuk memenuhi permintaan pasar global.",
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
      title: "Perfil da empresa",
      body: "A Asietex tem sido uma presença constante e tranquilizadora ao longo de toda a história da nossa empresa. As origens da Asietex remontam a 1985 e, desde então, evoluímos para nos tornarmos uma presença reconhecida e importante em todos os mercados nacionais e internacionais. A Asietex é uma empresa têxtil integrada que opera no fabrico de produtos têxteis, desde o fio ao tecido. 85% da nossa produção de tecidos é composta por algodão/rayon, e o restante por poliéster. A fábrica está equipada com maquinaria sofisticada, uma combinação de tecnologias asiáticas e europeias que nos confere uma vantagem competitiva, e a nossa equipa é altamente qualificada. Com isto, garantimos a utilização mais eficaz e eficiente dos recursos. Somos altamente competitivos e orgulhamo-nos de oferecer uma variedade de produtos de alta qualidade para satisfazer a procura do mercado global.",
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

const PARTNERS = [
  { name: "Adidas", src: "/partners/adidas.webp" },
  { name: "New Balance", src: "/partners/new-balance.webp" },
  { name: "Nike", src: "/partners/nike.webp" },
  { name: "Puma", src: "/partners/puma.webp" },
  { name: "Reebok", src: "/partners/reebok.webp" },
  { name: "Umbro", src: "/partners/umbro.webp" },
];

const MARKETING_CONTACTS = [
  {
    name: "Oki Haryanto",
    role: "In-House Marketing Manager (Garment & Uniform Division)",
    language: "Indonesian",
    phone: "(+62) 822-1018-0344",
    phoneHref: "+6282210180344",
    email: "oki.haryanto@asietex.com",
  },
  {
    name: "Dias Riski Yandi",
    role: "Group A Marketing Manager (Motif & Voile)",
    language: "Indonesian",
    phone: "(+62) 857-1755-5253",
    phoneHref: "+6285717555253",
    email: "dias.riski@asietex.com",
  },
  {
    name: "Yudi Prahmana",
    role: "Group B Marketing Manager (Cotton Spdx Enzym & Striped)",
    language: "Indonesian",
    phone: "(+62) 857-8094-8007",
    phoneHref: "+6285780948007",
    email: "yudhi.prahmana@asietex.com",
  },
  {
    name: "Yuni Elpiyanti",
    role: "Group C Marketing Manager (Woven AJL & WJL)",
    language: "Indonesian, English",
    phone: "(+62) 852-1677-1919",
    phoneHref: "+6285216771919",
    email: "yuni.elpiyanti@asietex.com",
  },
  {
    name: "Nurdjanah",
    role: "Group D Marketing Manager (Woven WJL Bellano & Velvet)",
    language: "Indonesian, English",
    phone: "(+62) 822-9700-4135",
    phoneHref: "+6282297004135",
    email: "nurdjanah@asietex.com",
  },
  {
    name: "Hendra Wijaya",
    role: "Marketing Manager (Printing)",
    language: "Indonesian, English",
    phone: "(+62) 818-0886-2111",
    phoneHref: "+6281808862111",
    email: "hendra.wijaya@asietex.com",
  },
  {
    name: "Nia Komalasari",
    role: "Fabric Marketing",
    language: "Indonesian",
    phone: "(+62) 822-1902-4589",
    phoneHref: "+6282219024589",
    email: "nia.komalasari@asietex.com",
  },
  {
    name: "Nadia Hermawan",
    role: "Export Import",
    language: "Indonesian, English",
    phone: "(+62) 895-3933-75890",
    phoneHref: "+62895393375890",
    email: "nadia.hernawan@asietex.com",
  },
  {
    name: "Ajeng Rena Sari",
    role: "Garment Marketing",
    language: "Indonesian",
    phone: "(+62) 822-0067-10849",
    phoneHref: "+62822006710849",
    email: "marketing@ptsgu.co.id",
  },
  {
    name: "Ali Burhan",
    role: "Italy Division Manager",
    language: "Indonesian, English, Mandarin, Italian",
    phone: "(+39) 388-376-6525",
    phoneHref: "+393883766525",
    email: "aliburhan_79@yahoo.com",
  },
  {
    name: "Lucia Wang",
    role: "Italy Office Manager",
    language: "English, Mandarin, Italian",
    phone: "(+39) 327-341-7660",
    phoneHref: "+393273417660",
    email: "luci.wang88@yahoo.com",
  },
  {
    name: "Priscillia Boissenin",
    role: "France Division Manager",
    language: "Indonesian, English, Mandarin, French",
    phone: "(+33) 630-864-465",
    phoneHref: "+33630864465",
    email: "prisboissenin@outlook.fr",
  },
  {
    name: "Gabriela Maia / Bruno",
    role: "Portugal Fabric, Yarn & Fiber Marketing",
    language: "Portuguese, English",
    phone: "(+351) 913-296-231",
    phoneHref: "+351913296231",
    email: "comercial@atlantidragao.pt",
  },
  {
    name: "Arif Kurnia",
    role: "Marketing Lace / Brocade",
    language: "Indonesian",
    phone: "(+62) 813-2303-3433",
    phoneHref: "+6281323033433",
    email: "arifkurnia@asietex.com",
  },
  {
    name: "Bambang Sihono",
    role: "Customer Service/Complaints",
    language: "Indonesian, English, Mandarin",
    phone: "",
    phoneHref: "",
    email: "bambangsihono@hotmail.com",
  },
] as const;

const MARKETING_CONTACTS_DATA = {
  en: MARKETING_CONTACTS,
  id: MARKETING_CONTACTS,
  pt: MARKETING_CONTACTS,
};

const CONTENT_COLLECTIONS = [
  {
    key: "about-company",
    data: ABOUT_CONTENT,
  },
  {
    key: "home-social-proof",
    data: {
      en: {
        partners: PARTNERS,
        testimonials: [
          {
            quote:
              "Clear communication at every stage gives our team more confidence when planning production.",
            attribution: "Sample buyer · Europe",
          },
          {
            quote:
              "Having one partner from material selection to finished fabric makes each decision easier to follow.",
            attribution: "Sample buyer · Asia",
          },
        ],
      },
      id: {
        partners: PARTNERS,
        testimonials: [
          {
            quote:
              "Komunikasi yang jelas di setiap tahap membuat tim kami lebih percaya diri saat merencanakan produksi.",
            attribution: "Contoh buyer · Eropa",
          },
          {
            quote:
              "Memiliki satu mitra sejak pemilihan material hingga kain jadi membuat setiap keputusan lebih mudah diikuti.",
            attribution: "Contoh buyer · Asia",
          },
        ],
      },
      pt: {
        partners: PARTNERS,
        testimonials: [
          {
            quote:
              "A comunicação consistente em cada etapa da produção facilita o planeamento da nossa equipa.",
            attribution: "Comprador de exemplo · Europa",
          },
          {
            quote:
              "Um único parceiro responsável dá-nos mais clareza desde a seleção do material até ao tecido acabado.",
            attribution: "Comprador de exemplo · Ásia",
          },
        ],
      },
    },
  },
  {
    key: "career-openings",
    data: {
      en: [
        {
          role: "Production Planner",
          location: "Jakarta",
          type: "Full time",
          postedAt: "Posted 2 days ago",
          applicationUrl: "https://www.google.com",
        },
        {
          role: "Quality Assurance Specialist",
          location: "Cikande Factory",
          type: "Full time",
          postedAt: "Posted 5 days ago",
          applicationUrl: "https://www.google.com",
        },
        {
          role: "Textile Process Engineer",
          location: "Cikampek Factory",
          type: "Full time",
          postedAt: "Posted 1 week ago",
          applicationUrl: "https://www.google.com",
        },
      ],
      id: [
        {
          role: "Perencana Produksi",
          location: "Jakarta",
          type: "Penuh waktu",
          postedAt: "Diposting 2 hari lalu",
          applicationUrl: "https://www.google.com",
        },
        {
          role: "Spesialis Quality Assurance",
          location: "Pabrik Cikande",
          type: "Penuh waktu",
          postedAt: "Diposting 5 hari lalu",
          applicationUrl: "https://www.google.com",
        },
        {
          role: "Engineer Proses Tekstil",
          location: "Pabrik Cikampek",
          type: "Penuh waktu",
          postedAt: "Diposting 1 minggu lalu",
          applicationUrl: "https://www.google.com",
        },
      ],
      pt: [
        {
          role: "Planeador de Produção",
          location: "Jacarta",
          type: "Tempo inteiro",
          postedAt: "Publicado há 2 dias",
          applicationUrl: "https://www.google.com",
        },
        {
          role: "Especialista de Qualidade",
          location: "Operações Fabris de Cikande",
          type: "Tempo inteiro",
          postedAt: "Publicado há 5 dias",
          applicationUrl: "https://www.google.com",
        },
        {
          role: "Engenheiro de Processos Têxteis",
          location: "Operações Fabris de Cikampek",
          type: "Tempo inteiro",
          postedAt: "Publicado há 1 semana",
          applicationUrl: "https://www.google.com",
        },
      ],
    },
  },
  {
    key: "marketing-contacts",
    data: MARKETING_CONTACTS_DATA,
  },
] as const;

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

async function seedContentCollections() {
  for (const collection of CONTENT_COLLECTIONS) {
    await prisma.contentCollection.upsert({
      where: { key: collection.key },
      create: {
        key: collection.key,
        data: collection.data,
        status: "PUBLISHED",
      },
      update: {
        data: collection.data,
        status: "PUBLISHED",
        draft: Prisma.DbNull,
      },
    });
  }
}

async function seedProducts() {
  await prisma.mediaAsset.deleteMany({
    where: {
      productId: { not: null },
      url: { startsWith: DUMMY_IMAGE_BASE },
    },
  });

  for (const [index, slug] of PRODUCT_SLUGS.entries()) {
    const productData = {
      order: index + 1,
      capacity: slug === "dyeing" ? "50,000 t / yr" : "To be provided",
      products: [
        `${slug.replaceAll("-", " ")} product range`,
        "Custom textile production",
      ],
      machinery: "Asian and European machinery",
      gallery: PRODUCT_GALLERIES[slug],
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
      const localizedTitle = PRODUCT_TITLES[locale][slug];
      const localizedCopy = PRODUCT_DETAIL_COPY[locale];
      const translation = {
        title: localizedTitle,
        body: localizedCopy.body(localizedTitle),
        capacity:
          slug === "dyeing" ? "50,000 t / yr" : localizedCopy.capacityPending,
        products: [localizedCopy.range(localizedTitle), localizedCopy.custom],
        machinery: localizedCopy.machinery,
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
  }
}

async function main() {
  const { adminEmail, adminPassword, staffEmail, staffPassword } = getSeedEnv();

  await seedSiteSetting();
  await seedUser("Asietex Admin", adminEmail, adminPassword, "ADMIN");
  await seedUser("Asietex Staff", staffEmail, staffPassword, "STAFF");
  await seedPages();
  await seedProducts();
  await seedContentCollections();
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
