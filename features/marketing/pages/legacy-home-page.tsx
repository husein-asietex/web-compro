import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, PlayIcon } from "@hugeicons/core-free-icons";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Network", href: "/network" },
  { label: "Contact", href: "/contact" },
];

const DIVISIONS = [
  "Spinning",
  "Twisting",
  "Knitting",
  "Weaving",
  "Dyeing",
  "Yarn Dyeing",
  "Garment",
  "Printing",
  "Finishing",
];

const E_CATALOG_URL = "https://e-catalog.asietex.web.id";

const toSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#1f211d]/10 bg-[#f8f7f2]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        <Link href="/" className="font-serif text-2xl">
          Asietex<span className="text-[#ab873e]">.</span>
        </Link>

        <div className="hidden gap-7 text-sm md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>

        <Link href="/login" className="text-sm underline underline-offset-4">
          CMS login
        </Link>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-14 md:grid-cols-12 md:px-10 md:pb-28 md:pt-24">
      <div className="md:col-span-7">
        <Badge
          variant="outline"
          className="border-[#ab873e]/40 bg-transparent text-[#765b25]"
        >
          Integrated textile manufacturer · Indonesia
        </Badge>

        <h1 className="mt-8 max-w-4xl font-serif text-5xl leading-[.93] tracking-[-.045em] md:text-8xl">
          From raw cotton to finished fabric, under one roof.
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-7 text-[#5b5d54]">
          Asietex brings spinning, knitting, weaving, dyeing and finishing
          together for brands and converters across Europe and Asia.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <a
            href={E_CATALOG_URL}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({
              className: "h-11 rounded-full bg-[#1f211d] px-5 text-white",
            })}
          >
            Explore e-catalog
            <HugeiconsIcon icon={ArrowUpRight01Icon} data-icon="inline-end" />
          </a>

          <Link
            href="/products"
            className={buttonVariants({
              variant: "outline",
              className:
                "h-11 rounded-full border-[#1f211d]/25 bg-transparent px-5",
            })}
          >
            Explore divisions
          </Link>
        </div>
      </div>

      <HeroVideoCard />
    </section>
  );
}

function HeroVideoCard() {
  return (
    <aside className="relative min-h-96 overflow-hidden rounded-[2rem] bg-[#d8d0bc] p-6 md:col-span-5">
      <div className="absolute inset-0 opacity-45 [background-image:repeating-linear-gradient(135deg,transparent_0,transparent_12px,#766440_13px,transparent_14px)]" />

      <div className="relative flex h-full flex-col justify-between">
        <span className="w-fit rounded-full bg-[#f8f7f2] px-3 py-1 text-xs">
          Company film
        </span>

        <button
          type="button"
          aria-label="Play company film"
          className="flex size-14 items-center justify-center rounded-full bg-[#f8f7f2]"
        >
          <HugeiconsIcon icon={PlayIcon} />
        </button>
      </div>
    </aside>
  );
}

function Divisions() {
  return (
    <section className="border-y border-[#1f211d]/10 bg-[#eeeadf] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <p className="text-sm text-[#765b25]">
          Nine divisions, one accountable chain
        </p>

        <h2 className="mt-3 max-w-2xl font-serif text-4xl tracking-[-.035em] md:text-6xl">
          Built for continuity, not handoffs.
        </h2>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[#1f211d]/10 bg-[#1f211d]/10 sm:grid-cols-2 lg:grid-cols-3">
          {DIVISIONS.map((name, index) => (
            <Link
              key={name}
              href={`/products/${toSlug(name)}`}
              className="flex min-h-40 flex-col justify-between bg-[#f8f7f2] p-5 hover:bg-[#e4dbc6]"
            >
              <span className="text-sm text-[#807d70]">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="flex items-end justify-between font-serif text-3xl">
                <span>{name}</span>
                <HugeiconsIcon icon={ArrowUpRight01Icon} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-10 text-sm text-[#5b5d54] md:flex-row md:px-10">
      <p>PT Asietex Sinar Indopratama · Jakarta, Indonesia</p>
      <p>contact.us@asietex.co.id · +62 21 6386 3999</p>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-dvh overflow-hidden bg-[#f8f7f2] text-[#1f211d]">
      <Header />
      <Hero />
      <Divisions />
      <Footer />
    </main>
  );
}