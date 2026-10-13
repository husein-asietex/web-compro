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
 * `nav` berurutan: About, Products, Marketing Contact, Career, Contact.
 */
export const copy = {
  en: {
    nav: ["About", "Products", "Marketing Contacts", "Career", "Contact"],
    hero: "From yarn to finished fabric, everything stays connected.",
    body: "Asietex brings spinning, knitting, weaving, dyeing and finishing together, helping brands and converters move with greater clarity across Europe and Asia.",
    catalog: "Browse the e-catalog",
    explore: "Explore our products",
  },

  id: {
    nav: ["Tentang", "Produk", "Kontak Marketing", "Karier", "Kontak"],
    hero: "Dari benang hingga kain jadi, semua proses tetap terhubung.",
    body: "Asietex menyatukan pemintalan, rajut, tenun, pencelupan, dan finishing untuk membantu brand dan konverter bekerja lebih jelas di Eropa dan Asia.",
    catalog: "Lihat e-catalog",
    explore: "Kenali produk kami",
  },

  pt: {
    nav: [
      "Sobre",
      "Produtos",
      "Contactos de Marketing",
      "Carreiras",
      "Contacto",
    ],
    hero: "Do fio ao tecido acabado, todos os processos ligados.",
    body: "A Asietex reúne fiação, malharia, tecelagem, tingimento e acabamento para ajudar marcas e transformadores a trabalhar com mais clareza na Europa e na Ásia.",
    catalog: "Ver o e-catalog",
    explore: "Conhecer os produtos",
  },
} satisfies Record<Locale, Record<string, string | string[]>>;
