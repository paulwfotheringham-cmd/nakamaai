"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { readAccountUsername } from "@/lib/account-username";
import { DEFAULT_USER_NAME, readGuidePreferences } from "@/lib/guides/preferences";
import { DATE_NIGHT_SCENARIOS, type DateNightScenario } from "./date-night-scenarios";

// ── Constants ──────────────────────────────────────────────────────
const CURATED_COUNT = 12;
const SIM_AUDIO_DURATION = 420; // 7-minute simulation

const SIM_VOICES = ["Cameron", "Sophia", "Ava", "Donny", "Will"];
const SIM_MOODS  = ["Romantic", "Playful", "Intense", "Relaxed"];
const SIM_TONES  = ["Tender", "Flirty", "Adventurous"];
const SIM_STYLES = ["Story-led", "Audio-led", "Mixed"];

const GEN_STEPS = [
  "Voice configured",
  "Mood set",
  "Scenario confirmed",
  "Generating chapters",
  "Generating dialogue",
  "Preparing narration",
  "Building opening scene",
];

const PARTNER_WAIT_MSGS = [
  "Preparing your experience…",
  "Selecting narrator…",
  "Building your story…",
  "Generating opening scene…",
  "Almost ready…",
];

// ── Types ──────────────────────────────────────────────────────────
type SimStep =
  | "invited"
  | "declined"
  | "accepted"
  | "setup"
  | "generating"
  | "adventure_ready";

// ── Utilities ──────────────────────────────────────────────────────
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

