import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { addMediaAction } from "@/features/cms/actions/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
export const instant = false;
export default async function MediaPage() {
    await requireUser();
    const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
    return (
        <main className="min-h-dvh bg-[#f8f7f2] p-6 md:p-12">
            <Link href="/dashboard" className="text-sm underline">← Dashboard</Link>
            <section className="mx-auto mt-14 max-w-5xl">
                <h1 className="font-serif text-5xl">Media library</h1>
                <form action={addMediaAction} className="mt-8 rounded-2xl border border-black/10 bg-white p-6">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="url">Image URL</FieldLabel>
                            <Input id="url" name="url" type="url" required />
                        </Field>
                        {[["altEn", "Alt text (EN)"], ["altId", "Alt text (ID)"], ["altPt", "Alt text (PT)"]].map(([name, label]) => (
                            <Field key={name}>
                                <FieldLabel htmlFor={name}>{label}</FieldLabel>
                                <Input id={name} name={name} required />
                            </Field>
                        ))}
                        <Button type="submit">Add media</Button>
                    </FieldGroup>
                </form>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {assets.map((asset) => (
                        <figure key={asset.id} className="overflow-hidden rounded-2xl border border-black/10 bg-white">
                            <img src={asset.url} alt={asset.altEn} className="aspect-video w-full object-cover" />
                            <figcaption className="p-4 text-sm">{asset.altEn}</figcaption>
                        </figure>
                    ))}
                </div>
            </section>
        </main>
    )
}
