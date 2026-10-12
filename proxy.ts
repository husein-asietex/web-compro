import { NextResponse, type NextRequest } from "next/server";
import { locales } from "@/lib/i18n";

const DEFAULT_LOCALE = "en";

// Path berikut tidak perlu ditambahkan prefix bahasa.
const BYPASS_PREFIXES = ["/dashboard", "/login", "/api", "/_next"];

function shouldBypass(pathname: string) {
  // Lewati path yang sama persis atau berada di bawah prefix pengecualian.
  return BYPASS_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function hasLocalePrefix(pathname: string) {
  // Cek apakah path sudah menggunakan bahasa yang tersedia.
  return locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const localePath = hasLocalePrefix(pathname);

  // Jangan ubah path yang dikecualikan.
  if (shouldBypass(pathname)) return;

  // Teruskan locale agar layout dapat mengatur bahasa halaman.
  if (localePath) {
    const headers = new Headers(request.headers);
    headers.set("x-locale", pathname.split("/")[1]);

    return NextResponse.next({ request: { headers } });
  }

  const url = request.nextUrl.clone();

  // Tambahkan bahasa default ke path yang belum memiliki bahasa.
  // "/" menjadi "/en", sedangkan "/about" menjadi "/en/about".
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;

  return NextResponse.redirect(url);
}

// Proxy hanya memproses URL tanpa titik.
// URL seperti file gambar, CSS, dan favicon akan dilewati.
export const config = { matcher: "/((?!.*\\..*).*)" };
