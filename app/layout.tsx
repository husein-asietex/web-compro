import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";
import "@/styles/globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source-serif",
});

export const metadata: Metadata = {
  icons: {
    icon: "/LOGOASIETEX.webp",
    shortcut: "/LOGOASIETEX.webp",
    apple: "/LOGOASIETEX.webp",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} h-full antialiased lining-nums`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
