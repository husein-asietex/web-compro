import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/backend/auth";
import { prisma } from "@/backend/prisma";
import { locales } from "@/lib/i18n";
import { asStringArray } from "@/lib/json";
import {
  publishProductAction,
  saveProductAction,
} from "@/features/cms/actions/content";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DashboardBreadcrumb } from "@/features/admin/components/dashboard-breadcrumb";
export const instant = false;
type ProductDraft = {
  capacity?: string;
  machinery?: string;
  products?: string[];
  gallery?: string[];
  videoEn?: string;
  videoId?: string;
  videoPt?: string;
  translations?: Record<string, { title?: string; body?: string }>;
};
export default async function ProductEditor({
  params,
  searchParams,
}: PageProps<"/dashboard/content/products/[slug]">) {
  const user = await requireUser();
  const { slug } = await params;
  const query = await searchParams;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { translations: true },
  });
  if (!product) notFound();
  const draft = product.draft as ProductDraft | null;
  const translation = (locale: string) =>
    draft?.translations?.[locale] ??
    product.translations.find((item) => item.locale === locale);
  return (
    <main className="min-h-dvh bg-background p-6 text-foreground md:p-12">
      <header className="mx-auto flex max-w-4xl items-center justify-between">
        <Badge variant={product.status === "PUBLISHED" ? "default" : "outline"}>
          {product.status}
        </Badge>
      </header>
      <section className="mx-auto mt-14 max-w-4xl">
        <DashboardBreadcrumb
          items={[
            { label: "Content", href: "/dashboard/content" },
            { label: "Products", href: "/dashboard/content" },
            { label: slug.replaceAll("-", " ") },
          ]}
        />
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
        <form action={saveProductAction} className="mt-10">
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
                    defaultValue={draft?.capacity ?? product.capacity ?? ""}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="products">
                    Products (one per line)
                  </FieldLabel>
                  <Textarea
                    id="products"
                    name="products"
                    defaultValue={(
                      draft?.products ?? asStringArray(product.products)
                    ).join("\n")}
                    rows={4}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="machinery">Machinery</FieldLabel>
                  <Textarea
                    id="machinery"
                    name="machinery"
                    defaultValue={draft?.machinery ?? product.machinery ?? ""}
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
                    defaultValue={(
                      draft?.gallery ?? asStringArray(product.gallery)
                    ).join("\n")}
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
                    defaultValue={draft?.videoEn ?? product.videoEn ?? ""}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="videoId">Indonesia</FieldLabel>
                  <Input
                    id="videoId"
                    name="videoId"
                    type="url"
                    defaultValue={draft?.videoId ?? product.videoId ?? ""}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="videoPt">Portuguese</FieldLabel>
                  <Input
                    id="videoPt"
                    name="videoPt"
                    type="url"
                    defaultValue={draft?.videoPt ?? product.videoPt ?? ""}
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
          <form className="mt-3" action={publishProductAction}>
            <input type="hidden" name="slug" value={slug} />
            <Button type="submit" variant="outline">
              Publish product
            </Button>
          </form>
        )}
      </section>
    </main>
  );
}
