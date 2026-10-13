import Link from "next/link";
import { requireUser } from "@/backend/auth";
import { logoutAction } from "@/features/auth/actions/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
export const instant = false;
export default async function AdminPage() {
  const user = await requireUser();
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border-subtle px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link className="font-serif text-2xl" href="/en">
            Asietex.
          </Link>
          <form action={logoutAction}>
            <Button type="submit" variant="outline">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-6 py-14">
        <Badge variant="outline">
          {user.role === "ADMIN" ? "Publishing approver" : "Content staff"}
        </Badge>
        <h1 className="mt-4 font-serif text-5xl">Good day, {user.name}.</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Manage published content, roles and media from this workspace.
        </p>
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          <Link
            href="/dashboard/content"
            className="rounded-2xl border border-border-subtle bg-card p-6 hover:bg-secondary"
          >
            <p className="font-serif text-2xl">Content</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Pages, translations and products
            </p>
          </Link>
          <Link
            href="/dashboard/users"
            className="rounded-2xl border border-border-subtle bg-card p-6 hover:bg-secondary"
          >
            <p className="font-serif text-2xl">People</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Staff access and roles
            </p>
          </Link>
          <Link
            href="/dashboard/account"
            className="rounded-2xl border border-border-subtle bg-card p-6 hover:bg-secondary"
          >
            <p className="font-serif text-2xl">My account</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Password and profile
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
