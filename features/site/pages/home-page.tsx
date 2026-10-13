import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

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

const PARTNER_LOGOS_REVERSED_FLOW = [
  PARTNER_LOGOS[3],
  PARTNER_LOGOS[0],
  PARTNER_LOGOS[5],
  PARTNER_LOGOS[1],
  PARTNER_LOGOS[4],
  PARTNER_LOGOS[2],
] as const;

function PartnerLogo({ partner }: { partner: (typeof PARTNER_LOGOS)[number] }) {
  return (
    <div className="relative min-h-28 min-w-52 overflow-hidden border border-border-subtle bg-background px-8">
      <Image
        src={partner.src}
        alt=""
        fill
        sizes="208px"
        className="object-contain p-7 grayscale"
      />
    </div>
  );
}

type LocaleCode = (typeof locales)[number];

const homeCopy = {
  en: {
    heroNote:
      "Nine specialized products work together across one connected production chain.",
    statsLabel: "At a glance",
    statsTitle: "The scale to support your plans.",
    stats: [
      ["9", "Integrated products"],
      ["3", "Languages served"],
      ["2", "Regions connected"],
      ["1", "Production partner"],
    ],
    filmTitle: "See how the work comes together.",
    filmBody:
      "A closer look at the people, machinery and care behind every metre.",
    productsTitle: "The right expertise at every stage.",
    productsBody:
      "Each product has its own profile, process and point of view. Choose a product to see how it works.",
    product: "Product",
    aboutTitle: "A connected supply chain, managed by one partner.",
    aboutBody:
      "Every stage, from yarn to fabric, runs in our own mills on a combination of Asian and European machinery. Control of the full chain gives our clients consistent quality, predictable lead times and a single point of contact.",
    aboutLink: "See how we work",
    partnersLabel: "Selected partners",
    partnersTitle: "Made for long-term collaboration.",
    partnersBody:
      "Partner logos are shown here as placeholders until approved brand assets are available.",
    testimonialsTitle: "Clear communication makes production easier.",
    testimonials: [
      [
        "Clear communication at every stage gives our team more confidence when planning production.",
        "Sample buyer · Europe",
      ],
      [
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
      "Sembilan produk khusus bekerja bersama dalam satu rantai produksi yang terhubung.",
    statsLabel: "Sekilas Asietex",
    statsTitle: "Kapasitas yang siap mendukung rencana Anda.",
    stats: [
      ["9", "Produk terintegrasi"],
      ["3", "Bahasa tersedia"],
      ["2", "Kawasan terhubung"],
      ["1", "Mitra produksi"],
    ],
    filmTitle: "Lihat bagaimana semuanya bekerja bersama.",
    filmBody:
      "Lihat lebih dekat orang, mesin, dan ketelitian di balik setiap meter kain.",
    productsTitle: "Keahlian yang tepat di setiap tahap.",
    productsBody:
      "Setiap produk punya profil, proses, dan sudut pandang sendiri. Pilih produk untuk melihat prosesnya.",
    product: "Produk",
    aboutTitle: "Rantai pasok yang terhubung, dikelola oleh satu mitra.",
    aboutBody:
      "Setiap tahap, dari benang hingga kain, berjalan di pabrik kami sendiri dengan kombinasi mesin Asia dan Eropa. Kendali atas seluruh rantai memberi klien kualitas yang konsisten, waktu produksi yang terukur, dan satu titik kontak.",
    aboutLink: "Lihat cara kerja kami",
    partnersLabel: "Mitra pilihan",
    partnersTitle: "Dibangun untuk kerja sama jangka panjang.",
    partnersBody:
      "Logo mitra berikut merupakan placeholder sampai aset merek yang disetujui tersedia.",
    testimonialsTitle: "Komunikasi yang jelas membuat produksi lebih mudah.",
    testimonials: [
      [
        "Komunikasi yang jelas di setiap tahap membuat tim kami lebih percaya diri saat merencanakan produksi.",
        "Contoh buyer · Eropa",
      ],
      [
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
      "Nove produtos especializados coordenam uma única cadeia de produção contínua.",
    statsLabel: "A Asietex em resumo",
    statsTitle: "A capacidade certa para apoiar os seus planos.",
    stats: [
      ["9", "Divisões integradas"],
      ["3", "Idiomas disponíveis"],
      ["2", "Regiões conectadas"],
      ["1", "Parceiro de produção"],
    ],
    filmTitle: "Veja as fábricas em movimento.",
    filmBody:
      "Conheça de perto as pessoas, máquinas e o cuidado por trás de cada metro.",
    productsTitle: "Uma fábrica para cada etapa.",
    productsBody:
      "Cada produto tem o seu perfil, processo e ponto de vista. Escolha um produto para ver como funciona.",
    product: "Produto",
    aboutTitle: "Uma cadeia integrada. Um parceiro responsável.",
    aboutBody:
      "Cada etapa, do fio ao tecido, decorre nas nossas próprias fábricas, com maquinaria asiática e europeia. O controlo de toda a cadeia garante qualidade consistente, prazos previsíveis e um único interlocutor.",
    aboutLink: "Ver como trabalhamos",
    partnersLabel: "Parceiros selecionados",
    partnersTitle:
      "Preparada para trabalhar em várias cadeias de fornecimento.",
    partnersBody:
      "As marcas abaixo são placeholders até serem fornecidos recursos de marca aprovados.",
    testimonialsTitle: "Como deve ser uma produção fiável.",
    testimonials: [
      [
        "A comunicação consistente em cada etapa da produção facilita o planeamento da nossa equipa.",
        "Comprador de exemplo · Europa",
      ],
      [
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
    title: locale === "id" ? "Beranda" : locale === "pt" ? "Início" : "Home",
    description: translation?.body.slice(0, 160) || copy[locale].body,
    alternates: { languages: { en: "/en", id: "/id", pt: "/pt" } },
  };
}

export const instant = false;

async function getHomeContent(locale: LocaleCode) {
  const [page, settings, products] = await Promise.all([
    prisma.page.findFirst({
      where: { slug: "home", status: "PUBLISHED" },
      include: { translations: { where: { locale } } },
    }),
    prisma.siteSetting.findUnique({ where: { id: "site" } }),
    prisma.product.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
      include: { translations: { where: { locale } } },
    }),
  ]);
  return { translation: page?.translations[0], settings, products };
}

export default async function LocalizedHome({
  params,
}: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale];
  const { translation, settings, products } = await getHomeContent(locale);
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
      {/* Hero: latar produksi terintegrasi, pesan utama, CTA, dan ringkasan skala. */}
      <section className="-mt-[4.75rem]">
        {/* Home hero */}
        <div className="relative isolate min-h-[42rem] overflow-hidden bg-primary text-primary-foreground md:min-h-[46rem]">
          <Image
            src="/home/integrated-textile-hero.png"
            alt="Integrated textile production with yarn preparation, machinery, and fabric quality inspection"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-[60%_center]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-primary via-primary/75 via-38% to-primary/10"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-primary/85 via-transparent to-primary/20"
            aria-hidden="true"
          />

          <div className="relative z-10 flex min-h-[42rem] flex-col justify-end p-6 md:min-h-[46rem] md:p-28">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
              <div className="max-w-3xl">
                <h1 className="mt-6 font-serif text-5xl leading-[.94] tracking-[-.035em] md:text-7xl xl:text-8xl">
                  {title}
                </h1>
                <p className="mt-6 max-w-xl text-base leading-7 text-primary-foreground/75 md:text-lg md:leading-8">
                  {body}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {showCatalog && (
                    <a
                      href={catalogUrl}
                      target={
                        settings?.catalogOpenNewTab !== false
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        settings?.catalogOpenNewTab !== false
                          ? "noreferrer"
                          : undefined
                      }
                      className={buttonVariants({
                        className:
                          "rounded-full bg-accent text-accent-foreground hover:bg-accent/90",
                      })}
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
                      className:
                        "rounded-full border-primary-foreground/35 bg-primary/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
                    })}
                  >
                    {t.explore}
                  </Link>
                </div>
              </div>

              <aside className="border border-primary-foreground/15 bg-primary/65 p-5 backdrop-blur-sm md:p-6">
                <p className="text-sm text-accent">{content.statsLabel}</p>
                <p className="mt-3 font-serif text-2xl leading-tight">
                  {content.statsTitle}
                </p>
                <dl className="mt-6 grid grid-cols-2 border-t border-primary-foreground/15">
                  {content.stats.map(([value, label]) => (
                    <div
                      key={label}
                      className="border-b border-primary-foreground/15 py-4 odd:border-r odd:pr-4 even:pl-4"
                    >
                      <dd className="font-serif text-4xl text-accent">
                        {value}
                      </dd>
                      <dt className="mt-1 text-xs leading-5 text-primary-foreground/65">
                        {label}
                      </dt>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 border-l-2 border-accent pl-4 text-sm leading-6 text-primary-foreground/70">
                  {content.heroNote}
                </p>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* Product catalog */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <h2 className="mt-6 max-w-3xl font-serif text-5xl leading-none md:text-7xl">
          {content.productsTitle}
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          {content.productsBody}
        </p>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border-subtle bg-border-subtle sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => {
            const text = product.translations[0];
            return (
              <Link
                key={product.id}
                href={`/${locale}/products/${product.slug}`}
                className="flex min-h-40 flex-col justify-between bg-background p-5 transition-colors hover:bg-surface-warm focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-text-accent"
              >
                <span className="text-sm text-text-soft">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="text-xs text-text-accent">
                    {content.product}
                  </span>
                  <span className="mt-2 block font-serif text-3xl capitalize">
                    {text?.title || product.slug.replaceAll("-", " ")}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Tentang perusahaan dan kapabilitas produksi */}
      {/* Company overview */}
      <section className="bg-secondary text-primary">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 grid-cols-1 md:grid-cols-[1.3fr_.7fr] md:px-10 md:py-24">
          <div>
            <h2 className="max-w-3xl font-serif text-5xl leading-none md:text-7xl">
              {content.aboutTitle}
            </h2>
          </div>
          <div>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
              {content.aboutBody}
            </p>
            <Link
              href={`/${locale}/about`}
              className="mt-8 inline-block text-muted-foreground underline underline-offset-4"
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

      {/* Video profil perusahaan */}
      {/* Company film */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-[.9fr_1.1fr] md:px-10 md:py-20">
          <div>
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

      {/* Partner dan logo klien */}
      {/* Partner network */}
      <section
        className="bg-card py-16 md:py-24"
        aria-labelledby="partner-title"
      >
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="flex flex-col items-center justify-center text-center w-full">
            <h2
              id="partner-title"
              className="font-serif text-5xl leading-none md:text-6xl w-1/2"
            >
              {content.partnersTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-muted-foreground">
              {content.partnersBody}
            </p>
          </div>
          <div className="mt-12 space-y-3 overflow-hidden" aria-hidden="true">
            <div className="overflow-hidden">
              <div className="flex w-max animate-[partner-marquee-left_30s_linear_infinite]">
                {[0, 1].map((group) => (
                  <div key={group} className="flex gap-3 pr-3">
                    {PARTNER_LOGOS.map((partner) => (
                      <PartnerLogo
                        key={`${group}-${partner.name}`}
                        partner={partner}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="flex w-max animate-[partner-marquee-right_40s_linear_infinite]">
                {[0, 1].map((group) => (
                  <div key={group} className="flex gap-3 pr-3">
                    {PARTNER_LOGOS_REVERSED_FLOW.map((partner) => (
                      <PartnerLogo
                        key={`${group}-${partner.name}`}
                        partner={partner}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <ul className="sr-only" aria-label={content.partnersLabel}>
            {PARTNER_LOGOS.map((partner) => (
              <li key={partner.name}>{partner.name}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Testimonial disembunyikan sampai testimoni buyer yang disetujui tersedia. */}
      {true && (
        /* Buyer stories */
        <section
          className="bg-background mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24"
          aria-labelledby="testimonial-title"
        >
          <h2
            id="testimonial-title"
            className="mt-5 max-w-3xl font-serif text-5xl leading-none md:text-7xl"
          >
            {content.testimonialsTitle}
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden border border-border-subtle bg-border-subtle md:grid-cols-2">
            {content.testimonials.map(([quote, attribution]) => (
              <figure
                key={attribution}
                className="flex min-h-72 flex-col bg-card p-7 md:p-10"
              >
                <blockquote className="mt-10 font-serif text-3xl leading-snug">
                  {quote}
                </blockquote>
                <figcaption className="mt-auto pt-10 text-sm text-muted-foreground">
                  {attribution}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Formulir permintaan sample */}
      {/* Request samples */}
      <section id="request-samples" className="bg-background py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 rounded-[2rem] border border-border-subtle bg-card px-5 py-7 md:grid-cols-[.8fr_.8fr_1.2fr] md:px-10 md:py-12">
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
            className="grid content-start gap-4 sm:grid-cols-2"
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
