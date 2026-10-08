import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { locales } from "@/lib/i18n";
import { publishPageAction, savePageAction } from "@/features/cms/actions/content";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const instant = false;

const ALLOWED_SLUGS = ["home", "about", "products", "network", "contact"];

type LocaleFieldsetProps = {
  locale: string;
  title: string;
  body: string;
};

function LocaleFieldset({ locale, title, body }: LocaleFieldsetProps) {
  const titleId = `${locale}_title`;
  const bodyId = `${locale}_body`;

  return (
    <fieldset className="rounded-2xl border border-black/10 bg-white p-6">
      <legend className="px-2 text-sm font-medium uppercase">{locale}</legend>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={titleId}>Title</FieldLabel>
          <Input id={titleId} name={titleId} defaultValue={title} />
        </Field>

        <Field>
          <FieldLabel htmlFor={bodyId}>Body</FieldLabel>
          <Textarea id={bodyId} name={bodyId} defaultValue={body} rows={6} />
        </Field>
      </FieldGroup>
    </fieldset>
  );
}

export default async function PageEditor({
  params,
}: PageProps<"/admin/content/pages/[slug]">) {
  const user = await requireUser();
  const { slug } = await params;
  if (!ALLOWED_SLUGS.includes(slug)) notFound();

  const page = await prisma.page.findUnique({
    where: { slug },
    include: { translations: true },
  });

  const findTranslation = (locale: string) =>
    page?.translations.find((item) => item.locale === locale);

  const isPublished = page?.status === "PUBLISHED";
  const canPublish = user.role === "ADMIN";

  return (
    <main className="min-h-dvh bg-[#f8f7f2] p-6 text-[#1f211d] md:p-12">
      <header className="mx-auto flex max-w-4xl items-center justify-between">
        <Link href="/admin/content" className="text-sm underline">
          ← Content library
        </Link>

        <Badge variant={isPublished ? "default" : "outline"}>
          {page?.status ?? "NEW"}
        </Badge>
      </header>

      <section className="mx-auto mt-14 max-w-4xl">
        <h1 className="font-serif text-5xl capitalize">Edit {slug}</h1>
        <p className="mt-3 text-[#5b5d54]">
          Content is saved separately in all three published languages.
        </p>

        <form action={savePageAction} className="mt-10">
          <input type="hidden" name="slug" value={slug} />

          <FieldGroup>
            {locales.map((locale) => {
              const translation = findTranslation(locale);

              return (
                <LocaleFieldset
                  key={locale}
                  locale={locale}
                  title={translation?.title ?? ""}
                  body={translation?.body ?? ""}
                />
              );
            })}

            <div className="flex flex-wrap gap-3">
              <Button type="submit">Save draft</Button>
            </div>
          </FieldGroup>
        </form>

        {canPublish && (
          <form action={publishPageAction} className="mt-3">
            <input type="hidden" name="slug" value={slug} />
            <Button variant="outline" type="submit">
              Publish this page
            </Button>
          </form>
        )}
      </section>
    </main>
  );
}
