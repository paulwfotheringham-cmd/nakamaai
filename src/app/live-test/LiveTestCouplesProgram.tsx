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
  onClick,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  image: string;
  button: string;
  onClick?: () => void;
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
              onClick={onClick}
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

function isTrialPlan(): boolean {
  if (typeof window === "undefined") return false;
  const plan = localStorage.getItem("plan");
  return plan === "free" || plan === "couples";
}

export default function LiveTestCouplesProgram({
  onStartDateNight,
  onStartSurprise,
}: {
  onStartDateNight?: () => void;
  onStartSurprise?: () => void;
}) {
  const [userName, setUserName] = useState(DEFAULT_USER_NAME);
  const [showTrialTools, setShowTrialTools] = useState(false);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  useEffect(() => {
    setUserName(readGuidePreferences().userName || DEFAULT_USER_NAME);
    setShowTrialTools(isTrialPlan());
  }, []);

  async function sendPartnerInvite() {
    const email = partnerEmail.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      setInviteStatus("error");
      setInviteMessage("Enter a valid email address.");
      return;
    }

    setInviteStatus("sending");
    setInviteMessage("");

    try {
      const res = await fetch("/api/couples/invite-partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerEmail: email }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
        inviteLink?: string;
      };

      if (!res.ok) {
        setInviteStatus("error");
        setInviteMessage(data.error ?? "Could not send invitation.");
        setInviteLink(data.inviteLink ?? `${window.location.origin}/couples-trial-partner`);
        return;
      }

      setInviteStatus("sent");
      setInviteMessage(data.message ?? "Invitation sent.");
      if (data.inviteLink) setInviteLink(data.inviteLink);
      localStorage.setItem("partnerInviteEmail", email);
    } catch {
      setInviteStatus("error");
      setInviteMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-amber-900/25 bg-gradient-to-b from-zinc-950/95 to-[#061a1a] shadow-[inset_0_0_60px_rgba(0,0,0,0.25)]">
      <header className="shrink-0 border-b border-stone-800/50 px-3 py-2 sm:px-4 sm:py-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-amber-600/85">
              Reignite
            </p>
            <h1 className="mt-0.5 font-serif text-base font-semibold leading-tight text-white sm:text-lg">
              The Couples Program
            </h1>
            <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-stone-400 sm:text-[11px]">
              Hi {userName} — for long-term partners and married couples. Choose how
              you want to reconnect tonight.
            </p>
          </div>

          {showTrialTools ? (
            <div className="flex shrink-0 flex-col items-end gap-2">
              {!showPartnerForm ? (
                <button
                  type="button"
                  onClick={() => setShowPartnerForm(true)}
                  className="whitespace-nowrap rounded-full border border-amber-400/45 bg-gradient-to-b from-amber-200/90 to-amber-600 px-3 py-1.5 text-[10px] font-bold text-zinc-950 shadow-sm transition hover:from-amber-100 hover:to-amber-500 sm:px-4 sm:text-xs"
                >
                  Add your partner
                </button>
              ) : (
                <div className="flex w-full max-w-[min(100%,22rem)] flex-col items-stretch gap-1.5 sm:flex-row sm:items-center sm:justify-end">
                  <input
                    type="email"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="h-8 min-w-0 flex-1 rounded-full border border-stone-700/80 bg-black/50 px-3 text-[11px] text-white outline-none placeholder:text-stone-500 focus:border-amber-500/40 sm:h-9 sm:text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => void sendPartnerInvite()}
                    disabled={inviteStatus === "sending"}
                    className="h-8 shrink-0 rounded-full border border-amber-400/45 bg-black/60 px-3 text-[10px] font-bold text-amber-100 transition hover:bg-amber-950/40 disabled:opacity-60 sm:h-9 sm:px-4 sm:text-xs"
                  >
                    {inviteStatus === "sending" ? "Sending…" : "Submit"}
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {showTrialTools && (inviteMessage || inviteLink) ? (
          <p
            className={`mt-2 text-[10px] leading-snug sm:text-[11px] ${
              inviteStatus === "error"
                ? "text-rose-300/90"
                : inviteStatus === "sent"
                  ? "text-amber-200/85"
                  : "text-stone-400"
            }`}
          >
            {inviteMessage}
            {inviteLink && inviteStatus === "error" ? (
              <>
                {" "}
                <a href={inviteLink} className="underline text-amber-200/90">
                  Share invite link
                </a>
              </>
            ) : null}
          </p>
        ) : null}
      </header>

      <div className="grid min-h-0 flex-1 auto-rows-[minmax(0,1fr)] grid-cols-1 items-stretch gap-2 overflow-y-auto p-2 sm:grid-cols-2 sm:overflow-hidden sm:gap-3 sm:p-3">
        {COUPLES_TILES.map((tile) => (
          <CouplesTile
            key={tile.id}
            {...tile}
            onClick={() => {
              if (tile.id === "date-night") onStartDateNight?.();
              if (tile.id === "surprise") onStartSurprise?.();
            }}
          />
        ))}
      </div>
    </div>
  );
}
