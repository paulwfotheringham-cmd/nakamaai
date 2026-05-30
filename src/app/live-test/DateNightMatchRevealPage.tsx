"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { DateNightScenario } from "./date-night-scenarios";

export default function DateNightMatchRevealPage({
  match,
  onBeginExperience,
}: {
  match: DateNightScenario;
  onBeginExperience: () => void;
}) {
  const [transitioning, setTransitioning] = useState(false);
  const [revealReady, setRevealReady] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setRevealReady(true), 120);
    return () => window.clearTimeout(t);
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: `${Math.round(Math.random() * 100)}%`,
        top: `${Math.round(Math.random() * 100)}%`,
        size: 2 + Math.round(Math.random() * 3),
        delay: Math.random() * 1.8,
        duration: 4.5 + Math.random() * 3.5,
        opacity: 0.18 + Math.random() * 0.22,
      })),
    [],
  );

  const begin = async () => {
    setTransitioning(true);
    await new Promise((r) => window.setTimeout(r, 900));
    onBeginExperience();
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-amber-900/25 bg-gradient-to-b from-zinc-950/95 to-[#061a1a] shadow-[inset_0_0_60px_rgba(0,0,0,0.25)]">
      <header className="shrink-0 border-b border-stone-800/50 px-3 py-2 sm:px-4 sm:py-2.5">
        <p className="type-label text-amber-600/85">
          Date Night
        </p>
        <h1 className="mt-0.5 type-section-heading text-luxury-primary sm:text-lg">
          Tonight’s Match
        </h1>
        <p className="mt-1 text-[10px] leading-snug text-stone-400 sm:text-[11px]">
          A shared fantasy, chosen in private.
        </p>
      </header>

      <section className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-3 sm:p-4">
        <div className="relative w-full max-w-[44rem]">
          <AnimatePresence>
            {transitioning ? (
              <motion.div
                key="darken"
                className="pointer-events-none absolute inset-0 z-20 rounded-2xl bg-black/55"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeInOut" }}
              />
            ) : null}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.99 }}
            animate={{
              opacity: revealReady ? 1 : 0,
              y: revealReady ? 0 : 14,
              scale: revealReady ? 1 : 0.99,
            }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <motion.article
              className="relative overflow-hidden rounded-2xl border border-amber-600/20 bg-black/30 shadow-[0_22px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl"
              animate={
                transitioning
                  ? { opacity: 0, y: -14, scale: 0.985 }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              transition={{ duration: 0.7, ease: "easeInOut" }}
            >
              <motion.img
                src={match.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center"
                animate={transitioning ? { scale: 1.08, filter: "blur(1px)" } : { scale: 1 }}
                transition={{ duration: 1.25, ease: "easeInOut" }}
              />

              {/* Softer, richer cinematic overlays */}
              <div className="pointer-events-none absolute inset-0 bg-black/20" aria-hidden />
              <div
                className="pointer-events-none absolute inset-0"
                aria-hidden
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 38%, rgba(0,0,0,0.72) 100%)",
                }}
              />
              <div
                className="pointer-events-none absolute inset-0"
                aria-hidden
                style={{
                  background:
                    "radial-gradient(ellipse 65% 48% at 50% 22%, rgba(255,215,120,0.16), transparent 62%)",
                }}
              />

              {/* Atmospheric fog */}
              <motion.div
                className="pointer-events-none absolute inset-0 opacity-50"
                aria-hidden
                animate={{ x: ["-12%", "10%", "-8%"], opacity: [0.35, 0.55, 0.4] }}
                transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  background:
                    "radial-gradient(ellipse 70% 45% at 30% 70%, rgba(255,255,255,0.10), transparent 60%), radial-gradient(ellipse 65% 40% at 70% 55%, rgba(255,255,255,0.08), transparent 62%)",
                  filter: "blur(10px)",
                }}
              />

              {/* Floating particles */}
              <div className="pointer-events-none absolute inset-0" aria-hidden>
                {particles.map((p) => (
                  <motion.span
                    key={p.id}
                    className="absolute rounded-full bg-amber-200/80"
                    style={{
                      left: p.left,
                      top: p.top,
                      width: p.size,
                      height: p.size,
                      opacity: p.opacity,
                      filter: "drop-shadow(0 0 10px rgba(255,215,120,0.25))",
                    }}
                    animate={{ y: [0, -18, 0], opacity: [p.opacity, p.opacity * 1.35, p.opacity] }}
                    transition={{
                      duration: p.duration,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: p.delay,
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10 p-5 sm:p-7">
                <p className="select-none type-label text-amber-300/80 drop-shadow-[0_1px_12px_rgba(0,0,0,0.9)]">
                  Tonight’s Match
                </p>
                <h2 className="select-none mt-2 font-serif text-[2.15rem] font-semibold leading-[1.05] tracking-[-0.02em] text-[#f7f2e8] drop-shadow-[0_2px_18px_rgba(0,0,0,0.95)] sm:text-[3.05rem]">
                  {match.title}
                </h2>
                <p className="select-none mt-3 text-sm leading-relaxed text-[#e9e1d6]/85 drop-shadow-[0_1px_14px_rgba(0,0,0,0.95)] sm:text-base">
                  {match.teaser}
                </p>

                <button
                  type="button"
                  onClick={begin}
                  disabled={transitioning}
                  className="mt-6 flex h-[2.6rem] w-full items-center justify-center rounded-full border border-amber-400/50 bg-gradient-to-b from-amber-200/90 to-amber-600 px-5 text-sm font-medium tracking-wide text-zinc-950 shadow-[0_14px_42px_rgba(0,0,0,0.62)] transition hover:from-amber-100 hover:to-amber-500 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Begin Experience
                </button>
              </div>
            </motion.article>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

