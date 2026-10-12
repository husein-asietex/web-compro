"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { Prisma } from "@/generated/prisma/client";
import { requireUser } from "@/backend/auth";
import { locales } from "@/lib/i18n";
import { prisma } from "@/backend/prisma";

const PAGE_SLUGS = [
  "home",
  "about",
  "products",
  "network",
  "career",
  "contact",
] as const;
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
] as const;

const pageSlugSchema = z.enum(PAGE_SLUGS);
const divisionSlugSchema = z.enum(DIVISION_SLUGS);
const requiredText = z.string().trim().min(1).max(10_000);
const optionalUrl = z.union([z.literal(""), z.url().startsWith("https://")]);
const translationValueSchema = z.object({
  title: requiredText,
  body: requiredText,
});
const translationDraftSchema = z.object({
  en: translationValueSchema,
  id: translationValueSchema,
  pt: translationValueSchema,
});
const divisionDraftSchema = z.object({
  capacity: z.string().max(500),
  machinery: z.string().max(5_000),
  products: z.array(z.string().min(1).max(500)),
  gallery: z.array(z.url().startsWith("https://")),
  videoEn: optionalUrl,
  videoId: optionalUrl,
  videoPt: optionalUrl,
  translations: translationDraftSchema,
});
const networkDraftSchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: requiredText.max(120),
  country: requiredText.max(80),
  city: requiredText.max(80),
  address: z.string().trim().max(300),
  kind: requiredText.max(80),
  order: z.coerce.number().int().min(0).max(999),
});
const catalogDraftSchema = z.object({
  catalogUrl: z.url().startsWith("https://"),
  catalogLabelEn: requiredText.max(80),
  catalogLabelId: requiredText.max(80),
  catalogLabelPt: requiredText.max(80),
  catalogPlacements: z
    .array(
      z.enum([
        "home",
        "about",
        "products",
        "division",
        "network",
        "career",
        "contact",
        "footer",
      ]),
    )
    .min(1),
  catalogOpenNewTab: z.boolean(),
  catalogOn: z.boolean(),
});

