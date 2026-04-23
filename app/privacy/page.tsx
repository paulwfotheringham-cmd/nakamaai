import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-stone-300">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm text-stone-500 transition hover:text-stone-300"
        >
          ← Home
        </Link>
        <h1 className="mt-8 font-serif text-3xl text-stone-100">
          Privacy policy
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-stone-500">
          Placeholder page. Replace this copy with your full privacy policy when
          ready.
        </p>
      </div>
    </main>
  );
}
