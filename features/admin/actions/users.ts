"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { passwordHash, requireUser } from "@/lib/auth";

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

function audit(userId: string, entity: string, entityId: string, action: string) {
  return prisma.revision.create({ data: { userId, entity, entityId, action } });
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export async function changeMyPasswordAction(formData: FormData) {
  const user = await requireUser();
  const password = getText(formData, "password");

  if (!isStrongPassword(password)) redirect("/dashboard/account?error=weak");

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: passwordHash(password) },
  });

  await audit(user.id, "user", user.id, "password-changed");

  redirect("/dashboard/account?saved=1");
}

export async function createStaffAction(formData: FormData) {
  const admin = await requireUser(true);

  const email = getText(formData, "email").trim().toLowerCase();
  const name = getText(formData, "name").trim();
  const password = getText(formData, "password");

  if (!name || !email || !isStrongPassword(password)) {
    redirect("/dashboard/users?error=invalid");
  }

  const hash = passwordHash(password);

  await prisma.user.upsert({
    where: { email },
    create: { name, email, passwordHash: hash, role: "STAFF" },
    update: { name, passwordHash: hash, role: "STAFF", active: true },
  });

  await audit(admin.id, "user", email, "staff-created");

  redirect("/dashboard/users?saved=1");
}

export async function toggleUserAction(formData: FormData) {
  const admin = await requireUser(true);

  const id = getText(formData, "id");
  const active = formData.get("active") === "true";

  // Admin tidak boleh menonaktifkan akunnya sendiri
  if (id === admin.id) redirect("/dashboard/users?error=self");

  await prisma.user.update({ where: { id }, data: { active } });

  // Hapus semua sesi supaya perubahan status langsung berlaku
  await prisma.session.deleteMany({ where: { userId: id } });

  redirect("/dashboard/users");
}
