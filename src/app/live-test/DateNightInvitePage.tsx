"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_USER_NAME,
  readGuidePreferences,
} from "@/lib/guides/preferences";

type InviteState = "form" | "waiting" | "connected";

export default function DateNightInvitePage({
  onBeginMatching,
}: {
  onBeginMatching: (partnerUsername: string) => void;
}) {
  const currentUsername = useMemo(() => {
    const prefs = readGuidePreferences();
    return (prefs.userName || DEFAULT_USER_NAME).trim() || DEFAULT_USER_NAME;
  }, []);

  const [partnerUsername, setPartnerUsername] = useState("");
  const [state, setState] = useState<InviteState>("form");

  useEffect(() => {
    if (state !== "waiting") return;
    const t = window.setTimeout(() => setState("connected"), 3000);
    return () => window.clearTimeout(t);
  }, [state]);

  const partnerLabel = partnerUsername.trim() || "partner";

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-amber-900/25 bg-gradient-to-b from-zinc-950/95 to-[#061a1a] shadow-[inset_0_0_60px_rgba(0,0,0,0.25)]">
      <header className="shrink-0 border-b border-stone-800/50 px-3 py-2 sm:px-4 sm:py-2.5">
        <p className="type-micro text-amber-600/85">
          Date Night
        </p>
        <h1 className="mt-0.5 font-serif text-base font-semibold leading-tight text-luxury-primary sm:text-lg">
          Invite Your Partner
        </h1>
        <p className="mt-1 text-[10px] leading-snug text-stone-400 sm:text-[11px]">
          Tonight starts with the two of you.
        </p>
      </header>

      <section className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-3 sm:p-4">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_50%_15%,rgba(255,215,120,0.09),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_20%_80%,rgba(90,220,220,0.08),transparent_60%)]" />
        </div>

        <AnimatePresence mode="wait">
          {state === "form" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full max-w-[34rem]"
            >
              <div className="relative overflow-hidden rounded-2xl border border-stone-800/70 bg-black/35 p-4 shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-5">
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(255,215,120,0.12),transparent_50%)]"
                  aria-hidden
                />
                <div className="relative">
                  <p className="type-micro text-amber-400/85">
                    Invite partner
                  </p>
                  <h2 className="mt-1 font-display text-card font-medium leading-snug text-luxury-primary sm:text-[2rem]">
                    Invite Your Partner
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone-300/80">
                    Tonight starts with the two of you.
                  </p>

                  <div className="mt-4 rounded-xl border border-stone-800/80 bg-black/35 px-3 py-2.5">
                    <p className="text-xs font-semibold text-stone-200/90">
                      You are connected as:{" "}
                      <span className="font-bold text-amber-200/95">
                        @{currentUsername}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block type-micro text-stone-400">
                      Partner username
                    </label>
                    <input
                      value={partnerUsername}
                      onChange={(e) => setPartnerUsername(e.target.value)}
                      placeholder="Enter your partner’s username"
                      autoComplete="off"
                      spellCheck={false}
                      className="h-[3.25rem] w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-luxury-primary outline-none placeholder:text-stone-500 focus:border-amber-300/40 focus:ring-2 focus:ring-amber-400/15"
                    />
                    <p className="mt-2 text-xs leading-relaxed text-stone-400">
                      Your email is for login. This username is for internal couples
                      matching.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setState("waiting")}
                    disabled={!partnerUsername.trim()}
                    className="mt-5 flex h-[3.25rem] w-full items-center justify-center rounded-full border border-amber-400/55 bg-gradient-to-b from-amber-200/95 to-amber-600 px-5 text-sm font-bold text-zinc-950 shadow-[0_14px_38px_rgba(0,0,0,0.55)] transition hover:from-amber-100 hover:to-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Send Invite
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}

          {state === "waiting" ? (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full max-w-[34rem]"
            >
              <div className="relative overflow-hidden rounded-2xl border border-amber-600/20 bg-black/35 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                <motion.div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_20%,rgba(255,215,120,0.16),transparent_55%)]"
                  animate={{ opacity: [0.65, 1, 0.65] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                />
                <motion.div
                  className="pointer-events-none absolute inset-0 opacity-50"
                  animate={{ x: ["-35%", "35%"] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
                  aria-hidden
                  style={{
                    background:
                      "linear-gradient(110deg, transparent 0%, rgba(255,215,120,0.14) 38%, transparent 70%)",
                  }}
                />

                <div className="relative">
                  <p className="type-micro text-amber-400/85">
                    Invitation Sent
                  </p>
                  <h2 className="mt-1 font-display text-card font-medium leading-snug text-luxury-primary sm:text-[2rem]">
                    Invitation Sent
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-stone-300/80">
                    Waiting for{" "}
                    <span className="font-semibold text-amber-200/95">
                      @{partnerLabel}
                    </span>{" "}
                    to join tonight’s experience…
                  </p>

                  <div className="mt-5 flex items-center gap-2">
                    <PulsingDots />
                    <span className="type-micro text-stone-400">
                      Connecting
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}

          {state === "connected" ? (
            <motion.div
              key="connected"
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full max-w-[34rem]"
            >
              <div className="relative overflow-hidden rounded-2xl border border-amber-600/20 bg-black/35 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_20%,rgba(255,215,120,0.14),transparent_55%)]"
                  aria-hidden
                />
                <div className="relative">
                  <p className="type-micro text-amber-400/85">
                    Connected
                  </p>
                  <h2 className="mt-1 font-display text-card font-medium leading-snug text-luxury-primary sm:text-[2rem]">
                    You’re connected
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-stone-300/80">
                    You’re both ready for tonight’s fantasy.
                  </p>

                  <div className="mt-5 flex items-center justify-center gap-4">
                    <CircleAvatar label={currentUsername} variant="self" />
                    <ConnectionLine />
                    <CircleAvatar label={partnerLabel} variant="partner" />
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-5 text-xs font-semibold text-stone-300/85">
                    <span className="rounded-full border border-stone-800/80 bg-black/35 px-3 py-1.5">
                      @{currentUsername}
                    </span>
                    <span className="rounded-full border border-stone-800/80 bg-black/35 px-3 py-1.5">
                      @{partnerLabel}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onBeginMatching(partnerLabel)}
                    className="mt-6 flex h-[3.25rem] w-full items-center justify-center rounded-full border border-amber-400/55 bg-gradient-to-b from-amber-200/95 to-amber-600 px-5 text-sm font-bold text-zinc-950 shadow-[0_14px_38px_rgba(0,0,0,0.55)] transition hover:from-amber-100 hover:to-amber-500"
                  >
                    Begin Fantasy Matching
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>
    </div>
  );
}

function PulsingDots() {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-amber-300/90 shadow-[0_0_18px_rgba(255,215,120,0.35)]"
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -2, 0] }}
          transition={{
            duration: 1.15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.14,
          }}
        />
      ))}
    </div>
  );
}

