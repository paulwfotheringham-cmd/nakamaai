"use client";

import { useEffect, useState } from "react";
import PartnerInviteResult from "@/components/PartnerInviteResult";
import {
  DEFAULT_USER_NAME,
  readGuidePreferences,
} from "@/lib/guides/preferences";

const REIGNITE_HOW_IT_WORKS_KEY = "nakama_reignite_how_it_works_dismissed";

const COUPLES_EXPERIENCES = [
  {
    id: "date-night",
    variant: "warm" as const,
    tagline: "Shared · Together",
    title: "Date Night",
    description:
      "A guided 30-minute experience designed to bring partners closer through shared storytelling.",
    image: "/couples/date-night-home.jpg",
  },
  {
    id: "surprise",
    variant: "playful" as const,
    tagline: "Playful · Partner-led",
    title: "Surprise Adventure",
    description:
      "Create a personalised adventure for your partner and reveal it one chapter at a time.",
    image: "/couples/surprise-adventure.jpg",
  },
] as const;

function displayFirstName(raw: string): string {
  const trimmed = raw.trim();
  const first = trimmed.split(/\s+/)[0] ?? "";
  if (/^[A-Z][a-z]{1,19}$/.test(first)) return first;
  if (/^[A-Za-z]{2,20}$/.test(first) && !/\d/.test(first)) {
    return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
  }
  return DEFAULT_USER_NAME;
}

function CouplesExperienceCard({
  variant,
  tagline,
  title,
  description,
  image,
  onClick,
}: {
  variant: "warm" | "playful";
  tagline: string;
  title: string;
  description: string;
  image: string;
  onClick?: () => void;
}) {
  return (
    <article
      className={`couples-experience-card couples-experience-card--${variant} group relative min-h-[min(44vh,22rem)] overflow-hidden rounded-2xl lg:min-h-[min(52vh,26rem)] lg:flex-1`}
    >
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
      />
      <div className="couples-card-scrim pointer-events-none absolute inset-0" aria-hidden />
      <div className={`couples-card-accent couples-card-accent--${variant}`} aria-hidden />

      <div className="relative z-10 flex h-full min-h-[min(44vh,22rem)] flex-col justify-end p-6 sm:p-8 lg:min-h-[min(52vh,26rem)] lg:p-9">
        <p className={`couples-card-tagline couples-card-tagline--${variant}`}>{tagline}</p>
        <h2 className={`couples-card-title couples-card-title--${variant}`}>{title}</h2>
        <p className={`couples-card-desc couples-card-desc--${variant}`}>{description}</p>
        <div className="mt-7">
          <button type="button" onClick={onClick} className="couples-cta-primary">
            Start
          </button>
        </div>
      </div>
    </article>
  );
}

function HowItWorksModal({
  dontShowAgain,
  onDontShowAgainChange,
  onClose,
}: {
  dontShowAgain: boolean;
  onDontShowAgainChange: (value: boolean) => void;
  onClose: () => void;
}) {
  return (
    <div className="couples-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="couples-modal"
        role="dialog"
        aria-labelledby="couples-how-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="couples-modal-close" aria-label="Close" onClick={onClose}>
          ×
        </button>
        <p className="couples-modal-eyebrow">Reignite</p>
        <h2 id="couples-how-title" className="couples-modal-title">
          How it works
        </h2>

        <section className="couples-modal-section">
          <h3 className="couples-modal-section-title">Date Night</h3>
          <p className="couples-modal-lead">A shared 30-minute narrated adventure for couples.</p>
          <ul className="couples-modal-list">
            <li>Both partners privately rate a set of story ideas.</li>
            <li>Nakama discovers the best mutual match.</li>
            <li>Choose voices and mood.</li>
            <li>Then begin your shared journey together.</li>
          </ul>
        </section>

        <section className="couples-modal-section">
          <h3 className="couples-modal-section-title couples-modal-section-title--playful">
            Surprise Adventure
          </h3>
          <p className="couples-modal-lead">One partner creates the experience.</p>
          <ul className="couples-modal-list">
            <li>Choose the scenario, mood and story direction.</li>
            <li>The other partner discovers the adventure as it unfolds.</li>
            <li>A more personalised and playful experience.</li>
          </ul>
        </section>

        <label className="couples-modal-dismiss">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => onDontShowAgainChange(e.target.checked)}
          />
          <span>Don&apos;t show again</span>
        </label>
      </div>
    </div>
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
  const [firstName, setFirstName] = useState(DEFAULT_USER_NAME);
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
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [dontShowHowItWorks, setDontShowHowItWorks] = useState(false);

  useEffect(() => {
    const prefs = readGuidePreferences();
    setFirstName(displayFirstName(prefs.userName || DEFAULT_USER_NAME));
    setShowTrialTools(isTrialPlan());
  }, []);

  function openHowItWorks() {
    setShowHowItWorks(true);
  }

  function closeHowItWorks() {
    if (dontShowHowItWorks && typeof window !== "undefined") {
      localStorage.setItem(REIGNITE_HOW_IT_WORKS_KEY, "1");
    }
    setShowHowItWorks(false);
  }

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

  function handleStart(id: (typeof COUPLES_EXPERIENCES)[number]["id"]) {
    if (id === "date-night") onStartDateNight?.();
    if (id === "surprise") onStartSurprise?.();
  }

  return (
    <div className="couples-experience-panel animate-panel-in relative flex h-full min-h-0 flex-col overflow-hidden">
      <div className="couples-atmosphere pointer-events-none absolute inset-0" aria-hidden />

      <header className="relative z-10 shrink-0 px-6 pb-4 pt-7 sm:px-10 sm:pt-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="type-label text-amber-500/60">Reignite · Couples</p>
            <h1 className="couples-greeting type-hero mt-3">
              Good evening,{" "}
              <span className="text-luxury-primary">{firstName}</span>
            </h1>
            <p className="couples-header-subtitle type-body mt-3">
              A private space for long-term partners — choose your experience and let the evening unfold.
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <button type="button" className="couples-how-link" onClick={openHowItWorks}>
              How it works
            </button>

            {showTrialTools ? (
              <>
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
              </>
            ) : null}
          </div>
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

      <div className="couples-cards-grid relative z-10 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6 pt-1 sm:gap-5 sm:overflow-hidden sm:p-8 sm:pt-2 lg:flex-row">
        {COUPLES_EXPERIENCES.map((experience) => (
          <CouplesExperienceCard
            key={experience.id}
            variant={experience.variant}
            tagline={experience.tagline}
            title={experience.title}
            description={experience.description}
            image={experience.image}
            onClick={() => handleStart(experience.id)}
          />
        ))}
      </div>

      {showHowItWorks ? (
        <HowItWorksModal
          dontShowAgain={dontShowHowItWorks}
          onDontShowAgainChange={setDontShowHowItWorks}
          onClose={closeHowItWorks}
        />
      ) : null}
    </div>
  );
}
