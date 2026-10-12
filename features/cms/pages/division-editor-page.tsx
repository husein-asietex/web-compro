import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/backend/auth";
import { prisma } from "@/backend/prisma";
import { locales } from "@/lib/i18n";
import {
  publishDivisionAction,
  saveDivisionAction,
} from "@/features/cms/actions/content";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
export const instant = false;
type DivisionDraft = {
  capacity?: string;
  machinery?: string;
  products?: string[];
  gallery?: string[];
  videoEn?: string;
  videoId?: string;
  videoPt?: string;
  translations?: Record<string, { title?: string; body?: string }>;
};
export default async function DivisionEditor({
  params,
  searchParams,
}: PageProps<"/dashboard/content/divisions/[slug]">) {
  const user = await requireUser();
  const { slug } = await params;
  const query = await searchParams;
  const division = await prisma.division.findUnique({
    where: { slug },
    include: { translations: true },
  });
  if (!division) notFound();
  const draft = division.draft as DivisionDraft | null;
  const translation = (locale: string) =>
    draft?.translations?.[locale] ??
    division.translations.find((item) => item.locale === locale);
  return (
    <main className="min-h-dvh bg-background p-6 text-foreground md:p-12">
      <header className="mx-auto flex max-w-4xl items-center justify-between">
        <Link href="/dashboard/content" className="text-sm underline">
          ← Content library
        </Link>
        <Badge
          variant={division.status === "PUBLISHED" ? "default" : "outline"}
        >
          {division.status}
        </Badge>
      </header>
      <section className="mx-auto mt-14 max-w-4xl">
        <h1 className="font-serif text-5xl capitalize">
          {slug.replace("-", " ")}
        </h1>
        {query.error === "incomplete" && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-800"
          >
            Isi judul dan deskripsi untuk ketiga bahasa sebelum publish.
          </p>
        )}
        {query.error === "invalid-url" && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-800"
          >
            Semua URL harus valid dan menggunakan HTTPS.
          </p>
        )}
        <form action={saveDivisionAction} className="mt-10">
          <input type="hidden" name="slug" value={slug} />
          <FieldGroup>
            <fieldset className="rounded-2xl border border-border-subtle bg-card p-6">
              <legend className="px-2 font-medium">Production details</legend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="capacity">Capacity</FieldLabel>
                  <Input
                    id="capacity"
                    name="capacity"
                    defaultValue={draft?.capacity ?? division.capacity ?? ""}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="products">
                    Products (one per line)
                  </FieldLabel>
                  <Textarea
                    id="products"
                    name="products"
                    defaultValue={(draft?.products ?? division.products).join(
                      "\n",
                    )}
                    rows={4}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="machinery">Machinery</FieldLabel>
                  <Textarea
                    id="machinery"
                    name="machinery"
                    defaultValue={draft?.machinery ?? division.machinery ?? ""}
                    rows={3}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="gallery">
                    Gallery URLs (one per line)
                  </FieldLabel>
                  <Textarea
                    id="gallery"
                    name="gallery"
                    defaultValue={(draft?.gallery ?? division.gallery).join(
                      "\n",
                    )}
                    rows={3}
                  />
                </Field>
              </FieldGroup>
            </fieldset>
            <fieldset className="rounded-2xl border border-border-subtle bg-card p-6">
              <legend className="px-2 font-medium">YouTube URLs</legend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="videoEn">English</FieldLabel>
                  <Input
                    id="videoEn"
                    name="videoEn"
                    type="url"
                    defaultValue={draft?.videoEn ?? division.videoEn ?? ""}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="videoId">Indonesia</FieldLabel>
                  <Input
                    id="videoId"
                    name="videoId"
                    type="url"
                    defaultValue={draft?.videoId ?? division.videoId ?? ""}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="videoPt">Portuguese</FieldLabel>
                  <Input
                    id="videoPt"
                    name="videoPt"
                    type="url"
                    defaultValue={draft?.videoPt ?? division.videoPt ?? ""}
                  />
                </Field>
              </FieldGroup>
            </fieldset>
            {locales.map((locale) => (
              <fieldset
                className="rounded-2xl border border-border-subtle bg-card p-6"
                key={locale}
              >
                <legend className="px-2 text-sm font-medium uppercase">
                  {locale}
                </legend>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor={`${locale}_title`}>Title</FieldLabel>
                    <Input
                      id={`${locale}_title`}
                      name={`${locale}_title`}
                      defaultValue={translation(locale)?.title ?? ""}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor={`${locale}_body`}>
                      Description
                    </FieldLabel>
                    <Textarea
                      id={`${locale}_body`}
                      name={`${locale}_body`}
                      defaultValue={translation(locale)?.body ?? ""}
                      rows={4}
                    />
                  </Field>
                </FieldGroup>
              </fieldset>
            ))}
            <Button type="submit">Save draft</Button>
          </FieldGroup>
        </form>
        {user.role === "ADMIN" && (
          <form className="mt-3" action={publishDivisionAction}>
            <input type="hidden" name="slug" value={slug} />
            <Button type="submit" variant="outline">
              Publish division
            </Button>
          </form>
        )}
      </section>
    </main>
  );
}
