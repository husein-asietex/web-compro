import { headers } from "next/headers";
import type { Metadata } from "next";
import "@/styles/globals.css";

export const instant = false;

export const metadata: Metadata = {
  icons: {
    icon: "/LOGOASIETEX.png",
    shortcut: "/LOGOASIETEX.png",
    apple: "/LOGOASIETEX.png",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-locale") ?? "en";

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
