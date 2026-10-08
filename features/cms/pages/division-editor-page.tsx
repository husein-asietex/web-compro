import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { locales } from "@/lib/i18n";
import { publishDivisionAction, saveDivisionAction } from "@/features/cms/actions/content";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
export const instant = false;
export default async function DivisionEditor({ params }: PageProps<"/dashboard/content/divisions/[slug]">) {
    const user = await requireUser(); const { slug } = await params;
    const division = await prisma.division.findUnique({
        where: { slug },
        include: { translations: true }
    });
    if (!division) notFound();
    const translation = (locale: string) => division.translations.find((item) => item.locale === locale);
    return <main className="min-h-dvh bg-[#f8f7f2] p-6 text-[#1f211d] md:p-12">
        <header className="mx-auto flex max-w-4xl items-center justify-between">
            <Link href="/dashboard/content" className="text-sm underline">← Content library</Link>
            <Badge variant={division.status === "PUBLISHED" ? "default" : "outline"}>{division.status}</Badge>
        </header><section className="mx-auto mt-14 max-w-4xl">
            <h1 className="font-serif text-5xl capitalize">{slug.replace("-", " ")}</h1>
            <form action={saveDivisionAction} className="mt-10"><input type="hidden" name="slug" value={slug} />
                <FieldGroup><fieldset className="rounded-2xl border border-black/10 bg-white p-6">
                    <legend className="px-2 font-medium">Production details</legend>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="capacity">Capacity</FieldLabel>
                            <Input id="capacity" name="capacity" defaultValue={division.capacity ?? ""} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="products">Products (one per line)</FieldLabel>
                            <Textarea id="products" name="products" defaultValue={division.products.join("\n")} rows={4} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="machinery">Machinery</FieldLabel>
                            <Textarea id="machinery" name="machinery" defaultValue={division.machinery ?? ""} rows={3} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="gallery">Gallery URLs (one per line)</FieldLabel>
                            <Textarea id="gallery" name="gallery" defaultValue={division.gallery.join("\n")} rows={3} />
                        </Field>
                    </FieldGroup>
                </fieldset>
                    <fieldset className="rounded-2xl border border-black/10 bg-white p-6">
                        <legend className="px-2 font-medium">YouTube URLs</legend>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="videoEn">English</FieldLabel>
                                <Input id="videoEn" name="videoEn" type="url" defaultValue={division.videoEn ?? ""} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="videoId">Indonesia</FieldLabel>
                                <Input id="videoId" name="videoId" type="url" defaultValue={division.videoId ?? ""} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="videoPt">Portuguese</FieldLabel>
                                <Input id="videoPt" name="videoPt" type="url" defaultValue={division.videoPt ?? ""} />
                            </Field>
                        </FieldGroup>
                    </fieldset>{locales.map((locale) => <fieldset className="rounded-2xl border border-black/10 bg-white p-6" key={locale}>
                        <legend className="px-2 text-sm font-medium uppercase">{locale}</legend>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor={`${locale}_title`}>Title</FieldLabel>
                                <Input id={`${locale}_title`} name={`${locale}_title`} defaultValue={translation(locale)?.title ?? ""} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor={`${locale}_body`}>Description</FieldLabel>
                                <Textarea id={`${locale}_body`} name={`${locale}_body`} defaultValue={translation(locale)?.body ?? ""} rows={4} />
                            </Field>
                        </FieldGroup>
                    </fieldset>)}
                    <Button type="submit">Save draft</Button>
                </FieldGroup>
            </form>
            {
                user.role === "ADMIN" && <form className="mt-3" action={publishDivisionAction}>
                    <input type="hidden" name="slug" value={slug} />
                    <Button type="submit" variant="outline">Publish division</Button>
                </form>
            }
        </section>
    </main>
}
