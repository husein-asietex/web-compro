import Link from "next/link";
import { requireUser } from "@/backend/auth";
import { prisma } from "@/backend/prisma";
import {
  createProductsAction,
  publishCatalogAction,
  saveCatalogAction,
} from "@/features/cms/actions/content";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { DashboardBreadcrumb } from "@/features/admin/components/dashboard-breadcrumb";

export const instant = false;

const PAGE_SLUGS = ["home", "about", "products", "career", "contact"];
const CONTENT_COLLECTIONS = [
  ["about-company", "About company profile"],
  ["home-social-proof", "Home social proof"],
  ["career-openings", "Career openings"],
  ["marketing-contacts", "Marketing contacts"],
] as const;
const DEFAULT_CATALOG_URL = "https://e-catalog.asietex.web.id";

const CARD_LINK_CLASS =
  "rounded-xl border border-border-subtle bg-card p-4 hover:bg-secondary";

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
            href={`/dashboard/content/pages/${slug}`}
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

function ProductsList({
  products,
}: {
  products: { id: string; slug: string; order: number }[];
}) {
  if (products.length === 0) {
    return (
      <form action={createProductsAction}>
        <Button className="mt-4">Create nine products</Button>
      </form>
    );
  }

  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-2">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/dashboard/content/products/${product.slug}`}
          className={`capitalize ${CARD_LINK_CLASS}`}
        >
          {product.order}. {product.slug.replaceAll("-", " ")}
        </Link>
      ))}
    </div>
  );
}

function ContentCollectionsList({
  collections,
}: {
  collections: { key: string; status: string }[];
}) {
  return (
    <div className="mt-4 grid gap-2">
      {CONTENT_COLLECTIONS.map(([key, label]) => {
        const collection = collections.find((item) => item.key === key);
        return (
          <Link
            key={key}
            href={`/dashboard/content/collections/${key}`}
            className={`flex items-center justify-between ${CARD_LINK_CLASS}`}
          >
            <span>{label}</span>
            <StatusBadge status={collection?.status} />
          </Link>
        );
      })}
    </div>
  );
}

function CatalogSettingsForm({
  settings,
  canPublish,
}: {
  settings: {
    catalogUrl: string;
    catalogOn: boolean;
    catalogLabelEn: string;
    catalogLabelId: string;
    catalogLabelPt: string;
    catalogPlacements: string[];
    catalogOpenNewTab: boolean;
    draft: unknown;
  } | null;
  canPublish: boolean;
}) {
  const draft = settings?.draft as Partial<NonNullable<typeof settings>> | null;
  return (
    <div className="rounded-2xl border border-border-subtle bg-card p-6 h-fit">
      <h2 className="font-serif text-3xl">E-catalog CTA</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Save creates a draft; only ADMIN can publish it.
      </p>
      <form action={saveCatalogAction} className="mt-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="catalogUrl">Destination URL</FieldLabel>
            <Input
              id="catalogUrl"
              name="catalogUrl"
              type="url"
              defaultValue={
                draft?.catalogUrl ?? settings?.catalogUrl ?? DEFAULT_CATALOG_URL
              }
              required
            />
          </Field>

          {[
            [
              "catalogLabelEn",
              "Label (EN)",
              draft?.catalogLabelEn ??
                settings?.catalogLabelEn ??
                "Explore e-catalog",
            ],
            [
              "catalogLabelId",
              "Label (ID)",
              draft?.catalogLabelId ??
                settings?.catalogLabelId ??
                "Buka e-catalog",
            ],
            [
              "catalogLabelPt",
              "Label (PT)",
              draft?.catalogLabelPt ??
                settings?.catalogLabelPt ??
                "Ver e-catalog",
            ],
          ].map(([name, label, value]) => (
            <Field key={name}>
              <FieldLabel htmlFor={name}>{label}</FieldLabel>
              <Input id={name} name={name} defaultValue={value} required />
            </Field>
          ))}

          <fieldset>
            <legend className="mb-2 text-sm font-medium">Show CTA on</legend>
            <div className="grid gap-2 text-sm">
              {["home", "product", "footer"].map((placement) => (
                <label
                  key={placement}
                  className="flex items-center gap-2 capitalize"
                >
                  <input
                    type="checkbox"
                    name="catalogPlacements"
                    value={placement}
                    defaultChecked={
                      (
                        draft?.catalogPlacements ?? settings?.catalogPlacements
                      )?.includes(placement) ?? true
                    }
                  />
                  {placement}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex items-center gap-2 text-sm">
            <input
              name="catalogOn"
              type="checkbox"
              defaultChecked={draft?.catalogOn ?? settings?.catalogOn ?? true}
            />
            Enable CTA
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              name="catalogOpenNewTab"
              type="checkbox"
              defaultChecked={
                draft?.catalogOpenNewTab ?? settings?.catalogOpenNewTab ?? true
              }
            />
            Open CTA in a new tab
          </label>

          <Button type="submit">Save draft</Button>
        </FieldGroup>
      </form>
      {canPublish && settings?.draft != null && (
        <form action={publishCatalogAction} className="mt-3">
          <Button type="submit" variant="outline">
            Publish CTA settings
          </Button>
        </form>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Halaman
// ---------------------------------------------------------------------------

export default async function ContentIndex() {
  const user = await requireUser();

  const [pages, products, settings, collections] = await Promise.all([
    prisma.page.findMany({ orderBy: { slug: "asc" } }),
    prisma.product.findMany({ orderBy: { order: "asc" } }),
    prisma.siteSetting.findUnique({ where: { id: "site" } }),
    prisma.contentCollection.findMany({ orderBy: { key: "asc" } }),
  ]);

  return (
    <section className="">
      <DashboardBreadcrumb items={[{ label: "Content" }]} />
      <header className="flex items-center justify-between">
        <Link href="/dashboard" className="font-serif text-2xl">
          Asietex CMS
        </Link>
      </header>

      <h1 className="font-serif text-5xl">Content library</h1>
      <p className="mt-3 text-muted-foreground">
        Staff saves drafts; only an admin can publish them.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_.8fr]">
        <div>
          <h2 className="font-serif text-3xl">Pages</h2>
          <PagesList pages={pages} />

          <h2 className="mt-10 font-serif text-3xl">Products</h2>
          <ProductsList products={products} />

          <h2 className="mt-10 font-serif text-3xl">Content collections</h2>
          <ContentCollectionsList collections={collections} />
        </div>

        <CatalogSettingsForm
          settings={settings}
          canPublish={user.role === "ADMIN"}
        />
      </div>
    </section>
  );
}
