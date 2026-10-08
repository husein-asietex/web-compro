import { NextResponse, type NextRequest } from "next/server";
import { locales } from "@/lib/i18n";

const DEFAULT_LOCALE = "en";

// Path yang tidak memakai prefix bahasa
const BYPASS_PREFIXES = ["/admin", "/login", "/api", "/_next"];

function shouldBypass(pathname: string) {
  return BYPASS_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function hasLocalePrefix(pathname: string) {
  return locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldBypass(pathname) || hasLocalePrefix(pathname)) return;

  // "/" -> "/en", "/about" -> "/en/about"
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;

  return NextResponse.redirect(url);
}

// Lewati semua path yang mengandung titik (file statis: .png, .css, .ico, dst.)
export const config = { matcher: "/((?!.*\\..*).*)" };