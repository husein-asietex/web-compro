import type { Locale } from "@/lib/i18n";
import { Message01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const pageCopy = {
  en: {
    title: "Talk to the team closest to your brief.",
    phoneLabel: "Call",
    emailLabel: "Email",
  },
  id: {
    title: "Hubungi tim yang paling sesuai dengan kebutuhan Anda.",
    phoneLabel: "Telepon",
    emailLabel: "Email",
  },
  pt: {
    title: "Fale com a equipa mais próxima do seu pedido.",
    phoneLabel: "Telefone",
    emailLabel: "Email",
  },
} as const;

const contacts = [
  {
    name: "Maya Hartono",
    role: "Apparel & Uniform Marketing",
    language: "Indonesian, English",
    phone: "+62 812 0000 0101",
    phoneHref: "+6281200000101",
    email: "maya.hartono@example.com",
  },
  {
    name: "Rafi Pradana",
    role: "Knits & Cotton Marketing",
    language: "Indonesia",
    phone: "+62 812 0000 0102",
    phoneHref: "+6281200000102",
    email: "rafi.pradana@example.com",
  },
  {
    name: "Elena Moretti",
    role: "European Market Development",
    language: "Italian, English",
    phone: "+39 320 000 0103",
    phoneHref: "+393200000103",
    email: "elena.moretti@example.com",
  },
  {
    name: "Tiago Duarte",
    role: "Yarn & Fabric Marketing",
    language: "Portuguese, English",
    phone: "+351 910 000 104",
    phoneHref: "+351910000104",
    email: "tiago.duarte@example.com",
  },
  {
    name: "Claire Martin",
    role: "Woven & Finishing Marketing",
    language: "French, English",
    phone: "+33 6 00 00 01 05",
    phoneHref: "+33600000105",
    email: "claire.martin@example.com",
  },
  {
    name: "Kusuma Wijaya",
    role: "Strategic Accounts",
    language: "Indonesian, English",
    phone: "+62 812 0000 0106",
    phoneHref: "+6281200000106",
    email: "kusuma.wijaya@example.com",
  },
] as const;

export default function MarketingContactPage({ locale }: { locale: Locale }) {
  const t = pageCopy[locale];

  return (
    /* Marketing contact page */
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
      {/* Marketing contact introduction */}
      <div className="grid gap-8 pb-12 md:grid-cols-[minmax(0,1.25fr)_minmax(16rem,.75fr)] md:items-end">
        <div>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-none md:text-7xl">
            {t.title}
          </h1>
        </div>
      </div>

      {/* Marketing contact directory */}
      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border-subtle bg-border-subtle sm:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact) => (
          <article
            key={contact.email}
            className="flex flex-col gap-8 bg-background p-6 md:p-7"
          >
            <div className="flex flex-col gap-1 text-sm">
              <h2 className="font-serif text-3xl leading-tight">
                {contact.name}
              </h2>

              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <HugeiconsIcon icon={Message01Icon} size={16} />{" "}
                {contact.language}
              </p>

              <p className="text-sm leading-6 text-muted-foreground">
                {contact.role}
              </p>
            </div>

            <div className="flex flex-col gap-1 border-border-subtle text-sm">
              <a
                href={`tel:${contact.phoneHref}`}
                className="w-fit underline decoration-border-strong underline-offset-4 transition-colors hover:text-text-accent focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text-accent"
              >
                <span className="sr-only">{t.phoneLabel}: </span>
                {contact.phone}
              </a>

              <a
                href={`mailto:${contact.email}`}
                className="w-fit break-all underline decoration-border-strong underline-offset-4 transition-colors hover:text-text-accent focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text-accent"
              >
                <span className="sr-only">{t.emailLabel}: </span>
                {contact.email}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
