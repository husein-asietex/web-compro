"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

function getText(formData: FormData, key: string) {
  return String(formData.get(key) || "");
}

export async function addMediaAction(formData: FormData) {
  const user = await requireUser();

  const asset = await prisma.mediaAsset.create({
    data: {
      url: getText(formData, "url"),
      altEn: getText(formData, "altEn"),
      altId: getText(formData, "altId"),
      altPt: getText(formData, "altPt"),
    },
  });

  await prisma.revision.create({
    data: {
      userId: user.id,
      entity: "media",
      entityId: asset.id,
      action: "created",
    },
  });

  redirect("/dashboard/media");
}
