import { redirect } from "next/navigation";

import { prisma } from "@/backend/prisma";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { CatalogCta } from "@/features/site/lib/site-page-helpers";
import { copy, type Locale } from "@/lib/i18n";

const careerCopy = {
  en: {
    label: "Work with Asietex",
    aside: "A place for careful work",
    asideBody: "Make something that lasts beyond the next production cycle.",
    valuesTitle: "How we work",
    values: [
      ["Care", "Protect quality, people, and the details that connect them."],
      [
        "Discipline",
        "Turn good decisions into repeatable production standards.",
      ],
      [
        "Curiosity",
        "Keep learning from materials, machinery, and one another.",
      ],
    ],
    departmentsTitle: "Where your craft can grow",
    departments: [
      "Production",
      "Quality",
      "Engineering",
      "Commercial",
      "Operations",
    ],
    openingsTitle: "Current openings",
    openingsNote:
      "Sample openings for layout review. Replace before publication.",
    openings: [
      ["Production Planner", "Jakarta · Full time"],
      ["Quality Assurance Specialist", "Factory operations · Full time"],
      ["Textile Process Engineer", "Engineering · Full time"],
    ],
    placeholder: "Placeholder",
    applyTitle: "Interested in joining us?",
    applyBody:
      "Send your profile and the role you are interested in to our team.",
    apply: "Email your profile",
  },
  id: {
    label: "Berkarier di Asietex",
    aside: "Ruang untuk karya yang teliti",
    asideBody: "Ciptakan sesuatu yang bertahan melampaui satu siklus produksi.",
    valuesTitle: "Cara kami bekerja",
    values: [
      [
        "Kepedulian",
        "Menjaga kualitas, manusia, dan detail yang menghubungkan keduanya.",
      ],
      [
        "Disiplin",
        "Mengubah keputusan baik menjadi standar produksi yang dapat diulang.",
      ],
      [
        "Keingintahuan",
        "Terus belajar dari material, mesin, dan satu sama lain.",
      ],
    ],
    departmentsTitle: "Tempat keahlian Anda berkembang",
    departments: [
      "Produksi",
      "Kualitas",
      "Engineering",
      "Komersial",
      "Operasional",
    ],
    openingsTitle: "Lowongan tersedia",
    openingsNote:
      "Lowongan contoh untuk peninjauan layout. Ganti sebelum publikasi.",
    openings: [
      ["Perencana Produksi", "Jakarta · Penuh waktu"],
      ["Spesialis Quality Assurance", "Operasional pabrik · Penuh waktu"],
      ["Engineer Proses Tekstil", "Engineering · Penuh waktu"],
    ],
    placeholder: "Placeholder",
    applyTitle: "Tertarik bergabung?",
    applyBody: "Kirim profil dan posisi yang Anda minati kepada tim kami.",
    apply: "Kirim profil melalui email",
  },
  pt: {
    label: "Trabalhe na Asietex",
    aside: "Um lugar para trabalho cuidadoso",
    asideBody: "Crie algo que dure para além do próximo ciclo de produção.",
    valuesTitle: "Como trabalhamos",
    values: [
      [
        "Cuidado",
        "Protegemos a qualidade, as pessoas e os detalhes que as ligam.",
      ],
      [
        "Disciplina",
        "Transformamos boas decisões em padrões de produção repetíveis.",
      ],
      [
        "Curiosidade",
        "Continuamos a aprender com materiais, máquinas e uns com os outros.",
      ],
    ],
    departmentsTitle: "Onde a sua experiência pode crescer",
    departments: [
      "Produção",
      "Qualidade",
      "Engenharia",
      "Comercial",
      "Operações",
    ],
    openingsTitle: "Vagas atuais",
    openingsNote:
      "Vagas de exemplo para revisão do layout. Substituir antes da publicação.",
    openings: [
      ["Planeador de Produção", "Jacarta · Tempo inteiro"],
      [
        "Especialista de Garantia da Qualidade",
        "Operações fabris · Tempo inteiro",
      ],
      ["Engenheiro de Processos Têxteis", "Engenharia · Tempo inteiro"],
    ],
    placeholder: "Placeholder",
    applyTitle: "Quer juntar-se a nós?",
    applyBody:
      "Envie o seu perfil e a função em que está interessado à nossa equipa.",
    apply: "Enviar perfil por email",
  },
} as const;

