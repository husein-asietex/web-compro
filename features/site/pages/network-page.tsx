import { redirect } from "next/navigation";

import { prisma } from "@/backend/prisma";
import { Badge } from "@/components/ui/badge";
import { CatalogCta } from "@/features/site/lib/site-page-helpers";
import { copy, type Locale } from "@/lib/i18n";

const networkLabel = {
  en: "Global network",
  id: "Jaringan global",
  pt: "Rede global",
} as const;

function locationKind(locale: Locale, kind: string) {
  const normalized = kind.toLowerCase();
  if (normalized.includes("warehouse"))
    return locale === "id"
      ? "Gudang"
      : locale === "pt"
        ? "Armazém"
        : "Warehouse";
  if (normalized.includes("factory") && normalized.includes("hq"))
    return locale === "id"
      ? "Kantor pusat & pabrik"
      : locale === "pt"
        ? "Sede e fábrica"
        : "HQ & factory";
  if (normalized.includes("factory"))
    return locale === "id" ? "Pabrik" : locale === "pt" ? "Fábrica" : "Factory";
  return kind;
}

export default async function NetworkPage({ locale }: { locale: Locale }) {
  const [page, locations, settings] = await Promise.all([
    prisma.page.findFirst({
      where: { slug: "network", status: "PUBLISHED" },
      include: { translations: { where: { locale } } },
    }),
    prisma.networkLocation.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
    }),
    prisma.siteSetting.findUnique({ where: { id: "site" } }),
  ]);
  if (!page) redirect("/en");

  const translation = page.translations[0];

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
      <Badge variant="outline">{networkLabel[locale]}</Badge>
      <h1 className="mt-7 font-serif text-6xl md:text-7xl">
        {translation?.title || copy[locale].nav[2]}
      </h1>
      <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
        {translation?.body}
      </p>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {locations.map((location) => (
          <article
            key={location.id}
            className="rounded-3xl border border-border-subtle bg-card p-7"
          >
            <p className="text-xs text-text-accent">
              {locationKind(locale, location.kind)}
            </p>
            <h2 className="mt-3 font-serif text-3xl">{location.name}</h2>
            <p className="mt-4 text-muted-foreground">
              {location.city}, {location.country}
            </p>
            {location.address && (
              <p className="mt-2 text-sm text-muted-foreground">
                {location.address}
              </p>
            )}
          </article>
        ))}
      </div>
      <CatalogCta locale={locale} settings={settings} placement="network" />
    </section>
  );
}
