import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { changeMyPasswordAction } from "@/features/admin/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

export const instant = false;

const MIN_PASSWORD_LENGTH = 12;

export default async function Account() {
  const user = await requireUser();

  return (
    <main className="min-h-dvh bg-[#f8f7f2] p-6 md:p-12">
      <Link href="/dashboard" className="text-sm underline">
        ← Dashboard
      </Link>

      <section className="mx-auto mt-14 max-w-md">
        <h1 className="font-serif text-5xl">My account</h1>
        <p className="mt-3 text-[#5b5d54]">{user.email}</p>

        <form
          action={changeMyPasswordAction}
          className="mt-8 rounded-2xl border border-black/10 bg-white p-6"
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
    </main>
  );
}
