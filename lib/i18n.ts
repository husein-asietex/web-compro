export const locales = ["en", "id", "pt"] as const;

export type Locale = (typeof locales)[number];

/** Locale shown when visitors open the non-localized root route. */
export const defaultLocale: Locale = "en";

export const isLocale = (value: string): value is Locale =>
  locales.includes(value as Locale);

/**
 * Teks default per bahasa. Dipakai sebagai fallback ketika konten dari CMS
 * (tabel translation) belum tersedia.
 *
 * `nav` berurutan: About, Products, Network, Contact.
 */
export const copy = {
  en: {
    nav: ["About", "Products", "Network", "Contact"],
    eyebrow: "Integrated textile manufacturer · Indonesia",
    hero: "From raw cotton to finished fabric, under one roof.",
    body: "Asietex brings spinning, knitting, weaving, dyeing and finishing together for brands and converters across Europe and Asia.",
    catalog: "Explore e-catalog",
    explore: "Explore divisions",
    chain: "Nine divisions, one accountable chain",
    headline: "Built for continuity, not handoffs.",
  },

  id: {
    nav: ["Tentang", "Produk", "Jaringan", "Kontak"],
    eyebrow: "Produsen tekstil terintegrasi · Indonesia",
    hero: "Dari kapas mentah hingga kain jadi, dalam satu atap.",
    body: "Asietex mengintegrasikan pemintalan, rajut, tenun, pencelupan, dan finishing untuk brand serta konverter di Eropa dan Asia.",
    catalog: "Buka e-catalog",
    explore: "Lihat divisi",
    chain: "Sembilan divisi, satu rantai yang bertanggung jawab",
    headline: "Dibangun untuk kesinambungan, bukan perpindahan proses.",
  },

  pt: {
    nav: ["Sobre", "Produtos", "Rede", "Contacto"],
    eyebrow: "Fabricante têxtil integrado · Indonésia",
    hero: "Do algodão bruto ao tecido acabado, sob o mesmo teto.",
    body: "A Asietex integra fiação, malharia, tecelagem, tingimento e acabamento para marcas e transformadores na Europa e Ásia.",
    catalog: "Ver e-catalog",
    explore: "Explorar divisões",
    chain: "Nove divisões, uma cadeia responsável",
    headline: "Feita para continuidade, não para transferências.",
  },
} satisfies Record<Locale, Record<string, string | string[]>>;
