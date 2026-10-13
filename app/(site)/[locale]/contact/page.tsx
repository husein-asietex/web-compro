import { notFound } from "next/navigation";

import ContactPage from "@/features/site/pages/contact-page";
import { getPageMetadata } from "@/features/site/lib/site-page-helpers";
import { isLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export const instant = false;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return getPageMetadata(locale, ["contact"]);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ContactPage locale={locale} />;
}
