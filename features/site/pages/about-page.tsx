import Image from "next/image";
import { redirect } from "next/navigation";

import { prisma } from "@/backend/prisma";
import { Badge } from "@/components/ui/badge";
import { CatalogCta, mediaAlt } from "@/features/site/lib/site-page-helpers";
import { copy, type Locale } from "@/lib/i18n";

const companyLabel = {
  en: "Integrated textile manufacturer · Indonesia",
  id: "Produsen tekstil terintegrasi · Indonesia",
  pt: "Fabricante têxtil integrado · Indonésia",
} as const;

export default async function AboutPage({ locale }: { locale: Locale }) {
  const [page, settings] = await Promise.all([
    prisma.page.findFirst({
      where: { slug: "about", status: "PUBLISHED" },
      include: {
        translations: { where: { locale } },
        media: { where: { approved: true } },
      },
    }),
    prisma.siteSetting.findUnique({ where: { id: "site" } }),
  ]);
  if (!page) redirect("/en");

  const translation = page.translations[0];

  return (
    <section className="mx-auto max-w-7xl px-5 py-20">
      <Badge variant="outline">{companyLabel[locale]}</Badge>
      <h1 className="mt-8 max-w-4xl font-serif text-6xl leading-none md:text-7xl">
        {translation?.title || copy[locale].nav[0]}
      </h1>
      <p className="mt-8 max-w-2xl whitespace-pre-line text-lg leading-8 text-muted-foreground">
        {translation?.body}
      </p>
      {page.media.length > 0 && (
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {page.media.map((media) => (
            <figure
              key={media.id}
              className="overflow-hidden rounded-3xl bg-card"
            >
              <div className="relative aspect-[3/2]">
                <Image
                  src={media.url}
                  alt={mediaAlt(locale, media)}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {media.credit && (
                <figcaption className="p-3 text-xs text-muted-foreground">
                  {media.credit}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
      <CatalogCta locale={locale} settings={settings} placement="about" />
    </section>
  );
}
