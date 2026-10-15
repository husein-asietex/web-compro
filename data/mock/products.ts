// ---------------------------------------------------------------------------
// Static mock data for products — derived from prisma/seed.ts
// Edit this file to update product content without touching the database.
// ---------------------------------------------------------------------------

export const LOCALES = ["en", "id", "pt"] as const;
export type Locale = (typeof LOCALES)[number];

export const PRODUCT_SLUGS = [
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

export type ProductSlug = (typeof PRODUCT_SLUGS)[number];

// Hero image per slug (used as fallback when no gallery image is available)
export const PRODUCT_HERO_IMAGES: Record<ProductSlug, string> = {
  spinning: "/products/1-spinning-4.webp",
  twisting: "/products/IMG_3588.webp",
  knitting: "/products/3-knitting.webp",
  weaving: "/products/4-weaving-1.webp",
  dyeing: "/products/IMG_4017.webp",
  "yarn-dyeing": "/products/IMG_3726.webp",
  garment: "/products/IMG_3025.webp",
  printing: "/products/IMG_3063.webp",
  finishing: "/products/IMG_3548.webp",
};

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

// ---------------------------------------------------------------------------
// Product type (mirrors the shape used in product-detail-page)
// ---------------------------------------------------------------------------

export interface StaticProductTranslation {
  title: string;
  body: string;
  capacity: string;
  products: string[];
  machinery: string;
}

export interface StaticProduct {
  slug: ProductSlug;
  order: number;
  capacity: string;
  products: string[];
  machinery: string;
  gallery: string[];
  heroImage: string;
  videoId?: string;
  videoEn?: string;
  videoPt?: string;
  translations: Record<Locale, StaticProductTranslation>;
}

// ---------------------------------------------------------------------------
// Build static product list
// ---------------------------------------------------------------------------

export const PRODUCTS: StaticProduct[] = PRODUCT_SLUGS.map((slug, index) => {
  const isDyeing = slug === "dyeing";

  const translations = Object.fromEntries(
    LOCALES.map((locale) => {
      const title = PRODUCT_TITLES[locale][slug];
      const copy = PRODUCT_DETAIL_COPY[locale];
      return [
        locale,
        {
          title,
          body: copy.body(title),
          capacity: isDyeing ? "50,000 t / yr" : copy.capacityPending,
          products: [copy.range(title), copy.custom],
          machinery: copy.machinery,
        } satisfies StaticProductTranslation,
      ];
    }),
  ) as Record<Locale, StaticProductTranslation>;

  return {
    slug,
    order: index + 1,
    capacity: isDyeing ? "50,000 t / yr" : "To be provided",
    products: [
      `${slug.replaceAll("-", " ")} product range`,
      "Custom textile production",
    ],
    machinery: "Asian and European machinery",
    gallery: PRODUCT_GALLERIES[slug],
    heroImage: PRODUCT_HERO_IMAGES[slug],
    translations,
  };
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getProductBySlug(slug: string): StaticProduct | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
