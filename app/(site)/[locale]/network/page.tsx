import { notFound } from "next/navigation";

import NetworkPage from "@/features/site/pages/network-page";
import { getPageMetadata } from "@/features/site/lib/site-page-helpers";
import { isLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return getPageMetadata(locale, ["network"]);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <NetworkPage locale={locale} />;
}
