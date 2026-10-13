import Image from "next/image";
import { redirect } from "next/navigation";

import factoryExterior from "@/public/about/factory-exterior.png";
import productionFloor from "@/public/about/integrated-production-floor.png";
import qualityTeam from "@/public/about/quality-team.png";
import { prisma } from "@/backend/prisma";
import type { Locale } from "@/lib/i18n";

const aboutHeroCopy = {
  en: {
    title: "A connected textile partner, built for continuity.",
  },
  id: {
    title: "Mitra tekstil terhubung yang dibangun untuk kesinambungan.",
  },
  pt: {
    title: "Um parceiro têxtil ligado, construído para dar continuidade.",
  },
} as const;

const history = {
  en: {
    label: "Our journey",
    title: "Built over time, connected by purpose.",
    intro:
      "Asietex has grown by bringing more of the textile journey together — helping every team, process, and partner move with greater continuity.",
    milestones: [
      [
        "1980s",
        "The beginning",
        "Asietex begins its textile manufacturing journey, building a foundation in yarn and fabric production.",
      ],
      [
        "1990s",
        "Expanding capabilities",
        "The company grows into additional knitting, weaving, dyeing, and finishing capabilities.",
      ],
      [
        "2000s",
        "An integrated operation",
        "Connected production processes give customers greater consistency from material to finished fabric.",
      ],
      [
        "2010s",
        "Growing with global partners",
        "Asietex strengthens relationships with brands and buyers through quality, flexibility, and dependable delivery.",
      ],
      [
        "2020s",
        "One connected textile partner",
        "Today, nine products work as one accountable chain for buyers across markets.",
      ],
    ],
  },
  id: {
    label: "Perjalanan kami",
    title: "Tumbuh dari waktu ke waktu, terhubung oleh tujuan.",
    intro:
      "Asietex berkembang dengan menyatukan lebih banyak proses tekstil — membantu setiap tim, proses, dan mitra bergerak dengan kesinambungan yang lebih baik.",
    milestones: [
      [
        "1980-an",
        "Awal perjalanan",
        "Asietex memulai perjalanan manufakturnya dengan membangun fondasi produksi benang dan kain.",
      ],
      [
        "1990-an",
        "Memperluas kapabilitas",
        "Perusahaan mengembangkan kemampuan knitting, weaving, dyeing, dan finishing.",
      ],
      [
        "2000-an",
        "Operasi yang terintegrasi",
        "Proses produksi yang terhubung membantu pelanggan mendapatkan konsistensi dari bahan hingga kain jadi.",
      ],
      [
        "2010-an",
        "Tumbuh bersama partner global",
        "Asietex memperkuat hubungan dengan brand dan buyer melalui kualitas, fleksibilitas, dan ketepatan pengiriman.",
      ],
      [
        "2020-an",
        "Satu mitra tekstil yang terhubung",
        "Saat ini, sembilan produk bekerja sebagai satu rantai yang bertanggung jawab untuk buyer di berbagai pasar.",
      ],
    ],
  },
  pt: {
    label: "A nossa jornada",
    title: "Construída ao longo do tempo, ligada por um propósito.",
    intro:
      "A Asietex cresceu ao ligar mais etapas da jornada têxtil — ajudando equipas, processos e parceiros a trabalhar com maior continuidade.",
    milestones: [
      [
        "Anos 1980",
        "O início",
        "A Asietex inicia a sua jornada de fabrico têxtil, criando uma base na produção de fios e tecidos.",
      ],
      [
        "Anos 1990",
        "Expansão de capacidades",
        "A empresa cresce com novas capacidades de malharia, tecelagem, tingimento e acabamento.",
      ],
      [
        "Anos 2000",
        "Uma operação integrada",
        "Processos de produção ligados oferecem maior consistência, do material ao tecido acabado.",
      ],
      [
        "Anos 2010",
        "Crescer com parceiros globais",
        "A Asietex reforça relações com marcas e compradores através de qualidade, flexibilidade e entrega fiável.",
      ],
      [
        "Anos 2020",
        "Um parceiro têxtil ligado",
        "Hoje, nove produtos trabalham como uma cadeia responsável para compradores em vários mercados.",
      ],
    ],
  },
} as const;

