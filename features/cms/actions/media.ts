"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/backend/prisma";
import { requireUser } from "@/backend/auth";

function getText(formData: FormData, key: string) {
  return String(formData.get(key) || "");
}

export async function addMediaAction(formData: FormData) {
  const user = await requireUser();

  const parsed = z
    .object({
      url: z.url().startsWith("https://"),
      altEn: z.string().trim().min(1).max(200),
      altId: z.string().trim().min(1).max(200),
      altPt: z.string().trim().min(1).max(200),
      credit: z.string().trim().max(200),
      pageId: z.string().trim(),
      productId: z.string().trim(),
    })
    .refine((data) => !(data.pageId && data.productId))
    .safeParse({
      url: getText(formData, "url"),
      altEn: getText(formData, "altEn"),
      altId: getText(formData, "altId"),
      altPt: getText(formData, "altPt"),
      credit: getText(formData, "credit"),
      pageId: getText(formData, "pageId"),
      productId: getText(formData, "productId"),
    });

  if (!parsed.success) redirect("/dashboard/media?error=invalid");

  await prisma.$transaction(async (tx) => {
    const asset = await tx.mediaAsset.create({
      data: {
        ...parsed.data,
        credit: parsed.data.credit || null,
        pageId: parsed.data.pageId || null,
        productId: parsed.data.productId || null,
        approved: user.role === "ADMIN",
      },
    });

    await tx.revision.create({
      data: {
        userId: user.id,
        entity: "media",
        entityId: asset.id,
        action: user.role === "ADMIN" ? "created-approved" : "created-draft",
      },
    });
  });

  redirect("/dashboard/media");
}

export async function approveMediaAction(formData: FormData) {
  const user = await requireUser(true);
  const id = z.string().min(1).safeParse(getText(formData, "id"));
  if (!id.success) redirect("/dashboard/media?error=invalid");

  await prisma.$transaction([
    prisma.mediaAsset.update({
      where: { id: id.data },
      data: { approved: true },
    }),
    prisma.revision.create({
      data: {
        userId: user.id,
        entity: "media",
        entityId: id.data,
        action: "approved",
      },
    }),
  ]);

  redirect("/dashboard/media?approved=1");
}
