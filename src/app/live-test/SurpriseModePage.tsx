"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useMemo, useState } from "react";
import PartnerInviteResult from "@/components/PartnerInviteResult";
import { readAccountEmail, persistAccountEmail } from "@/lib/account-email";
import { readAccountUsername } from "@/lib/account-username";
import { DEFAULT_USER_NAME, readGuidePreferences } from "@/lib/guides/preferences";
import { DATE_NIGHT_SCENARIOS, type DateNightScenario } from "./date-night-scenarios";

const CURATED_COUNT = 6;

function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function getCurated(): DateNightScenario[] {
  return shuffle(DATE_NIGHT_SCENARIOS).slice(0, CURATED_COUNT);
}

export default function SurpriseModePage({ onBack }: { onBack?: () => void }) {
  const username = useMemo(
    () =>
      readAccountUsername() ||
      readGuidePreferences().userName?.trim() ||
      DEFAULT_USER_NAME,
    [],
  );

  const [curated, setCurated] = useState<DateNightScenario[]>(() => getCurated());
  const [selected, setSelected] = useState<DateNightScenario | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<"idle" | "sent" | "error">("idle");
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const stored = readAccountEmail();
    if (stored) setUserEmail(stored);
    const partner = localStorage.getItem("partnerInviteEmail");
    if (partner) setPartnerEmail(partner);
  }, []);

  function refreshCurated() {
    setRefreshing(true);
    setSelected(null);
    setTimeout(() => {
      setCurated(getCurated());
      setRefreshKey((k) => k + 1);
      setRefreshing(false);
    }, 250);
  }

  async function handleInviteSubmit(e: FormEvent) {
    e.preventDefault();
    const email = userEmail.trim().toLowerCase();
    const partner = partnerEmail.trim().toLowerCase();

    if (!email || !email.includes("@")) {
      setInviteStatus("error");
      setInviteMessage("Enter your email so we can send your surprise summary.");
      return;
    }

    persistAccountEmail(email);
    setSubmitting(true);
    setInviteStatus("idle");
    setInviteMessage("");

    try {
      const res = await fetch("/api/couples/surprise-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: email,
          partnerEmail: partner || undefined,
          scenarioTitle: selected?.title ?? "Surprise Mode",
          username,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
        inviteLink?: string;
        emailSent?: boolean;
        partnerEmailSent?: boolean;
      };

      const link = data.inviteLink ?? `${window.location.origin}/couples-trial-partner`;

      if (!res.ok) {
        setInviteStatus("error");
        setInviteMessage(data.error ?? "Could not send invitations.");
        setInviteLink(link);
        setSubmitting(false);
        return;
      }

      if (partner) localStorage.setItem("partnerInviteEmail", partner);
      setInviteStatus("sent");
      setInviteMessage(data.message ?? "You're all set.");
      setInviteLink(link);
      setEmailSent(Boolean(data.emailSent || data.partnerEmailSent));
      setShowInvite(false);
    } catch {
      setInviteStatus("error");
      setInviteMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="surp-page">

      {/* ── Header ── */}
      <header className="surp-header">
        <div className="min-w-0">
          <p className="surp-eyebrow">Surprise Mode</p>
          <h1 className="surp-headline">Curate their evening.</h1>
          <p className="surp-subline">
            Choose an adventure to gift your partner — they&apos;ll discover it when they join.
          </p>
        </div>
        {onBack ? (
          <button type="button" className="surp-back-btn" onClick={onBack}>
            ← Back
          </button>
        ) : null}
      </header>

      {/* ── Invite success ── */}
      {inviteStatus === "sent" && inviteLink ? (
        <div className="surp-success-wrap">
          <PartnerInviteResult
            inviteLink={inviteLink}
            partnerEmail={partnerEmail || userEmail}
            emailSent={emailSent}
            message={inviteMessage}
          />
        </div>
      ) : (
        <>
          {/* ── Scenario grid ── */}
          <div className="surp-body">
            <AnimatePresence mode="wait">
              {!refreshing && (
                <motion.ul
                  key={refreshKey}
                  className="surp-grid"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  {curated.map((scenario) => {
                    const isSelected = selected?.id === scenario.id;
                    return (
                      <li key={scenario.id}>
                        <button
                          type="button"
                          className={`surp-card group${isSelected ? " surp-card-selected" : ""}`}
                          onClick={() => setSelected(isSelected ? null : scenario)}
                        >
                          <div className="surp-card-img-wrap">
                            <img src={scenario.image} alt="" className="surp-card-img" />
                            <div className="surp-card-img-overlay" aria-hidden />
                            {isSelected && (
                              <div className="surp-card-check" aria-hidden>
                                <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                                  <path
                                    d="M3.5 8.5l3 3 6-7"
                                    stroke="currentColor"
                                    strokeWidth="1.75"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="surp-card-body">
                            <h3 className="surp-card-title">{scenario.title}</h3>
                            <p className="surp-card-teaser">{scenario.teaser}</p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* ── Footer actions ── */}
          <footer className="surp-footer">
            <button type="button" className="surp-refresh-btn" onClick={refreshCurated}>
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden>
                <path
                  d="M2.5 8A5.5 5.5 0 1 0 4 4.5L2.5 3"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
                <path
                  d="M2.5 3v3h3"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Different choices
            </button>

            <button
              type="button"
              className="surp-create-btn"
              disabled={!selected}
              onClick={() => setShowInvite(true)}
            >
              {selected ? `"${selected.title}" — Create Surprise` : "Select an adventure first"}
              {selected && (
                <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden>
                  <path
                    d="M3 8h10M9 4.5 13 8l-4 3.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </footer>
        </>
      )}

      {/* ── Invite modal ── */}
      <AnimatePresence>
        {showInvite && selected ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="surp-modal-backdrop"
            role="dialog"
            aria-modal
            aria-labelledby="surp-invite-title"
            onClick={() => setShowInvite(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="surp-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="surp-modal-eyebrow">Your surprise</p>
              <h2 id="surp-invite-title" className="surp-modal-title">
                {selected.title}
              </h2>
              <p className="surp-modal-body">
                We&apos;ll create this adventure and send the invite to your partner.
              </p>

              <form onSubmit={(e) => void handleInviteSubmit(e)} className="surp-modal-form">
                <label className="surp-modal-label">
                  <span>Your email</span>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="surp-modal-input"
                  />
                </label>
                <label className="surp-modal-label">
                  <span>
                    Partner&apos;s email{" "}
                    <em className="opacity-60 not-italic">(optional)</em>
                  </span>
                  <input
                    type="email"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    placeholder="partner@example.com"
                    className="surp-modal-input"
                  />
                </label>

                {inviteStatus === "error" && inviteMessage ? (
                  <p className="surp-modal-error">{inviteMessage}</p>
                ) : null}

                <div className="surp-modal-actions">
                  <button
                    type="button"
                    className="surp-modal-back"
                    onClick={() => setShowInvite(false)}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="surp-modal-submit"
                  >
                    {submitting ? "Sending…" : "Send invitation"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
