import Image from "next/image";
import { redirect } from "next/navigation";

import engineeringCollaboration from "@/public/career/engineering-collaboration.png";
import productionTeam from "@/public/career/production-team.png";
import qualitySpecialist from "@/public/career/quality-specialist.png";
import { prisma } from "@/backend/prisma";
import { copy, type Locale } from "@/lib/i18n";

const careerCopy = {
  en: {
    branchesTitle: "Where our people work",
    mapsLabel: "View on Maps",
    branches: [
      [
        "Jakarta",
        "Head Office",
        "Jl. Cideng Timur No. 36, Petojo Utara, Gambir, Central Jakarta 10130, Indonesia",
        "https://www.google.com/maps/search/?api=1&query=Jl.+Cideng+Timur+No.+36,+Jakarta+Pusat",
      ],
      [
        "Cikande",
        "Factory",
        "Modern Cikande Industrial Estate, Serang, Banten, Indonesia",
        "https://www.google.com/maps/search/?api=1&query=Modern+Cikande+Industrial+Estate,+Serang,+Banten",
      ],
      [
        "Cikampek",
        "Factory",
        "Cikampek, Karawang, West Java, Indonesia",
        "https://www.google.com/maps/search/?api=1&query=Cikampek,+Karawang,+Jawa+Barat",
      ],
    ],
    openingsTitle: "Current openings",
    viewOpenings: "Apply Now",
  },
  id: {
    branchesTitle: "Tempat tim kami bekerja",
    mapsLabel: "Lihat di Maps",
    branches: [
      [
        "Jakarta",
        "Kantor Pusat",
        "Jl. Cideng Timur No. 36, Petojo Utara, Gambir, Jakarta Pusat 10130, Indonesia",
        "https://www.google.com/maps/search/?api=1&query=Jl.+Cideng+Timur+No.+36,+Jakarta+Pusat",
      ],
      [
        "Cikande",
        "Pabrik",
        "Kawasan Industri Modern Cikande, Serang, Banten, Indonesia",
        "https://www.google.com/maps/search/?api=1&query=Modern+Cikande+Industrial+Estate,+Serang,+Banten",
      ],
      [
        "Cikampek",
        "Pabrik",
        "Cikampek, Karawang, Jawa Barat, Indonesia",
        "https://www.google.com/maps/search/?api=1&query=Cikampek,+Karawang,+Jawa+Barat",
      ],
    ],
    openingsTitle: "Lowongan tersedia",
    viewOpenings: "Lamar Sekarang",
  },
  pt: {
    branchesTitle: "Onde as nossas equipas trabalham",
    mapsLabel: "Ver no Maps",
    branches: [
      [
        "Jakarta",
        "Sede",
        "Jl. Cideng Timur No. 36, Petojo Utara, Gambir, Jacarta Central 10130, Indonésia",
        "https://www.google.com/maps/search/?api=1&query=Jl.+Cideng+Timur+No.+36,+Jakarta+Pusat",
      ],
      [
        "Cikande",
        "Fábrica",
        "Parque Industrial Modern Cikande, Serang, Banten, Indonésia",
        "https://www.google.com/maps/search/?api=1&query=Modern+Cikande+Industrial+Estate,+Serang,+Banten",
      ],
      [
        "Cikampek",
        "Fábrica",
        "Cikampek, Karawang, Java Ocidental, Indonésia",
        "https://www.google.com/maps/search/?api=1&query=Cikampek,+Karawang,+Jawa+Barat",
      ],
    ],
    openingsTitle: "Vagas atuais",
    viewOpenings: "Candidate-se agora",
  },
} as const;

const dummyOpenings = {
  en: [
    {
      role: "Production Planner",
      location: "Jakarta",
      type: "Full time",
      postedAt: "Posted 2 days ago",
    },
    {
      role: "Quality Assurance Specialist",
      location: "Factory operations",
      type: "Full time",
      postedAt: "Posted 5 days ago",
    },
    {
      role: "Textile Process Engineer",
      location: "Jakarta",
      type: "Full time",
      postedAt: "Posted 1 week ago",
    },
  ],
  id: [
    {
      role: "Perencana Produksi",
      location: "Jakarta",
      type: "Penuh waktu",
      postedAt: "Diposting 2 hari lalu",
    },
    {
      role: "Spesialis Quality Assurance",
      location: "Operasional pabrik",
      type: "Penuh waktu",
      postedAt: "Diposting 5 hari lalu",
    },
    {
      role: "Engineer Proses Tekstil",
      location: "Jakarta",
      type: "Penuh waktu",
      postedAt: "Diposting 1 minggu lalu",
    },
  ],
  pt: [
    {
      role: "Planeador de Produção",
      location: "Jacarta",
      type: "Tempo inteiro",
      postedAt: "Publicado há 2 dias",
    },
    {
      role: "Especialista de Qualidade",
      location: "Operações fabris",
      type: "Tempo inteiro",
      postedAt: "Publicado há 5 dias",
    },
    {
      role: "Engenheiro de Processos Têxteis",
      location: "Jacarta",
      type: "Tempo inteiro",
      postedAt: "Publicado há 1 semana",
    },
  ],
} as const;