export default async function CareerPage({ locale }: { locale: Locale }) {
  const [page, settings] = await Promise.all([
    prisma.page.findFirst({
      where: { slug: "career", status: "PUBLISHED" },
      include: { translations: { where: { locale } } },
    }),
    prisma.siteSetting.findUnique({ where: { id: "site" } }),
  ]);
  if (!page) redirect("/en");

  const translation = page.translations[0];
  const text = careerCopy[locale];

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
      <div className="grid gap-12 md:grid-cols-[1.25fr_.75fr] md:gap-20">
        <div>
          <Badge variant="outline">{text.label}</Badge>
          <h1 className="mt-8 max-w-4xl font-serif text-6xl leading-[.95] tracking-[-.04em] md:text-8xl">
            {translation?.title || copy[locale].nav[3]}
          </h1>
          <div className="mt-9 max-w-2xl whitespace-pre-line text-lg leading-8 text-muted-foreground">
            {translation?.body}
          </div>
        </div>

        <aside className="self-end rounded-[2rem] bg-primary p-7 text-primary-foreground md:p-9">
          <p className="text-sm text-accent">{text.aside}</p>
          <p className="mt-8 font-serif text-4xl leading-tight">
            {text.asideBody}
          </p>
          <div className="mt-12 border-t border-border-subtle pt-5 text-sm leading-6 text-ink-inverse-muted">
            {text.departments.join(" · ")}
          </div>
        </aside>
      </div>

      <section className="mt-24" aria-labelledby="career-values">
        <h2 id="career-values" className="font-serif text-5xl md:text-6xl">
          {text.valuesTitle}
        </h2>
        <div className="mt-10 grid gap-px overflow-hidden border border-border-subtle bg-border-subtle md:grid-cols-3">
          {text.values.map(([title, body]) => (
            <article key={title} className="bg-background p-7">
              <h3 className="font-serif text-3xl">{title}</h3>
              <p className="mt-5 leading-7 text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="mt-24 grid gap-10 md:grid-cols-[.7fr_1.3fr]"
        aria-labelledby="career-fields"
      >
        <h2 id="career-fields" className="font-serif text-5xl md:text-6xl">
          {text.departmentsTitle}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {text.departments.map((department) => (
            <li
              key={department}
              className="border-t border-border-strong py-5 text-lg"
            >
              {department}
            </li>
          ))}
        </ul>
      </section>

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
            <p className="mt-4 text-sm text-muted-foreground">
              {text.openingsNote}
            </p>
          </div>
          <Badge variant="outline">{text.placeholder}</Badge>
        </div>
        <div>
          {text.openings.map(([role, meta]) => (
            <article
              key={role}
              className="grid gap-2 border-b border-border-subtle py-6 md:grid-cols-[1fr_auto] md:items-center"
            >
              <h3 className="font-serif text-3xl">{role}</h3>
              <p className="text-sm text-muted-foreground">{meta}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20 border-l-2 border-accent pl-6">
        <h2 className="font-serif text-4xl">{text.applyTitle}</h2>
        <p className="mt-4 max-w-xl text-muted-foreground">{text.applyBody}</p>
        <a
          href="mailto:career@asietex.co.id"
          className={buttonVariants({
            variant: "outline",
            className: "mt-6 rounded-full",
          })}
        >
          {text.apply}
        </a>
      </section>
      <CatalogCta locale={locale} settings={settings} placement="career" />
    </section>
  );
}
