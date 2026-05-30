"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { DateNightScenario } from "./date-night-scenarios";

type Beat = { kind: "line" | "prompt"; text: string; holdMs: number };

function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export default function DateNightExperiencePage({
  match,
}: {
  match: DateNightScenario;
}) {
  // Real ambience audio (looped, subtle). Frontend-only mock.
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [durationSec, setDurationSec] = useState(95);

  const beats: Beat[] = useMemo(
    () => [
      { kind: "line", text: "The night holds its breath.", holdMs: 4200 },
      { kind: "line", text: "And then… it gives you permission.", holdMs: 4200 },
      { kind: "prompt", text: "Move closer.", holdMs: 3000 },
      { kind: "line", text: "You feel the story settle around you like velvet.", holdMs: 4500 },
      { kind: "line", text: "Don’t rush this. Let it build.", holdMs: 4200 },
      { kind: "prompt", text: "Don’t look away yet.", holdMs: 3000 },
      {
        kind: "line",
        text: "Somewhere in the dark, a presence finally steps from the shadows.",
        holdMs: 5200,
      },
      { kind: "line", text: "And it chooses you.", holdMs: 4200 },
      { kind: "prompt", text: "Let the silence stretch.", holdMs: 3200 },
      { kind: "line", text: "The rest of tonight belongs only to you.", holdMs: 5200 },
    ],
    [],
  );

  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [beatIndex, setBeatIndex] = useState(0);

  const beatTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (beatTimerRef.current) window.clearTimeout(beatTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const audio = audioRef.current;
    if (!audio) return;

    const tick = () => {
      setElapsed(audio.currentTime || 0);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    if (beatIndex >= beats.length) return;

    const beat = beats[beatIndex];
    beatTimerRef.current = window.setTimeout(() => {
      setBeatIndex((i) => i + 1);
    }, beat.holdMs);

    return () => {
      if (beatTimerRef.current) window.clearTimeout(beatTimerRef.current);
      beatTimerRef.current = null;
    };
  }, [playing, beatIndex, beats]);

  useEffect(() => {
    if (!playing) return;
    if (elapsed >= durationSec) {
      setPlaying(false);
    }
  }, [elapsed, durationSec, playing]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!playing) {
      try {
        audio.volume = 0.35;
        audio.loop = true;
        await audio.play();
        setPlaying(true);
        if (beatIndex >= beats.length) setBeatIndex(0);
      } catch {
        // If autoplay is blocked for any reason, keep UI idle.
        setPlaying(false);
      }
      return;
    }

    audio.pause();
    setPlaying(false);
  };

  const progress = elapsed / durationSec;
  const activeBeat = beatIndex < beats.length ? beats[beatIndex] : null;
  const nearEnd = elapsed > durationSec * 0.82;

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-amber-900/25 bg-black shadow-[inset_0_0_60px_rgba(0,0,0,0.35)]">
      <audio
        ref={audioRef}
        src="/audio/intro.mp3"
        preload="auto"
        onLoadedMetadata={(e) => {
          const d = (e.currentTarget.duration || 0) as number;
          if (Number.isFinite(d) && d > 1) setDurationSec(d);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {/* Fullscreen cinematic background */}
      <div className="absolute inset-0">
        <img
          src={match.image}
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.42) 45%, rgba(0,0,0,0.78) 100%)",
          }}
        />
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: nearEnd ? 0.92 : 0.72 }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 22%, rgba(255,215,120,0.14), transparent 60%)",
          }}
        />

        {/* Moving fog */}
        <motion.div
          className="absolute inset-0 opacity-45"
          animate={{ x: ["-10%", "8%", "-7%"], opacity: [0.25, 0.55, 0.3] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(ellipse 70% 45% at 25% 75%, rgba(255,255,255,0.10), transparent 62%), radial-gradient(ellipse 60% 40% at 75% 55%, rgba(255,255,255,0.08), transparent 64%)",
            filter: "blur(12px)",
          }}
        />

        {/* Floating particles */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {Array.from({ length: 22 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-amber-200/80"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 19) % 100}%`,
                width: 2 + ((i * 7) % 3),
                height: 2 + ((i * 7) % 3),
                opacity: 0.12 + ((i % 7) * 0.02),
                filter: "drop-shadow(0 0 12px rgba(255,215,120,0.2))",
              }}
              animate={{ y: [0, -22, 0], opacity: [0.12, 0.26, 0.12] }}
              transition={{
                duration: 5.5 + (i % 6),
                repeat: Infinity,
                ease: "easeInOut",
                delay: (i % 9) * 0.12,
              }}
            />
          ))}
        </div>
      </div>

      {/* Center: minimal player + cinematic beats */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[44rem]">
          <motion.div
            className="overflow-hidden rounded-2xl border border-stone-800/70 bg-black/30 p-4 shadow-[0_22px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-5"
            animate={{
              boxShadow: playing
                ? "0 22px 85px rgba(255,215,120,0.13)"
                : "0 22px 80px rgba(0,0,0,0.6)",
            }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
          >
            <p className="select-none type-label text-amber-300/80 drop-shadow-[0_1px_12px_rgba(0,0,0,0.9)]">
              Date Night Experience
            </p>
            <h1 className="select-none mt-2 type-card-title leading-snug text-[#f7f2e8] drop-shadow-[0_2px_18px_rgba(0,0,0,0.95)] sm:text-[2.35rem]">
              {match.title}
            </h1>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => void togglePlay()}
                className="grid h-11 w-11 place-items-center rounded-full border border-amber-400/45 bg-gradient-to-b from-amber-200/75 to-amber-700 text-zinc-950 shadow-[0_14px_42px_rgba(0,0,0,0.62)] transition hover:from-amber-100 hover:to-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/25"
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? (
                  <span className="block h-4 w-4 rounded-sm bg-zinc-950/90" />
                ) : (
                  <span
                    className="ml-0.5 block h-0 w-0 border-y-[8px] border-l-[12px] border-y-transparent border-l-zinc-950/90"
                    aria-hidden
                  />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-stone-300/80">
                  <span className="select-none">{formatTime(elapsed)}</span>
                  <span className="select-none">{formatTime(durationSec)}</span>
                </div>

                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.round(progress * 100)}%`,
                      background:
                        "linear-gradient(90deg, rgba(255,215,120,0.95) 0%, rgba(255,215,120,0.55) 55%, rgba(255,215,120,0.25) 100%)",
                      filter: "drop-shadow(0 0 14px rgba(255,215,120,0.25))",
                    }}
                    animate={{ opacity: playing ? 1 : 0.75 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-7 min-h-[4.5rem]">
              <AnimatePresence mode="wait">
                {playing && activeBeat ? (
                  <motion.div
                    key={`${beatIndex}-${activeBeat.text}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 1.1, ease: "easeInOut" }}
                    className="text-center"
                  >
                    <p
                      className={`select-none font-serif text-xl leading-snug drop-shadow-[0_2px_18px_rgba(0,0,0,0.95)] sm:text-2xl ${
                        activeBeat.kind === "prompt"
                          ? "text-amber-200/90"
                          : "text-[#f2eadc]/90"
                      }`}
                    >
                      {activeBeat.text}
                    </p>
                  </motion.div>
                ) : (
                  <motion.p
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="select-none text-center text-sm leading-relaxed text-stone-300/70"
                  >
                    Press play when you’re ready.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.p
              className="select-none mt-5 text-center type-label text-stone-400/80"
              animate={{ opacity: playing ? 0.9 : 0.65 }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
            >
              Private. Cinematic. Just the two of you.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

