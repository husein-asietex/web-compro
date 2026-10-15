import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { WorldMarketMap } from "@/features/site/components/world-market-map";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ABOUT_CONTENT, type AboutContent } from "@/data/mock/about";

const HERO_IMAGE = "/about/IMG_3426.webp";
const FACTORY_IMAGE = "/about/IMG_3376.webp";

function getLocalizedContent(
  value: unknown,
  locale: Locale,
): AboutContent | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const localized = (value as Record<string, unknown>)[locale];
  if (!localized || typeof localized !== "object" || Array.isArray(localized)) {
    return null;
  }

  const candidate = localized as Partial<AboutContent>;
  if (
    !candidate.hero ||
    !candidate.history ||
    !candidate.purpose ||
    !candidate.factories ||
    !candidate.affiliates ||
    !candidate.network ||
    !candidate.cta
  ) {
    return null;
  }

  return candidate as AboutContent;
}

export default function AboutPage({ locale }: { locale: Locale }) {
  const translation = {
    title:
      locale === "id"
        ? "Tentang Asietex"
        : locale === "pt"
          ? "Sobre a Asietex"
          : "About Asietex",
    body: ABOUT_CONTENT[locale].hero.intro.join(" "),
  };
  const content = getLocalizedContent(ABOUT_CONTENT, locale)!;

  return (
    <main>
      {/* Section: About hero and company snapshot */}
      <section
        className="mx-auto grid grid-cols-6 max-w-7xl gap-10 px-5 py-16 md:px-10 md:py-24 lg:items-end"
        aria-labelledby="about-title"
      >
        <figure className="col-span-6 relative min-h-[28rem] overflow-hidden rounded-2xl bg-card md:min-h-[25rem]">
          <Image
            src={HERO_IMAGE}
            alt={content.hero.imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent"
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <h1
              id="about-title"
              className="max-w-md capitalize font-serif text-5xl leading-[1.05] tracking-[-0.035em] text-primary-foreground md:text-7xl xl:text-8xl"
            >
              {translation?.title}
            </h1>
          </div>
        </figure>

        <div className="col-span-3">
          <dl className="grid gap-px overflow-hidden rounded-2xl border border-border-subtle bg-border-subtle sm:grid-cols-3">
            {content.hero.facts.map((fact) => (
              <div key={fact.label} className="bg-card p-5 md:p-6">
                <dt className="max-w-40 text-sm leading-6 text-muted-foreground">
                  {fact.label}
                </dt>
                <dd className="mt-10 font-serif text-4xl text-text-accent">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="col-span-3 text-lg leading-8 text-muted-foreground">
          {translation?.body}
        </p>
      </section>

      {/* Section: History and milestones */}
      <section
        className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[minmax(17rem,.7fr)_minmax(0,1.3fr)] lg:gap-24"
        aria-labelledby="history-title"
      >
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm font-medium text-text-accent">
            {content.history.label}
          </p>
          <h2
            id="history-title"
            className="mt-4 max-w-lg font-serif text-4xl leading-tight md:text-5xl"
          >
            {content.history.title}
          </h2>
          <p className="mt-6 max-w-md leading-7 text-muted-foreground">
            {content.history.intro}
          </p>
        </div>

        <ol className="border-s border-border-strong ps-7 md:ps-11">
          {content.history.milestones.map((milestone, index) => (
            <li
              key={`${milestone.year}-${milestone.title}`}
              className="relative grid gap-2 border-b border-border-subtle py-8 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-6"
            >
              <span
                className={cn(
                  "absolute -start-[2.05rem] size-3 rounded-full border-[3px] border-background bg-accent md:-start-[3.15rem]",
                  index === 0 ? "top-1" : "top-9",
                )}
                aria-hidden="true"
              />
              <p className="font-serif text-2xl text-text-accent">
                {milestone.year}
              </p>
              <div className="min-w-0">
                <h3 className="text-xl font-medium tracking-tight">
                  {milestone.title}
                </h3>
                <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">
                  {milestone.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Section: Vision and mission */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
          <div className="grid border-y border-primary-foreground/20 md:grid-cols-2">
            <article className="py-8 md:pe-12 md:py-12">
              <p className="text-sm text-accent">
                {content.purpose.visionLabel}
              </p>
              <p className="mt-5 max-w-xl font-serif text-3xl leading-snug md:text-4xl">
                {content.purpose.vision}
              </p>
            </article>
            <article className="border-t border-primary-foreground/20 py-8 md:border-s md:border-t-0 md:ps-12 md:py-12">
              <p className="text-sm text-accent">
                {content.purpose.missionLabel}
              </p>
              <p className="mt-5 max-w-xl font-serif text-3xl leading-snug md:text-4xl">
                {content.purpose.mission}
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Section: Factories and production sites */}
      <section
        className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28"
        aria-labelledby="factories-title"
      >
        <div>
          <p className="text-sm font-medium text-text-accent">
            {content.factories.label}
          </p>
          <h2
            id="factories-title"
            className="mt-4 max-w-2xl font-serif text-5xl leading-none md:text-7xl"
          >
            {content.factories.title}
          </h2>
        </div>

        <figure className="relative mt-12 aspect-[16/5] min-h-72 overflow-hidden rounded-2xl bg-card">
          <Image
            src={FACTORY_IMAGE}
            alt={content.factories.imageAlt}
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-[center_70%]"
          />
        </figure>

        <div className="mt-12">
          {content.factories.locations.map((factory, index) => (
            <article
              key={factory.name}
              className="grid gap-7 border-t border-border-strong py-10 lg:grid-cols-[minmax(14rem,.80fr)_minmax(0,1.2fr)] lg:gap-16"
            >
              <div>
                <p className="text-sm text-text-soft">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-serif text-3xl leading-tight">
                  {factory.name}
                </h3>
              </div>

              <dl className="min-w-0">
                {factory.details.map((detail) => (
                  <div
                    key={detail.label}
                    className="grid gap-2 border-b border-border-subtle py-2 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6"
                  >
                    <dt className="text-sm font-medium text-text-accent">
                      {detail.label}
                    </dt>
                    <dd className="min-w-0 leading-7 text-muted-foreground">
                      {detail.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </section>

      {/* Section: Affiliate companies */}
      <section className="bg-secondary" aria-labelledby="affiliates-title">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
          <div>
            <p className="text-sm font-medium text-text-accent">
              {content.affiliates.label}
            </p>
            <h2
              id="affiliates-title"
              className="mt-4 max-w-2xl font-serif text-5xl leading-none md:text-7xl"
            >
              {content.affiliates.title}
            </h2>
          </div>

          <div className="mt-12">
            {content.affiliates.companies.map((company, index) => (
              <article
                key={company.name}
                className="grid gap-7 border-t border-border-strong py-10 lg:grid-cols-[minmax(14rem,.80fr)_minmax(0,1.2fr)] lg:gap-16"
              >
                <div>
                  <p className="text-sm text-text-soft">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-serif text-3xl leading-tight">
                    {company.name}
                  </h3>
                </div>

                <dl className="min-w-0">
                  {company.details.map((detail) => (
                    <div
                      key={detail.label}
                      className="grid gap-2 border-b border-border-subtle py-5 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6"
                    >
                      <dt className="text-sm font-medium text-text-accent">
                        {detail.label}
                      </dt>
                      <dd className="min-w-0 whitespace-pre-line leading-7 text-muted-foreground">
                        {detail.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section: International market network */}
      <section
        className="bg-primary text-primary-foreground"
        aria-labelledby="network-title"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
          <div className="max-w-4xl">
            <h2
              id="network-title"
              className="font-serif text-5xl leading-none md:text-7xl"
            >
              {content.network.title}
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-primary-foreground/70">
              {content.network.intro}
            </p>
          </div>

          <div className="mt-12">
            <h3 className="text-sm font-medium text-accent">
              {content.network.mixTitle}
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {content.network.mix.map((item) => (
                <Card key={item.label} className="min-h-36 rounded-2xl">
                  <CardHeader>
                    <CardDescription>{item.label}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <p className="font-serif text-5xl leading-none md:text-6xl">
                      {item.value}%
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-primary-foreground/60">
              {content.network.note}
            </p>
          </div>

          <Card className="mt-10 gap-0 rounded-2xl py-0 md:mx-0">
            <CardHeader className="border-b py-6 md:px-8 md:py-8">
              <h3 className="font-serif text-3xl md:text-4xl">
                {content.network.label}
              </h3>
            </CardHeader>
            <CardContent className="grid gap-x-10 gap-y-7 py-7 md:grid-cols-3 md:px-8 md:py-8">
              {content.network.regions.map((region) => (
                <div key={region.name} className="min-w-0">
                  <h4 className="font-serif text-2xl text-text-accent">
                    {region.name}
                  </h4>
                  <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
                    {region.markets.map((market) => (
                      <li key={market}>{market}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section: Contact call to action */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <div className="overflow-hidden rounded-[2rem] bg-card px-6 py-12 md:px-12 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-medium text-text-accent">
                {content.cta.label}
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">
                {content.cta.title}
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
                {content.cta.body}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}/contact`}
                className={buttonVariants({ className: "rounded-full" })}
              >
                {content.cta.contact}
              </Link>
              <Link
                href={`/${locale}/products`}
                className={buttonVariants({
                  variant: "outline",
                  className: "rounded-full",
                })}
              >
                {content.cta.products}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
