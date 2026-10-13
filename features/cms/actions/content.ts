"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { Prisma } from "@/generated/prisma/client";
import { requireUser } from "@/backend/auth";
import { locales } from "@/lib/i18n";
import { prisma } from "@/backend/prisma";

const PAGE_SLUGS = ["home", "about", "products", "career", "contact"] as const;
const PRODUCT_SLUGS = [
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
const CONTENT_COLLECTIONS = [
  "about-company",
  "home-social-proof",
  "career-openings",
  "marketing-contacts",
] as const;

const pageSlugSchema = z.enum(PAGE_SLUGS);
const productSlugSchema = z.enum(PRODUCT_SLUGS);
const contentCollectionSchema = z.enum(CONTENT_COLLECTIONS);
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
const productDraftSchema = z.object({
  capacity: z.string().max(500),
  machinery: z.string().max(5_000),
  products: z.array(z.string().min(1).max(500)),
  gallery: z.array(z.url().startsWith("https://")),
  videoEn: optionalUrl,
  videoId: optionalUrl,
  videoPt: optionalUrl,
  translations: translationDraftSchema,
});
const catalogDraftSchema = z.object({
  catalogUrl: z.url().startsWith("https://"),
  catalogLabelEn: requiredText.max(80),
  catalogLabelId: requiredText.max(80),
  catalogLabelPt: requiredText.max(80),
  catalogPlacements: z.array(z.enum(["home", "product", "footer"])).min(1),
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

function getJson(formData: FormData, key: string) {
  try {
    const value: unknown = JSON.parse(getText(formData, key));
    return value && typeof value === "object"
      ? (value as Prisma.InputJsonValue)
      : null;
  } catch {
    return null;
  }
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

function revalidateContentCollection(
  key: (typeof CONTENT_COLLECTIONS)[number],
) {
  for (const locale of locales) {
    const path =
      key === "home-social-proof"
        ? `/${locale}`
        : key === "about-company"
          ? `/${locale}/about`
          : `/${locale}/${key === "career-openings" ? "career" : "marketing-contact"}`;
    revalidatePath(path);
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

export async function createProductsAction() {
  const user = await requireUser(true);

  await prisma.$transaction(async (tx) => {
    for (const [index, slug] of PRODUCT_SLUGS.entries()) {
      await tx.product.upsert({
        where: { slug },
        create: { slug, order: index + 1, products: [], gallery: [] },
        update: { order: index + 1 },
      });
    }
    await audit(tx, user.id, "product", "collection", "seeded");
  });

  revalidatePath("/dashboard/content");
  redirect("/dashboard/content");
}

export async function saveProductAction(formData: FormData) {
  const user = await requireUser();
  const parsedSlug = productSlugSchema.safeParse(getText(formData, "slug"));
  if (!parsedSlug.success) redirect("/dashboard/content?error=invalid-product");

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
    redirect(`/dashboard/content/products/${slug}?error=invalid-url`);
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
    const product = await tx.product.update({
      where: { slug },
      data: { draft },
    });
    await audit(tx, user.id, "product", product.id, "saved-draft");
  });

  for (const locale of locales) revalidatePath(`/${locale}/products/${slug}`);
  redirect(`/dashboard/content/products/${slug}?saved=1`);
}

export async function publishProductAction(formData: FormData) {
  const user = await requireUser(true);
  const parsedSlug = productSlugSchema.safeParse(getText(formData, "slug"));
  if (!parsedSlug.success) redirect("/dashboard/content?error=invalid-product");

  const slug = parsedSlug.data;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { translations: true },
  });
  const draft = productDraftSchema.safeParse(product?.draft);
  const existingIsComplete = product
    ? hasCompleteTranslations(product.translations)
    : false;

  if (!product || (!draft.success && !existingIsComplete)) {
    redirect(`/dashboard/content/products/${slug}?error=incomplete`);
  }

  await prisma.$transaction(async (tx) => {
    if (draft.success) {
      for (const locale of locales) {
        const fields = draft.data.translations[locale];
        await tx.translation.upsert({
          where: { productId_locale: { productId: product.id, locale } },
          create: { productId: product.id, locale, ...fields },
          update: fields,
        });
      }
    }
    await tx.product.update({
      where: { id: product.id },
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
    await audit(tx, user.id, "product", product.id, "published");
  });

  for (const locale of locales) {
    revalidatePath(`/${locale}/products`);
    revalidatePath(`/${locale}/products/${slug}`);
  }
  redirect(`/dashboard/content/products/${slug}?published=1`);
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
      create: {
        id: "site",
        catalogPlacements: ["home", "product", "footer"],
        draft: parsed.data,
      },
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

export async function saveContentCollectionAction(formData: FormData) {
  const user = await requireUser();
  const key = contentCollectionSchema.safeParse(getText(formData, "key"));
  const draft = getJson(formData, "data");

  if (!key.success || !draft) {
    redirect("/dashboard/content?error=invalid-collection");
  }

  await prisma.$transaction(async (tx) => {
    const collection = await tx.contentCollection.upsert({
      where: { key: key.data },
      create: { key: key.data, data: draft, draft, status: "DRAFT" },
      update: { draft },
    });
    await audit(
      tx,
      user.id,
      "content-collection",
      collection.key,
      "saved-draft",
    );
  });

  redirect(`/dashboard/content/collections/${key.data}?saved=1`);
}

export async function publishContentCollectionAction(formData: FormData) {
  const user = await requireUser(true);
  const key = contentCollectionSchema.safeParse(getText(formData, "key"));
  if (!key.success) redirect("/dashboard/content?error=invalid-collection");

  const collection = await prisma.contentCollection.findUnique({
    where: { key: key.data },
  });
  if (!collection?.draft) {
    redirect(`/dashboard/content/collections/${key.data}?error=incomplete`);
  }

  await prisma.$transaction(async (tx) => {
    await tx.contentCollection.update({
      where: { key: key.data },
      data: {
        data: collection.draft!,
        draft: Prisma.DbNull,
        status: "PUBLISHED",
      },
    });
    await audit(tx, user.id, "content-collection", key.data, "published");
  });

  revalidateContentCollection(key.data);
  redirect(`/dashboard/content/collections/${key.data}?published=1`);
}
