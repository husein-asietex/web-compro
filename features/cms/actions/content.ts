"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { locales } from "@/lib/i18n";

// Catatan: file "use server" hanya boleh meng-export fungsi async,
// jadi semua helper & konstanta di bawah sengaja tidak di-export.

const DIVISION_SLUGS = [
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

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function getText(formData: FormData, key: string) {
  return String(formData.get(key) || "");
}

/** Textarea satu item per baris -> array string tanpa baris kosong. */
function getLines(formData: FormData, key: string) {
  return getText(formData, key)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** String kosong disimpan sebagai null di database. */
function getOptionalText(formData: FormData, key: string) {
  return getText(formData, key) || null;
}

function getTranslationFields(formData: FormData, locale: string) {
  return {
    title: getText(formData, `${locale}_title`),
    body: getText(formData, `${locale}_body`),
  };
}

function audit(userId: string, entity: string, entityId: string, action: string) {
  return prisma.revision.create({ data: { userId, entity, entityId, action } });
}

async function savePageTranslations(pageId: string, formData: FormData) {
  for (const locale of locales) {
    const fields = getTranslationFields(formData, locale);

    await prisma.translation.upsert({
      where: { pageId_locale: { pageId, locale } },
      create: { pageId, locale, ...fields },
      update: fields,
    });
  }
}

async function saveDivisionTranslations(divisionId: string, formData: FormData) {
  for (const locale of locales) {
    const fields = getTranslationFields(formData, locale);

    await prisma.translation.upsert({
      where: { divisionId_locale: { divisionId, locale } },
      create: { divisionId, locale, ...fields },
      update: fields,
    });
  }
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

export async function savePageAction(formData: FormData) {
  const user = await requireUser();
  const slug = getText(formData, "slug");

  const page = await prisma.page.upsert({
    where: { slug },
    create: { slug },
    update: {},
  });

  await savePageTranslations(page.id, formData);
  await audit(user.id, "page", page.id, "saved-draft");

  revalidatePath(`/${slug}`);
  redirect(`/dashboard/content/pages/${slug}?saved=1`);
}

export async function publishPageAction(formData: FormData) {
  const user = await requireUser(true);
  const slug = getText(formData, "slug");

  const page = await prisma.page.update({
    where: { slug },
    data: { status: "PUBLISHED" },
  });

  await audit(user.id, "page", page.id, "published");

  revalidatePath(`/${slug}`);
  redirect(`/dashboard/content/pages/${slug}?published=1`);
}

// ---------------------------------------------------------------------------
// Divisions
// ---------------------------------------------------------------------------

export async function createDivisionsAction() {
  const user = await requireUser(true);

  for (const [index, slug] of DIVISION_SLUGS.entries()) {
    await prisma.division.upsert({
      where: { slug },
      create: { slug, order: index + 1 },
      update: {},
    });
  }

  await audit(user.id, "division", "collection", "seeded");

  revalidatePath("/dashboard/content");
  redirect("/dashboard/content");
}

export async function saveDivisionAction(formData: FormData) {
  const user = await requireUser();
  const slug = getText(formData, "slug");

  const division = await prisma.division.update({
    where: { slug },
    data: {
      capacity: getText(formData, "capacity"),
      machinery: getText(formData, "machinery"),
      products: getLines(formData, "products"),
      gallery: getLines(formData, "gallery"),
      videoEn: getOptionalText(formData, "videoEn"),
      videoId: getOptionalText(formData, "videoId"),
      videoPt: getOptionalText(formData, "videoPt"),
    },
  });

  await saveDivisionTranslations(division.id, formData);
  await audit(user.id, "division", division.id, "saved-draft");

  redirect(`/dashboard/content/divisions/${slug}?saved=1`);
}

export async function publishDivisionAction(formData: FormData) {
  const user = await requireUser(true);
  const slug = getText(formData, "slug");

  const division = await prisma.division.update({
    where: { slug },
    data: { status: "PUBLISHED" },
  });

  await audit(user.id, "division", division.id, "published");

  for (const locale of locales) {
    revalidatePath(`/${locale}/products/${slug}`);
  }

  redirect(`/dashboard/content/divisions/${slug}?published=1`);
}

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------

export async function saveCatalogAction(formData: FormData) {
  const user = await requireUser(true);

  const settings = {
    catalogUrl: getText(formData, "catalogUrl"),
    catalogOn: formData.get("catalogOn") === "on",
  };

  await prisma.siteSetting.upsert({
    where: { id: "site" },
    create: { id: "site", ...settings },
    update: settings,
  });

  await audit(user.id, "setting", "site", "saved");

  redirect("/dashboard/content?settings=1");
}
