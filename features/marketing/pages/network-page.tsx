import Link from "next/link";
export default function NetworkPage() {
    return (
        <main className="min-h-dvh bg-[#f8f7f2] p-6 text-[#1f211d] md:p-16">
            <Link href="/" className="text-sm underline">← Asietex</Link>
            <h1 className="mt-16 font-serif text-6xl">Stock close to your production.</h1>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                <li className="rounded-xl bg-[#eeeadf] p-6">Indonesia · HQ & mills</li>
                <li className="rounded-xl bg-[#eeeadf] p-6">China · Warehouse</li>
                <li className="rounded-xl bg-[#eeeadf] p-6">France · Warehouse</li>
                <li className="rounded-xl bg-[#eeeadf] p-6">Italy · Warehouse</li>
                <li className="rounded-xl bg-[#eeeadf] p-6">Portugal · Warehouse</li>
            </ul>
        </main>
    )
}
