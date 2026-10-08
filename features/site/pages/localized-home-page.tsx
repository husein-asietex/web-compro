import Link from "next/link";
import { notFound } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SiteNavbar } from "@/components/site-navbar";
import { copy, isLocale, locales } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

const DEFAULT_CATALOG_URL = "https://e-catalog.asietex.web.id";

type LocaleCode = (typeof locales)[number];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const instant = false;

async function getHomeContent(locale: LocaleCode) {
  const [page, settings] = await Promise.all([
    prisma.page.findFirst({
      where: { slug: "home", status: "PUBLISHED" },
      include: { translations: { where: { locale } } },
    }),
    prisma.siteSetting.findUnique({ where: { id: "site" } }),
  ]);

  return { translation: page?.translations[0], settings };
}

export default async function LocalizedHome({
  params,
}: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = copy[locale];
  const { translation, settings } = await getHomeContent(locale);

  // Konten dari CMS diutamakan, fallback ke teks default i18n
  const title = translation?.title || t.hero;
  const body = translation?.body || t.body;

  const showCatalog = settings?.catalogOn !== false;
  const catalogUrl = settings?.catalogUrl || DEFAULT_CATALOG_URL;

  return (
    <main className="min-h-dvh bg-[#f8f7f2] text-[#1f211d]">
      <SiteNavbar locale={locale} labels={t.nav} />

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-12">
        <div className="md:col-span-8">
          <Badge variant="outline">{t.eyebrow}</Badge>

          <h1 className="mt-8 max-w-4xl font-serif text-6xl leading-none md:text-8xl">
            {title}
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-[#5b5d54]">
            {body}
          </p>

          <div className="mt-9 flex gap-3">
            {showCatalog && (
              <a
                href={catalogUrl}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({
                  className: "rounded-full bg-[#1f211d] text-white",
                })}
              >
                {t.catalog}
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  data-icon="inline-end"
                />
              </a>
            )}

            <Link
              href={`/${locale}/products`}
              className={buttonVariants({
                variant: "outline",
                className: "rounded-full",
              })}
            >
              {t.explore}
            </Link>
          </div>
        </div>

        <div className="min-h-80 rounded-[2rem] bg-[#d8d0bc] md:col-span-4" />
      </section>
    </main>
  );
}
