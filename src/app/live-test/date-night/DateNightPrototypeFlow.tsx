"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  DATE_NIGHT_MOODS,
  MOCK_FEMALE_VOICES,
  MOCK_MALE_VOICES,
  PROTOTYPE_PARTNER_USERNAME,
  STORY_DURATION_SEC,
} from "@/lib/date-night-prototype/constants";
import { isStepAtLeast, matchCompatibility } from "@/lib/date-night-prototype/journey";
import { findBestMatch } from "@/lib/date-night-prototype/match";
import { getScenarioImage } from "@/lib/date-night-prototype/scenario-images";
import { freshScenarioSet } from "@/lib/date-night-prototype/scenarios";
import {
  createNewSession,
  deleteSharedStory,
  dismissTutorial,
  isTutorialDismissed,
  readActiveSession,
  readSharedStories,
  upsertSharedStory,
  writeActiveSession,
} from "@/lib/date-night-prototype/storage";
import type { DateNightSession, SharedDateNightStory } from "@/lib/date-night-prototype/types";
import { readGuidePreferences, DEFAULT_USER_NAME } from "@/lib/guides/preferences";
import DateNightPlayer from "./DateNightPlayer";
import DateNightRatingPicker from "./DateNightRatingPicker";
import DateNightSharedSidebar from "./DateNightSharedSidebar";
import PartnerSimulationPanel, { RatingLegend } from "./PartnerSimulationPanel";
import CouplesGuideConcierge from "../CouplesGuideConcierge";

type DateNightPrototypeFlowProps = {
  onBack: () => void;
  guideRailHidden?: boolean;
  onToggleGuide?: () => void;
};

function JourneySection({
  id,
  step,
  title,
  subtitle,
  unlocked,
  complete,
  children,
}: {
  id: string;
  step: number;
  title: string;
  subtitle?: string;
  unlocked: boolean;
  complete: boolean;
  children: ReactNode;
}) {
  if (!unlocked) return null;

  return (
    <section id={id} className={`dn-journey-section${complete ? " dn-journey-section-complete" : ""}`}>
      <header className="dn-journey-section-header">
        <span className="dn-journey-step">{complete ? "✓" : step}</span>
        <div>
          <h2 className="dn-journey-section-title">{title}</h2>
          {subtitle ? <p className="dn-journey-section-sub">{subtitle}</p> : null}
        </div>
      </header>
      <div className="dn-journey-section-body">{children}</div>
    </section>
  );
}

