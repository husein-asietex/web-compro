import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { YouTubeEmbed } from "@/features/site/components/youtube-embed";
import { copy, isLocale, locales } from "@/lib/i18n";
import { prisma } from "@/backend/prisma";

const DEFAULT_CATALOG_URL = "https://e-catalog.asietex.web.id";
const COMPANY_FILM_URL = "https://youtu.be/bwxw2O6NMs0?si=T2BPqraQGgzgCl3N";
const PARTNER_LOGOS = [
  { name: "Adidas", src: "/partners/adidas.png" },
  { name: "New Balance", src: "/partners/new-balance.png" },
  { name: "Nike", src: "/partners/nike.png" },
  { name: "Puma", src: "/partners/puma.png" },
  { name: "Reebok", src: "/partners/reebok.png" },
  { name: "Umbro", src: "/partners/umbro.png" },
] as const;

type LocaleCode = (typeof locales)[number];

function locationKind(locale: LocaleCode, kind: string) {
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

const homeCopy = {
  en: {
    heroNote:
      "Nine specialized divisions work together across one connected production chain.",
    statsLabel: "At a glance",
    statsTitle: "The scale to support your plans.",
    stats: [
      ["9", "Integrated divisions"],
      ["3", "Languages served"],
      ["2", "Regions connected"],
      ["1", "Production partner"],
    ],
    filmLabel: "Inside Asietex",
    filmTitle: "See how the work comes together.",
    filmBody:
      "A closer look at the people, machinery and care behind every metre.",
    divisionsLabel: "Our nine divisions",
    divisionsTitle: "The right expertise at every stage.",
    divisionsBody:
      "Each division has its own profile, process and point of view. Choose a stage to see how it works.",
    division: "Division",
    aboutLabel: "Why Asietex",
    aboutTitle: "A connected supply chain, managed by one partner.",
    aboutBody:
      "Every stage, from yarn to fabric, runs in our own mills on a combination of Asian and European machinery. Control of the full chain gives our clients consistent quality, predictable lead times and a single point of contact.",
    motto: "Discipline · Accuracy · Effectiveness",
    aboutLink: "See how we work",
    networkLabel: "Our network",
    networkTitle: "Closer to the markets you serve.",
    networkBody:
      "Headquartered in Jakarta, with warehouses serving buyers across Europe and Asia.",
    networkLink: "Explore our network",
    partnersLabel: "Selected partners",
    partnersTitle: "Made for long-term collaboration.",
    partnersBody:
      "Partner logos are shown here as placeholders until approved brand assets are available.",
    testimonialsLabel: "From our buyers",
    testimonialsTitle: "Clear communication makes production easier.",
    testimonials: [
      [
        "Placeholder testimonial",
        "Clear communication at every stage gives our team more confidence when planning production.",
        "Sample buyer · Europe",
      ],
      [
        "Placeholder testimonial",
        "Having one partner from material selection to finished fabric makes each decision easier to follow.",
        "Sample buyer · Asia",
      ],
    ],
    requestTitle: "Let’s talk about your next fabric order.",
    requestBody:
      "Share the fabric, composition and volume you have in mind. Our team will come back with samples and a quotation.",
    request: "Ask for samples",
    fields: ["Fabric type", "Composition", "Monthly volume", "Business email"],
    placeholders: [
      "e.g. single jersey",
      "e.g. 100% cotton",
      "e.g. 20,000 m",
      "name@company.com",
    ],
  },
  id: {
    heroNote:
      "Sembilan divisi khusus bekerja bersama dalam satu rantai produksi yang terhubung.",
    statsLabel: "Sekilas Asietex",
    statsTitle: "Kapasitas yang siap mendukung rencana Anda.",
    stats: [
      ["9", "Divisi terintegrasi"],
      ["3", "Bahasa tersedia"],
      ["2", "Kawasan terhubung"],
      ["1", "Mitra produksi"],
    ],
    filmLabel: "Di balik Asietex",
    filmTitle: "Lihat bagaimana semuanya bekerja bersama.",
    filmBody:
      "Lihat lebih dekat orang, mesin, dan ketelitian di balik setiap meter kain.",
    divisionsLabel: "Sembilan divisi kami",
    divisionsTitle: "Keahlian yang tepat di setiap tahap.",
    divisionsBody:
      "Setiap divisi punya profil, proses, dan sudut pandang sendiri. Pilih tahap untuk melihat prosesnya.",
    division: "Divisi",
    aboutLabel: "Mengapa Asietex",
    aboutTitle: "Rantai pasok yang terhubung, dikelola oleh satu mitra.",
    aboutBody:
      "Setiap tahap, dari benang hingga kain, berjalan di pabrik kami sendiri dengan kombinasi mesin Asia dan Eropa. Kendali atas seluruh rantai memberi klien kualitas yang konsisten, waktu produksi yang terukur, dan satu titik kontak.",
    motto: "Disiplin · Akurat · Efektif",
    aboutLink: "Lihat cara kerja kami",
    networkLabel: "Jaringan kami",
    networkTitle: "Lebih dekat dengan pasar Anda.",
    networkBody:
      "Berkantor pusat di Jakarta, dengan gudang yang melayani pembeli di Eropa dan Asia.",
    networkLink: "Jelajahi jaringan kami",
    partnersLabel: "Mitra pilihan",
    partnersTitle: "Dibangun untuk kerja sama jangka panjang.",
    partnersBody:
      "Logo mitra berikut merupakan placeholder sampai aset merek yang disetujui tersedia.",
    testimonialsLabel: "Cerita dari buyer",
    testimonialsTitle: "Komunikasi yang jelas membuat produksi lebih mudah.",
    testimonials: [
      [
        "Testimoni placeholder",
        "Komunikasi yang jelas di setiap tahap membuat tim kami lebih percaya diri saat merencanakan produksi.",
        "Contoh buyer · Eropa",
      ],
      [
        "Testimoni placeholder",
        "Memiliki satu mitra sejak pemilihan material hingga kain jadi membuat setiap keputusan lebih mudah diikuti.",
        "Contoh buyer · Asia",
      ],
    ],
    requestTitle: "Mari bicarakan kebutuhan kain Anda.",
    requestBody:
      "Ceritakan jenis kain, komposisi, dan volume yang Anda perlukan. Tim kami akan menyiapkan sampel dan penawaran harga.",
    request: "Minta sampel",
    fields: ["Jenis kain", "Komposisi", "Volume per bulan", "Email bisnis"],
    placeholders: [
      "mis. single jersey",
      "mis. 100% katun",
      "mis. 20.000 m",
      "nama@perusahaan.com",
    ],
  },
  pt: {
    heroNote:
      "Nove divisões especializadas coordenam uma única cadeia de produção contínua.",
    statsLabel: "A Asietex em resumo",
    statsTitle: "A capacidade certa para apoiar os seus planos.",
    stats: [
      ["9", "Divisões integradas"],
      ["3", "Idiomas disponíveis"],
      ["2", "Regiões conectadas"],
      ["1", "Parceiro de produção"],
    ],
    filmLabel: "Por dentro da Asietex",
    filmTitle: "Veja as fábricas em movimento.",
    filmBody:
      "Conheça de perto as pessoas, máquinas e o cuidado por trás de cada metro.",
    divisionsLabel: "Nove divisões",
    divisionsTitle: "Uma fábrica para cada etapa.",
    divisionsBody:
      "Cada divisão tem o seu perfil, processo e ponto de vista. Escolha uma etapa para ver como funciona.",
    division: "Divisão",
    aboutLabel: "Porquê a Asietex",
    aboutTitle: "Uma cadeia integrada. Um parceiro responsável.",
    aboutBody:
      "Cada etapa, do fio ao tecido, decorre nas nossas próprias fábricas, com maquinaria asiática e europeia. O controlo de toda a cadeia garante qualidade consistente, prazos previsíveis e um único interlocutor.",
    motto: "Disciplina · Precisão · Eficácia",
    aboutLink: "Ver como trabalhamos",
    networkLabel: "A nossa rede",
    networkTitle: "Stock perto da sua produção.",
    networkBody:
      "Sede em Jacarta, com armazéns que servem compradores na Europa e na Ásia.",
    networkLink: "Explorar a nossa rede",
    partnersLabel: "Parceiros selecionados",
    partnersTitle:
      "Preparada para trabalhar em várias cadeias de fornecimento.",
    partnersBody:
      "As marcas abaixo são placeholders até serem fornecidos recursos de marca aprovados.",
    testimonialsLabel: "Perspetivas dos compradores",
    testimonialsTitle: "Como deve ser uma produção fiável.",
    testimonials: [
      [
        "Testemunho placeholder",
        "A comunicação consistente em cada etapa da produção facilita o planeamento da nossa equipa.",
        "Comprador de exemplo · Europa",
      ],
      [
        "Testemunho placeholder",
        "Um único parceiro responsável dá-nos mais clareza desde a seleção do material até ao tecido acabado.",
        "Comprador de exemplo · Ásia",
      ],
    ],
    requestTitle: "Solicite amostras ou um orçamento.",
    requestBody:
      "Indique o tecido, a composição e o volume de que precisa, e a nossa equipa prepara amostras e preços.",
    request: "Solicitar amostras",
    fields: [
      "Tipo de tecido",
      "Composição",
      "Volume mensal",
      "Email profissional",
    ],
    placeholders: [
      "ex. jersey simples",
      "ex. 100% algodão",
      "ex. 20.000 m",
      "nome@empresa.com",
    ],
  },
} as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const page = await prisma.page.findFirst({
    where: { slug: "home", status: "PUBLISHED" },
    include: { translations: { where: { locale } } },
  });
  const translation = page?.translations[0];
  return {
    title: translation?.title || copy[locale].hero,
    description: translation?.body.slice(0, 160) || copy[locale].body,
    alternates: { languages: { en: "/en", id: "/id", pt: "/pt" } },
  };
}

