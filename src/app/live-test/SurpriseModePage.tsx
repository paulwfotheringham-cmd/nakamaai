"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useMemo, useState } from "react";
import { readAccountUsername } from "@/lib/account-username";
import { DEFAULT_USER_NAME, readGuidePreferences } from "@/lib/guides/preferences";
import { DATE_NIGHT_SCENARIOS, type DateNightScenario } from "./date-night-scenarios";

const CURATED_COUNT = 12;

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

  const [partnerUsername, setPartnerUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [sentTo, setSentTo] = useState("");

  function refreshCurated() {
    setRefreshing(true);
    setSelected(null);
    setTimeout(() => {
      setCurated(getCurated());
      setRefreshKey((k) => k + 1);
      setRefreshing(false);
    }, 240);
  }

  async function handleInviteSubmit(e: FormEvent) {
    e.preventDefault();
    const partner = partnerUsername.replace(/^@/, "").trim();
    if (!partner) {
      setInviteError("Enter your partner's username.");
      return;
    }
    setInviteError("");
    setSubmitting(true);
    // Simulate a brief network call then show success
    await new Promise((r) => setTimeout(r, 700));
    setSentTo(partner);
    setInviteSent(true);
    setShowInvite(false);
    setSubmitting(false);
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

      {/* ── Invite sent success ── */}
      {inviteSent ? (
        <div className="surp-sent-wrap">
          <div className="surp-sent-card">
            <div className="surp-sent-check">
              <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                <path d="M4 10.5l4.5 4.5 8-9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="surp-sent-eyebrow">Invitation sent</p>
            <h2 className="surp-sent-title">{selected?.title}</h2>
            <p className="surp-sent-body">
              @{sentTo} has been invited to join your adventure. They&apos;ll step into the story when they connect.
            </p>
            <button
              type="button"
              className="surp-sent-restart"
              onClick={() => {
                setInviteSent(false);
                setSentTo("");
                setSelected(null);
                setPartnerUsername("");
              }}
            >
              Plan another evening
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ── Toolbar: refresh above grid ── */}
          <div className="surp-toolbar">
            <span className="surp-toolbar-label">
              {selected
                ? `Selected: ${selected.title}`
                : `${CURATED_COUNT} curated for you`}
            </span>
            <button type="button" className="surp-refresh-btn" onClick={refreshCurated}>
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden>
                <path d="M2.5 8A5.5 5.5 0 1 0 4 4.5L2.5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <path d="M2.5 3v3h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Give me different scenarios
            </button>
          </div>

          {/* ── Scenario grid ── */}
          <div className="surp-body">
            <AnimatePresence mode="wait">
              {!refreshing && (
                <motion.ul
                  key={refreshKey}
                  className="surp-grid"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
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
                                <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
                                  <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
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

          {/* ── Footer: primary CTA only ── */}
          <footer className="surp-footer">
            <button
              type="button"
              className="surp-create-btn"
              disabled={!selected}
              onClick={() => setShowInvite(true)}
            >
              {selected
                ? `Create surprise — "${selected.title}"`
                : "Select an adventure to continue"}
              {selected && (
                <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden>
                  <path d="M3 8h10M9 4.5 13 8l-4 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
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
              <p className="surp-modal-eyebrow">Your surprise for tonight</p>
              <h2 id="surp-invite-title" className="surp-modal-title">
                {selected.title}
              </h2>
              <p className="surp-modal-body">
                Who are you gifting this adventure to?
              </p>

              <form onSubmit={(e) => void handleInviteSubmit(e)} className="surp-modal-form">
                <label className="surp-modal-label">
                  <span>Partner&apos;s username</span>
                  <input
                    type="text"
                    value={partnerUsername}
                    onChange={(e) => setPartnerUsername(e.target.value)}
                    placeholder="@jane"
                    autoComplete="off"
                    spellCheck={false}
                    className="surp-modal-input"
                  />
                </label>

                {inviteError ? (
                  <p className="surp-modal-error">{inviteError}</p>
                ) : null}

                <div className="surp-modal-actions">
                  <button type="button" className="surp-modal-back" onClick={() => setShowInvite(false)}>
                    Back
                  </button>
                  <button type="submit" disabled={submitting} className="surp-modal-submit">
                    {submitting ? "Sending…" : "Send invitation"}
                  </button>
                </div>
              </form>

              <p className="surp-modal-hint">
                Logged in as @{username}
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
