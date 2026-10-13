import { headers } from "next/headers";
import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";
import "@/styles/globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source-serif",
});

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
    <html
      lang={locale}
      className={`${sourceSerif.variable} h-full antialiased lining-nums`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
