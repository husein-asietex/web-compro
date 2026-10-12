import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-5 text-center text-foreground">
      <div>
        <p className="text-sm text-text-accent">404</p>
        <h1 className="mt-3 font-serif text-5xl">Page not found</h1>
        <p className="mt-4 text-muted-foreground">
          The requested page is unavailable.
        </p>
        <Link
          href="/en"
          className={buttonVariants({ className: "mt-7 rounded-full" })}
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
