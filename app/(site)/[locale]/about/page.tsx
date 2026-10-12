import { notFound } from "next/navigation";

import AboutPage from "@/features/site/pages/about-page";
import { getPageMetadata } from "@/features/site/lib/site-page-helpers";
import { isLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return getPageMetadata(locale, ["about"]);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <AboutPage locale={locale} />;
}
