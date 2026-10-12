import Link from "next/link";
import { requireUser } from "@/backend/auth";
import { prisma } from "@/backend/prisma";
import {
  createStaffAction,
  toggleUserAction,
  updateUserRoleAction,
} from "@/features/admin/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
export const instant = false;
export default async function UsersPage() {
  const currentAdmin = await requireUser(true);
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <main className="min-h-dvh bg-background p-6 md:p-12">
      <Link href="/dashboard" className="text-sm underline">
        ← Dashboard
      </Link>
      <section className="mx-auto mt-14 max-w-4xl">
        <h1 className="font-serif text-5xl">People</h1>
        <div className="mt-8 grid gap-3">
          {users.map((user) => (
            <div
              className="grid gap-4 rounded-xl border border-border-subtle bg-card p-4 md:grid-cols-[1fr_auto] md:items-center"
              key={user.id}
            >
              <div>
                <p>{user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {user.email} · {user.role} ·{" "}
                  {user.active ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <form action={updateUserRoleAction} className="flex gap-2">
                  <input type="hidden" name="id" value={user.id} />
                  <label className="sr-only" htmlFor={`role-${user.id}`}>
                    Role for {user.name}
                  </label>
                  <select
                    id={`role-${user.id}`}
                    name="role"
                    defaultValue={user.role}
                    disabled={user.id === currentAdmin.id}
                    className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
                  >
                    <option value="STAFF">Staff</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={user.id === currentAdmin.id}
                  >
                    Update role
                  </Button>
                </form>
                <form action={toggleUserAction}>
                  <input type="hidden" name="id" value={user.id} />
                  <input
                    type="hidden"
                    name="active"
                    value={String(!user.active)}
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={user.id === currentAdmin.id}
                  >
                    {user.active ? "Deactivate" : "Activate"}
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
        <form
          action={createStaffAction}
          className="mt-10 rounded-2xl border border-border-subtle bg-card p-6"
        >
          <h2 className="font-serif text-3xl">Add user</h2>
          <FieldGroup className="mt-5">
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" name="name" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" name="email" type="email" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Temporary password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                minLength={12}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <select
                id="role"
                name="role"
                defaultValue="STAFF"
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
            </Field>
            <Button type="submit">Create account</Button>
          </FieldGroup>
        </form>
      </section>
    </main>
  );
}
