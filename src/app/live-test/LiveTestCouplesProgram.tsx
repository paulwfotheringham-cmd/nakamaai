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
    duration: "30 min",
    badge: "Most popular",
    eyebrow: "Tonight's experience",
  },
  {
    id: "surprise",
    title: "Surprise Mode",
    description:
      "Woman makes the story, surprises partner with a fantasy adventure.",
    image: "/couples/surprise.jpg",
    button: "Start",
    duration: "Curated",
    eyebrow: "Secret fantasy",
  },
] as const;

function CouplesHeroCard({
  eyebrow,
  title,
  description,
  image,
  button,
  duration,
  badge,
  onClick,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  button: string;
  duration: string;
  badge?: string;
  onClick?: () => void;
}) {
  return (
    <article className="couples-hero-card group relative min-h-[min(52vh,28rem)] overflow-hidden rounded-2xl lg:min-h-0 lg:flex-1">
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
      />
      <div className="couples-hero-vignette pointer-events-none absolute inset-0" aria-hidden />
      <div className="couples-hero-glow pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative z-10 flex h-full min-h-[min(52vh,28rem)] flex-col justify-end p-6 sm:p-8 lg:min-h-0 lg:p-10">
        <div className="flex flex-wrap items-center gap-2.5">
          {badge ? (
            <span className="rounded-full border border-amber-400/35 bg-amber-950/50 px-3 py-1 type-label text-amber-200/95 backdrop-blur-sm">
              {badge}
            </span>
          ) : null}
          <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-medium uppercase tracking-micro text-stone-300/90 backdrop-blur-sm">
            {duration}
          </span>
        </div>

        <p className="mt-5 type-label text-amber-400/75">
          {eyebrow}
        </p>
        <h2 className="type-card-title mt-3 max-w-xl">
          {title}
        </h2>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-stone-200/90 sm:text-[17px]">
          {description}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button type="button" onClick={onClick} className="couples-cta-primary">
            {button}
          </button>
          <span className="text-xs font-medium text-stone-400/80">
            Curated for couples · Begin together
          </span>
        </div>
      </div>
    </article>
  );
}

function CouplesSecondaryCard({
  eyebrow,
  title,
  description,
  image,
  button,
  duration,
  onClick,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  button: string;
  duration: string;
  onClick?: () => void;
}) {
  return (
    <article className="couples-secondary-card group relative min-h-[16rem] overflow-hidden rounded-2xl lg:min-h-0 lg:flex-1">
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/92 via-black/45 to-black/20" aria-hidden />
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_50%_100%,rgba(198,164,106,0.12),transparent_65%)]" aria-hidden />

      <div className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-6">
        <span className="text-[10px] font-medium uppercase tracking-micro text-stone-400/80">
          {duration}
        </span>
        <p className="mt-2 type-label text-amber-500/60">
          {eyebrow}
        </p>
        <h2 className="mt-2 type-card-title leading-tight text-luxury-primary sm:text-2xl">
          {title}
        </h2>
        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-stone-300/85">
          {description}
        </p>
        <div className="mt-5">
          <button type="button" onClick={onClick} className="couples-cta-secondary">
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

  const [hero, secondary] = COUPLES_TILES;

  return (
    <div className="couples-experience-panel animate-panel-in relative flex h-full min-h-0 flex-col overflow-hidden">
      <div className="couples-atmosphere pointer-events-none absolute inset-0" aria-hidden />

      <header className="relative z-10 shrink-0 px-6 pb-5 pt-7 sm:px-8 sm:pt-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="type-label text-amber-500/60">
              Reignite · Couples
            </p>
            <h1 className="type-hero mt-3">
              Tonight begins here,{" "}
              <span className="text-luxury-primary">
                {userName}
              </span>
            </h1>
            <p className="type-body mt-4 max-w-xl">
              A private space for long-term partners — choose your experience and
              let the evening unfold.
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
          <p className="mt-3 text-[11px] leading-snug text-rose-300/90">
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
          <div className="mt-3">
            <PartnerInviteResult
              inviteLink={inviteLink}
              partnerEmail={invitedPartnerEmail}
              emailSent={inviteEmailSent}
              message={inviteMessage}
              compact
            />
          </div>
        ) : null}
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6 pt-2 sm:flex-row sm:gap-5 sm:overflow-hidden sm:p-8 sm:pt-3">
        <div className="flex min-h-0 flex-[7] flex-col">
          <CouplesHeroCard
            {...hero}
            onClick={() => onStartDateNight?.()}
          />
        </div>
        <div className="flex min-h-0 flex-[3] flex-col">
          <CouplesSecondaryCard
            {...secondary}
            onClick={() => onStartSurprise?.()}
          />
        </div>
      </div>
    </div>
  );
}
