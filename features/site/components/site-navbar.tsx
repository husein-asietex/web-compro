"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { InternetIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { locales, type Locale } from "@/lib/i18n";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import Image from "next/image";

// Props yang dibutuhkan oleh navbar.
type SiteNavbarProps = {
  locale: Locale;
  labels: readonly string[];
  isAuthenticated?: boolean;
};

// Label aksesibilitas dan teks bantuan berdasarkan bahasa aktif.
const navUi = {
  en: {
    skip: "Skip to content",
    open: "Open navigation",
    close: "Close navigation",
    description: "Company profile navigation",
    language: "Language",
    primary: "Primary navigation",
    mobile: "Mobile navigation",
    home: "Home",
  },
  id: {
    skip: "Lewati ke konten",
    open: "Buka navigasi",
    close: "Tutup navigasi",
    description: "Navigasi profil perusahaan",
    language: "Bahasa",
    primary: "Navigasi utama",
    mobile: "Navigasi seluler",
    home: "Beranda",
  },
  pt: {
    skip: "Ir para o conteúdo",
    open: "Abrir navegação",
    close: "Fechar navegação",
    description: "Navegação do perfil da empresa",
    language: "Idioma",
    primary: "Navegação principal",
    mobile: "Navegação móvel",
    home: "Página inicial",
  },
} as const;

/** Shared public navigation for every localized marketing page. */
export function SiteNavbar({
  locale,
  labels,
  isAuthenticated = false,
}: SiteNavbarProps) {
  // State untuk membuka dan menutup menu mobile.
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const ui = navUi[locale];

  // Daftar halaman utama yang tampil di navigasi.
  const navItems = [
    ["home", ui.home],
    ["about", labels[0]],
    ["products", labels[1]],
    ["contact", labels[4]],
    ["career", labels[3]],
    ["marketing-contact", labels[2]],
  ] as const;

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
    <>
      {/* Skip navigation */}
      {/* Link aksesibilitas untuk langsung menuju konten utama. */}
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-50 -translate-y-24 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground transition-transform focus:translate-y-0"
      >
        {ui.skip}
      </a>
      {/* Header dan navigasi utama. */}
      {/* Public site header */}
      <header className="fixed inset-x-0 top-0 z-30 border-b border-border-subtle bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/90">
        <nav
          aria-label={ui.primary}
          className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4"
        >
          {/* Logo dan nama perusahaan. */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 font-serif text-lg"
            aria-label={ui.home}
          >
            <Image
              src="/LOGOASIETEX.webp"
              alt="Asietex"
              width={140}
              height={36}
              className="h-9 w-auto object-contain"
              priority
            />
            <span className="hidden xl:inline">
              PT Asietex Sinar Indopratama
            </span>
          </Link>

          {/* Desktop and mobile navigation controls */}
          <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm">
            {/* Navigasi desktop dan link CMS untuk user yang login. */}
            {/* Desktop navigation */}
            <div className="hidden items-center gap-4 lg:flex">
              {navItems.map(([slug, label]) => (
                <Link
                  key={slug}
                  href={slug === "home" ? `/${locale}` : `/${locale}/${slug}`}
                  className="transition-colors hover:text-text-accent"
                >
                  {label ?? slug}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  className="transition-colors hover:text-text-accent"
                >
                  CMS
                </Link>
              )}
            </div>

            {/* Pilihan bahasa pada tampilan desktop. */}
            {/* Language switcher */}
            <div
              aria-label={ui.language}
              className="hidden items-center gap-1 border-l border-border-subtle pl-3 sm:flex"
            >
              <HugeiconsIcon
                icon={InternetIcon}
                size={16}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              {locales.map((code) => (
                <Link
                  key={code}
                  href={languageHref(code)}
                  aria-current={locale === code ? "page" : undefined}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    locale === code &&
                      "bg-secondary font-bold text-text-accent justify-center rounded-md px-2 py-1 text-sm font-sans",
                  )}
                >
                  {code.toUpperCase()}
                </Link>
              ))}
            </div>

            {/* Tombol dan panel navigasi mobile. */}
            {/* Mobile navigation */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon-lg"
                    aria-label={ui.open}
                  />
                }
                className="lg:hidden"
              >
                <MenuIcon />
              </SheetTrigger>
              <SheetContent
                side="right"
                closeLabel={ui.close}
                className="w-[min(88vw,24rem)]"
              >
                <SheetHeader className="border-b border-border-subtle p-6">
                  <SheetTitle className="font-serif text-2xl">
                    Asietex
                  </SheetTitle>
                  <SheetDescription>{ui.description}</SheetDescription>
                </SheetHeader>
                {/* Link halaman utama pada menu mobile. */}
                <nav
                  aria-label={ui.mobile}
                  className="flex flex-1 flex-col px-6 py-5"
                >
                  {navItems.map(([slug, label]) => (
                    <Link
                      key={slug}
                      href={
                        slug === "home" ? `/${locale}` : `/${locale}/${slug}`
                      }
                      onClick={() => setMobileOpen(false)}
                      className="border-b border-border-subtle py-4 font-serif text-3xl focus-visible:outline-2 focus-visible:outline-offset-4"
                    >
                      {label ?? slug}
                    </Link>
                  ))}
                  {/* Link CMS hanya untuk user yang sudah login. */}
                  {isAuthenticated && (
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="border-b border-border-subtle py-4 font-serif text-3xl"
                    >
                      CMS
                    </Link>
                  )}
                  {/* Pilihan bahasa mobile saat fitur diaktifkan kembali. */}
                  <div className="mt-auto pt-8">
                    <p className="mb-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <HugeiconsIcon
                          icon={InternetIcon}
                          size={16}
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                        {ui.language}
                      </span>
                    </p>
                    <div className="flex gap-2" aria-label={ui.language}>
                      {locales.map((code) => (
                        <Link
                          key={code}
                          href={languageHref(code)}
                          onClick={() => setMobileOpen(false)}
                          aria-current={locale === code ? "page" : undefined}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "lg" }),
                            locale === code &&
                              "bg-secondary font-bold text-text-accent",
                          )}
                        >
                          {code.toUpperCase()}
                        </Link>
                      ))}
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
    </>
  );
}
