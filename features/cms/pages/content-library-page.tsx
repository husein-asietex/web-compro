import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createDivisionsAction, saveCatalogAction } from "@/features/cms/actions/content";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

export const instant = false;

const PAGE_SLUGS = ["home", "about", "products", "network", "contact"];
const DEFAULT_CATALOG_URL = "https://e-catalog.asietex.web.id";

const CARD_LINK_CLASS =
  "rounded-xl border border-black/10 bg-white p-4 hover:bg-[#eeeadf]";

// ---------------------------------------------------------------------------
// Komponen kecil
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status?: string }) {
  return (
    <Badge variant={status === "PUBLISHED" ? "default" : "outline"}>
      {status ?? "NEW"}
    </Badge>
  );
}

function PagesList({ pages }: { pages: { slug: string; status: string }[] }) {
  return (
    <div className="mt-4 grid gap-2">
      {PAGE_SLUGS.map((slug) => {
        const page = pages.find((item) => item.slug === slug);

        return (
          <Link
            key={slug}
            href={`/admin/content/pages/${slug}`}
            className={`flex items-center justify-between ${CARD_LINK_CLASS}`}
          >
            <span className="capitalize">{slug}</span>
            <StatusBadge status={page?.status} />
          </Link>
        );
      })}
    </div>
  );
}

function DivisionsList({
  divisions,
}: {
  divisions: { id: string; slug: string; order: number }[];
}) {
  if (divisions.length === 0) {
    return (
      <form action={createDivisionsAction}>
        <Button className="mt-4">Create nine divisions</Button>
      </form>
    );
  }

  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-2">
      {divisions.map((division) => (
        <Link
          key={division.id}
          href={`/admin/content/divisions/${division.slug}`}
          className={`capitalize ${CARD_LINK_CLASS}`}
        >
          {division.order}. {division.slug.replaceAll("-", " ")}
        </Link>
      ))}
    </div>
  );
}

function CatalogSettingsForm({
  settings,
  canEdit,
}: {
  settings: { catalogUrl: string | null; catalogOn: boolean } | null;
  canEdit: boolean;
}) {
  return (
    <form
      action={saveCatalogAction}
      className="rounded-2xl border border-black/10 bg-white p-6 h-fit"
    >
      <h2 className="font-serif text-3xl">E-catalog CTA</h2>

      <FieldGroup className="mt-6">
        <Field>
          <FieldLabel htmlFor="catalogUrl">Destination URL</FieldLabel>
          <Input
            id="catalogUrl"
            name="catalogUrl"
            type="url"
            defaultValue={settings?.catalogUrl ?? DEFAULT_CATALOG_URL}
            required
          />
        </Field>

        <label className="flex items-center gap-2 text-sm">
          <input
            name="catalogOn"
            type="checkbox"
            defaultChecked={settings?.catalogOn ?? true}
          />
          Enable CTA
        </label>

        <Button type="submit" disabled={!canEdit}>
          Save setting
        </Button>
      </FieldGroup>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Halaman
// ---------------------------------------------------------------------------

export default async function ContentIndex() {
  const user = await requireUser();

  const [pages, divisions, settings] = await Promise.all([
    prisma.page.findMany({ orderBy: { slug: "asc" } }),
    prisma.division.findMany({ orderBy: { order: "asc" } }),
    prisma.siteSetting.findUnique({ where: { id: "site" } }),
  ]);

  return (
    <main className="min-h-dvh bg-[#f8f7f2] p-6 text-[#1f211d] md:p-12">
      <header className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/admin" className="font-serif text-2xl">
          Asietex CMS
        </Link>
        <Badge variant="outline">{user.role}</Badge>
      </header>

      <section className="mx-auto mt-14 max-w-6xl">
        <h1 className="font-serif text-5xl">Content library</h1>
        <p className="mt-3 text-[#5b5d54]">
          Staff saves drafts; only an admin can publish them.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_.8fr]">
          <div>
            <h2 className="font-serif text-3xl">Pages</h2>
            <PagesList pages={pages} />

            <h2 className="mt-10 font-serif text-3xl">Divisions</h2>
            <DivisionsList divisions={divisions} />
          </div>

          <CatalogSettingsForm
            settings={settings}
            canEdit={user.role === "ADMIN"}
          />
        </div>
      </section>
    </main>
  );
}
