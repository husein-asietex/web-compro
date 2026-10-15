import Image from "next/image";
import { copy, type Locale } from "@/lib/i18n";

import { SendIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const engineeringCollaboration = "/career/IMG_3869.webp";
const productionTeam = "/career/IMG_4033.webp";
const qualitySpecialist = "/career/IMG_3001.webp";

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

type CareerOpening = {
  role: string;
  location: string;
  type: string;
  postedAt: string;
  applicationUrl: string;
};

function getOpenings(data: unknown, locale: Locale): CareerOpening[] {
  if (!data || typeof data !== "object" || !(locale in data)) return [];
  const openings = (data as Record<string, unknown>)[locale];
  if (!Array.isArray(openings)) return [];
  return openings.filter(
    (opening): opening is CareerOpening =>
      Boolean(opening) &&
      typeof opening === "object" &&
      ["role", "location", "type", "postedAt", "applicationUrl"].every(
        (key) => typeof (opening as Record<string, unknown>)[key] === "string",
      ),
  );
}

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

export default function CareerPage({ locale }: { locale: Locale }) {
  const translation = { title: copy[locale].nav[3], body: "" };
  const text = careerCopy[locale];
  const openings = getOpenings(undefined, locale);
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
      <div className="mt-16 grid grid-cols-3 gap-2 md:gap-4">
        {[
          [productionTeam, imageAlts[0]],
          [engineeringCollaboration, imageAlts[1]],
          [qualitySpecialist, imageAlts[2]],
        ].map(([src, alt], index) => (
          <figure
            key={alt as string}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-card"
          >
            <Image
              src={src}
              alt={alt as string}
              fill
              priority={index === 0}
              sizes="33vw"
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
      {/* <section
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
                <p className="text-sm text-muted-foreground">
                  {opening.postedAt}
                </p>
                <h3 className="font-serif text-3xl leading-tight">
                  {opening.role}
                </h3>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-text-accent">
                  {opening.type} • {opening.location}
                </p>

                <a
                  href={opening.applicationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 w-full gap-1 items-center justify-center rounded-full border border-border-strong px-4 text-sm font-medium transition-colors hover:border-text-accent hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-accent mt-5"
                >
                  <HugeiconsIcon icon={SendIcon} size={17} />{" "}
                  {text.viewOpenings}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section> */}
    </section>
  );
}
