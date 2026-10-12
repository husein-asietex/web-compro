"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/backend/prisma";
import { createSession, destroySession, passwordMatches } from "@/backend/auth";

export async function loginAction(formData: FormData) {
  const credentials = z
    .object({ email: z.email(), password: z.string().min(1).max(200) })
    .safeParse({
      email: String(formData.get("email") || "")
        .trim()
        .toLowerCase(),
      password: String(formData.get("password") || ""),
    });

  if (!credentials.success) redirect("/login?error=invalid");
  const { email, password } = credentials.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.active || !passwordMatches(password, user.passwordHash)) {
    redirect("/login?error=invalid");
  }
  await createSession(user.id);
  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
