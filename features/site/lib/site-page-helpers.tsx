import type { Metadata } from "next";

import { prisma } from "@/backend/prisma";
import { isLocale, type Locale } from "@/lib/i18n";

export const DUMMY_IMAGE =
  "https://placehold.co/1200x800/png?text=Asietex+media";

const pageTitles = {
  en: {
    home: "Home",
    about: "About",
    products: "Products",
    career: "Career",
    contact: "Contact",
    "marketing-contact": "Marketing Contacts",
  },
  id: {
    home: "Beranda",
    about: "Tentang",
    products: "Produk",
    career: "Karier",
    contact: "Kontak",
    "marketing-contact": "Kontak Marketing",
  },
  pt: {
    home: "Início",
    about: "Sobre",
    products: "Produtos",
    career: "Carreiras",
    contact: "Contacto",
    "marketing-contact": "Contactos de Marketing",
  },
} as const;

export function mediaAlt(
  locale: Locale,
  media: { altEn: string; altId: string; altPt: string },
) {
  return locale === "id"
    ? media.altId
    : locale === "pt"
      ? media.altPt
      : media.altEn;
}

export async function getPageMetadata(
  locale: string,
  path: string[],
): Promise<Metadata> {
  if (!isLocale(locale)) return {};

  const isProduct = path.length === 2 && path[0] === "products";
  const slug = isProduct ? path[1] : path.join("/");
  const record = isProduct
    ? await prisma.product.findFirst({
        where: { slug, status: "PUBLISHED" },
        include: { translations: { where: { locale } } },
      })
    : await prisma.page.findFirst({
        where: { slug, status: "PUBLISHED" },
        include: { translations: { where: { locale } } },
      });
  const translation = record?.translations[0];
  const localizedPath = path.join("/");
  const pageTitle =
    !isProduct && path.length === 1
      ? pageTitles[locale][path[0] as keyof (typeof pageTitles)[typeof locale]]
      : translation?.title || slug.replaceAll("-", " ");

  return {
    title: pageTitle,
    description: translation?.body.slice(0, 160),
    alternates: {
      languages: {
        en: `/en/${localizedPath}`,
        id: `/id/${localizedPath}`,
        pt: `/pt/${localizedPath}`,
      },
    },
  };
}