function getText(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function getLines(formData: FormData, key: string) {
  return getText(formData, key)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function getTranslationFields(formData: FormData, locale: string) {
  return {
    title: getText(formData, `${locale}_title`),
    body: getText(formData, `${locale}_body`),
  };
}

function audit(
  tx: Prisma.TransactionClient,
  userId: string,
  entity: string,
  entityId: string,
  action: string,
) {
  return tx.revision.create({ data: { userId, entity, entityId, action } });
}

function revalidatePublicPage(slug: (typeof PAGE_SLUGS)[number]) {
  for (const locale of locales) {
    revalidatePath(slug === "home" ? `/${locale}` : `/${locale}/${slug}`);
  }
}

function hasCompleteTranslations(
  translations: { locale: string; title: string; body: string }[],
) {
  return locales.every((locale) => {
    const translation = translations.find((item) => item.locale === locale);
    return (
      translation &&
      requiredText.safeParse(translation.title).success &&
      requiredText.safeParse(translation.body).success
    );
  });
}

export async function savePageAction(formData: FormData) {
  const user = await requireUser();
  const parsedSlug = pageSlugSchema.safeParse(getText(formData, "slug"));
  if (!parsedSlug.success) redirect("/dashboard/content?error=invalid-page");

  const slug = parsedSlug.data;
  const draft = Object.fromEntries(
    locales.map((locale) => [locale, getTranslationFields(formData, locale)]),
  );
  await prisma.$transaction(async (tx) => {
    const page = await tx.page.upsert({
      where: { slug },
      create: { slug, status: "DRAFT", draft },
      update: { draft },
    });
    await audit(tx, user.id, "page", page.id, "saved-draft");
  });

  revalidatePublicPage(slug);
  redirect(`/dashboard/content/pages/${slug}?saved=1`);
}

export async function publishPageAction(formData: FormData) {
  const user = await requireUser(true);
  const parsedSlug = pageSlugSchema.safeParse(getText(formData, "slug"));
  if (!parsedSlug.success) redirect("/dashboard/content?error=invalid-page");

  const slug = parsedSlug.data;
  const page = await prisma.page.findUnique({
    where: { slug },
    include: { translations: true },
  });
  const draft = translationDraftSchema.safeParse(page?.draft);
  const existingIsComplete = page
    ? hasCompleteTranslations(page.translations)
    : false;

  if (!page || (!draft.success && !existingIsComplete)) {
    redirect(`/dashboard/content/pages/${slug}?error=incomplete`);
  }

  await prisma.$transaction(async (tx) => {
    if (draft.success) {
      for (const locale of locales) {
        const fields = draft.data[locale];
        await tx.translation.upsert({
          where: { pageId_locale: { pageId: page.id, locale } },
          create: { pageId: page.id, locale, ...fields },
          update: fields,
        });
      }
    }
    await tx.page.update({
      where: { id: page.id },
      data: { status: "PUBLISHED", draft: Prisma.DbNull },
    });
    await audit(tx, user.id, "page", page.id, "published");
  });

  revalidatePublicPage(slug);
  redirect(`/dashboard/content/pages/${slug}?published=1`);
}

export async function createDivisionsAction() {
  const user = await requireUser(true);

  await prisma.$transaction(async (tx) => {
    for (const [index, slug] of DIVISION_SLUGS.entries()) {
      await tx.division.upsert({
        where: { slug },
        create: { slug, order: index + 1 },
        update: { order: index + 1 },
      });
    }
    await audit(tx, user.id, "division", "collection", "seeded");
  });

  revalidatePath("/dashboard/content");
  redirect("/dashboard/content");
}

export async function saveDivisionAction(formData: FormData) {
  const user = await requireUser();
  const parsedSlug = divisionSlugSchema.safeParse(getText(formData, "slug"));
  if (!parsedSlug.success)
    redirect("/dashboard/content?error=invalid-division");

  const slug = parsedSlug.data;
  const parsedUrls = z
    .object({
      videoEn: optionalUrl,
      videoId: optionalUrl,
      videoPt: optionalUrl,
    })
    .safeParse({
      videoEn: getText(formData, "videoEn"),
      videoId: getText(formData, "videoId"),
      videoPt: getText(formData, "videoPt"),
    });
  const gallery = z
    .array(z.url().startsWith("https://"))
    .safeParse(getLines(formData, "gallery"));

  if (!parsedUrls.success || !gallery.success) {
    redirect(`/dashboard/content/divisions/${slug}?error=invalid-url`);
  }

  const draft = {
    capacity: getText(formData, "capacity"),
    machinery: getText(formData, "machinery"),
    products: getLines(formData, "products"),
    gallery: gallery.data,
    videoEn: parsedUrls.data.videoEn,
    videoId: parsedUrls.data.videoId,
    videoPt: parsedUrls.data.videoPt,
    translations: Object.fromEntries(
      locales.map((locale) => [locale, getTranslationFields(formData, locale)]),
    ),
  };

  await prisma.$transaction(async (tx) => {
    const division = await tx.division.update({
      where: { slug },
      data: { draft },
    });
    await audit(tx, user.id, "division", division.id, "saved-draft");
  });

  for (const locale of locales) revalidatePath(`/${locale}/products/${slug}`);
  redirect(`/dashboard/content/divisions/${slug}?saved=1`);
}

export async function publishDivisionAction(formData: FormData) {
  const user = await requireUser(true);
  const parsedSlug = divisionSlugSchema.safeParse(getText(formData, "slug"));
  if (!parsedSlug.success)
    redirect("/dashboard/content?error=invalid-division");

  const slug = parsedSlug.data;
  const division = await prisma.division.findUnique({
    where: { slug },
    include: { translations: true },
  });
  const draft = divisionDraftSchema.safeParse(division?.draft);
  const existingIsComplete = division
    ? hasCompleteTranslations(division.translations)
    : false;

  if (!division || (!draft.success && !existingIsComplete)) {
    redirect(`/dashboard/content/divisions/${slug}?error=incomplete`);
  }

  await prisma.$transaction(async (tx) => {
    if (draft.success) {
      for (const locale of locales) {
        const fields = draft.data.translations[locale];
        await tx.translation.upsert({
          where: { divisionId_locale: { divisionId: division.id, locale } },
          create: { divisionId: division.id, locale, ...fields },
          update: fields,
        });
      }
    }
    await tx.division.update({
      where: { id: division.id },
      data: draft.success
        ? {
            status: "PUBLISHED",
            draft: Prisma.DbNull,
            capacity: draft.data.capacity || null,
            machinery: draft.data.machinery || null,
            products: draft.data.products,
            gallery: draft.data.gallery,
            videoEn: draft.data.videoEn || null,
            videoId: draft.data.videoId || null,
            videoPt: draft.data.videoPt || null,
          }
        : { status: "PUBLISHED", draft: Prisma.DbNull },
    });
    await audit(tx, user.id, "division", division.id, "published");
  });

  for (const locale of locales) {
    revalidatePath(`/${locale}/products`);
    revalidatePath(`/${locale}/products/${slug}`);
  }
  redirect(`/dashboard/content/divisions/${slug}?published=1`);
}

export async function saveCatalogAction(formData: FormData) {
  const user = await requireUser();
  const parsed = catalogDraftSchema.safeParse({
    catalogUrl: getText(formData, "catalogUrl"),
    catalogLabelEn: getText(formData, "catalogLabelEn"),
    catalogLabelId: getText(formData, "catalogLabelId"),
    catalogLabelPt: getText(formData, "catalogLabelPt"),
    catalogPlacements: formData.getAll("catalogPlacements").map(String),
    catalogOpenNewTab: formData.get("catalogOpenNewTab") === "on",
    catalogOn: formData.get("catalogOn") === "on",
  });

  if (!parsed.success) redirect("/dashboard/content?error=invalid-settings");

  await prisma.$transaction(async (tx) => {
    await tx.siteSetting.upsert({
      where: { id: "site" },
      create: { id: "site", draft: parsed.data },
      update: { draft: parsed.data },
    });
    await audit(tx, user.id, "setting", "site", "saved-draft");
  });

  redirect("/dashboard/content?settings-draft=1");
}

export async function publishCatalogAction() {
  const user = await requireUser(true);
  const setting = await prisma.siteSetting.findUnique({
    where: { id: "site" },
  });
  const draft = catalogDraftSchema.safeParse(setting?.draft);
  if (!setting || !draft.success)
    redirect("/dashboard/content?error=invalid-settings");

  await prisma.$transaction(async (tx) => {
    await tx.siteSetting.update({
      where: { id: "site" },
      data: { ...draft.data, draft: Prisma.DbNull },
    });
    await audit(tx, user.id, "setting", "site", "published");
  });

  for (const locale of locales) revalidatePath(`/${locale}`, "layout");
  redirect("/dashboard/content?settings-published=1");
}

export async function saveNetworkLocationAction(formData: FormData) {
  const user = await requireUser();
  const parsed = networkDraftSchema
    .extend({ id: z.string().trim().optional() })
    .safeParse({
      id: getText(formData, "id") || undefined,
      slug: getText(formData, "slug"),
      name: getText(formData, "name"),
      country: getText(formData, "country"),
      city: getText(formData, "city"),
      address: getText(formData, "address"),
      kind: getText(formData, "kind"),
      order: getText(formData, "order"),
    });

  if (!parsed.success) redirect("/dashboard/content/network?error=invalid");
  const { id, address, ...data } = parsed.data;

  await prisma.$transaction(async (tx) => {
    const location = id
      ? await tx.networkLocation.update({
          where: { id },
          data: { draft: { ...data, address } },
        })
      : await tx.networkLocation.create({
          data: {
            ...data,
            address: address || null,
            draft: { ...data, address },
          },
        });
    await audit(tx, user.id, "network-location", location.id, "saved-draft");
  });

  for (const locale of locales) revalidatePath(`/${locale}/network`);
  redirect("/dashboard/content/network?saved=1");
}

export async function publishNetworkLocationAction(formData: FormData) {
  const user = await requireUser(true);
  const id = z.string().min(1).safeParse(getText(formData, "id"));
  if (!id.success) redirect("/dashboard/content/network?error=invalid");

  const location = await prisma.networkLocation.findUnique({
    where: { id: id.data },
  });
  if (!location) redirect("/dashboard/content/network?error=invalid");
  const draft = networkDraftSchema.safeParse(location.draft);

  await prisma.$transaction(async (tx) => {
    await tx.networkLocation.update({
      where: { id: id.data },
      data: draft.success
        ? {
            ...draft.data,
            address: draft.data.address || null,
            status: "PUBLISHED",
            draft: Prisma.DbNull,
          }
        : { status: "PUBLISHED", draft: Prisma.DbNull },
    });
    await audit(tx, user.id, "network-location", id.data, "published");
  });

  for (const locale of locales) revalidatePath(`/${locale}/network`);
  redirect("/dashboard/content/network?published=1");
}