function CircleAvatar({
  label,
  variant,
}: {
  label: string;
  variant: "self" | "partner";
}) {
  const initial = (label.trim()[0] || "?").toUpperCase();
  const bg =
    variant === "self"
      ? "from-amber-200/20 via-black/40 to-teal-300/10"
      : "from-teal-200/15 via-black/40 to-amber-300/10";

  return (
    <motion.div
      className={`relative grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-gradient-to-b ${bg} shadow-[0_18px_55px_rgba(0,0,0,0.55)]`}
      animate={{
        boxShadow: [
          "0 18px 55px rgba(0,0,0,0.55)",
          "0 18px 60px rgba(255,215,120,0.18)",
          "0 18px 55px rgba(0,0,0,0.55)",
        ],
      }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute inset-1 rounded-full bg-black/40 backdrop-blur-sm" />
      <span className="relative font-display text-card font-medium text-amber-100/95">
        {initial}
      </span>
    </motion.div>
  );
}

function ConnectionLine() {
  return (
    <div className="relative h-1 w-16 overflow-hidden rounded-full bg-white/5">
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ x: ["-60%", "60%"] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,215,120,0.95) 40%, transparent 80%)",
          filter: "drop-shadow(0 0 14px rgba(255,215,120,0.35))",
        }}
      />
    </div>
  );
}

