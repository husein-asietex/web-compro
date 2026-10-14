import Image from "next/image";
import Link from "next/link";

import {
  addMediaAction,
  approveMediaAction,
} from "@/features/cms/actions/media";
import { requireUser } from "@/backend/auth";
import { prisma } from "@/backend/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DashboardBreadcrumb } from "@/features/admin/components/dashboard-breadcrumb";

const DUMMY_IMAGE = "https://placehold.co/1200x800/png?text=Asietex+media";

export const instant = false;

export default async function MediaPage() {
  const user = await requireUser();
  const [assets, pages, products] = await Promise.all([
    prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.page.findMany({ orderBy: { slug: "asc" } }),
    prisma.product.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <section className="">
      <DashboardBreadcrumb items={[{ label: "Media" }]} />
      <h1 className="font-serif text-5xl">Media library</h1>
      <p className="mt-3 text-muted-foreground">
        Gunakan link HTTPS. Link dummy sudah disediakan dan dapat diganti
        sebelum produksi.
      </p>
      <form
        action={addMediaAction}
        className="mt-8 rounded-2xl border border-border-subtle bg-card p-6"
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="url">Image URL</FieldLabel>
            <Input
              id="url"
              name="url"
              type="url"
              defaultValue={DUMMY_IMAGE}
              required
            />
          </Field>
          {[
            ["altEn", "Alt text (EN)"],
            ["altId", "Alt text (ID)"],
            ["altPt", "Alt text (PT)"],
          ].map(([name, label]) => (
            <Field key={name}>
              <FieldLabel htmlFor={name}>{label}</FieldLabel>
              <Input
                id={name}
                name={name}
                defaultValue="Asietex textile production placeholder"
                required
              />
            </Field>
          ))}
          <Field>
            <FieldLabel htmlFor="credit">Credit / usage note</FieldLabel>
            <Input id="credit" name="credit" defaultValue="" />
          </Field>
          <Field>
            <FieldLabel htmlFor="pageId">Attach to page (optional)</FieldLabel>
            <select
              id="pageId"
              name="pageId"
              className="h-9 rounded-md border bg-transparent px-3 text-sm"
            >
              <option value="">None</option>
              {pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.slug}
                </option>
              ))}
            </select>
          </Field>
          <Field>
            <FieldLabel htmlFor="productId">
              Attach to product (optional)
            </FieldLabel>
            <select
              id="productId"
              name="productId"
              className="h-9 rounded-md border bg-transparent px-3 text-sm"
            >
              <option value="">None</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.slug}
                </option>
              ))}
            </select>
          </Field>
          <p className="text-xs text-muted-foreground">
            Media yang dibuat ADMIN langsung disetujui; media dari STAFF
            tersimpan sebagai draft.
          </p>
          <Button type="submit">Add media</Button>
        </FieldGroup>
      </form>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <figure
            key={asset.id}
            className="overflow-hidden rounded-2xl border border-border-subtle bg-card"
          >
            <div className="relative aspect-video">
              <Image
                src={asset.url}
                alt={asset.altEn}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <figcaption className="p-4 text-sm">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span>{asset.altEn}</span>
                <Badge variant={asset.approved ? "default" : "outline"}>
                  {asset.approved ? "APPROVED" : "DRAFT"}
                </Badge>
              </div>
              {asset.credit && (
                <p className="text-xs text-muted-foreground">{asset.credit}</p>
              )}
              {!asset.approved && user.role === "ADMIN" && (
                <form action={approveMediaAction} className="mt-3">
                  <input type="hidden" name="id" value={asset.id} />
                  <Button type="submit" size="sm" variant="outline">
                    Approve
                  </Button>
                </form>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
