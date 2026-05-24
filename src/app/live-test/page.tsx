import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Live Test",
  description: "Nakama Nights — talking guide live test (stage 1).",
};

export default function LiveTestPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#07040d] px-6 text-white">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400/80">
        Stage 1
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Live test</h1>
      <p className="mt-3 max-w-md text-center text-sm text-zinc-400">
        Blank page — talking 3D guide and AI chat will be added here next.
      </p>
      <Link
        href="/"
        className="mt-10 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
      >
        ← Home
      </Link>
    </main>
  );
}
