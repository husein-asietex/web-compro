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

        <div
          className="relative isolate h-[430px] overflow-visible sm:h-[500px] md:col-span-4"
          aria-label="Koleksi contoh kain ASIETEX"
        >
          <div
            aria-hidden="true"
            className="absolute left-[3%] top-[74px] h-[330px] w-[58%] rotate-[-8deg] rounded-[18px] bg-[repeating-linear-gradient(135deg,#e6e1d6_0,#e6e1d6_1px,#efebe3_1px,#efebe3_10px)] shadow-[0_20px_40px_-24px_rgba(40,30,10,0.25)] sm:h-[380px]"
          />
          <div
            aria-hidden="true"
            className="absolute left-[25%] top-[22px] h-[350px] w-[58%] rotate-[3deg] rounded-[18px] bg-[repeating-linear-gradient(45deg,#e1dbcd_0,#e1dbcd_1px,#ece7dc_1px,#ece7dc_8px)] shadow-[0_20px_40px_-24px_rgba(40,30,10,0.25)] sm:h-[400px]"
          />

          <article className="absolute left-[35%] top-[52px] flex h-[355px] w-[64%] rotate-[8deg] flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_30px_60px_-28px_rgba(40,30,10,0.35)] sm:h-[420px]">
            <div className="flex flex-1 items-end bg-[repeating-linear-gradient(90deg,#e8e3d8_0,#e8e3d8_1px,#f1ede5_1px,#f1ede5_6px)] p-4 font-mono text-[10px] leading-none text-[#8f897c]">
              [ fabric swatch photo ]
            </div>
            <div className="flex items-center justify-between bg-white px-5 py-5">
              <div>
                <p className="font-mono text-[11px] font-medium leading-none text-[#8a6a2c]">
                  ASIETEX · No. 05
                </p>
                <p className="mt-2 text-[19px] font-medium leading-none text-[#171916]">
                  Dyeing
                </p>
              </div>
              <span
                aria-hidden="true"
                className="size-4 rounded-full border-2 border-[#d9d3c6]"
              />
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
