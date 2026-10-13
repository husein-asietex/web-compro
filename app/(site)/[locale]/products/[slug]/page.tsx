import { notFound } from "next/navigation";

import ProductDetailPage from "@/features/site/pages/product-detail-page";
import { getPageMetadata } from "@/features/site/lib/site-page-helpers";
import { isLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const instant = false;

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return getPageMetadata(locale, ["products", slug]);
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return <ProductDetailPage locale={locale} slug={slug} />;
}
