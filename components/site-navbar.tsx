"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { locales, type Locale } from "@/lib/i18n";
import { Button } from "./ui/button";

type SiteNavbarProps = {
  locale: Locale;
  labels: readonly string[];
};

/** Shared public navigation for every localized marketing page. */
export function SiteNavbar({ locale, labels }: SiteNavbarProps) {
  const pathname = usePathname();
  const navItems = ["about", "products", "network", "contact"] as const;

  /** Replace only the locale segment, preserving the active localized page. */
  function languageHref(targetLocale: Locale) {
    const segments = pathname.split("/");

    if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
      segments[1] = targetLocale;
      return segments.join("/");
    }

    return `/${targetLocale}`;
  }

  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f8f7f2]/95 backdrop-blur">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4"
      >
        <Link href={`/${locale}`} className="font-serif text-2xl" aria-label="Asietex home">
          Asietex.
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm">
          <div className="hidden items-center gap-4 md:flex">
            {navItems.map((slug, index) => (
              <Link key={slug} href={`/${locale}/${slug}`} className="transition-colors hover:text-[#765b25]">
                {labels[index] ?? slug}
              </Link>
            ))}
          </div>

          <Link href="/login" className="underline underline-offset-4 hover:text-[#765b25]">
            Login
          </Link>

          <div aria-label="Change language" className="flex items-center gap-2 border-l border-black/15 pl-3">
            {locales.map((code) => (
              <Link
                key={code}
                href={languageHref(code)}
                aria-current={locale === code ? "page" : undefined}
                className={locale === code ? "font-bold text-[#765b25]" : "hover:text-[#765b25]"}
              >
                <Button>
                  {code.toUpperCase()}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
