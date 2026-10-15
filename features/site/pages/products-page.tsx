import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/data/mock/products";
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

export default function ProductsPage({ locale }: { locale: Locale }) {
  const text = productsCopy[locale];
  const hero = productsHeroCopy[locale];
  const products = PRODUCTS;

  return (
    /* Products overview */
    <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
      {/* Products introduction */}
      <h1 className="mt-7 max-w-4xl font-serif text-6xl leading-none md:text-7xl">
        {hero.title}
      </h1>

      {/* Product capability grid */}
      <div className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-3">
        {products.map((product) => {
          const translationText = product.translations[locale];

          return (
            <Link
              key={product.slug}
              href={`/${locale}/products/${product.slug}`}
              className="group overflow-hidden rounded-2xl border border-border-subtle bg-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-subtle">
                <Image
                  src={product.heroImage}
                  alt={`${product.slug} product`}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
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
