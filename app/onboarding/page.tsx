"use client";

import { useState } from "react";

export default function OnboardingPage() {
  const [appearance, setAppearance] = useState<string | null>(null);

  const guideOptions = [
    { id: 1, src: "/guides/GUIDE1.png", label: "Business" },
    { id: 2, src: "/guides/GUIDE2.png", label: "Pirate" },
    { id: 3, src: "/guides/GUIDE3.png", label: "Victorian" },
    { id: 4, src: "/guides/GUIDE4.png", label: "Army" },
    { id: 5, src: "/guides/GUIDE5.png", label: "Classic" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-5xl text-center">
        {/* HEADER */}
        <p className="mb-4 text-xs tracking-[0.2em] text-amber-400">NAKAMA NIGHTS</p>

        <h1 className="mb-2 font-serif text-4xl">Choose your Guide</h1>

        <p className="mb-12 text-stone-400">Choose the one you&apos;re drawn to.</p>

        {/* GRID */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3">
          {guideOptions.map((guide) => (
            <button
              key={guide.id}
              type="button"
              onClick={() => setAppearance(guide.src)}
              className={`cursor-pointer rounded-2xl p-6 text-left transition-all duration-300 ${
                appearance === guide.src
                  ? "scale-105 bg-black/40 ring-2 ring-amber-300 backdrop-blur-sm"
                  : "bg-black/30 hover:scale-105"
              }`}
            >
              <div className="flex h-72 items-end justify-center">
                <img
                  src={guide.src}
                  alt={guide.label}
                  className="h-full scale-125 object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,1)]"
                />
              </div>

              <p className="mt-4 text-sm text-stone-300">{guide.label}</p>
            </button>
          ))}
        </div>

        {/* BUTTONS */}
        <div className="mt-12 flex justify-center gap-4">
          <button
            type="button"
            disabled={!appearance}
            onClick={() => {
              if (!appearance) return;
              const fileName = appearance.split("/").pop();
              if (fileName) {
                localStorage.setItem("selectedGuide", fileName);
              }
              window.location.href = "/guide";
            }}
            className={`rounded-full px-8 py-3 text-sm font-semibold transition ${
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
