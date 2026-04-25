"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const guideOptions = [
  { id: 1, src: "/guides/GUIDE1.png", label: "Business" },
  { id: 2, src: "/guides/GUIDE2.png", label: "Pirate" },
  { id: 3, src: "/guides/GUIDE3.png", label: "Victorian" },
  { id: 4, src: "/guides/GUIDE4.png", label: "Army" },
  { id: 5, src: "/guides/GUIDE5.png", label: "Classic" },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [appearance, setAppearance] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-10 text-white sm:px-6">
      <div className="w-full max-w-4xl text-center">
        <p className="mb-4 text-xs tracking-[0.2em] text-amber-400">NAKAMA NIGHTS</p>

        <h1 className="mb-2 font-serif text-3xl sm:text-4xl">Choose your Guide</h1>

        <p className="mb-8 text-stone-400 sm:mb-10">Choose the one you&apos;re drawn to.</p>

        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-8">
          {guideOptions.map((guide) => {
            const selected = appearance === guide.src;
            return (
              <button
                key={guide.id}
                type="button"
                onClick={() => setAppearance(guide.src)}
                className={`rounded-xl p-3 text-center transition sm:p-4 ${
                  selected
                    ? "scale-[1.02] bg-zinc-900 ring-2 ring-amber-300"
                    : "bg-zinc-950 hover:scale-[1.02] hover:bg-zinc-900/80"
                }`}
              >
                <div className="flex h-44 items-center justify-center sm:h-56">
                  <img
                    src={guide.src}
                    alt={guide.label}
                    className="h-full w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
                  />
                </div>
                <p className="mt-2 text-sm text-stone-300 sm:mt-3">{guide.label}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-10 sm:gap-4">
          <button
            type="button"
            className="rounded-full border border-stone-600 px-6 py-2.5 text-sm text-stone-200 transition hover:border-stone-500 hover:bg-zinc-900"
            onClick={() => router.push("/")}
          >
            Back
          </button>

          <button
            type="button"
            disabled={!appearance}
            onClick={() => router.push("/guide")}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition ${
              appearance
                ? "bg-amber-200 text-black hover:bg-amber-100"
                : "cursor-not-allowed bg-stone-700 text-stone-400"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
