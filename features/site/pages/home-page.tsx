import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

import { buttonVariants } from "@/components/ui/button";
import { YouTubeEmbed } from "@/features/site/components/youtube-embed";
import { copy, isLocale, locales } from "@/lib/i18n";
import { prisma } from "@/backend/prisma";
import { asStringArray } from "@/lib/json";

const DEFAULT_CATALOG_URL = "https://e-catalog.asietex.web.id";
const COMPANY_FILM_URL = "https://www.youtube.com/watch?v=A1YoEqG4amQ";
type Partner = { name: string; src: string };
type Testimonial = { quote: string; attribution: string };

function PartnerLogo({ partner }: { partner: Partner }) {
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

function getSocialProof(data: unknown, locale: LocaleCode) {
  if (!data || typeof data !== "object" || !(locale in data)) {
    return { partners: [] as Partner[], testimonials: [] as Testimonial[] };
  }
  const content = (data as Record<string, unknown>)[locale];
  if (!content || typeof content !== "object") {
    return { partners: [] as Partner[], testimonials: [] as Testimonial[] };
  }
  const value = content as Record<string, unknown>;
  const partners = Array.isArray(value.partners)
    ? value.partners.filter(
        (item): item is Partner =>
          Boolean(item) &&
          typeof item === "object" &&
          typeof (item as Record<string, unknown>).name === "string" &&
          typeof (item as Record<string, unknown>).src === "string",
      )
    : [];
  const testimonials = Array.isArray(value.testimonials)
    ? value.testimonials.filter(
        (item): item is Testimonial =>
          Boolean(item) &&
          typeof item === "object" &&
          typeof (item as Record<string, unknown>).quote === "string" &&
          typeof (item as Record<string, unknown>).attribution === "string",
      )
    : [];
  return { partners, testimonials };
}

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
  await connection();
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
  await connection();
  const [page, settings, products, socialProof] = await Promise.all([
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
    prisma.contentCollection.findFirst({
      where: { key: "home-social-proof", status: "PUBLISHED" },
    }),
  ]);
  return {
    translation: page?.translations[0],
    settings,
    products,
    socialProof,
  };
}

export default async function LocalizedHome({
  params,
}: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale];
  const { translation, settings, products, socialProof } =
    await getHomeContent(locale);
  const title = translation?.title || t.hero;
  const body = translation?.body || t.body;
  const showCatalog =
    settings?.catalogOn !== false &&
    (settings
      ? asStringArray(settings.catalogPlacements).includes("home")
      : true);
  const catalogUrl = settings?.catalogUrl || DEFAULT_CATALOG_URL;
  const catalogLabel =
    locale === "id"
      ? settings?.catalogLabelId || t.catalog
      : locale === "pt"
        ? settings?.catalogLabelPt || t.catalog
        : settings?.catalogLabelEn || t.catalog;
  const content = homeCopy[locale];
  const { partners, testimonials } = getSocialProof(socialProof?.data, locale);

  return (
    <>
      {/* Hero: latar produksi terintegrasi, pesan utama, CTA, dan ringkasan skala. */}
      <section className="">
        {/* Home hero */}
        <div className="relative isolate min-h-[42rem] overflow-hidden bg-primary text-primary-foreground md:min-h-[46rem]">
          <Image
            src="/home/IMG_3406.JPG"
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

      {/* Products */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-24">
        <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-none md:mt-6 md:text-7xl">
          {content.productsTitle}
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground md:mt-6 md:text-lg md:leading-8">
          {content.productsBody}
        </p>
        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border-subtle bg-border-subtle md:mt-12 lg:grid-cols-3">
          {products.map((product, index) => {
            const text = product.translations[0];
            return (
              <Link
                key={product.id}
                href={`/${locale}/products/${product.slug}`}
                className="flex min-h-28 flex-col justify-between bg-background p-4 transition-colors hover:bg-surface-warm focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-text-accent md:min-h-40 md:p-5"
              >
                <span className="text-sm text-text-soft">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="hidden text-xs text-text-accent sm:inline">
                    {content.product}
                  </span>
                  <span className="block font-serif text-2xl capitalize sm:mt-2 sm:text-3xl">
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
          <div className="relative aspect-[2/1] overflow-hidden rounded-2xl md:col-span-2">
            <Image
              src="/why-asietex/IMG_2875.JPG"
              alt={content.aboutTitle}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

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
            loadImmediately
          />
        </div>
      </section>

      {/* Partner network */}
      {false && partners.length > 0 && (
        <section
          className="overflow-x-clip bg-card py-16 md:py-24"
          aria-labelledby="partner-title"
        >
          <div className="mx-auto w-full max-w-7xl overflow-x-clip px-5 md:px-10">
            <div className="flex w-full min-w-0 flex-col items-center justify-center text-center">
              <h2
                id="partner-title"
                className="w-full max-w-2xl font-serif text-5xl leading-none md:w-1/2 md:text-6xl"
              >
                {content.partnersTitle}
              </h2>
              <p className="mt-5 max-w-2xl text-muted-foreground">
                {content.partnersBody}
              </p>
            </div>
            <div
              className="mt-12 w-full min-w-0 space-y-3 overflow-hidden"
              aria-hidden="true"
            >
              <div className="w-full overflow-hidden">
                <div className="flex w-max animate-[partner-marquee-left_30s_linear_infinite]">
                  {[0, 1].map((group) => (
                    <div key={group} className="flex gap-3 pr-3">
                      {partners.map((partner) => (
                        <PartnerLogo
                          key={`${group}-${partner.name}`}
                          partner={partner}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full overflow-hidden">
                <div className="flex w-max animate-[partner-marquee-right_40s_linear_infinite]">
                  {[0, 1].map((group) => (
                    <div key={group} className="flex gap-3 pr-3">
                      {[...partners].reverse().map((partner) => (
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
              {partners.map((partner) => (
                <li key={partner.name}>{partner.name}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Testimonial disembunyikan sampai testimoni buyer yang disetujui tersedia. */}
      {false && testimonials.length > 0 && (
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
            {testimonials.map(({ quote, attribution }) => (
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
              src="/request-samples/IMG_3723.JPG"
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
