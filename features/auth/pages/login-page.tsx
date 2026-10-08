import Link from "next/link";
import { loginAction } from "@/features/auth/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
export const instant = false;
export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { error } = await searchParams;
  return (
    <main className="grid min-h-dvh place-items-center bg-[#eeeadf] p-5">
      <Card className="w-full max-w-md border-black/10 bg-[#f8f7f2]">
        
        <CardHeader>
          <Link href="/" className="font-serif text-2xl">Asietex.</Link>
          <CardTitle className="font-serif text-3xl">CMS login</CardTitle>
          <CardDescription>Sign in with an account created by the secure database seeder.</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form action={loginAction}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Business email</FieldLabel>
                <Input id="email" name="email" type="email" autoComplete="email" required />
              </Field><Field><FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" name="password" type="password" autoComplete="current-password" required />
              </Field>{error && <p role="alert" className="text-sm text-destructive">Check your email and password.</p>}
              <Button type="submit" className="mt-2 w-full">Sign in</Button>
            </FieldGroup>
          </form>
        </CardContent>

      </Card>
    </main>

  )
}
