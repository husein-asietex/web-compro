"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-5 text-center text-foreground">
      <div>
        <h1 className="font-serif text-5xl">Something went wrong</h1>
        <p className="mt-4 text-muted-foreground">
          Please try loading this page again.
        </p>
        <Button className="mt-7 rounded-full" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