export const instant = false;

async function getHomeContent(locale: LocaleCode) {
  const [page, settings, divisions, locations] = await Promise.all([
    prisma.page.findFirst({
      where: { slug: "home", status: "PUBLISHED" },
      include: { translations: { where: { locale } } },
    }),
    prisma.siteSetting.findUnique({ where: { id: "site" } }),
    prisma.division.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
      include: { translations: { where: { locale } } },
    }),
    prisma.networkLocation.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
    }),
  ]);
  return { translation: page?.translations[0], settings, divisions, locations };
}

export default async function LocalizedHome({
  params,
}: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale];
  const { translation, settings, divisions, locations } =
    await getHomeContent(locale);
  const title = translation?.title || t.hero;
  const body = translation?.body || t.body;
  const showCatalog =
    settings?.catalogOn !== false &&
    (settings?.catalogPlacements.includes("home") ?? true);
  const catalogUrl = settings?.catalogUrl || DEFAULT_CATALOG_URL;
  const catalogLabel =
    locale === "id"
      ? settings?.catalogLabelId || t.catalog
      : locale === "pt"
        ? settings?.catalogLabelPt || t.catalog
        : settings?.catalogLabelEn || t.catalog;
  const content = homeCopy[locale];

  return (
    <>
      {/* Hero: pesan utama dan CTA katalog */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-10 border-b border-border-strong pb-16 md:grid-cols-[1.35fr_.65fr] md:items-end md:pb-20">
          <div>
            <Badge variant="outline">{t.eyebrow}</Badge>
            <h1 className="mt-8 max-w-5xl font-serif text-6xl leading-none tracking-[-.035em] md:text-8xl">
              {title}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
              {body}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              {showCatalog && (
                <a
                  href={catalogUrl}
                  target={
                    settings?.catalogOpenNewTab !== false ? "_blank" : undefined
                  }
                  rel={
                    settings?.catalogOpenNewTab !== false
                      ? "noreferrer"
                      : undefined
                  }
                  className={buttonVariants({ className: "rounded-full" })}
                >
                  {catalogLabel}
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
          <p className="max-w-md border-l-2 border-accent pl-6 text-xl leading-8 text-muted-foreground md:justify-self-end">
            {content.heroNote}
          </p>
        </div>
      </section>

      {/* Ringkasan perusahaan dan statistik utama */}
      <section
        className="mx-auto max-w-7xl px-5 pb-16 md:px-10 md:pb-24"
        aria-labelledby="company-snapshot"
      >
        <p className="text-sm text-text-accent">{content.statsLabel}</p>
        <h2
          id="company-snapshot"
          className="mt-4 max-w-3xl font-serif text-4xl md:text-6xl"
        >
          {content.statsTitle}
        </h2>
        <dl className="mt-10 grid border-y border-border-strong sm:grid-cols-2 lg:grid-cols-4">
          {content.stats.map(([value, label]) => (
            <div
              key={label}
              className="border-b border-border-subtle py-7 sm:border-r sm:px-6 lg:border-b-0 first:pl-0 last:border-r-0"
            >
              <dd className="font-serif text-5xl">{value}</dd>
              <dt className="mt-3 text-sm text-muted-foreground">{label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Video profil perusahaan */}
      <section className="border-y border-border-subtle bg-secondary">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-[.9fr_1.1fr] md:px-10 md:py-20">
          <div>
            <Badge variant="outline">{content.filmLabel}</Badge>
            <h2 className="mt-6 max-w-lg font-serif text-5xl leading-none md:text-6xl">
              {content.filmTitle}
            </h2>
            <p className="mt-6 max-w-md leading-7 text-muted-foreground">
              {content.filmBody}
            </p>
          </div>
          <YouTubeEmbed
            url={COMPANY_FILM_URL}
            title={content.filmTitle}
            posterSrc="/company-film/company-film-poster.png"
          />
        </div>
      </section>

      {/* Daftar divisi dan kategori produk */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <Badge variant="outline">{content.divisionsLabel}</Badge>
        <h2 className="mt-6 max-w-3xl font-serif text-5xl leading-none md:text-7xl">
          {content.divisionsTitle}
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          {content.divisionsBody}
        </p>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border-subtle bg-border-subtle sm:grid-cols-2 lg:grid-cols-3">
          {divisions.map((division, index) => {
            const text = division.translations[0];
            return (
              <Link
                key={division.id}
                href={`/${locale}/products/${division.slug}`}
                className="flex min-h-40 flex-col justify-between bg-background p-5 transition-colors hover:bg-surface-warm focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-text-accent"
              >
                <span className="text-sm text-text-soft">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="text-xs text-text-accent">
                    {content.division}
                  </span>
                  <span className="mt-2 block font-serif text-3xl capitalize">
                    {text?.title || division.slug.replaceAll("-", " ")}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Tentang perusahaan dan kapabilitas produksi */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[.7fr_1.3fr] md:px-10 md:py-24">
          <div>
            <p className="text-sm text-accent">{content.aboutLabel}</p>
            <p className="mt-8 font-serif text-4xl leading-tight">
              {content.motto}
            </p>
          </div>
          <div>
            <h2 className="max-w-3xl font-serif text-5xl leading-none md:text-7xl">
              {content.aboutTitle}
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-ink-inverse-muted">
              {content.aboutBody}
            </p>
            <Link
              href={`/${locale}/about`}
              className="mt-8 inline-block text-accent underline underline-offset-4"
            >
              {content.aboutLink}
            </Link>
          </div>
          <div className="relative aspect-[2/1] overflow-hidden rounded-[2rem] md:col-span-2">
            <Image
              src="/why-asietex/integrated-production.png"
              alt={content.aboutTitle}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Jaringan lokasi dan cakupan operasional */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <p className="text-sm text-text-accent">{content.networkLabel}</p>
        <h2 className="mt-5 max-w-3xl font-serif text-5xl leading-none md:text-7xl">
          {content.networkTitle}
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          {content.networkBody}
        </p>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {locations.map((location) => (
            <article
              key={location.id}
              className="border-t border-border-strong pt-4"
            >
              <p className="text-xs text-text-accent">
                {locationKind(locale, location.kind)}
              </p>
              <h3 className="mt-3 font-serif text-2xl">{location.city}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {location.country}
              </p>
            </article>
          ))}
        </div>
        <Link
          href={`/${locale}/network`}
          className="mt-10 inline-block font-medium underline underline-offset-4"
        >
          {content.networkLink}
        </Link>
      </section>

      {/* Partner dan logo klien */}
      <section
        className="border-y border-border-subtle bg-card py-16 md:py-24"
        aria-labelledby="partner-title"
      >
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="grid gap-6 md:grid-cols-[.7fr_1.3fr] md:items-end">
            <p className="text-sm text-text-accent">{content.partnersLabel}</p>
            <div>
              <h2
                id="partner-title"
                className="font-serif text-5xl leading-none md:text-6xl"
              >
                {content.partnersTitle}
              </h2>
              <p className="mt-5 max-w-2xl text-muted-foreground">
                {content.partnersBody}
              </p>
            </div>
          </div>
          <div
            className="mt-12 flex snap-x gap-3 overflow-x-auto pb-3 focus-visible:outline-2 focus-visible:outline-offset-4"
            aria-label={content.partnersLabel}
            tabIndex={0}
          >
            {PARTNER_LOGOS.map((partner) => (
              <div
                key={partner.name}
                className="relative min-h-28 min-w-52 snap-start overflow-hidden border border-border-subtle bg-background px-8"
              >
                <Image
                  src={partner.src}
                  alt={`${partner.name} logo`}
                  fill
                  sizes="208px"
                  className="object-contain p-7 grayscale"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial pelanggan */}
      <section
        className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24"
        aria-labelledby="testimonial-title"
      >
        <p className="text-sm text-text-accent">{content.testimonialsLabel}</p>
        <h2
          id="testimonial-title"
          className="mt-5 max-w-3xl font-serif text-5xl leading-none md:text-7xl"
        >
          {content.testimonialsTitle}
        </h2>
        <div className="mt-12 grid gap-px overflow-hidden border border-border-subtle bg-border-subtle md:grid-cols-2">
          {content.testimonials.map(([label, quote, attribution]) => (
            <figure
              key={attribution}
              className="flex min-h-72 flex-col bg-background p-7 md:p-10"
            >
              <Badge variant="outline" className="w-fit">
                {label}
              </Badge>
              <blockquote className="mt-10 font-serif text-3xl leading-snug">
                “{quote}”
              </blockquote>
              <figcaption className="mt-auto pt-10 text-sm text-muted-foreground">
                {attribution}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Formulir permintaan sample */}
      <section id="request-samples" className="bg-secondary py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 rounded-[2rem] border border-border-subtle bg-background px-5 py-7 md:grid-cols-[.8fr_.8fr_1.2fr] md:px-10 md:py-12">
          <div className="self-center">
            <h2 className="max-w-xl font-serif text-5xl leading-none md:text-6xl">
              {content.requestTitle}
            </h2>
            <p className="mt-6 max-w-md leading-7 text-muted-foreground">
              {content.requestBody}
            </p>
          </div>
          <div className="relative min-h-80 overflow-hidden rounded-2xl">
            <Image
              src="/request-samples/fabric-swatches.jpg"
              alt={content.requestTitle}
              fill
              sizes="(max-width: 768px) 100vw, 30vw"
              className="object-cover"
            />
          </div>
          <form
            className="grid content-center gap-4 sm:grid-cols-2"
            action="mailto:contact.us@asietex.co.id"
            method="post"
            encType="text/plain"
          >
            {content.fields.map((field, index) => (
              <label
                key={field}
                className="grid gap-2 text-sm font-medium"
                htmlFor={`sample-${index}`}
              >
                <span>{field}</span>
                <input
                  id={`sample-${index}`}
                  name={field.toLowerCase().replaceAll(" ", "-")}
                  type={index === 3 ? "email" : "text"}
                  autoComplete={index === 3 ? "email" : "off"}
                  placeholder={content.placeholders[index]}
                  className="h-12 rounded-xl border border-border-subtle bg-card px-4 text-base outline-none placeholder:text-text-soft focus-visible:border-text-accent focus-visible:ring-3 focus-visible:ring-text-accent/20"
                />
              </label>
            ))}
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-2 focus-visible:outline-offset-4 sm:col-span-2"
            >
              {content.request}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
