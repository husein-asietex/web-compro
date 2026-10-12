import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/backend/prisma";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { YouTubeEmbed } from "@/features/site/components/youtube-embed";
import {
  catalogLabel,
  DUMMY_IMAGE,
  mediaAlt,
} from "@/features/site/lib/site-page-helpers";
import { copy, type Locale } from "@/lib/i18n";

const divisionCopy = {
  en: {
    capacity: "Capacity",
    machinery: "Machinery",
    products: "Products",
    gallery: "Gallery",
    confirm: "To be confirmed",
    integrated: "Asietex integrated chain",
  },
  id: {
    capacity: "Kapasitas",
    machinery: "Mesin",
    products: "Produk",
    gallery: "Galeri",
    confirm: "Akan dikonfirmasi",
    integrated: "Rantai terintegrasi Asietex",
  },
  pt: {
    capacity: "Capacidade",
    machinery: "Maquinaria",
    products: "Produtos",
    gallery: "Galeria",
    confirm: "A confirmar",
    integrated: "Cadeia integrada da Asietex",
  },
} as const;

export default async function DivisionPage({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const text = divisionCopy[locale];
  const [division, settings] = await Promise.all([
    prisma.division.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: {
        translations: { where: { locale } },
        media: { where: { approved: true } },
      },
    }),
    prisma.siteSetting.findUnique({ where: { id: "site" } }),
  ]);
  if (!division) redirect("/en");

  const translation = division.translations[0];
  const linkedImages = division.media.map((item) => item.url);
  const gallery = Array.from(new Set([...linkedImages, ...division.gallery]));
  const videoUrl =
    locale === "id"
      ? division.videoId
      : locale === "pt"
        ? division.videoPt
        : division.videoEn;

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
      <Link
        href={`/${locale}/products`}
        className="text-sm underline underline-offset-4"
      >
        ← {copy[locale].nav[1]}
      </Link>
      <Badge variant="outline" className="mt-10 block w-fit">
        {text.integrated}
      </Badge>
      <h1 className="mt-7 max-w-4xl font-serif text-6xl capitalize leading-none md:text-7xl">
        {translation?.title || division.slug.replaceAll("-", " ")}
      </h1>
      <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
        {translation?.body}
      </p>

      <dl className="mt-12 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-card p-6">
          <dt className="text-sm text-text-accent">{text.capacity}</dt>
          <dd className="mt-2 text-xl">{division.capacity || text.confirm}</dd>
        </div>
        <div className="rounded-2xl bg-card p-6">
          <dt className="text-sm text-text-accent">{text.machinery}</dt>
          <dd className="mt-2 text-xl">{division.machinery || text.confirm}</dd>
        </div>
      </dl>

      {division.products.length > 0 && (
        <section className="mt-14">
          <h2 className="font-serif text-4xl">{text.products}</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {division.products.map((product) => (
              <li
                key={product}
                className="rounded-2xl border border-border-subtle bg-card p-5"
              >
                {product}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-14">
        <h2 className="font-serif text-4xl">{text.gallery}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {(gallery.length ? gallery : [DUMMY_IMAGE]).map((url, index) => {
            const media = division.media.find((item) => item.url === url);
            return (
              <figure
                key={`${url}-${index}`}
                className="overflow-hidden rounded-3xl bg-card"
              >
                <div className="relative aspect-[3/2]">
                  <Image
                    src={url}
                    alt={
                      media
                        ? mediaAlt(locale, media)
                        : `${division.slug} gallery ${index + 1}`
                    }
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                {media?.credit && (
                  <figcaption className="p-3 text-xs text-muted-foreground">
                    {media.credit}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
      </section>

      {videoUrl && (
        <section className="mt-14">
          <YouTubeEmbed
            url={videoUrl}
            title={translation?.title || division.slug}
          />
        </section>
      )}

      {settings?.catalogOn &&
        settings.catalogPlacements.includes("division") && (
          <a
            href={settings.catalogUrl}
            target={settings.catalogOpenNewTab ? "_blank" : undefined}
            rel={settings.catalogOpenNewTab ? "noreferrer" : undefined}
            className={buttonVariants({ className: "mt-12 rounded-full" })}
          >
            {catalogLabel(locale, settings)}
          </a>
        )}
    </section>
  );
}
