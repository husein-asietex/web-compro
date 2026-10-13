import Link from "next/link";
import { requireUser } from "@/backend/auth";
import { changeMyPasswordAction } from "@/features/admin/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { DashboardBreadcrumb } from "@/features/admin/components/dashboard-breadcrumb";

export const instant = false;

const MIN_PASSWORD_LENGTH = 12;

export default async function Account() {
  const user = await requireUser();

  return (
    <section className="mx-auto max-w-md">
      <DashboardBreadcrumb items={[{ label: "My account" }]} />
      <h1 className="font-serif text-5xl">My account</h1>
      <p className="mt-3 text-muted-foreground">{user.email}</p>

      <form
        action={changeMyPasswordAction}
        className="mt-8 rounded-2xl border border-border-subtle bg-card p-6"
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="password">New password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              minLength={MIN_PASSWORD_LENGTH}
              required
            />
          </Field>

          <Button type="submit">Update password</Button>
        </FieldGroup>
      </form>
    </section>
  );
}
