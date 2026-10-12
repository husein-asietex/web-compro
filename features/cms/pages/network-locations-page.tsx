import Link from "next/link";

import {
  publishNetworkLocationAction,
  saveNetworkLocationAction,
} from "@/features/cms/actions/content";
import { requireUser } from "@/backend/auth";
import { prisma } from "@/backend/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type LocationFormProps = {
  location?: {
    id: string;
    slug: string;
    name: string;
    country: string;
    city: string;
    address: string | null;
    kind: string;
    order: number;
    status: string;
    draft: unknown;
  };
  canPublish: boolean;
};

function LocationForm({ location, canPublish }: LocationFormProps) {
  const draft = location?.draft as Partial<
    Omit<NonNullable<LocationFormProps["location"]>, "id" | "status" | "draft">
  > | null;
  return (
    <article className="rounded-2xl border border-border-subtle bg-card p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl">
          {location?.name || "New location"}
        </h2>
        {location && (
          <Badge
            variant={location.status === "PUBLISHED" ? "default" : "outline"}
          >
            {location.status}
          </Badge>
        )}
      </div>
      <form action={saveNetworkLocationAction} className="mt-5">
        <input type="hidden" name="id" value={location?.id || ""} />
        <FieldGroup>
          {[
            ["slug", "Slug", draft?.slug ?? location?.slug ?? ""],
            ["name", "Name", draft?.name ?? location?.name ?? ""],
            ["kind", "Type", draft?.kind ?? location?.kind ?? ""],
            ["country", "Country", draft?.country ?? location?.country ?? ""],
            ["city", "City", draft?.city ?? location?.city ?? ""],
            ["address", "Address", draft?.address ?? location?.address ?? ""],
            ["order", "Order", String(draft?.order ?? location?.order ?? 0)],
          ].map(([name, label, value]) => (
            <Field key={name}>
              <FieldLabel htmlFor={`${location?.id || "new"}-${name}`}>
                {label}
              </FieldLabel>
              <Input
                id={`${location?.id || "new"}-${name}`}
                name={name}
                defaultValue={value}
                required={name !== "address"}
              />
            </Field>
          ))}
          <Button type="submit">Save draft</Button>
        </FieldGroup>
      </form>
      {location && canPublish && (
        <form action={publishNetworkLocationAction} className="mt-3">
          <input type="hidden" name="id" value={location.id} />
          <Button type="submit" variant="outline">
            Publish location
          </Button>
        </form>
      )}
    </article>
  );
}

export default async function NetworkLocationsPage() {
  const user = await requireUser();
  const locations = await prisma.networkLocation.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <main className="min-h-dvh bg-background p-6 text-foreground md:p-12">
      <section className="mx-auto max-w-5xl">
        <Link href="/dashboard/content" className="text-sm underline">
          ← Content library
        </Link>
        <h1 className="mt-12 font-serif text-5xl">Network locations</h1>
        <p className="mt-3 text-muted-foreground">
          Staff saves drafts; only an admin can publish locations.
        </p>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {locations.map((location) => (
            <LocationForm
              key={location.id}
              location={location}
              canPublish={user.role === "ADMIN"}
            />
          ))}
          <LocationForm canPublish={false} />
        </div>
      </section>
    </main>
  );
}
