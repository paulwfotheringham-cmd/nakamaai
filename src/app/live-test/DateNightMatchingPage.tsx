"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  DEFAULT_USER_NAME,
  readGuidePreferences,
} from "@/lib/guides/preferences";
import { DATE_NIGHT_SCENARIOS, type DateNightScenario } from "./date-night-scenarios";

type Ratings = Record<string, number>;

export default function DateNightMatchingPage({
  partnerUsername,
  onReveal,
}: {
  partnerUsername: string;
  onReveal: (match: DateNightScenario) => void;
}) {
  const currentUsername = useMemo(() => {
    const prefs = readGuidePreferences();
    return (prefs.userName || DEFAULT_USER_NAME).trim() || DEFAULT_USER_NAME;
  }, []);

  const [ratings, setRatings] = useState<Ratings>({});
  const [finding, setFinding] = useState(false);

  const canFind = Object.keys(ratings).length >= 1;

  const findMatch = async () => {
    setFinding(true);

    const partnerRatings: Ratings = {};
    for (const s of DATE_NIGHT_SCENARIOS) {
      // Hidden partner ratings (mock)
      partnerRatings[s.id] = 1 + Math.floor(Math.random() * 10);
    }

    let best = DATE_NIGHT_SCENARIOS[0];
    let bestScore = -1;

    for (const s of DATE_NIGHT_SCENARIOS) {
      const you = ratings[s.id] ?? 0;
      const them = partnerRatings[s.id] ?? 0;
      const score = you * them;
      if (score > bestScore) {
        bestScore = score;
        best = s;
      }
    }

    await new Promise((r) => window.setTimeout(r, 4000));
    onReveal(best);
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-amber-900/25 bg-gradient-to-b from-zinc-950/95 to-[#061a1a] shadow-[inset_0_0_60px_rgba(0,0,0,0.25)]">
      <header className="shrink-0 border-b border-stone-800/50 px-3 py-2 sm:px-4 sm:py-2.5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-amber-600/85">
          Date Night
        </p>
        <h1 className="mt-0.5 font-serif text-base font-semibold leading-tight text-white sm:text-lg">
          Choose Tonight’s Fantasy
        </h1>
        <p className="mt-1 text-[10px] leading-snug text-stone-400 sm:text-[11px]">
          Rate each fantasy from 1–10 privately.
        </p>
      </header>

      <section className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatePresence>
          {finding ? (
            <motion.div
              key="finding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 grid place-items-center bg-black/55 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="mx-3 w-full max-w-[34rem] overflow-hidden rounded-2xl border border-amber-500/20 bg-black/45 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl"
              >
                <motion.div
                  className="pointer-events-none absolute inset-0 opacity-60"
                  animate={{ x: ["-35%", "35%"] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
                  aria-hidden
                  style={{
                    background:
                      "linear-gradient(110deg, transparent 0%, rgba(255,215,120,0.14) 38%, transparent 70%)",
                  }}
                />
                <div className="relative">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-400/85">
                    Matching
                  </p>
                  <h2 className="mt-1 font-serif text-2xl font-semibold leading-tight text-white sm:text-[2rem]">
                    Finding Your Match
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-stone-300/80">
                    Comparing your private ratings with{" "}
                    <span className="font-semibold text-amber-200/95">
                      @{partnerUsername}
                    </span>
                    .
                  </p>

                  <div className="mt-5 flex items-center justify-between rounded-xl border border-stone-800/80 bg-black/35 px-3 py-2.5 text-xs font-semibold text-stone-300/85">
                    <span>@{currentUsername}</span>
                    <span className="text-amber-200/90">AI compatibility</span>
                    <span>@{partnerUsername}</span>
                  </div>

                  <div className="mt-5">
                    <motion.div
                      className="h-1.5 w-full overflow-hidden rounded-full bg-white/5"
                      aria-hidden
                    >
                      <motion.div
                        className="h-full w-1/3 rounded-full"
                        animate={{ x: ["-30%", "230%"] }}
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        style={{
                          background:
                            "linear-gradient(90deg, transparent 0%, rgba(255,215,120,0.92) 40%, transparent 85%)",
                          filter: "drop-shadow(0 0 14px rgba(255,215,120,0.35))",
                        }}
                      />
                    </motion.div>
                    <p className="mt-2 text-[11px] leading-relaxed text-stone-400">
                      Just a moment. Setting the mood.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="grid min-h-0 flex-1 auto-rows-[minmax(0,1fr)] grid-cols-1 gap-2 overflow-y-auto p-2 sm:grid-cols-2 sm:gap-3 sm:p-3 lg:grid-cols-3">
          {DATE_NIGHT_SCENARIOS.map((scenario) => (
            <FantasyCard
              key={scenario.id}
              scenario={scenario}
              value={ratings[scenario.id] ?? null}
              onChange={(v) => setRatings((prev) => ({ ...prev, [scenario.id]: v }))}
            />
          ))}
        </div>
      </section>

      <footer className="shrink-0 border-t border-stone-800/50 p-2 sm:p-3">
        <button
          type="button"
          onClick={findMatch}
          disabled={finding || !canFind}
          className="flex h-[3.25rem] w-full items-center justify-center rounded-full border border-amber-400/55 bg-gradient-to-b from-amber-200/95 to-amber-600 px-5 text-sm font-bold text-zinc-950 shadow-[0_14px_38px_rgba(0,0,0,0.55)] transition hover:from-amber-100 hover:to-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Find Our Match
        </button>
      </footer>
    </div>
  );
}

function FantasyCard({
  scenario,
  value,
  onChange,
}: {
  scenario: DateNightScenario;
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <article className="relative min-h-[11.5rem] overflow-hidden rounded-xl border border-stone-800/80 bg-zinc-950">
      <img
        src={scenario.image}
        alt=""
        className="absolute inset-0 z-0 h-full w-full object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/25" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/55 via-black/25 to-black/60"
        aria-hidden
      />

      <div className="relative z-10 flex h-full flex-col px-3 pb-3 pt-4 sm:px-4 sm:pt-5">
        <h3 className="font-serif text-lg font-semibold leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          {scenario.title}
        </h3>
        <p className="mt-1.5 line-clamp-3 text-xs font-semibold leading-relaxed text-stone-100/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
          {scenario.teaser}
        </p>

        <div className="mt-auto pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300/80">
            Your rating
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {Array.from({ length: 10 }).map((_, i) => {
              const n = i + 1;
              const active = value === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => onChange(n)}
                  className={`h-8 min-w-8 rounded-full border px-2 text-xs font-bold transition ${
                    active
                      ? "border-amber-300/70 bg-gradient-to-b from-amber-200/95 to-amber-600 text-zinc-950 shadow-[0_10px_26px_rgba(0,0,0,0.5)]"
                      : "border-stone-700/80 bg-black/45 text-stone-200/90 hover:border-amber-700/40 hover:text-amber-100"
                  }`}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}