function ProgressTimeline({ session }: { session: DateNightSession }) {
  const items = [
    { label: "Invitation sent", done: session.inviteStatus !== "idle" },
    { label: "Invitation accepted", done: session.inviteStatus === "accepted" },
    {
      label: "Partner ranking stories",
      done: isStepAtLeast(session.step, "match-loading") && session.inviteStatus === "accepted",
    },
    { label: "Match found", done: isStepAtLeast(session.step, "match-reveal") },
  ];

  return (
    <ul className="dn-progress-timeline">
      {items.map((item) => (
        <li key={item.label} className={item.done ? "dn-progress-timeline-done" : ""}>
          <span className="dn-progress-dot" aria-hidden />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export default function DateNightPrototypeFlow({
  onBack,
  guideRailHidden = true,
  onToggleGuide,
}: DateNightPrototypeFlowProps) {
  const [showTutorial, setShowTutorial] = useState(true);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [session, setSession] = useState<DateNightSession | null>(null);
  const [sharedStories, setSharedStories] = useState<SharedDateNightStory[]>([]);
  const [creatorUsername, setCreatorUsername] = useState(DEFAULT_USER_NAME);
  const [partnerUsername, setPartnerUsername] = useState(PROTOTYPE_PARTNER_USERNAME);
  const journeyRef = useRef<HTMLDivElement>(null);

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
    setSharedStories(readSharedStories());
    const existing = readActiveSession();
    if (existing) setSession(existing);
    setShowTutorial(!isTutorialDismissed());
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
    const t = setTimeout(() => updateSession({ step: "story-starting" }), 3000);
    return () => clearTimeout(t);
  }, [session?.step, updateSession]);

  useEffect(() => {
    if (session?.step !== "story-starting") return;
    const t = setTimeout(() => {
      updateSession({
        step: "player",
        playback: { playing: false, timeRemainingSec: STORY_DURATION_SEC },
      });
    }, 2000);
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

  function dismissTutorialBanner() {
    if (dontShowAgain) dismissTutorial(true);
    setShowTutorial(false);
  }

  function startCreateNew() {
    persist(createNewSession());
    requestAnimationFrame(() => {
      document.getElementById("dn-matching")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function continueExisting(story: SharedDateNightStory) {
    persist({ ...story.sessionSnapshot, step: "player" });
    requestAnimationFrame(() => {
      document.getElementById("dn-player")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
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

  function beginStoryConfig() {
    updateSession({ step: "story-config" });
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

  const ratingsComplete =
    session?.scenarios.every(
      (s) => session.creatorRatings[s.id] >= 1 && session.creatorRatings[s.id] <= 10,
    ) ?? false;

  const partner = session?.partnerUsername || PROTOTYPE_PARTNER_USERNAME;
  const compatibility = session ? matchCompatibility(session) : 0;

  return (
    <div className="dn-workspace">
      <DateNightSharedSidebar
        stories={sharedStories}
        activeStoryId={session?.id ?? null}
        onResume={continueExisting}
        onNewAdventure={startCreateNew}
      />

      <div className="dn-workspace-center">
        <div className="dn-workspace-scroll" ref={journeyRef}>
          <header className="dn-page-header">
            <div className="dn-page-header-row">
              <button type="button" className="dn-back-link" onClick={onBack}>
                ← Reignite
              </button>
              {onToggleGuide ? (
                <CouplesGuideConcierge guideHidden={guideRailHidden} onToggle={onToggleGuide} />
              ) : null}
            </div>
            <div>
              <p className="dn-page-eyebrow">Date Night</p>
              <h1 className="dn-page-title">Tonight&apos;s Adventure</h1>
              <p className="dn-page-sub">
                A 30-minute narrated adventure designed for you and your partner.
              </p>
            </div>
          </header>

          {showTutorial ? (
            <section className="dn-tutorial-banner">
              <div className="dn-tutorial-banner-copy">
                <p className="dn-tutorial-banner-label">How Date Night works</p>
                <p className="dn-tutorial-banner-desc">
                  A 30-minute narrated adventure designed for couples.
                </p>
                <ul className="dn-tutorial-checklist">
                  <li>Connect with your partner</li>
                  <li>Discover tonight&apos;s shared match</li>
                  <li>Choose voices and mood</li>
                  <li>Begin your story</li>
                </ul>
                <label className="dn-tutorial-dismiss">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                  />
                  <span>Don&apos;t show again</span>
                </label>
              </div>
              <button type="button" className="dn-tutorial-close" onClick={dismissTutorialBanner} aria-label="Dismiss">
                ×
              </button>
            </section>
          ) : null}

          {!session ? (
            <section className="dn-hero-start">
              <div className="dn-hero-start-card">
                <p className="dn-hero-start-eyebrow">Ready when you are</p>
                <h2 className="dn-hero-start-title">Match tonight&apos;s adventure</h2>
                <p className="dn-hero-start-desc">
                  Rank ten curated scenarios, connect with your partner, and discover the story you both want tonight.
                </p>
                <button type="button" className="dn-btn-gold" onClick={startCreateNew}>
                  Begin matching
                </button>
              </div>
            </section>
          ) : (
            <div className="dn-journey">
              <JourneySection
                id="dn-matching"
                step={1}
                title="Match tonight's adventure"
                subtitle="Rank each scenario privately — we'll reveal your best shared match."
                unlocked
                complete={isStepAtLeast(session.step, "connect")}
              >
                <RatingLegend />
                <ul className="dn-scenario-grid">
                  {session.scenarios.map((s) => (
                    <li key={s.id} className="dn-scenario-card">
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
                <div className="dn-section-actions">
                  <button type="button" className="dn-btn-ghost-ivory" onClick={refreshScenarios}>
                    Show me different scenarios
                  </button>
                  {!isStepAtLeast(session.step, "connect") ? (
                    <button
                      type="button"
                      className="dn-btn-gold"
                      disabled={!ratingsComplete}
                      onClick={submitCreatorRatings}
                    >
                      Continue to partner
                    </button>
                  ) : null}
                </div>
              </JourneySection>

              <JourneySection
                id="dn-partner"
                step={2}
                title="Partner connection"
                subtitle="Invite your partner and watch the shared journey unfold."
                unlocked={isStepAtLeast(session.step, "connect")}
                complete={isStepAtLeast(session.step, "match-loading")}
              >
                <div className="dn-partner-connect">
                  <div className="dn-partner-connect-left">
                    <h3 className="dn-subsection-title">Invite your partner</h3>
                    <p className="dn-subsection-desc">Enter your partner&apos;s Nakama username.</p>
                    {session.inviteStatus === "idle" ? (
                      <>
                        <label className="dn-lux-field">
                          <span>Partner username</span>
                          <input
                            className="dn-lux-input"
                            value={partnerUsername}
                            onChange={(e) => setPartnerUsername(e.target.value)}
                            placeholder={PROTOTYPE_PARTNER_USERNAME}
                          />
                        </label>
                        <button type="button" className="dn-btn-gold" onClick={connectPartner}>
                          Connect
                        </button>
                      </>
                    ) : session.inviteStatus === "pending" ? (
                      <p className="dn-waiting-text">Invitation sent — awaiting response from @{partner}.</p>
                    ) : session.inviteStatus === "rejected" ? (
                      <>
                        <p className="dn-waiting-text">{partner} declined your invitation.</p>
                        <button type="button" className="dn-btn-ghost-ivory" onClick={() => persist(null)}>
                          Start over
                        </button>
                      </>
                    ) : (
                      <ProgressTimeline session={session} />
                    )}
                  </div>
                  <div className="dn-partner-connect-right">
                    <h3 className="dn-subsection-title">Partner preview</h3>
                    <dl className="dn-preview-card">
                      <div>
                        <dt>Username</dt>
                        <dd>@{partner}</dd>
                      </div>
                      <div>
                        <dt>Status</dt>
                        <dd>
                          {session.inviteStatus === "pending"
                            ? "Invited"
                            : session.inviteStatus === "accepted"
                              ? "Accepted"
                              : session.inviteStatus === "rejected"
                                ? "Declined"
                                : "Waiting"}
                        </dd>
                      </div>
                      <div>
                        <dt>Step</dt>
                        <dd>
                          {session.step === "partner-ratings"
                            ? "Ranking"
                            : isStepAtLeast(session.step, "match-reveal")
                              ? "Matched"
                              : session.inviteStatus === "accepted"
                                ? "Connected"
                                : "Waiting"}
                        </dd>
                      </div>
                    </dl>
                    {session.inviteStatus === "accepted" ? <ProgressTimeline session={session} /> : null}
                  </div>
                </div>
              </JourneySection>

              <JourneySection
                id="dn-match"
                step={3}
                title="Tonight's match"
                subtitle="The adventure you both chose."
                unlocked={isStepAtLeast(session.step, "match-loading")}
                complete={isStepAtLeast(session.step, "story-config")}
              >
                {session.step === "match-loading" ? (
                  <div className="dn-match-loading">
                    <div className="dn-spinner dn-spinner-gold" aria-hidden />
                    <p className="dn-match-loading-text">Finding tonight&apos;s match…</p>
                  </div>
                ) : session.matchedScenario ? (
                  <div className="dn-match-reveal-card">
                    <p className="dn-match-reveal-label">✨ Tonight&apos;s match</p>
                    <div
                      className="dn-match-reveal-art"
                      style={{ backgroundImage: `url(${getScenarioImage(session.matchedScenario.title)})` }}
                    />
                    <h3 className="dn-match-reveal-title">{session.matchedScenario.title}</h3>
                    <p className="dn-match-reveal-desc">{session.matchedScenario.description}</p>
                    {compatibility > 0 ? (
                      <p className="dn-match-reveal-score">Matched compatibility: {compatibility}%</p>
                    ) : null}
                    {session.step === "match-reveal" ? (
                      <button type="button" className="dn-btn-gold" onClick={beginStoryConfig}>
                        Continue
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </JourneySection>

              <JourneySection
                id="dn-setup"
                step={4}
                title="Story setup"
                subtitle="Name your adventure and set the mood."
                unlocked={isStepAtLeast(session.step, "story-config")}
                complete={isStepAtLeast(session.step, "story-generated")}
              >
                <div className="dn-config-grid">
                  <label className="dn-config-card">
                    <span className="dn-config-card-label">Friendly story name</span>
                    <input
                      className="dn-lux-input"
                      value={session.friendlyName}
                      onChange={(e) => updateSession({ friendlyName: e.target.value })}
                      placeholder="Our evening adventure"
                    />
                  </label>
                  <label className="dn-config-card">
                    <span className="dn-config-card-label">Male voice</span>
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
                  <label className="dn-config-card">
                    <span className="dn-config-card-label">Female voice</span>
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
                  <label className="dn-config-card">
                    <span className="dn-config-card-label">Mood</span>
                    <select
                      className="dn-lux-select"
                      value={session.mood}
                      onChange={(e) => updateSession({ mood: e.target.value as DateNightSession["mood"] })}
                    >
                      {DATE_NIGHT_MOODS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                {session.step === "story-config" ? (
                  <button type="button" className="dn-btn-gold dn-config-generate" onClick={generateStory}>
                    Generate story
                  </button>
                ) : null}
              </JourneySection>

              <JourneySection
                id="dn-generating"
                step={5}
                title="Your adventure"
                unlocked={isStepAtLeast(session.step, "story-generated")}
                complete={session.step === "player"}
              >
                {session.step === "story-generated" ? (
                  <div className="dn-generating">
                    <div className="dn-spinner dn-spinner-gold" aria-hidden />
                    <p className="dn-generating-title">Generating your adventure…</p>
                    <p className="dn-generating-sub">Crafting voices, mood, and tonight&apos;s narrative.</p>
                  </div>
                ) : session.step === "story-starting" ? (
                  <div className="dn-ready-banner">
                    <p className="dn-ready-banner-title">Your story is ready.</p>
                    <p className="dn-ready-banner-sub">Press play when you&apos;re both settled in.</p>
                  </div>
                ) : session.step === "player" && session.matchedScenario ? (
                  <div id="dn-player">
                    <DateNightPlayer
                      session={session}
                      partnerName={partner}
                      onUpdate={updateSession}
                      onSave={saveStory}
                    />
                  </div>
                ) : null}
              </JourneySection>
            </div>
          )}
        </div>
      </div>

      {session ? (
        <PartnerSimulationPanel
          session={session}
          creatorUsername={creatorUsername}
          onAcceptInvite={acceptInvite}
          onRejectInvite={rejectInvite}
          onPartnerRatingsSubmit={submitPartnerRatings}
          onUpdate={updateSession}
        />
      ) : (
        <aside className="dn-partner-phone dn-partner-phone-idle">
          <div className="dn-partner-phone-frame">
            <header className="dn-partner-phone-header">
              <p className="dn-partner-phone-label">Partner View</p>
              <p className="dn-partner-phone-user">@{PROTOTYPE_PARTNER_USERNAME}</p>
            </header>
            <p className="dn-partner-muted">Start matching to preview your partner&apos;s experience.</p>
          </div>
        </aside>
      )}
    </div>
  );
}
