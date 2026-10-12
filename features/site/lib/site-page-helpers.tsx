import type { Metadata } from "next";

import { prisma } from "@/backend/prisma";
import { buttonVariants } from "@/components/ui/button";
import { isLocale, type Locale } from "@/lib/i18n";

export const DUMMY_IMAGE =
  "https://placehold.co/1200x800/png?text=Asietex+media";

export type CatalogSettings = {
  catalogOn: boolean;
  catalogUrl: string;
  catalogLabelEn: string;
  catalogLabelId: string;
  catalogLabelPt: string;
  catalogPlacements: string[];
  catalogOpenNewTab: boolean;
};

export function catalogLabel(
  locale: Locale,
  settings: Pick<
    CatalogSettings,
    "catalogLabelEn" | "catalogLabelId" | "catalogLabelPt"
  >,
) {
  return locale === "id"
    ? settings.catalogLabelId
    : locale === "pt"
      ? settings.catalogLabelPt
      : settings.catalogLabelEn;
}

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

export function CatalogCta({
  locale,
  settings,
  placement,
}: {
  locale: Locale;
  settings: CatalogSettings | null;
  placement: string;
}) {
  if (!settings?.catalogOn || !settings.catalogPlacements.includes(placement))
    return null;

  return (
    <a
      href={settings.catalogUrl}
      target={settings.catalogOpenNewTab ? "_blank" : undefined}
      rel={settings.catalogOpenNewTab ? "noreferrer" : undefined}
      className={buttonVariants({ className: "mt-10 rounded-full" })}
    >
      {catalogLabel(locale, settings)}
    </a>
  );
}

export async function getPageMetadata(
  locale: string,
  path: string[],
): Promise<Metadata> {
  if (!isLocale(locale)) return {};

  const isDivision = path.length === 2 && path[0] === "products";
  const slug = isDivision ? path[1] : path.join("/");
  const record = isDivision
    ? await prisma.division.findFirst({
        where: { slug, status: "PUBLISHED" },
        include: { translations: { where: { locale } } },
      })
    : await prisma.page.findFirst({
        where: { slug, status: "PUBLISHED" },
        include: { translations: { where: { locale } } },
      });
  const translation = record?.translations[0];
  const localizedPath = path.join("/");

  return {
    title: translation?.title || slug.replaceAll("-", " "),
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
