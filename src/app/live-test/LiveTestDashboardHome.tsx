"use client";

import { useEffect, useState } from "react";
import { readGuidePreferences, type GuidePreferences } from "@/lib/guides/preferences";

const PICK_UP_ITEMS = [
  {
    section: "Audiobooks",
    lastActivity: "Gothic · windswept moor",
    when: "Last played 3 days ago",
    image: "/scenes/moor.jpg",
  },
  {
    section: "Build Adventure",
    lastActivity: "Your draft — slow burn, office setting",
    when: "Saved, not finished",
    image: "/scenes/office.jpg",
  },
  {
    section: "Interactive Adventures",
    lastActivity: "Chapter 2 — the choice at the door",
    when: "In progress",
    image: "/tiles/tile3.jpg",
  },
  {
    section: "Forbidden Chat",
    lastActivity: "Private desires",
    when: "Pick up the conversation",
    image: "/tiles/tile4.jpg",
  },
  {
    section: "Reignite for Couples",
    lastActivity: "Date Night Mode — Reconnection Series",
    when: "Last time you were here, 2 days ago",
    image: "/tiles/tile5.jpg",
  },
] as const;

export default function LiveTestDashboardHome() {
  const [prefs, setPrefs] = useState<GuidePreferences | null>(null);

  useEffect(() => {
    setPrefs(readGuidePreferences());
  }, []);

  const userName = prefs?.userName ?? "Jane";
  const guideName = prefs?.guideName ?? "your guide";
  const voiceLabel = prefs?.voiceName?.split("—")[0]?.trim() ?? "your voice";
  const tone = prefs?.tone ?? "Relaxed";

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-amber-900/25 bg-gradient-to-b from-zinc-950/95 to-[#061a1a] shadow-[inset_0_0_60px_rgba(0,0,0,0.25)]">
      <header className="shrink-0 border-b border-stone-800/50 px-3 py-2.5 sm:px-4 sm:py-3">
        <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-amber-600/85 sm:text-[10px]">
          Dashboard
        </p>
        <h1 className="mt-1 font-serif text-lg font-semibold leading-tight tracking-tight text-white sm:text-xl lg:text-2xl">
          This is your dashboard,{" "}
          <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300/90 bg-clip-text text-transparent">
            {userName}
          </span>
        </h1>
        <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-stone-400 sm:text-xs">
          Pick up where you left off from the menu above. Your guide{" "}
          <span className="font-medium text-amber-200/90">{guideName}</span> ({voiceLabel}
          , {tone} tone) is on the right when you want to talk.
        </p>
      </header>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="mb-2 shrink-0">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-500/80">
            Pick up where you left off
          </h2>
          <p className="mt-0.5 text-[10px] text-stone-500 sm:text-[11px]">
            Do you want to continue?
          </p>
        </div>

        <ul className="grid min-h-0 flex-1 auto-rows-[minmax(8.75rem,1fr)] grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2 sm:gap-2.5 lg:grid-cols-5 lg:auto-rows-[minmax(11.5rem,1fr)] lg:overflow-hidden">
          {PICK_UP_ITEMS.map((item) => (
            <li
              key={item.section}
              className="relative h-full min-h-0 overflow-hidden rounded-xl border border-stone-800/80 bg-zinc-950"
            >
              <img
                src={item.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/25" aria-hidden />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/55"
                aria-hidden
              />

              <div className="relative z-10 flex h-full min-h-0 flex-col items-center justify-start px-2.5 pb-[5.5rem] pt-4 text-center sm:px-3 sm:pt-5 lg:pb-[5.5rem]">
                <div className="flex h-full w-full max-w-[95%] flex-col">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-400 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] sm:text-xs">
                    {item.section}
                  </p>
                  <div className="flex-1" />
                  <p className="line-clamp-2 font-serif text-lg font-bold leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-xl md:text-[1.35rem]">
                    {item.lastActivity}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-xs font-semibold text-stone-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] sm:text-sm">
                    {item.when}
                  </p>
                  <div className="flex-[0.9]" />
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-1.5 px-2 pb-2.5 pt-5 sm:gap-2 sm:pb-3">
                <button
                  type="button"
                  className="w-full max-w-[12rem] rounded-full border border-amber-400/55 bg-gradient-to-b from-amber-200/95 to-amber-600 px-3 py-2 text-center text-xs font-bold text-zinc-950 shadow-lg shadow-black/40 transition hover:from-amber-100 hover:to-amber-500 sm:max-w-[12.5rem] sm:py-2.5 sm:text-sm lg:max-w-none lg:px-3 lg:py-2 lg:text-[11px]"
                >
                  Yes, continue
                </button>
                <button
                  type="button"
                  className="w-full max-w-[12rem] rounded-full border border-stone-400/50 bg-black/50 px-3 py-2 text-center text-xs font-semibold text-stone-100 backdrop-blur-sm transition hover:border-stone-300 hover:bg-black/65 sm:max-w-[12.5rem] sm:py-2.5 sm:text-sm lg:max-w-none lg:px-3 lg:py-2 lg:text-[11px]"
                >
                  Not now
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
