"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DATE_NIGHT_MOODS,
  MOCK_FEMALE_VOICES,
  MOCK_MALE_VOICES,
  PROTOTYPE_PARTNER_USERNAME,
  STORY_DURATION_SEC,
} from "@/lib/date-night-prototype/constants";
import { matchCompatibility } from "@/lib/date-night-prototype/journey";
import { findBestMatch } from "@/lib/date-night-prototype/match";
import { getScenarioImage } from "@/lib/date-night-prototype/scenario-images";
import { freshScenarioSet } from "@/lib/date-night-prototype/scenarios";
import {
  createNewSession,
  dismissTutorial,
  isTutorialDismissed,
  readActiveSession,
  readSharedStories,
  upsertSharedStory,
  writeActiveSession,
} from "@/lib/date-night-prototype/storage";
import type { DateNightMood, DateNightSession, SharedDateNightStory } from "@/lib/date-night-prototype/types";
import { readGuidePreferences, DEFAULT_USER_NAME } from "@/lib/guides/preferences";
import DateNightPlayer from "./DateNightPlayer";
import DateNightRatingPicker, { RatingLegend } from "./DateNightRatingPicker";
import PartnerSimulationPanel from "./PartnerSimulationPanel";
import CouplesGuideConcierge from "../CouplesGuideConcierge";

type DateNightPrototypeFlowProps = {
  onBack: () => void;
  guideRailHidden?: boolean;
  onToggleGuide?: () => void;
};

function StepPanel({
  title,
  description,
  children,
  actionLabel,
  onAction,
  actionDisabled,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
  actionLabel: string;
  onAction: () => void;
  actionDisabled?: boolean;
}) {
  return (
    <section className="dn-step">
      <div className="dn-step-panel">
        <h2 className="dn-step-panel-title">{title}</h2>
        {description ? <p className="dn-step-panel-desc">{description}</p> : null}
        {children}
        <button
          type="button"
          className="dn-btn-gold dn-btn-gold-lg"
          disabled={actionDisabled}
          onClick={onAction}
        >
          {actionLabel}
        </button>
      </div>
    </section>
  );
}

