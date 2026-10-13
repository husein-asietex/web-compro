import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { currentUser } from "@/backend/auth";
import { SiteFooter } from "@/features/site/components/site-footer";
import { SiteNavbar } from "@/features/site/components/site-navbar";
import { copy, isLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: { default: "Asietex", template: "%s | Asietex" },
  description:
    "Integrated textile manufacturing from raw cotton to finished fabric.",
  openGraph: { siteName: "Asietex", type: "website" },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const user = await currentUser();

  return (
    <main id="main-content" className="min-h-dvh bg-background text-foreground">
      <SiteNavbar
        locale={locale}
        labels={copy[locale].nav}
        isAuthenticated={Boolean(user)}
      />
      <div className="mb-20">{children}</div>
      <SiteFooter locale={locale} />
    </main>
  );
}
