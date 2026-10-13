import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/backend/prisma";
import { DUMMY_IMAGE, mediaAlt } from "@/features/site/lib/site-page-helpers";
import type { Locale } from "@/lib/i18n";

const productsCopy = {
  en: { product: "Product" },
  id: { product: "Produk" },
  pt: { product: "Produto" },
} as const;

const productsHeroCopy = {
  en: {
    title: "Nine products. One connected production chain.",
  },
  id: {
    title: "Sembilan produk. Satu rantai produksi yang terhubung.",
  },
  pt: {
    title: "Nove produtos. Uma cadeia de produção ligada.",
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

export default async function ProductsPage({ locale }: { locale: Locale }) {
  const text = productsCopy[locale];
  const hero = productsHeroCopy[locale];
  const [page, products] = await Promise.all([
    prisma.page.findFirst({
      where: { slug: "products", status: "PUBLISHED" },
      include: { translations: { where: { locale } } },
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
      include: {
        translations: { where: { locale } },
        media: { where: { approved: true }, take: 1 },
      },
    }),
  ]);
  if (!page) redirect("/en");

  const translation = page.translations[0];

  return (
    /* Products overview */
    <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
      {/* Products introduction */}
      <h1 className="mt-7 max-w-4xl font-serif text-6xl leading-none md:text-7xl">
        {translation?.title || hero.title}
      </h1>

      {/* Product capability grid */}
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const translationText = product.translations[0];
          const media = product.media[0];
          const productImage = productImages[product.slug];

          return (
            <Link
              key={product.id}
              href={`/${locale}/products/${product.slug}`}
              className="group overflow-hidden rounded-3xl border border-border-subtle bg-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-subtle">
                <Image
                  src={
                    productImage ||
                    media?.url ||
                    product.gallery[0] ||
                    DUMMY_IMAGE
                  }
                  alt={
                    media ? mediaAlt(locale, media) : `${product.slug} product`
                  }
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-text-accent">
                  {text.product} {product.order}
                </p>
                <h2 className="mt-3 font-serif text-3xl capitalize">
                  {translationText?.title || product.slug.replaceAll("-", " ")}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {translationText?.body}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
