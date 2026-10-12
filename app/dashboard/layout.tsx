import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Asietex Dashboard" },
  robots: { index: false, follow: false },
};

export { default } from "@/features/admin/layouts/admin-layout";