function SharedStoriesModal({
  stories,
  onClose,
  onResume,
}: {
  stories: SharedDateNightStory[];
  onClose: () => void;
  onResume: (story: SharedDateNightStory) => void;
}) {
  return (
    <div className="dn-modal-backdrop" role="presentation" onClick={onClose}>
      <div className="dn-shared-modal" role="dialog" aria-labelledby="dn-shared-title" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="dn-modal-close" aria-label="Close" onClick={onClose}>
          ×
        </button>
        <h2 id="dn-shared-title" className="dn-shared-modal-title">
          Saved Stories
        </h2>
        {stories.length === 0 ? (
          <p className="dn-shared-modal-empty">Saved adventures appear here after your first story.</p>
        ) : (
          <ul className="dn-shared-modal-list">
            {stories.map((story) => (
              <li key={story.id} className="dn-shared-modal-item">
                <div>
                  <p className="dn-shared-modal-name">{story.storyName}</p>
                  <p className="dn-shared-modal-meta">
                    {story.partnerName} · Last played{" "}
                    {new Date(story.dateCreated).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    · {story.progressPercent}% progress
                  </p>
                </div>
                <button type="button" className="dn-btn-gold dn-btn-gold-sm" onClick={() => onResume(story)}>
                  Resume
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function DateNightPrototypeFlow({
  onBack,
  guideRailHidden = true,
  onToggleGuide,
}: DateNightPrototypeFlowProps) {
  const [session, setSession] = useState<DateNightSession | null>(null);
  const [sharedStories, setSharedStories] = useState<SharedDateNightStory[]>([]);
  const [showSharedModal, setShowSharedModal] = useState(false);
  const [creatorUsername, setCreatorUsername] = useState(DEFAULT_USER_NAME);
  const [partnerUsername, setPartnerUsername] = useState(PROTOTYPE_PARTNER_USERNAME);
  const [dontShowTutorialAgain, setDontShowTutorialAgain] = useState(false);
  // Partner simulator state (dev/test only — simulates the invited partner's experience)
  const [simPartnerState, setSimPartnerState] = useState<"invitation" | "ranking">("invitation");
  const [simPartnerRatings, setSimPartnerRatings] = useState<Record<string, number>>({});

  const persist = useCallback((next: DateNightSession | null) => {
    setSession(next);
    writeActiveSession(next);
  }, []);

  const updateSession = useCallback((patch: Partial<DateNightSession>) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      writeActiveSession(next);
      return next;
    });
  }, []);

  useEffect(() => {
    setCreatorUsername(readGuidePreferences().userName || DEFAULT_USER_NAME);

    const stored = readActiveSession();

    // A completed player session must never auto-restore on entry —
    // it belongs in Shared Stories, not as the default landing screen.
    if (stored?.step === "player" && stored.matchedScenario) {
      const existing = readSharedStories();
      const alreadySaved = existing.some((s) => s.id === stored.id);
      if (!alreadySaved) {
        const story: SharedDateNightStory = {
          id: stored.id,
          storyName: stored.friendlyName || stored.matchedScenario.title,
          scenarioTitle: stored.matchedScenario.title,
          partnerName: stored.partnerUsername || PROTOTYPE_PARTNER_USERNAME,
          dateCreated: stored.createdAt,
          progressPercent: Math.round(
            ((STORY_DURATION_SEC - stored.playback.timeRemainingSec) / STORY_DURATION_SEC) * 100,
          ),
          maleVoice: stored.maleVoice,
          femaleVoice: stored.femaleVoice,
          mood: stored.mood,
          sessionSnapshot: stored,
        };
        upsertSharedStory(story);
      }
      writeActiveSession(null);
      setSharedStories(readSharedStories());
      setSession(null);
      return;
    }

    setSharedStories(readSharedStories());
    // Always boot to scenario matching — never resume a stored step on entry.
    // In-progress sessions (connect, waiting, etc.) are discarded; the user
    // starts fresh each visit. Completed stories live in Shared Stories.
    const fresh = createNewSession();
    writeActiveSession(fresh);
    setSession(fresh);
  }, []);

  useEffect(() => {
    if (session?.step !== "match-loading") return;
    const t = setTimeout(() => {
      setSession((prev) => {
        if (!prev || prev.step !== "match-loading") return prev;
        const match = findBestMatch(prev.scenarios, prev.creatorRatings, prev.partnerRatings);
        const next = { ...prev, step: "match-reveal" as const, matchedScenario: match };
        writeActiveSession(next);
        return next;
      });
    }, 2500);
    return () => clearTimeout(t);
  }, [session?.step]);

  useEffect(() => {
    if (session?.step !== "story-generated") return;
    const t = setTimeout(() => {
      updateSession({
        step: "player",
        playback: { playing: false, timeRemainingSec: STORY_DURATION_SEC },
      });
    }, 3000);
    return () => clearTimeout(t);
  }, [session?.step, updateSession]);

  useEffect(() => {
    if (!session?.playback.playing || session.step !== "player") return;
    const iv = setInterval(() => {
      setSession((prev) => {
        if (!prev || !prev.playback.playing) return prev;
        const left = Math.max(0, prev.playback.timeRemainingSec - 1);
        const next = {
          ...prev,
          playback: { ...prev.playback, timeRemainingSec: left, playing: left > 0 },
        };
        writeActiveSession(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [session?.playback.playing, session?.step]);

  function startCreateNew() {
    const next = createNewSession();
    next.step = isTutorialDismissed() ? "ratings" : "tutorial";
    persist(next);
  }

  function finishTutorial() {
    if (dontShowTutorialAgain) dismissTutorial(true);
    updateSession({ step: "ratings" });
  }

  function continueExisting(story: SharedDateNightStory) {
    persist({ ...story.sessionSnapshot, step: "player" });
    setShowSharedModal(false);
  }

  function refreshScenarios() {
    updateSession({ scenarios: freshScenarioSet(), creatorRatings: {} });
  }

  function submitCreatorRatings() {
    if (!session) return;
    updateSession({ step: "connect" });
  }

  function connectPartner() {
    if (!session) return;
    updateSession({
      partnerUsername: partnerUsername.trim() || PROTOTYPE_PARTNER_USERNAME,
      inviteStatus: "pending",
      step: "connect",
    });
  }

  function acceptInvite() {
    updateSession({ inviteStatus: "accepted", step: "partner-ratings", partnerRatings: {} });
  }

  function rejectInvite() {
    updateSession({ inviteStatus: "rejected" });
  }

  function submitPartnerRatings(ratings: Record<string, number>) {
    updateSession({ partnerRatings: ratings, step: "match-loading" });
  }

  function generateStory() {
    updateSession({ storyGenerated: true, step: "story-generated" });
  }

  function saveStory() {
    if (!session?.matchedScenario) return;
    const story: SharedDateNightStory = {
      id: session.id,
      storyName: session.friendlyName || session.matchedScenario.title,
      scenarioTitle: session.matchedScenario.title,
      partnerName: session.partnerUsername || PROTOTYPE_PARTNER_USERNAME,
      dateCreated: Date.now(),
      progressPercent: Math.round(
        ((STORY_DURATION_SEC - session.playback.timeRemainingSec) / STORY_DURATION_SEC) * 100,
      ),
      maleVoice: session.maleVoice,
      femaleVoice: session.femaleVoice,
      mood: session.mood,
      sessionSnapshot: session,
    };
    upsertSharedStory(story);
    setSharedStories(readSharedStories());
  }

  const isRatingsStep = !session || session.step === "ratings";

  const ratingsComplete =
    session?.scenarios.every(
      (s) => session.creatorRatings[s.id] >= 1 && session.creatorRatings[s.id] <= 10,
    ) ?? false;

  const partner = session?.partnerUsername || PROTOTYPE_PARTNER_USERNAME;
  const compatibility = session ? matchCompatibility(session) : 0;
  const storyNameReady = (session?.friendlyName.trim().length ?? 0) > 0;

  function renderMainStep() {
    if (!session) return null;

    if (session.step === "tutorial") {
      return (
        <StepPanel
          title="How Date Night works"
          description="A 30-minute narrated adventure designed for you and your partner."
          actionLabel="Begin matching"
          onAction={finishTutorial}
        >
          <ul className="dn-tutorial-checklist dn-tutorial-checklist-panel">
            <li>Rank twelve curated scenarios</li>
            <li>Connect with your partner</li>
            <li>Discover tonight&apos;s shared match</li>
            <li>Choose a name, voices, and mood</li>
            <li>Begin your audio experience</li>
          </ul>
          <label className="dn-tutorial-dismiss">
            <input
              type="checkbox"
              checked={dontShowTutorialAgain}
              onChange={(e) => setDontShowTutorialAgain(e.target.checked)}
            />
            <span>Don&apos;t show again</span>
          </label>
        </StepPanel>
      );
    }

    if (session.step === "ratings") {
      return (
        <section className="dn-step dn-step-ratings">
          <div className="dn-ratings-header">
            <RatingLegend />
          </div>
          <ul className="dn-scenario-grid dn-scenario-grid-4col">
            {session.scenarios.map((s) => (
              <li key={s.id} className="dn-scenario-card dn-scenario-card-compact">
                <div
                  className="dn-scenario-card-image"
                  style={{ backgroundImage: `url(${getScenarioImage(s.title)})` }}
                />
                <div className="dn-scenario-card-body">
                  <h3 className="dn-scenario-card-title">{s.title}</h3>
                  <p className="dn-scenario-card-desc">{s.description}</p>
                  <DateNightRatingPicker
                    value={session.creatorRatings[s.id]}
                    onChange={(v) =>
                      updateSession({
                        creatorRatings: { ...session.creatorRatings, [s.id]: v },
                      })
                    }
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="dn-submit-row">
            <button
              type="button"
              className="dn-btn-gold dn-btn-gold-lg"
              disabled={!ratingsComplete}
              onClick={submitCreatorRatings}
            >
              Submit Rankings
            </button>
          </div>
        </section>
      );
    }

    if (session.step === "connect" && session.inviteStatus === "idle") {
      return (
        <StepPanel
          title="Invite your partner"
          actionLabel="Connect"
          onAction={connectPartner}
        >
          <label className="dn-lux-field">
            <span>Partner username</span>
            <input
              className="dn-lux-input"
              value={partnerUsername}
              onChange={(e) => setPartnerUsername(e.target.value)}
              placeholder={PROTOTYPE_PARTNER_USERNAME}
            />
          </label>
        </StepPanel>
      );
    }

    if (session.step === "connect" && session.inviteStatus === "pending") {
      const isRanking = simPartnerState === "ranking";
      return (
        <section className={`dn-sim-layout${isRanking ? " dn-sim-layout--ranking" : ""}`}>

          {/* ── Left: Initiator (User A) ──────────────────────────── */}
          <div className="dn-sim-initiator">
            {!isRanking ? (
              /* Still waiting */
              <div className="dn-connect-waiting-card">
                <div className="dn-connect-pulse-ring" aria-hidden />
                <h2 className="dn-connect-waiting-heading">Waiting for your partner</h2>
                <p className="dn-connect-waiting-sub">
                  Invitation sent to{" "}
                  <strong className="dn-connect-partner-name">@{partner}</strong>
                </p>
                <p className="dn-connect-waiting-hint">
                  Waiting for your partner to respond&hellip;
                </p>
              </div>
            ) : (
              /* Partner accepted — success state */
              <div className="dn-connect-waiting-card dn-accepted-card">
                <div className="dn-accepted-check" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M7.5 12.5l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="dn-connect-waiting-heading">Partner Accepted</h2>
                <p className="dn-connect-waiting-sub">
                  <strong className="dn-connect-partner-name">@{partner}</strong>{" "}
                  accepted your invitation.
                </p>
                <p className="dn-connect-waiting-hint">
                  Waiting for your partner to complete their scenario rankings&hellip;
                </p>
              </div>
            )}
          </div>

          {/* ── Right: Partner Simulator ──────────────────────────── */}
          <div className="dn-sim-partner">

            {!isRanking ? (
              /* ── Invitation card (disappears on Accept) ── */
              <div className="dn-partner-notif-card">
                <p className="dn-partner-notif-eyebrow">Partner Simulator</p>
                <div className="dn-partner-notif-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                    <path d="M21 8.5V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                    <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                    <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </div>
                <h2 className="dn-partner-notif-title">Date Night Invitation</h2>
                <p className="dn-partner-notif-body">
                  <strong className="dn-partner-notif-sender">@{creatorUsername}</strong>{" "}
                  wants to start a Date Night with you.
                </p>
                <p className="dn-partner-notif-desc">
                  You will both be matched to the same adventure based on your scenario rankings.
                </p>
                <div className="dn-partner-notif-actions">
                  <button
                    type="button"
                    className="dn-btn-gold dn-btn-gold-lg dn-partner-notif-accept"
                    onClick={() => setSimPartnerState("ranking")}
                  >
                    Accept
                  </button>
                  <button type="button" className="dn-partner-notif-decline">
                    Decline
                  </button>
                </div>
              </div>
            ) : (
              /* ── Partner ranking grid (invitation card gone) ── */
              <div className="dn-sim-ranking-panel">
                <div className="dn-sim-ranking-header">
                  <p className="dn-page-eyebrow">Partner Simulator — Ranking</p>
                  <h2 className="dn-page-title" style={{ fontSize: "1.5rem" }}>
                    Rank Tonight&apos;s Possibilities
                  </h2>
                  <RatingLegend />
                </div>
                <ul className="dn-scenario-grid dn-scenario-grid-4col dn-sim-ranking-grid">
                  {session.scenarios.map((s) => (
                    <li key={s.id} className="dn-scenario-card dn-scenario-card-compact">
                      <div
                        className="dn-scenario-card-image"
                        style={{ backgroundImage: `url(${getScenarioImage(s.title)})` }}
                      />
                      <div className="dn-scenario-card-body">
                        <h3 className="dn-scenario-card-title">{s.title}</h3>
                        <p className="dn-scenario-card-desc">{s.description}</p>
                        <DateNightRatingPicker
                          value={simPartnerRatings[s.id]}
                          onChange={(v) =>
                            setSimPartnerRatings((prev) => ({ ...prev, [s.id]: v }))
                          }
                        />
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="dn-submit-row">
                  <button type="button" className="dn-btn-gold dn-btn-gold-lg" disabled>
                    Submit Rankings
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      );
    }

    if (session.step === "connect" && session.inviteStatus === "rejected") {
      return (
        <section className="dn-step">
          <div className="dn-waiting-panel">
            <h2 className="dn-waiting-title">Invitation declined</h2>
            <p className="dn-waiting-text">{partner} declined your invitation.</p>
            <button type="button" className="dn-btn-ghost-ivory mt-6" onClick={() => persist(null)}>
              Start over
            </button>
          </div>
        </section>
      );
    }

    if (session.step === "partner-ratings") {
      return (
        <section className="dn-step dn-step-waiting">
          <div className="dn-waiting-panel">
            <div className="dn-spinner dn-spinner-gold" aria-hidden />
            <h2 className="dn-waiting-title">Partner rates scenarios</h2>
            <p className="dn-waiting-text">
              <strong>@{partner}</strong> is ranking tonight&apos;s adventures.
            </p>
            <p className="dn-waiting-sub">We&apos;ll find your shared match once they submit.</p>
          </div>
        </section>
      );
    }

    if (session.step === "match-loading") {
      return (
        <section className="dn-step">
          <div className="dn-match-loading">
            <div className="dn-spinner dn-spinner-gold" aria-hidden />
            <p className="dn-match-loading-text">Finding tonight&apos;s match…</p>
          </div>
        </section>
      );
    }

    if (session.step === "match-reveal" && session.matchedScenario) {
      return (
        <section className="dn-step">
          <div className="dn-match-reveal-card">
            <p className="dn-match-reveal-label">✨ Match found</p>
            <div
              className="dn-match-reveal-art"
              style={{ backgroundImage: `url(${getScenarioImage(session.matchedScenario.title)})` }}
            />
            <h3 className="dn-match-reveal-title">{session.matchedScenario.title}</h3>
            <p className="dn-match-reveal-desc">{session.matchedScenario.description}</p>
            {compatibility > 0 ? (
              <p className="dn-match-reveal-score">Matched compatibility: {compatibility}%</p>
            ) : null}
            <button type="button" className="dn-btn-gold" onClick={() => updateSession({ step: "story-name" })}>
              Continue
            </button>
          </div>
        </section>
      );
    }

    if (session.step === "story-name") {
      return (
        <StepPanel
          title="Story name"
          description="Give tonight's adventure a name you'll both remember."
          actionLabel="Continue"
          actionDisabled={!storyNameReady}
          onAction={() => updateSession({ step: "story-voices" })}
        >
          <label className="dn-lux-field">
            <span>Friendly story name</span>
            <input
              className="dn-lux-input"
              value={session.friendlyName}
              onChange={(e) => updateSession({ friendlyName: e.target.value })}
              placeholder="Our evening adventure"
            />
          </label>
        </StepPanel>
      );
    }

    if (session.step === "story-voices") {
      return (
        <StepPanel
          title="Voices"
          description="Choose the narrators for your story."
          actionLabel="Continue"
          onAction={() => updateSession({ step: "story-mood" })}
        >
          <label className="dn-lux-field">
            <span>Male voice</span>
            <select
              className="dn-lux-select"
              value={session.maleVoice}
              onChange={(e) => updateSession({ maleVoice: e.target.value })}
            >
              {MOCK_MALE_VOICES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label className="dn-lux-field">
            <span>Female voice</span>
            <select
              className="dn-lux-select"
              value={session.femaleVoice}
              onChange={(e) => updateSession({ femaleVoice: e.target.value })}
            >
              {MOCK_FEMALE_VOICES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        </StepPanel>
      );
    }

    if (session.step === "story-mood") {
      return (
        <StepPanel
          title="Mood"
          description="Set the tone for tonight's narrative."
          actionLabel="Generate story"
          onAction={generateStory}
        >
          <div className="dn-mood-grid" role="listbox" aria-label="Story mood">
            {DATE_NIGHT_MOODS.map((m) => (
              <button
                key={m}
                type="button"
                role="option"
                aria-selected={session.mood === m}
                className={`dn-mood-pill${session.mood === m ? " dn-mood-pill-active" : ""}`}
                onClick={() => updateSession({ mood: m as DateNightMood })}
              >
                {m}
              </button>
            ))}
          </div>
        </StepPanel>
      );
    }

    if (session.step === "story-generated") {
      return (
        <section className="dn-step">
          <div className="dn-generating">
            <div className="dn-spinner dn-spinner-gold" aria-hidden />
            <p className="dn-generating-title">Generating your adventure…</p>
            <p className="dn-generating-sub">Crafting voices, mood, and tonight&apos;s narrative.</p>
          </div>
        </section>
      );
    }

    if (session.step === "player" && session.matchedScenario) {
      return (
        <section className="dn-step" id="dn-player">
          <DateNightPlayer
            session={session}
            partnerName={partner}
            onUpdate={updateSession}
            onSave={saveStory}
          />
        </section>
      );
    }

    return null;
  }

  return (
    <div className="dn-workspace dn-workspace-solo">
      <div className="dn-workspace-center dn-workspace-center-full">
        <div className="dn-workspace-scroll">
          <header className="dn-page-header">
            <div className="dn-page-header-row">
              <div className="dn-page-header-left">
                <button type="button" className="dn-back-link" onClick={onBack}>
                  ← Reignite
                </button>
              </div>
              <div className="dn-page-header-right">
                <button type="button" className="dn-saved-stories-btn" onClick={() => setShowSharedModal(true)}>
                  <span className="dn-saved-stories-btn-glow" aria-hidden />
                  <span className="dn-saved-stories-btn-icon" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                      <path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="dn-saved-stories-btn-copy">
                    <span className="dn-saved-stories-btn-label">Saved Stories</span>
                    <span className="dn-saved-stories-btn-sub">Your adventures</span>
                  </span>
                </button>
                {onToggleGuide ? (
                  <CouplesGuideConcierge guideHidden={guideRailHidden} onToggle={onToggleGuide} />
                ) : null}
              </div>
            </div>
            {isRatingsStep && (
              <div>
                <p className="dn-page-eyebrow">Date Night</p>
                <div className="dn-title-row">
                  <h1 className="dn-page-title">Match Tonight&apos;s Adventure</h1>
                  <button type="button" className="dn-btn-gold dn-btn-sm" onClick={refreshScenarios}>
                    Show Different Scenarios
                  </button>
                </div>
                <p className="dn-page-sub">
                  Rank scenarios with your partner, discover your shared match, and begin a guided audio experience together.
                </p>
              </div>
            )}
          </header>

          {renderMainStep()}
        </div>
      </div>


      {showSharedModal ? (
        <SharedStoriesModal
          stories={sharedStories}
          onClose={() => setShowSharedModal(false)}
          onResume={continueExisting}
        />
      ) : null}
    </div>
  );
}
