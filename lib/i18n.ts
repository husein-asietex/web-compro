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
 * `nav` berurutan: About, Products, Network, Career, Contact.
 */
export const copy = {
  en: {
    nav: ["About", "Products", "Network", "Career", "Contact"],
    eyebrow: "Integrated textile manufacturing from Indonesia",
    hero: "From yarn to finished fabric, everything stays connected.",
    body: "Asietex brings spinning, knitting, weaving, dyeing and finishing together, helping brands and converters move with greater clarity across Europe and Asia.",
    catalog: "Browse the e-catalog",
    explore: "Meet our divisions",
    chain: "Nine divisions, one accountable chain",
    headline: "Built for continuity, not handoffs.",
  },

  id: {
    nav: ["Tentang", "Produk", "Jaringan", "Karier", "Kontak"],
    eyebrow: "Manufaktur tekstil terintegrasi dari Indonesia",
    hero: "Dari benang hingga kain jadi, semua proses tetap terhubung.",
    body: "Asietex menyatukan pemintalan, rajut, tenun, pencelupan, dan finishing untuk membantu brand dan konverter bekerja lebih jelas di Eropa dan Asia.",
    catalog: "Lihat e-catalog",
    explore: "Kenali divisi kami",
    chain: "Sembilan divisi, satu rantai yang bertanggung jawab",
    headline: "Dibangun untuk kesinambungan, bukan perpindahan proses.",
  },

  pt: {
    nav: ["Sobre", "Produtos", "Rede", "Carreiras", "Contacto"],
    eyebrow: "Fabrico têxtil integrado a partir da Indonésia",
    hero: "Do fio ao tecido acabado, todos os processos ligados.",
    body: "A Asietex reúne fiação, malharia, tecelagem, tingimento e acabamento para ajudar marcas e transformadores a trabalhar com mais clareza na Europa e na Ásia.",
    catalog: "Ver o e-catalog",
    explore: "Conhecer as divisões",
    chain: "Nove divisões, uma cadeia responsável",
    headline: "Feita para continuidade, não para transferências.",
  },
} satisfies Record<Locale, Record<string, string | string[]>>;
