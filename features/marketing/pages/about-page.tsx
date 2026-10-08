import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-dvh bg-[#f8f7f2] p-6 text-[#1f211d] md:p-16">
      <Link href="/" className="text-sm underline">
        ← Asietex
      </Link>

      <h1 className="mt-16 max-w-4xl font-serif text-6xl">
        One integrated chain. One accountable partner.
      </h1>

      <p className="mt-8 max-w-2xl text-lg leading-8 text-[#5b5d54]">
        Every stage, from yarn to fabric, runs in our own mills. This page is
        ready for approved company, facilities and certification content.
      </p>
    </main>
  );
}