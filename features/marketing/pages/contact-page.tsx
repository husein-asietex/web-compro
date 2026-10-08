import Link from "next/link";
export default function ContactPage() {
    return (
        <main className="min-h-dvh bg-[#f8f7f2] p-6 text-[#1f211d] md:p-16">
            <Link href="/" className="text-sm underline">← Asietex</Link>
            <h1 className="mt-16 font-serif text-6xl">Talk to Asietex.</h1>
            <p className="mt-8 text-lg">contact.us@asietex.co.id · +62 21 6386 3999</p>
            <p className="mt-4 max-w-xl text-[#5b5d54]">The sample and quotation form remains deliberately inactive in this MVP, as defined in the PRD.</p>
        </main>
    )
}
