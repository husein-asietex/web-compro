import Link from "next/link";

export function StaticPreviewNotice() {
  return (
    <main className="grid min-h-dvh place-items-center bg-secondary p-6 text-center">
      <div className="max-w-lg rounded-2xl border border-border-subtle bg-background p-8">
        <p className="text-sm text-text-accent">Static preview</p>
        <h1 className="mt-3 font-serif text-4xl">Dashboard is unavailable</h1>
        <p className="mt-4 text-muted-foreground">
          This deployment contains the public website only. Content management
          and account actions require the separate application environment.
        </p>
        <Link
          className="mt-7 inline-block underline underline-offset-4"
          href="/en"
        >
          Visit the website
        </Link>
      </div>
    </main>
  );
}
