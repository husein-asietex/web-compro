import type { Metadata } from "next";
import { notFound } from "next/navigation";

import MarketingContactPage from "@/features/site/pages/marketing-contact-page";
import { isLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

const metadata = {
  en: {
    title: "Marketing Contacts",
    description: "Find the right marketing contact for your product or region.",
  },
  id: {
    title: "Kontak Marketing",
    description: "Temukan kontak marketing sesuai produk atau wilayah Anda.",
  },
  pt: {
    title: "Contactos de Marketing",
    description:
      "Encontre o contacto de marketing certo para o seu produto ou região.",
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return metadata[locale];
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <MarketingContactPage locale={locale} />;
}
