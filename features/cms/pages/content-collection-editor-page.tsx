import Link from "next/link";
import { notFound } from "next/navigation";

import { requireUser } from "@/backend/auth";
import { prisma } from "@/backend/prisma";
import {
  publishContentCollectionAction,
  saveContentCollectionAction,
} from "@/features/cms/actions/content";
import { DashboardBreadcrumb } from "@/features/admin/components/dashboard-breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

const COLLECTIONS = {
  "about-company": "About company profile",
  "home-social-proof": "Home social proof",
  "career-openings": "Career openings",
  "marketing-contacts": "Marketing contacts",
} as const;

type CollectionKey = keyof typeof COLLECTIONS;

function isCollectionKey(value: string): value is CollectionKey {
  return value in COLLECTIONS;
}

export default async function ContentCollectionEditor({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  const { key } = await params;
  const query = await searchParams;
  if (!isCollectionKey(key)) notFound();

  const collection = await prisma.contentCollection.findUnique({
    where: { key },
  });
  const content = collection?.draft ?? collection?.data ?? {};
  const canPublish = user.role === "ADMIN";

  return (
    <section className="mx-auto max-w-4xl">
      <DashboardBreadcrumb
        items={[
          { label: "Content", href: "/dashboard/content" },
          { label: COLLECTIONS[key] },
        ]}
      />
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-5xl">{COLLECTIONS[key]}</h1>
          <p className="mt-3 text-muted-foreground">
            Edit data terstruktur yang dipakai halaman publik. Simpan sebagai
            draft, lalu publish setelah dicek.
          </p>
        </div>
        <Badge
          variant={collection?.status === "PUBLISHED" ? "default" : "outline"}
        >
          {collection?.status ?? "NEW"}
        </Badge>
      </header>

      {query.error && (
        <p
          role="alert"
          className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-800"
        >
          Data harus berupa JSON object yang valid.
        </p>
      )}

      <form action={saveContentCollectionAction} className="mt-8">
        <input type="hidden" name="key" value={key} />
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="data">Content data (JSON)</FieldLabel>
            <Textarea
              id="data"
              name="data"
              defaultValue={JSON.stringify(content, null, 2)}
              rows={28}
              className="font-mono text-sm"
              required
            />
          </Field>
          <Button type="submit">Save draft</Button>
        </FieldGroup>
      </form>

      {canPublish && (
        <form action={publishContentCollectionAction} className="mt-3">
          <input type="hidden" name="key" value={key} />
          <Button type="submit" variant="outline">
            Publish collection
          </Button>
        </form>
      )}

      <Link
        href="/dashboard/content"
        className="mt-8 inline-block text-sm underline"
      >
        Back to content library
      </Link>
    </section>
  );
}
