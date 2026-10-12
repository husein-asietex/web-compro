import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/backend/prisma";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  catalogLabel,
  DUMMY_IMAGE,
  mediaAlt,
} from "@/features/site/lib/site-page-helpers";
import { copy, type Locale } from "@/lib/i18n";

const productsCopy = {
  en: { chain: "Nine divisions, one accountable chain", division: "Division" },
  id: {
    chain: "Sembilan divisi, satu rantai yang bertanggung jawab",
    division: "Divisi",
  },
  pt: { chain: "Nove divisões, uma cadeia responsável", division: "Divisão" },
} as const;

export default async function ProductsPage({ locale }: { locale: Locale }) {
  const text = productsCopy[locale];
  const [page, divisions, settings] = await Promise.all([
    prisma.page.findFirst({
      where: { slug: "products", status: "PUBLISHED" },
      include: { translations: { where: { locale } } },
    }),
    prisma.division.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
      include: {
        translations: { where: { locale } },
        media: { where: { approved: true }, take: 1 },
      },
    }),
    prisma.siteSetting.findUnique({ where: { id: "site" } }),
  ]);
  if (!page) redirect("/en");

  const translation = page.translations[0];

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
      <Badge variant="outline">{text.chain}</Badge>
      <h1 className="mt-7 max-w-4xl font-serif text-6xl leading-none md:text-7xl">
        {translation?.title || copy[locale].nav[1]}
      </h1>
      <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
        {translation?.body}
      </p>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {divisions.map((division) => {
          const translationText = division.translations[0];
          const media = division.media[0];

          return (
            <Link
              key={division.id}
              href={`/${locale}/products/${division.slug}`}
              className="group overflow-hidden rounded-3xl border border-border-subtle bg-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-subtle">
                <Image
                  src={media?.url || division.gallery[0] || DUMMY_IMAGE}
                  alt={
                    media
                      ? mediaAlt(locale, media)
                      : `${division.slug} division`
                  }
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-text-accent">
                  {text.division} {division.order}
                </p>
                <h2 className="mt-3 font-serif text-3xl capitalize">
                  {translationText?.title || division.slug.replaceAll("-", " ")}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {translationText?.body}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {settings?.catalogOn &&
        settings.catalogPlacements.includes("products") && (
          <a
            href={settings.catalogUrl}
            target={settings.catalogOpenNewTab ? "_blank" : undefined}
            rel={settings.catalogOpenNewTab ? "noreferrer" : undefined}
            className={buttonVariants({ className: "mt-10 rounded-full" })}
          >
            {catalogLabel(locale, settings)}
          </a>
        )}
    </section>
  );
}
