import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";

const pages = [
  "",
  "about",
  "products",
  "marketing-contact",
  "career",
  "contact",
];
const products = [
  "spinning",
  "twisting",
  "knitting",
  "weaving",
  "dyeing",
  "yarn-dyeing",
  "garment",
  "printing",
  "finishing",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const paths = [
    ...locales.flatMap((locale) =>
      pages.map((page) => `/${locale}${page ? `/${page}` : ""}`),
    ),
    ...locales.flatMap((locale) =>
      products.map((slug) => `/${locale}/products/${slug}`),
    ),
  ];

  return paths.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "weekly",
  }));
}
