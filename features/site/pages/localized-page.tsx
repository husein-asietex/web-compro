import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { SiteNavbar } from "@/components/site-navbar";
import { copy, isLocale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export const instant = false;

export default async function LocalizedPage({
  params,
}: PageProps<"/[locale]/[...path]">) {
  const { locale, path } = await params;

  if (!isLocale(locale)) notFound();

  const segment = path.join("/");
  const division = path.length === 2 && path[0] === "products" ? path[1] : null;
  const record = division
    ? await prisma.division.findFirst({
        where: { slug: division, status: "PUBLISHED" },
        include: { translations: { where: { locale } } },
      })
    : await prisma.page.findFirst({
        where: { slug: segment, status: "PUBLISHED" },
        include: { translations: { where: { locale } } },
      });

  const translation = record?.translations[0];
  const fallbackTitle = division
    ? division.replaceAll("-", " ")
    : ({
        about: copy[locale].nav[0],
        products: copy[locale].nav[1],
        network: copy[locale].nav[2],
        contact: copy[locale].nav[3],
      }[segment] ?? "Asietex");
  const fallbackBody = `This page is localised for ${locale.toUpperCase()}. Official published content will replace this fallback after an admin approves it in the CMS.`;

  return (
    <main className="min-h-dvh bg-[#f8f7f2] text-[#1f211d]">
      <SiteNavbar locale={locale} labels={copy[locale].nav} />

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-12">
        <div className="min-w-0 md:col-span-8">
          <Badge variant="outline">
            {division
              ? "Asietex integrated chain"
              : "Integrated textile manufacturer · Indonesia"}
          </Badge>

          <h1 className="mt-8 max-w-4xl font-serif text-6xl leading-none capitalize md:text-8xl">
            {translation?.title || fallbackTitle}
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-[#5b5d54]">
            {translation?.body || fallbackBody}
          </p>
        </div>

        {/* <aside
          aria-hidden="true"
          className="min-h-80 rounded-[2rem] bg-[#d8d0bc] md:col-span-4"
        /> */}
      </section>
    </main>
  );
}