const companyOverview = {
  en: [
    "Asietex is an integrated textile manufacturer from Indonesia, bringing together the skills, facilities, and people needed to turn yarn into dependable finished fabric.",
    "By keeping key stages of production connected, we help brands and buyers work with clearer communication, consistent quality, and a partner accountable from start to finish.",
  ],
  id: [
    "Asietex adalah produsen tekstil terintegrasi dari Indonesia yang menyatukan keahlian, fasilitas, dan tim untuk mengolah benang menjadi kain jadi yang andal.",
    "Dengan menjaga setiap tahap produksi tetap terhubung, kami membantu brand dan buyer bekerja dengan komunikasi yang lebih jelas, kualitas yang konsisten, dan mitra yang bertanggung jawab dari awal hingga akhir.",
  ],
  pt: [
    "A Asietex é um fabricante têxtil integrado da Indonésia, reunindo competências, instalações e pessoas para transformar fio em tecido acabado de confiança.",
    "Ao manter as principais etapas de produção ligadas, ajudamos marcas e compradores a trabalhar com comunicação clara, qualidade consistente e um parceiro responsável do início ao fim.",
  ],
} as const;

const aboutImages = [
  {
    src: factoryExterior,
    alt: "Asietex textile manufacturing campus in Jakarta",
    className: "sm:col-span-2",
  },
  {
    src: productionFloor,
    alt: "Integrated textile production floor",
    className: "",
  },
  {
    src: qualityTeam,
    alt: "Textile quality team inspecting fabric",
    className: "",
  },
] as const;

export default async function AboutPage({ locale }: { locale: Locale }) {
  const page = await prisma.page.findFirst({
    where: { slug: "about", status: "PUBLISHED" },
    include: { translations: { where: { locale } } },
  });
  if (!page) redirect("/en");

  const translation = page.translations[0];
  const journey = history[locale];
  const overview = companyOverview[locale];

  return (
    /* About page */
    <section className="mx-auto max-w-7xl px-5 py-20">
      {/* Company introduction */}
      <h1 className="mt-8 max-w-4xl font-serif text-6xl leading-none md:text-7xl">
        {translation?.title || aboutHeroCopy[locale].title}
      </h1>
      <div className="mt-12 grid max-w-5xl gap-6 md:grid-cols-2 md:gap-12">
        {overview.map((paragraph) => (
          <p key={paragraph} className="text-lg leading-8 text-foreground/80">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Company history */}
      <section
        className="mt-28 grid gap-12 border-t border-border-subtle pt-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24"
        aria-labelledby="our-journey-title"
      >
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm font-medium text-text-accent">
            {journey.label}
          </p>
          <h2
            id="our-journey-title"
            className="mt-4 max-w-md font-serif text-4xl leading-tight md:text-5xl"
          >
            {journey.title}
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
            {journey.intro}
          </p>
        </div>
        <ol className="relative ml-2 border-l border-border-strong pl-8 md:pl-12">
          {journey.milestones.map(([year, title, description], index) => (
            <li key={year} className="relative pb-12 last:pb-0">
              <span
                className="absolute -left-[2.1rem] top-0 flex size-4 items-center justify-center rounded-full border-4 border-background bg-accent md:-left-[3.51rem]"
                aria-hidden="true"
              />
              <p className="text-sm font-semibold tracking-wide text-text-accent">
                {year}
              </p>
              <h3 className="mt-2 text-2xl font-medium tracking-tight">
                {title}
              </h3>
              <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
                {description}
              </p>
              {index < journey.milestones.length - 1 && (
                <div
                  className="mt-8 h-px max-w-xl bg-border-subtle"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Company imagery */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {aboutImages.map((image, index) => (
          <figure
            key={image.alt}
            className={`relative overflow-hidden rounded-3xl bg-card ${image.className}`}
          >
            <div className={index === 0 ? "aspect-[2/1]" : "aspect-[4/3]"}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                placeholder="blur"
                priority={index === 0}
                sizes={
                  index === 0
                    ? "(max-width: 1280px) 100vw, 1280px"
                    : "(max-width: 640px) 100vw, 50vw"
                }
                className="object-cover"
              />
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
