"use client";

import { useEffect, useState } from "react";
import PartnerInviteResult from "@/components/PartnerInviteResult";
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
  featured = false,
  className = "",
  onClick,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  image: string;
  button: string;
  featured?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <article className={`group launcher-card ${featured ? "launcher-card-featured" : ""} ${className}`}>
      <img src={image} alt="" className="launcher-card-image" />
      <div
        className={`pointer-events-none absolute inset-0 ${featured ? "launcher-card-overlay-featured" : "launcher-card-overlay"}`}
        aria-hidden
      />
      <div className="launcher-card-glow" aria-hidden />

      <div
        className={`relative z-10 flex h-full min-h-0 flex-col justify-end ${
          featured ? "p-6 sm:p-8" : "p-5 sm:p-6"
        }`}
      >
        {eyebrow ? <p className="launcher-section-label">{eyebrow}</p> : null}
        <h2
          className={`mt-2 font-serif font-semibold leading-tight text-white ${
            featured ? "text-2xl sm:text-3xl md:text-4xl" : "text-xl sm:text-2xl"
          }`}
        >
          {title}
        </h2>
        <p
          className={`mt-3 leading-snug text-stone-300/90 ${
            featured ? "text-sm sm:text-base" : "text-xs sm:text-sm"
          }`}
        >
          {description}
        </p>
        <div className="mt-5 flex justify-start sm:mt-6">
          <button type="button" onClick={onClick} className="btn-primary">
            {button}
          </button>
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
  const [inviteEmailSent, setInviteEmailSent] = useState(false);
  const [invitedPartnerEmail, setInvitedPartnerEmail] = useState("");

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
        emailSent?: boolean;
      };

      const link =
        data.inviteLink ?? `${window.location.origin}/couples-trial-partner`;

      if (!res.ok) {
        setInviteStatus("error");
        setInviteMessage(data.error ?? "Could not send invitation.");
        setInviteLink(link);
        return;
      }

      setInviteStatus("sent");
      setInviteMessage(data.message ?? "Invitation ready for your partner.");
      setInviteLink(link);
      setInviteEmailSent(Boolean(data.emailSent));
      setInvitedPartnerEmail(email);
      localStorage.setItem("partnerInviteEmail", email);
    } catch {
      setInviteStatus("error");
      setInviteMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="launcher-panel animate-panel-in">
      <header className="launcher-panel-header border-b border-white/[0.04]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="launcher-eyebrow">Reignite</p>
            <h1 className="launcher-title text-2xl sm:text-3xl">The Couples Program</h1>
            <p className="launcher-subtitle">
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
                  className="btn-secondary whitespace-nowrap px-4 py-2 text-xs"
                >
                  Add your partner
                </button>
              ) : (
                <div className="flex w-full max-w-[min(100%,22rem)] flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
                  <input
                    type="email"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="launcher-chat-input h-9 min-w-0 flex-1 rounded-full px-4 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => void sendPartnerInvite()}
                    disabled={inviteStatus === "sending"}
                    className="btn-primary h-9 shrink-0 px-4 py-2 text-xs disabled:opacity-60"
                  >
                    {inviteStatus === "sending" ? "Sending…" : "Submit"}
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {showTrialTools && inviteStatus === "error" && inviteMessage ? (
          <p className="mt-2 text-[10px] leading-snug text-rose-300/90 sm:text-[11px]">
            {inviteMessage}
            {inviteLink ? (
              <>
                {" "}
                <a href={inviteLink} className="underline text-amber-200/90">
                  Open invite link
                </a>
              </>
            ) : null}
          </p>
        ) : null}

        {showTrialTools && inviteStatus === "sent" && inviteLink ? (
          <PartnerInviteResult
            inviteLink={inviteLink}
            partnerEmail={invitedPartnerEmail}
            emailSent={inviteEmailSent}
            message={inviteMessage}
            compact
          />
        ) : null}
      </header>

      <div className="grid min-h-0 flex-1 auto-rows-[minmax(12rem,1fr)] grid-cols-1 items-stretch gap-4 overflow-y-auto p-6 sm:grid-cols-3 sm:gap-6 sm:overflow-hidden sm:p-8">
        {COUPLES_TILES.map((tile, index) => (
          <CouplesTile
            key={tile.id}
            {...tile}
            featured={index === 0}
            className={index === 0 ? "sm:col-span-2" : undefined}
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
