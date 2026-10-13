import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { prisma } from "@/backend/prisma";
import { YouTubeEmbed } from "@/features/site/components/youtube-embed";
import { DUMMY_IMAGE, mediaAlt } from "@/features/site/lib/site-page-helpers";
import { copy, type Locale } from "@/lib/i18n";

const productCopy = {
  en: {
    capacity: "Capacity",
    machinery: "Machinery",
    products: "Products",
    gallery: "Gallery",
    confirm: "To be confirmed",
    overview: "Inside the chain",
  },
  id: {
    capacity: "Kapasitas",
    machinery: "Mesin",
    products: "Produk",
    gallery: "Galeri",
    confirm: "Akan dikonfirmasi",
    overview: "Di dalam rantai produksi",
  },
  pt: {
    capacity: "Capacidade",
    machinery: "Maquinaria",
    products: "Produtos",
    gallery: "Galeria",
    confirm: "A confirmar",
    overview: "Dentro da cadeia",
  },
} as const;

const productImages: Record<string, string> = {
  spinning: "/divisions/1-spinning.png",
  twisting: "/divisions/2-twisting.png",
  knitting: "/divisions/3-knitting.png",
  weaving: "/divisions/4-weaving.png",
  dyeing: "/divisions/5-dyeing.png",
  "yarn-dyeing": "/divisions/6-yarn-dyeing.png",
  garment: "/divisions/7-garment.png",
  printing: "/divisions/8-printing.png",
  finishing: "/divisions/9-finishing.png",
};

export default async function ProductDetailPage({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const text = productCopy[locale];
  const product = await prisma.product.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      translations: { where: { locale } },
      media: { where: { approved: true } },
    },
  });
  if (!product) redirect("/en");

  const translation = product.translations[0];
  const linkedImages = product.media.map((item) => item.url);
  const gallery = Array.from(new Set([...linkedImages, ...product.gallery]));
  const videoUrl =
    locale === "id"
      ? product.videoId
      : locale === "pt"
        ? product.videoPt
        : product.videoEn;
  const heroImage = productImages[product.slug] || gallery[0] || DUMMY_IMAGE;
  const title = translation?.title || product.slug.replaceAll("-", " ");

  return (
    /* Product detail page */
    <section className="mx-auto max-w-7xl px-5 pb-20 pt-8 md:pb-28 md:pt-12">
      {/* Product hero */}
      <Link
        href={`/${locale}/products`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <HugeiconsIcon
          icon={ArrowLeft02Icon}
          size={16}
          strokeWidth={1.8}
          aria-hidden="true"
        />
        {copy[locale].nav[1]}
      </Link>
      <div className="mt-8 grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
        <div className="pb-2">
          <h1 className="mt-7 max-w-3xl font-serif text-6xl capitalize leading-[0.9] tracking-[-0.045em] md:text-8xl">
            {title}
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">
            {translation?.body}
          </p>
        </div>
        <div className="relative aspect-[1.45] overflow-hidden rounded-[2rem] bg-surface-subtle shadow-[0_24px_70px_-35px_var(--shadow-soft)]">
          <Image
            src={heroImage}
            alt={`${product.slug} textile production`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-20 text-sm text-white/85">
            {text.overview}
          </div>
        </div>
      </div>

      {/* Product specifications */}
      <dl className="mt-10 grid border-y border-border-subtle sm:grid-cols-2">
        <div className="border-b border-border-subtle py-5 sm:border-b-0 sm:border-r sm:pr-8">
          <dt className="text-xs uppercase tracking-[0.16em] text-text-accent">
            {text.capacity}
          </dt>
          <dd className="mt-3 text-xl">{product.capacity || text.confirm}</dd>
        </div>
        <div className="py-5 sm:pl-8">
          <dt className="text-xs uppercase tracking-[0.16em] text-text-accent">
            {text.machinery}
          </dt>
          <dd className="mt-3 text-xl">{product.machinery || text.confirm}</dd>
        </div>
      </dl>

      {/* Product list */}
      {product.products.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-4xl tracking-[-0.03em]">
            {text.products}
          </h2>
          <ul className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {product.products.map((product) => (
              <li
                key={product}
                className="border-b border-border-subtle py-4 text-lg"
              >
                {product}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Product gallery */}
      <section className="mt-16">
        <h2 className="font-serif text-4xl tracking-[-0.03em]">
          {text.gallery}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {(gallery.length ? gallery : [DUMMY_IMAGE]).map((url, index) => {
            const media = product.media.find((item) => item.url === url);
            return (
              <figure
                key={`${url}-${index}`}
                className="overflow-hidden rounded-[1.5rem] bg-card"
              >
                <div className="relative aspect-[3/2]">
                  <Image
                    src={url}
                    alt={
                      media
                        ? mediaAlt(locale, media)
                        : `${product.slug} gallery ${index + 1}`
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

      {/* Product video */}
      {videoUrl && (
        <section className="mt-16">
          <YouTubeEmbed url={videoUrl} title={title} />
        </section>
      )}
    </section>
  );
}