const careerImageAlts = {
  en: [
    "Textile production team briefing",
    "Engineers collaborating on the production floor",
    "Quality specialist inspecting woven fabric",
  ],
  id: [
    "Briefing tim produksi tekstil",
    "Kolaborasi engineer di area produksi",
    "Spesialis kualitas memeriksa kain tenun",
  ],
  pt: [
    "Briefing da equipa de produção têxtil",
    "Engenheiros a colaborar na área de produção",
    "Especialista de qualidade a inspecionar tecido entrançado",
  ],
} as const;

export default async function CareerPage({ locale }: { locale: Locale }) {
  const page = await prisma.page.findFirst({
    where: { slug: "career", status: "PUBLISHED" },
    include: { translations: { where: { locale } } },
  });
  if (!page) redirect("/en");

  const translation = page.translations[0];
  const text = careerCopy[locale];
  const openings = dummyOpenings[locale];
  const imageAlts = careerImageAlts[locale];

  return (
    /* Career page */
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
      {/* Career introduction */}
      <div className="grid gap-12">
        <h1 className="mt-8 max-w-4xl font-serif text-6xl leading-[.95] tracking-[-.04em] md:text-8xl">
          {translation?.title || copy[locale].nav[3]}
        </h1>
        <div className="max-w-2xl whitespace-pre-line text-lg leading-8 text-muted-foreground">
          {translation?.body}
        </div>
      </div>

      {/* Career imagery */}
      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {[
          [productionTeam, imageAlts[0]],
          [engineeringCollaboration, imageAlts[1]],
          [qualitySpecialist, imageAlts[2]],
        ].map(([src, alt], index) => (
          <figure
            key={alt as string}
            className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-card"
          >
            <Image
              src={src}
              alt={alt as string}
              fill
              placeholder="blur"
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </figure>
        ))}
      </div>

      {/* Career branches */}
      <section className="mt-24" aria-labelledby="career-values">
        <h2 id="career-values" className="font-serif text-5xl md:text-6xl">
          {text.branchesTitle}
        </h2>
        <div className="mt-10 grid gap-px overflow-hidden border border-border-subtle bg-border-subtle md:grid-cols-3">
          {text.branches.map(([location, type, address, mapsUrl]) => (
            <article
              key={location}
              className="flex min-h-64 flex-col bg-card p-7"
            >
              <h3 className="font-serif text-3xl">{location}</h3>
              <p className="mt-5 text-sm font-medium text-text-accent">
                {type}
              </p>
              <address className="mt-6 max-w-xs text-sm not-italic leading-6 text-muted-foreground">
                {address}
              </address>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-auto pt-8 text-sm font-medium underline decoration-border-strong underline-offset-4 transition-colors hover:text-text-accent focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text-accent"
              >
                {text.mapsLabel}
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Job Vacancies */}
      <section
        className="mt-24 bg-secondary p-6 md:p-10"
        aria-labelledby="career-openings"
      >
        <div className="flex flex-col gap-4 border-b border-border-strong pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2
              id="career-openings"
              className="font-serif text-5xl md:text-6xl"
            >
              {text.openingsTitle}
            </h2>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {openings.map((opening) => (
            <article
              key={opening.role}
              className="flex min-h-75 flex-col justify-between rounded-2xl border border-border-subtle bg-background p-6 transition-colors hover:border-text-accent hover:bg-card"
            >
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-text-accent">
                  {opening.type} • {opening.location}
                </p>
                <h3 className="font-serif text-3xl leading-tight">
                  {opening.role}
                </h3>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span>{opening.location}</span>
                </div>

                <p className="text-sm text-muted-foreground">
                  {opening.postedAt}
                </p>

                <a
                  href="https://www.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-border-strong px-4 text-sm font-medium transition-colors hover:border-text-accent hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-accent mt-5"
                >
                  {text.viewOpenings}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
