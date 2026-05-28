"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_USER_NAME,
  readGuidePreferences,
} from "@/lib/guides/preferences";

const COUPLES_TILES = [
  {
    id: "date-night",
    title: "Date Night Mode",
    description:
      "A mediated 30-min experience for date night at home — sets the mood, builds anticipation, leads somewhere.",
    image: "/couples/date-night.jpg",
    button: "Start",
  },
  {
    id: "surprise",
    title: "Surprise Mode",
    description:
      "Woman makes the story, surprises partner with a fantasy adventure.",
    image: "/couples/surprise.jpg",
    button: "Start",
  },
] as const;

function CouplesTile({
  eyebrow,
  title,
  description,
  image,
  button,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  image: string;
  button: string;
}) {
  return (
    <article className="relative h-full min-h-0 overflow-hidden rounded-xl border border-stone-800/80 bg-zinc-950">
      <img
        src={image}
        alt=""
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-black/25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-black/30 to-black/55"
        aria-hidden
      />

      <div className="relative z-10 flex h-full min-h-0 flex-col items-center justify-start px-3 pb-3 pt-4 text-center sm:px-4 sm:pt-6">
        <div className="flex h-full w-full max-w-[95%] flex-col">
          {eyebrow ? (
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-400 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] sm:text-xs">
              {eyebrow}
            </p>
          ) : null}
          <h2
            className={`font-serif text-2xl font-bold leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] sm:text-3xl md:text-[2.15rem] ${
              eyebrow ? "mt-1" : ""
            }`}
          >
            {title}
          </h2>
          <p className="mt-3 line-clamp-4 text-sm font-semibold leading-snug text-stone-100/95 drop-shadow-[0_1px_8px_rgba(0,0,0,0.95)] sm:text-[15px] md:text-base">
            {description}
          </p>
          <div className="mt-auto flex w-full justify-center pt-4 sm:pt-5">
            <button
              type="button"
              className="flex min-h-[2.75rem] w-full max-w-[14rem] items-center justify-center whitespace-nowrap rounded-full border border-amber-400/55 bg-gradient-to-b from-amber-200/95 to-amber-600 px-5 py-2.5 text-center text-xs font-bold leading-none text-zinc-950 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition hover:from-amber-100 hover:to-amber-500 sm:max-w-[16rem] sm:py-3 sm:text-sm"
            >
              {button}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function LiveTestCouplesProgram() {
  const [userName, setUserName] = useState(DEFAULT_USER_NAME);

  useEffect(() => {
    setUserName(readGuidePreferences().userName || DEFAULT_USER_NAME);
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-amber-900/25 bg-gradient-to-b from-zinc-950/95 to-[#061a1a] shadow-[inset_0_0_60px_rgba(0,0,0,0.25)]">
      <header className="shrink-0 border-b border-stone-800/50 px-3 py-2 sm:px-4 sm:py-2.5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-amber-600/85">
          Reignite
        </p>
        <h1 className="mt-0.5 font-serif text-base font-semibold leading-tight text-white sm:text-lg">
          The Couples Program
        </h1>
        <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-stone-400 sm:text-[11px]">
          Hi {userName} — for long-term partners and married couples. Choose how you want
          to reconnect tonight.
        </p>
      </header>

      <div className="grid min-h-0 flex-1 auto-rows-[minmax(0,1fr)] grid-cols-1 items-stretch gap-2 overflow-y-auto p-2 sm:grid-cols-2 sm:overflow-hidden sm:gap-3 sm:p-3">
        {COUPLES_TILES.map((tile) => (
          <CouplesTile key={tile.id} {...tile} />
        ))}
      </div>
    </div>
  );
}
