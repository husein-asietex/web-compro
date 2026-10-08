import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createStaffAction, toggleUserAction } from "@/features/admin/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
export const instant = false;
export default async function UsersPage() {
    await requireUser(true);
    const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
    return (
        <main className="min-h-dvh bg-[#f8f7f2] p-6 md:p-12">
            <Link href="/dashboard" className="text-sm underline">← Dashboard</Link>
            <section className="mx-auto mt-14 max-w-4xl">
                <h1 className="font-serif text-5xl">People</h1>
                <div className="mt-8 grid gap-3">
                    {users.map((user) => (
                        <div className="flex items-center justify-between rounded-xl border border-black/10 bg-white p-4" key={user.id}>
                            <div>
                                <p>{user.name}</p>
                                <p className="text-sm text-[#5b5d54]">
                                    {user.email} · {user.role} · {user.active ? "Active" : "Inactive"}
                                </p>
                            </div>
                            <form action={toggleUserAction}>
                                <input type="hidden" name="id" value={user.id} />
                                <input type="hidden" name="active" value={String(!user.active)} />
                                <Button type="submit" variant="outline">
                                    {user.active ? "Deactivate" : "Activate"}
                                </Button>
                            </form>
                        </div>
                    ))}
                </div>
                <form action={createStaffAction} className="mt-10 rounded-2xl border border-black/10 bg-white p-6">
                    <h2 className="font-serif text-3xl">Add staff</h2>
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
                            <Input id="password" name="password" type="password" minLength={12} required />
                        </Field>
                        <Button type="submit">Create staff account</Button>
                    </FieldGroup>
                </form>
            </section>
        </main>
    )
}