function fmt(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ── Main component ─────────────────────────────────────────────────
export default function SurpriseModePage({ onBack }: { onBack?: () => void }) {
  const username = useMemo(
    () => readAccountUsername() || readGuidePreferences().userName?.trim() || DEFAULT_USER_NAME,
    [],
  );

  // Selection
  const [curated, setCurated]     = useState<DateNightScenario[]>(() => getCurated());
  const [selected, setSelected]   = useState<DateNightScenario | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Invite form
  const [partnerUsername, setPartnerUsername] = useState("");
  const [submitting, setSubmitting]           = useState(false);
  const [inviteError, setInviteError]         = useState("");

  // Simulation state
  const [inviteSent, setInviteSent] = useState(false);
  const [sentTo, setSentTo]         = useState("");
  const [simStep, setSimStep]       = useState<SimStep>("invited");

  // Setup form
  const [simVoice, setSimVoice]         = useState("");
  const [simMood, setSimMood]           = useState("");
  const [simTone, setSimTone]           = useState("");
  const [simStyle, setSimStyle]         = useState("");
  const [simSetupError, setSimSetupError] = useState("");

  // Generation progress
  const [genIdx, setGenIdx] = useState(0);

  // Audio player
  const [audioPlaying, setAudioPlaying]   = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Partner wait message cycling
  const [partnerMsgIdx, setPartnerMsgIdx] = useState(0);

  // ── Effects ──────────────────────────────────────────────────────
  useEffect(() => {
    if (simStep !== "setup" && simStep !== "generating") return;
    const id = setInterval(
      () => setPartnerMsgIdx((i) => (i + 1) % PARTNER_WAIT_MSGS.length),
      2200,
    );
    return () => clearInterval(id);
  }, [simStep]);

  useEffect(() => {
    if (!audioPlaying || simStep !== "adventure_ready") return;
    const id = setInterval(() => {
      setAudioProgress((p) => {
        if (p >= SIM_AUDIO_DURATION) { setAudioPlaying(false); return SIM_AUDIO_DURATION; }
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [audioPlaying, simStep]);

  // ── Handlers ─────────────────────────────────────────────────────
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
    if (!partner) { setInviteError("Enter your partner's username."); return; }
    setInviteError("");
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSentTo(partner);
    setSimStep("invited");
    setInviteSent(true);
    setShowInvite(false);
    setSubmitting(false);
  }

  function handlePartnerAccept() {
    setSimStep("accepted");
    setTimeout(() => setSimStep("setup"), 1200);
  }

  function handlePartnerDecline() {
    setSimStep("declined");
  }

  function handleGenerate() {
    if (!simVoice || !simMood || !simTone || !simStyle) {
      setSimSetupError("Complete all options to generate.");
      return;
    }
    setSimSetupError("");
    setSimStep("generating");
    setGenIdx(0);
    GEN_STEPS.forEach((_, i) => {
      setTimeout(() => setGenIdx(i + 1), (i + 1) * 560);
    });
    setTimeout(() => {
      setAudioProgress(0);
      setAudioPlaying(false);
      setSimStep("adventure_ready");
    }, GEN_STEPS.length * 560 + 700);
  }

  function resetFlow() {
    setInviteSent(false);
    setSelected(null);
    setPartnerUsername("");
    setSimVoice(""); setSimMood(""); setSimTone(""); setSimStyle("");
    setGenIdx(0); setAudioProgress(0); setAudioPlaying(false);
  }

  // ── Derived ──────────────────────────────────────────────────────
  const pct       = Math.min(100, (audioProgress / SIM_AUDIO_DURATION) * 100);
  const remaining = Math.max(0, SIM_AUDIO_DURATION - audioProgress);

  // ── Render helpers ────────────────────────────────────────────────
  function renderLeftPanel() {
    switch (simStep) {
      case "invited":
        return (
          <div className="surp-sim-state">
            <div className="surp-sim-pulse-ring" />
            <p className="surp-sim-state-eyebrow">Invitation sent</p>
            <h3 className="surp-sim-state-title">{selected?.title}</h3>
            <p className="surp-sim-state-meta">Waiting for @{sentTo} to respond…</p>
          </div>
        );

      case "declined":
        return (
          <div className="surp-sim-state">
            <p className="surp-sim-state-eyebrow surp-sim-declined-label">Declined</p>
            <p className="surp-sim-state-meta">@{sentTo} declined this adventure.</p>
            <button type="button" className="surp-sim-ghost-btn mt-4" onClick={resetFlow}>
              Choose a different adventure
            </button>
          </div>
        );

      case "accepted":
        return (
          <div className="surp-sim-state">
            <div className="surp-sim-check-ring">✓</div>
            <p className="surp-sim-state-eyebrow">Partner accepted</p>
            <p className="surp-sim-state-meta">Moving to adventure setup…</p>
          </div>
        );

      case "setup":
        return (
          <div className="surp-sim-setup">
            <p className="surp-sim-setup-eyebrow">Configure tonight&apos;s adventure</p>
            <h3 className="surp-sim-setup-title">{selected?.title}</h3>

            <div className="surp-sim-field">
              <p className="surp-sim-field-label">Narrator voice</p>
              <div className="surp-sim-chips">
                {SIM_VOICES.map((v) => (
                  <button key={v} type="button" className={`surp-sim-chip${simVoice === v ? " active" : ""}`} onClick={() => setSimVoice(v)}>{v}</button>
                ))}
              </div>
            </div>

            <div className="surp-sim-field">
              <p className="surp-sim-field-label">Mood</p>
              <div className="surp-sim-chips">
                {SIM_MOODS.map((m) => (
                  <button key={m} type="button" className={`surp-sim-chip${simMood === m ? " active" : ""}`} onClick={() => setSimMood(m)}>{m}</button>
                ))}
              </div>
            </div>

            <div className="surp-sim-field">
              <p className="surp-sim-field-label">Tone</p>
              <div className="surp-sim-chips">
                {SIM_TONES.map((t) => (
                  <button key={t} type="button" className={`surp-sim-chip${simTone === t ? " active" : ""}`} onClick={() => setSimTone(t)}>{t}</button>
                ))}
              </div>
            </div>

            <div className="surp-sim-field">
              <p className="surp-sim-field-label">Adventure style</p>
              <div className="surp-sim-chips">
                {SIM_STYLES.map((s) => (
                  <button key={s} type="button" className={`surp-sim-chip${simStyle === s ? " active" : ""}`} onClick={() => setSimStyle(s)}>{s}</button>
                ))}
              </div>
            </div>

            {simSetupError && <p className="surp-sim-error">{simSetupError}</p>}

            <button type="button" className="surp-sim-generate-btn" onClick={handleGenerate}>
              Generate Adventure
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden>
                <path d="M3 8h10M9 4.5 13 8l-4 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        );

      case "generating":
        return (
          <div className="surp-sim-state">
            <p className="surp-sim-state-eyebrow">Generating your adventure…</p>
            <ul className="surp-sim-gen-list">
              {GEN_STEPS.map((step, i) => (
                <li key={step} className={`surp-sim-gen-item${i < genIdx ? " done" : i === genIdx ? " active" : ""}`}>
                  <span className="surp-sim-gen-icon">{i < genIdx ? "✓" : "·"}</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        );

      case "adventure_ready":
        return (
          <div className="surp-sim-player">
            <div className="surp-sim-player-hero">
              <img src={selected?.image ?? ""} alt="" className="surp-sim-player-img" />
              <div className="surp-sim-player-gradient" aria-hidden />
            </div>
            <div className="surp-sim-player-body">
              <p className="surp-sim-player-eyebrow">Now Playing · Host</p>
              <h3 className="surp-sim-player-title">{selected?.title}</h3>
              <p className="surp-sim-player-meta">{simMood} · {simTone} · {simStyle}</p>
              <div className="surp-sim-prog-wrap">
                <div className="surp-sim-prog-bar">
                  <div className="surp-sim-prog-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="surp-sim-prog-times">
                  <span>{fmt(audioProgress)}</span>
                  <span>−{fmt(remaining)}</span>
                </div>
              </div>
              <div className="surp-sim-ctrls">
                <button type="button" className="surp-sim-ctrl" title="Replay 15s" onClick={() => setAudioProgress((p) => Math.max(0, p - 15))}>
                  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
                    <path d="M3 10a7 7 0 1 0 1.7-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M3 5.5V10h4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    <text x="6.5" y="13" fontSize="4.5" fill="currentColor" fontFamily="system-ui">15</text>
                  </svg>
                </button>
                <button type="button" className="surp-sim-ctrl-play" onClick={() => setAudioPlaying((p) => !p)}>
                  {audioPlaying ? (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                      <rect x="4" y="3" width="4" height="14" rx="1" />
                      <rect x="12" y="3" width="4" height="14" rx="1" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                      <polygon points="5,2 17,10 5,18" />
                    </svg>
                  )}
                </button>
                <button type="button" className="surp-sim-ctrl surp-sim-ctrl-end" title="End session" onClick={resetFlow}>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                    <rect x="3" y="3" width="14" height="14" rx="2" />
                  </svg>
                </button>
              </div>
              <p className="surp-sim-host-tag">You are the host · Playback synced</p>
            </div>
          </div>
        );
    }
  }

  function renderRightPanel() {
    switch (simStep) {
      case "invited":
        return (
          <div className="surp-sim-state">
            <p className="surp-sim-notif-app">Nakama Nights</p>
            <div className="surp-sim-notif-card">
              <p className="surp-sim-notif-kicker">Surprise Adventure</p>
              <p className="surp-sim-notif-msg">
                <strong className="text-white/80">@{username}</strong> wants to share a secret adventure with you tonight.
              </p>
              <p className="surp-sim-notif-hint">The scenario is hidden until you accept.</p>
              <div className="surp-sim-notif-actions">
                <button type="button" className="surp-sim-notif-accept" onClick={handlePartnerAccept}>Accept</button>
                <button type="button" className="surp-sim-notif-decline" onClick={handlePartnerDecline}>Decline</button>
              </div>
            </div>
          </div>
        );

      case "declined":
        return (
          <div className="surp-sim-state">
            <p className="surp-sim-state-eyebrow surp-sim-declined-label">Invitation declined</p>
            <p className="surp-sim-state-meta">You chose not to join tonight.</p>
          </div>
        );

      case "accepted":
        return (
          <div className="surp-sim-state">
            <div className="surp-sim-check-ring">✓</div>
            <p className="surp-sim-state-eyebrow">Accepted</p>
            <p className="surp-sim-state-meta">Waiting for host to configure…</p>
          </div>
        );

      case "setup":
        return (
          <div className="surp-sim-partner-wait">
            <div className="surp-sim-pulse-ring" />
            <p className="surp-sim-state-eyebrow">Your partner is preparing tonight&apos;s adventure.</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={partnerMsgIdx}
                className="surp-sim-partner-msg"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.28 }}
              >
                {PARTNER_WAIT_MSGS[partnerMsgIdx]}
              </motion.p>
            </AnimatePresence>
            <div className="surp-sim-preview">
              <p className="surp-sim-preview-row">Scenario: <span>{selected?.title}</span></p>
              {simVoice && <p className="surp-sim-preview-row">Voice: <span>{simVoice}</span></p>}
              {simMood  && <p className="surp-sim-preview-row">Mood: <span>{simMood}</span></p>}
              {simTone  && <p className="surp-sim-preview-row">Tone: <span>{simTone}</span></p>}
            </div>
          </div>
        );

      case "generating":
        return (
          <div className="surp-sim-partner-wait">
            <div className="surp-sim-pulse-ring" />
            <p className="surp-sim-state-eyebrow">Your partner is preparing something special…</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={genIdx}
                className="surp-sim-partner-msg"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                {GEN_STEPS[Math.min(genIdx, GEN_STEPS.length - 1)]}…
              </motion.p>
            </AnimatePresence>
          </div>
        );

      case "adventure_ready":
        return (
          <div className="surp-sim-player">
            <div className="surp-sim-player-hero">
              <img src={selected?.image ?? ""} alt="" className="surp-sim-player-img" />
              <div className="surp-sim-player-gradient" aria-hidden />
            </div>
            <div className="surp-sim-player-body">
              <p className="surp-sim-player-eyebrow">Listening</p>
              <h3 className="surp-sim-player-title">{selected?.title}</h3>
              <p className="surp-sim-player-meta">Adventure by @{username}</p>
              <div className="surp-sim-prog-wrap">
                <div className="surp-sim-prog-bar">
                  <div className="surp-sim-prog-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="surp-sim-prog-times">
                  <span>{fmt(audioProgress)}</span>
                  <span>−{fmt(remaining)}</span>
                </div>
              </div>
              <p className="surp-sim-listener-tag">Listening with @{username} · Playback controlled by host</p>
            </div>
          </div>
        );
    }
  }

  // ── Main render ───────────────────────────────────────────────────
  return (
    <div className="surp-page">

      {/* ── Header ── */}
      <header className="surp-header">
        <div className="min-w-0">
          <p className="surp-eyebrow">Surprise Mode</p>
          <h1 className="surp-headline">
            {inviteSent ? "Shared Adventure — Live Simulation" : "Curate their evening."}
          </h1>
          {!inviteSent && (
            <p className="surp-subline">
              Choose an adventure to gift your partner — they&apos;ll discover it when they join.
            </p>
          )}
        </div>
        {onBack ? (
          <button type="button" className="surp-back-btn" onClick={onBack}>← Back</button>
        ) : null}
      </header>

      {/* ── Split-screen simulation ── */}
      {inviteSent ? (
        <div className="surp-sim">
          {/* Step indicator */}
          <div className="surp-sim-steps-bar">
            {(["invited","accepted","setup","generating","adventure_ready"] as SimStep[]).map((step, i, arr) => (
              <div key={step} className="surp-sim-step-item">
                <div className={`surp-sim-step-dot${simStep === step ? " active" : (arr.indexOf(simStep) > i ? " done" : "")}`} />
                <span className="surp-sim-step-label">
                  {step === "invited" ? "Invite" : step === "accepted" ? "Accept" : step === "setup" ? "Setup" : step === "generating" ? "Generate" : "Adventure"}
                </span>
                {i < arr.length - 1 && <div className={`surp-sim-step-line${arr.indexOf(simStep) > i ? " done" : ""}`} />}
              </div>
            ))}
          </div>

          {/* Panels */}
          <div className="surp-sim-cols">
            <div className="surp-sim-panel surp-sim-panel-left">
              <div className="surp-sim-panel-hdr">
                <span className="surp-sim-you-badge">YOU</span>
                <span className="surp-sim-handle">@{username}</span>
              </div>
              <div className="surp-sim-panel-body">
                {renderLeftPanel()}
              </div>
            </div>
            <div className="surp-sim-panel surp-sim-panel-right">
              <div className="surp-sim-panel-hdr">
                <span className="surp-sim-partner-badge">PARTNER</span>
                <span className="surp-sim-handle">@{sentTo}</span>
              </div>
              <div className="surp-sim-panel-body">
                {renderRightPanel()}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ── Toolbar ── */}
          <div className="surp-toolbar">
            <span className="surp-toolbar-label">
              {selected ? `Selected: ${selected.title}` : `${CURATED_COUNT} curated for you`}
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

          {/* ── Footer ── */}
          <footer className="surp-footer">
            <button
              type="button"
              className="surp-create-btn"
              disabled={!selected}
              onClick={() => setShowInvite(true)}
            >
              {selected ? `Create surprise — "${selected.title}"` : "Select an adventure to continue"}
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
              <h2 id="surp-invite-title" className="surp-modal-title">{selected.title}</h2>
              <p className="surp-modal-body">Who are you gifting this adventure to?</p>

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
                {inviteError ? <p className="surp-modal-error">{inviteError}</p> : null}
                <div className="surp-modal-actions">
                  <button type="button" className="surp-modal-back" onClick={() => setShowInvite(false)}>Back</button>
                  <button type="submit" disabled={submitting} className="surp-modal-submit">
                    {submitting ? "Sending…" : "Send invitation"}
                  </button>
                </div>
              </form>
              <p className="surp-modal-hint">Logged in as @{username}</p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
