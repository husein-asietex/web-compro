import "server-only";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/backend/prisma";

const COOKIE = "asietex_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 hari (detik)
const KEY_LENGTH = 64;

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

/** Token sesi hanya disimpan dalam bentuk hash di database. */
const hash = (value: string) => createHash("sha256").update(value).digest("hex");

async function getSessionToken() {
  return (await cookies()).get(COOKIE)?.value;
}

// ---------------------------------------------------------------------------
// Password
// ---------------------------------------------------------------------------

/** Format hasil: `<salt>:<hash>` (keduanya hex). */
export function passwordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, KEY_LENGTH).toString("hex");

  return `${salt}:${derived}`;
}

export function passwordMatches(password: string, stored: string) {
  const [salt, expectedHex] = stored.split(":");
  if (!salt || !expectedHex) return false;

  const expected = Buffer.from(expectedHex, "hex");
  const actual = scryptSync(password, salt, KEY_LENGTH);

  // timingSafeEqual melempar error jika panjang buffer berbeda
  if (actual.length !== expected.length) return false;

  return timingSafeEqual(actual, expected);
}

// ---------------------------------------------------------------------------
// User & session
// ---------------------------------------------------------------------------

export async function currentUser() {
  const token = await getSessionToken();
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hash(token) },
    include: { user: true },
  });

  const isValid =
    session && session.user.active && session.expiresAt >= new Date();

  return isValid ? session.user : null;
}

export async function requireUser(admin = false) {
  const user = await currentUser();

  if (!user) redirect("/login");
  if (admin && user.role !== "ADMIN") redirect("/admin");

  return user;
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");

  await prisma.session.create({
    data: {
      userId,
      tokenHash: hash(token),
      expiresAt: new Date(Date.now() + MAX_AGE * 1000),
    },
  });

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;

  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hash(token) } });
  }

  jar.delete({ name: COOKIE, path: "/" });
}