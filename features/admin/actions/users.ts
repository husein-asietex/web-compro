"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/backend/prisma";
import { passwordHash, requireUser } from "@/backend/auth";

// Catatan: file "use server" hanya boleh meng-export fungsi async,
// jadi helper & konstanta di bawah sengaja tidak di-export.

const MIN_PASSWORD_LENGTH = 12;

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function getText(formData: FormData, key: string) {
  return String(formData.get(key) || "");
}

function isStrongPassword(password: string) {
  return password.length >= MIN_PASSWORD_LENGTH;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export async function changeMyPasswordAction(formData: FormData) {
  const user = await requireUser();
  const password = getText(formData, "password");

  if (!isStrongPassword(password) || password.length > 200) {
    redirect("/dashboard/account?error=weak");
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: { passwordHash: passwordHash(password) },
    });
    await tx.revision.create({
      data: {
        userId: user.id,
        entity: "user",
        entityId: user.id,
        action: "password-changed",
      },
    });
  });

  redirect("/dashboard/account?saved=1");
}

export async function createStaffAction(formData: FormData) {
  const admin = await requireUser(true);

  const email = getText(formData, "email").trim().toLowerCase();
  const name = getText(formData, "name").trim();
  const password = getText(formData, "password");
  const role = getText(formData, "role");

  const parsed = z
    .object({
      name: z.string().trim().min(1).max(100),
      email: z.email(),
      password: z.string().min(MIN_PASSWORD_LENGTH).max(200),
      role: z.enum(["ADMIN", "STAFF"]),
    })
    .safeParse({ name, email, password, role });

  if (!parsed.success) {
    redirect("/dashboard/users?error=invalid");
  }

  const hash = passwordHash(parsed.data.password);
  await prisma.$transaction(async (tx) => {
    await tx.user.upsert({
      where: { email: parsed.data.email },
      create: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash: hash,
        role: parsed.data.role,
      },
      update: {
        name: parsed.data.name,
        passwordHash: hash,
        role: parsed.data.role,
        active: true,
      },
    });
    await tx.revision.create({
      data: {
        userId: admin.id,
        entity: "user",
        entityId: parsed.data.email,
        action: `${parsed.data.role.toLowerCase()}-created`,
      },
    });
  });

  redirect("/dashboard/users?saved=1");
}

export async function toggleUserAction(formData: FormData) {
  const admin = await requireUser(true);

  const parsedId = z.string().min(1).safeParse(getText(formData, "id"));
  if (!parsedId.success) redirect("/dashboard/users?error=invalid");
  const id = parsedId.data;
  const active = formData.get("active") === "true";

  // Admin tidak boleh menonaktifkan akunnya sendiri
  if (id === admin.id) redirect("/dashboard/users?error=self");

  await prisma.$transaction([
    prisma.user.update({ where: { id }, data: { active } }),
    prisma.session.deleteMany({ where: { userId: id } }),
    prisma.revision.create({
      data: {
        userId: admin.id,
        entity: "user",
        entityId: id,
        action: active ? "activated" : "deactivated",
      },
    }),
  ]);

  redirect("/dashboard/users");
}

export async function updateUserRoleAction(formData: FormData) {
  const admin = await requireUser(true);
  const parsed = z
    .object({
      id: z.string().min(1),
      role: z.enum(["ADMIN", "STAFF"]),
    })
    .safeParse({
      id: getText(formData, "id"),
      role: getText(formData, "role"),
    });

  if (!parsed.success) redirect("/dashboard/users?error=invalid");
  if (parsed.data.id === admin.id && parsed.data.role !== "ADMIN") {
    redirect("/dashboard/users?error=self-role");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: parsed.data.id },
      data: { role: parsed.data.role },
    }),
    prisma.revision.create({
      data: {
        userId: admin.id,
        entity: "user",
        entityId: parsed.data.id,
        action: `role-changed-to-${parsed.data.role.toLowerCase()}`,
      },
    }),
  ]);

  redirect("/dashboard/users?role-updated=1");
}
