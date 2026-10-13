import Link from "next/link";

import { copy, type Locale } from "@/lib/i18n";

const footerCopy = {
  en: {
    home: "Home",
    description:
      "Integrated textile manufacturing from raw cotton to finished fabric.",
    explore: "Explore Asietex",
    contact: "Contact",
    location: "Jakarta, Indonesia",
    copyright: "All rights reserved.",
  },
  id: {
    home: "Beranda",
    description:
      "Manufaktur tekstil terintegrasi dari kapas mentah hingga kain jadi.",
    explore: "Jelajahi Asietex",
    contact: "Kontak",
    location: "Jakarta, Indonesia",
    copyright: "Hak cipta dilindungi.",
  },
  pt: {
    home: "Página inicial",
    description:
      "Fabrico têxtil integrado, do algodão bruto ao tecido acabado.",
    explore: "Explorar a Asietex",
    contact: "Contacto",
    location: "Jacarta, Indonésia",
    copyright: "Todos os direitos reservados.",
  },
} satisfies Record<Locale, Record<string, string>>;

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = footerCopy[locale];
  const navItems = [
    ["home", t.home],
    ["about", copy[locale].nav[0]],
    ["products", copy[locale].nav[1]],
    ["career", copy[locale].nav[3]],
    ["contact", copy[locale].nav[4]],
    ["marketing-contact", copy[locale].nav[2]],
  ] as const;

  return (
    /* Public site footer */
    <footer
      className="border-t border-border-subtle bg-primary text-primary-foreground"
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16">
        {/* Footer content columns */}
        <div className="grid gap-12 md:grid-cols-[1.4fr_.8fr_.8fr]">
          <div>
            <Link
              href={`/${locale}`}
              className="inline-block font-serif text-3xl focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              aria-label="Asietex home"
            >
              Asietex<span className="text-accent">.</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-ink-inverse-muted">
              {t.description}
            </p>
          </div>

          {/* Explore navigation */}
          <nav aria-label={t.explore}>
            <h2 className="text-sm font-medium text-accent">{t.explore}</h2>
            <ul className="mt-4 grid gap-3 text-sm">
              {navItems.map(([slug, label]) => (
                <li key={slug}>
                  <Link
                    href={slug === "home" ? `/${locale}` : `/${locale}/${slug}`}
                    className="text-ink-inverse-muted underline-offset-4 transition-colors hover:text-primary-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-medium text-accent">{t.contact}</h2>
            <address className="mt-4 grid gap-3 text-sm not-italic text-ink-inverse-muted">
              <a
                className="underline-offset-4 hover:text-primary-foreground hover:underline"
                href="mailto:contact.us@asietex.co.id"
              >
                contact.us@asietex.co.id
              </a>
              <a
                className="underline-offset-4 hover:text-primary-foreground hover:underline"
                href="tel:+622163863999"
              >
                +62 21 6386 3999
              </a>
              <span>{t.location}</span>
            </address>
          </div>
        </div>

        {/* Footer legal and attribution */}
        <div className="mt-12 flex flex-col gap-3 border-t border-border-subtle pt-5 text-xs text-ink-inverse-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 PT Asietex Sinar Indopratama</span>
          <span>{t.copyright}</span>
        </div>
      </div>
    </footer>
  );
}
