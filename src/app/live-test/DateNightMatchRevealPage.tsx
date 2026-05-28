"use client";

import { motion } from "framer-motion";
import type { DateNightScenario } from "./date-night-scenarios";

export default function DateNightMatchRevealPage({
  match,
}: {
  match: DateNightScenario;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-amber-900/25 bg-gradient-to-b from-zinc-950/95 to-[#061a1a] shadow-[inset_0_0_60px_rgba(0,0,0,0.25)]">
      <header className="shrink-0 border-b border-stone-800/50 px-3 py-2 sm:px-4 sm:py-2.5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-amber-600/85">
          Date Night
        </p>
        <h1 className="mt-0.5 font-serif text-base font-semibold leading-tight text-white sm:text-lg">
          Tonight’s Match
        </h1>
        <p className="mt-1 text-[10px] leading-snug text-stone-400 sm:text-[11px]">
          A shared fantasy, chosen in private.
        </p>
      </header>

      <section className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-[40rem]"
        >
          <article className="relative overflow-hidden rounded-2xl border border-amber-600/20 bg-black/35 shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <img
              src={match.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-0 bg-black/30" aria-hidden />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70"
              aria-hidden
            />
            <motion.div
              className="pointer-events-none absolute inset-0"
              animate={{ opacity: [0.35, 0.75, 0.35] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
              style={{
                background:
                  "radial-gradient(ellipse 60% 45% at 50% 30%, rgba(255,215,120,0.18), transparent 60%)",
              }}
            />

            <div className="relative z-10 p-5 sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300/85">
                Tonight’s Match
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] sm:text-[2.75rem]">
                {match.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-100/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.9)] sm:text-base">
                {match.teaser}
              </p>

              <button
                type="button"
                className="mt-6 flex h-[3.25rem] w-full items-center justify-center rounded-full border border-amber-400/55 bg-gradient-to-b from-amber-200/95 to-amber-600 px-5 text-sm font-bold text-zinc-950 shadow-[0_14px_38px_rgba(0,0,0,0.55)] transition hover:from-amber-100 hover:to-amber-500"
              >
                Begin Experience
              </button>
            </div>
          </article>
        </motion.div>
      </section>
    </div>
  );
}

