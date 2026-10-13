import Image from "next/image";
import { redirect } from "next/navigation";

import { prisma } from "@/backend/prisma";
import { Button } from "@/components/ui/button";
import { copy, type Locale } from "@/lib/i18n";
import { SendIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const buyerMeetingSpace = "/contact/IMG_3983.JPG";
const factoryExterior = "/about/IMG_3376.JPG";
const productionFloor = "/why-asietex/IMG_2875.JPG";
const qualityTeam = "/career/IMG_3545.JPG";

const contactCopy = {
  en: {
    addressLabel: "Office address",
    address:
      "Jl. Cideng Timur No. 36, Petojo Utara - Gambir, Jakarta Pusat 10130, Indonesia",
    retailerAddressLabel: "Retailer shop address",
    retailerAddress: "Tanah Abang Bukit F/10, Jakarta Pusat\nINDONESIA",
    retailerPhoneLabel: "Retailer phone",
    retailerFaxLabel: "Retailer fax",
    retailerPhone: "+62 21 3190 9731",
    retailerFax: "+62 21 391 1529",
    phoneLabel: "Phone",
    faxLabel: "Fax",
    emailLabel: "Email",
    hoursLabel: "Office hours",
    hours: "Monday–Friday, 08:00–17:00 WIB",
    formTitle: "Tell us what you are looking for.",
    formIntro:
      "Share a few details and our team will help you find the right starting point.",
    name: "Name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    submit: "Send message",
  },
  id: {
    addressLabel: "Alamat kantor",
    address:
      "Jl. Cideng Timur No. 36, Petojo Utara - Gambir, Jakarta Pusat 10130, Indonesia",
    retailerAddressLabel: "Alamat toko retailer",
    retailerAddress: "Tanah Abang Bukit F/10, Jakarta Pusat\nINDONESIA",
    retailerPhoneLabel: "Telepon toko retailer",
    retailerFaxLabel: "Faks toko retailer",
    retailerPhone: "+62 21 3190 9731",
    retailerFax: "+62 21 391 1529",
    phoneLabel: "Telepon",
    faxLabel: "Faks",
    emailLabel: "Email",
    hoursLabel: "Jam kerja",
    hours: "Senin–Jumat, 08.00–17.00 WIB",
    formTitle: "Ceritakan kebutuhan Anda.",
    formIntro:
      "Bagikan beberapa detail dan tim kami akan membantu menentukan langkah awal yang tepat.",
    name: "Nama",
    email: "Email",
    phone: "Telepon",
    message: "Pesan",
    submit: "Kirim pesan",
  },
  pt: {
    addressLabel: "Morada do escritório",
    address:
      "Jl. Cideng Timur No. 36, Petojo Utara - Gambir, Jakarta Pusat 10130, Indonésia",
    retailerAddressLabel: "Morada da loja retalhista",
    retailerAddress: "Tanah Abang Bukit F/10, Jakarta Pusat\nINDONÉSIA",
    retailerPhoneLabel: "Telefone da loja retalhista",
    retailerFaxLabel: "Fax da loja retalhista",
    retailerPhone: "+62 21 3190 9731",
    retailerFax: "+62 21 391 1529",
    phoneLabel: "Telefone",
    faxLabel: "Fax",
    emailLabel: "Email",
    hoursLabel: "Horário de funcionamento",
    hours: "Segunda–sexta, 08:00–17:00 WIB",
    formTitle: "Conte-nos o que procura.",
    formIntro:
      "Partilhe alguns detalhes e a nossa equipa ajudará a encontrar o melhor ponto de partida.",
    name: "Nome",
    email: "Email",
    phone: "Telefone",
    message: "Mensagem",
    submit: "Enviar mensagem",
  },
} as const;

export default async function ContactPage({ locale }: { locale: Locale }) {
  const page = await prisma.page.findFirst({
    where: { slug: "contact", status: "PUBLISHED" },
    include: { translations: { where: { locale } } },
  });
  if (!page) redirect("/en");

  const translation = page.translations[0];
  const content = contactCopy[locale];

  return (
    /* Contact page */
    <section className="mx-auto max-w-7xl px-5 py-16 md:py-20">
      {/* Contact introduction */}
      {/* Contact hero */}
      <div className="max-w-3xl">
        <h1 className="mt-8 max-w-4xl font-serif text-5xl leading-[0.98] md:text-7xl">
          {translation?.title || copy[locale].nav[4]}
        </h1>
        {translation?.body && (
          <p className="mt-6 max-w-2xl whitespace-pre-line text-lg leading-8 text-muted-foreground">
            {translation.body}
          </p>
        )}
      </div>

      {/* Office details and inquiry form */}
      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
        <div>
          {/* Office information */}
          <div className="max-w-md space-y-7">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-text-accent">
                {content.addressLabel}
              </h2>
              <p className="mt-3 text-lg leading-8">{content.address}</p>
            </div>

            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">{content.phoneLabel}</dt>
                <dd className="mt-1 font-medium">+62 21 6386 3999</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{content.faxLabel}</dt>
                <dd className="mt-1 font-medium">+62 21 6386 1999</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{content.emailLabel}</dt>
                <dd className="mt-1 font-medium">contact.us@asietex.co.id</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{content.hoursLabel}</dt>
                <dd className="mt-1 font-medium">{content.hours}</dd>
              </div>
            </dl>

            {/* Office location map */}
            <div className="relative mt-6 min-h-80 overflow-hidden rounded-3xl bg-surface-subtle">
              <iframe
                title="Asietex office location on Google Maps"
                src="https://www.google.com/maps?q=Jl.+Cideng+Timur+No.+36,+Jakarta+Pusat,+Indonesia&output=embed"
                className="absolute inset-0 h-full min-h-80 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-text-accent">
                {content.retailerAddressLabel}
              </h2>
              <address className="mt-3 whitespace-pre-line text-lg leading-8 not-italic">
                {content.retailerAddress}
              </address>
            </div>

            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">
                  {content.retailerPhoneLabel}
                </dt>
                <dd className="mt-1 font-medium">{content.retailerPhone}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">
                  {content.retailerFaxLabel}
                </dt>
                <dd className="mt-1 font-medium">{content.retailerFax}</dd>
              </div>
            </dl>
          </div>

          {/* Contact imagery */}
          <div className="mt-12 grid grid-cols-2 gap-4">
            {(
              [
                [
                  buyerMeetingSpace,
                  "Textile consultation in the buyer meeting space",
                ],
                [factoryExterior, "Asietex textile manufacturing campus"],
                [productionFloor, "Integrated textile production floor"],
                [qualityTeam, "Textile quality team inspecting fabric"],
              ] as const
            ).map(([src, alt]) => (
              <figure
                key={alt}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-card"
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="50vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </figure>
            ))}
          </div>
        </div>

        {/* Contact inquiry form */}
        <div className="rounded-3xl bg-surface-warm p-6 md:p-8 h-fit">
          <h2 className="max-w-sm font-serif text-3xl leading-tight md:text-4xl">
            {content.formTitle}
          </h2>
          <p className="mt-4 max-w-md leading-7 text-muted-foreground">
            {content.formIntro}
          </p>
          <form className="mt-8 space-y-5">
            <div>
              <label htmlFor="contact-name" className="text-sm font-medium">
                {content.name}
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                className="mt-2 min-h-12 w-full rounded-xl border border-border-strong bg-background px-4 text-base outline-none transition-colors focus:border-text-accent focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="text-sm font-medium">
                {content.email}
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                className="mt-2 min-h-12 w-full rounded-xl border border-border-strong bg-background px-4 text-base outline-none transition-colors focus:border-text-accent focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </div>
            <div>
              <label htmlFor="contact-phone" className="text-sm font-medium">
                {content.phone}
              </label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                className="mt-2 min-h-12 w-full rounded-xl border border-border-strong bg-background px-4 text-base outline-none transition-colors focus:border-text-accent focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="text-sm font-medium">
                {content.message}
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                className="mt-2 w-full resize-y rounded-xl border border-border-strong bg-background px-4 py-3 text-base outline-none transition-colors focus:border-text-accent focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </div>
            <Button
              type="submit"
              className="min-h-12 w-full rounded-xl sm:w-auto"
            >
              <HugeiconsIcon icon={SendIcon} /> {content.submit}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
