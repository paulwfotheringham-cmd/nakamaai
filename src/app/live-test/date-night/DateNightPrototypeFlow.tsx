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
import type { DateNightSession, SharedDateNightStory } from "@/lib/date-night-prototype/types";
import { readGuidePreferences, DEFAULT_USER_NAME } from "@/lib/guides/preferences";
import DateNightPlayer from "./DateNightPlayer";
import DateNightRatingPicker, { RatingLegendCompact } from "./DateNightRatingPicker";
import PartnerSimulationPanel from "./PartnerSimulationPanel";
import CouplesGuideConcierge from "../CouplesGuideConcierge";

type DateNightPrototypeFlowProps = {
  onBack: () => void;
  guideRailHidden?: boolean;
  onToggleGuide?: () => void;
};

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
          Shared Stories
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
  const [showTutorial, setShowTutorial] = useState(true);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [session, setSession] = useState<DateNightSession | null>(null);
  const [sharedStories, setSharedStories] = useState<SharedDateNightStory[]>([]);
  const [showSharedModal, setShowSharedModal] = useState(false);
  const [creatorUsername, setCreatorUsername] = useState(DEFAULT_USER_NAME);
  const [partnerUsername, setPartnerUsername] = useState(PROTOTYPE_PARTNER_USERNAME);

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

  function renderMainStep() {
    if (!session) return null;

    if (session.step === "ratings") {
      return (
        <section className="dn-step dn-step-ratings">
          <div className="dn-scenario-toolbar">
            <RatingLegendCompact />
            <button type="button" className="dn-btn-ghost-ivory" onClick={refreshScenarios}>
              Show me different scenarios
            </button>
          </div>
          <ul className="dn-scenario-grid dn-scenario-grid-compact">
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
        <section className="dn-step dn-step-connect">
          <div className="dn-connect-panel">
            <h2 className="dn-connect-title">Invite your partner</h2>
            <p className="dn-connect-desc">
              Enter your partner&apos;s Nakama username. Usernames can be found in the Profile section.
            </p>
            <label className="dn-lux-field">
              <span>Partner username</span>
              <input
                className="dn-lux-input"
                value={partnerUsername}
                onChange={(e) => setPartnerUsername(e.target.value)}
                placeholder={PROTOTYPE_PARTNER_USERNAME}
              />
            </label>
            <button type="button" className="dn-btn-gold dn-btn-gold-lg" onClick={connectPartner}>
              Connect
            </button>
          </div>
        </section>
      );
    }

    if (
      session.step === "connect" &&
      (session.inviteStatus === "pending" || session.inviteStatus === "accepted")
    ) {
      return (
        <section className="dn-step dn-step-waiting">
          <div className="dn-waiting-panel">
            <div className="dn-spinner dn-spinner-gold" aria-hidden />
            <h2 className="dn-waiting-title">Waiting for partner</h2>
            <p className="dn-waiting-text">
              Invitation sent to <strong>@{partner}</strong>.
            </p>
            <p className="dn-waiting-sub">Waiting for your partner to respond…</p>
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
            <h2 className="dn-waiting-title">Waiting for partner</h2>
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
            <button type="button" className="dn-btn-gold" onClick={beginStoryConfig}>
              Continue
            </button>
          </div>
        </section>
      );
    }

    if (session.step === "story-config") {
      return (
        <section className="dn-step">
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
          <button type="button" className="dn-btn-gold dn-config-generate" onClick={generateStory}>
            Generate story
          </button>
        </section>
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

    if (session.step === "story-starting") {
      return (
        <section className="dn-step">
          <div className="dn-ready-banner">
            <p className="dn-ready-banner-title">Your story is ready.</p>
            <p className="dn-ready-banner-sub">Press play when you&apos;re both settled in.</p>
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
    <div className="dn-workspace dn-workspace-focused">
      <div className="dn-workspace-center dn-workspace-center-full">
        <div className="dn-workspace-scroll">
          <header className="dn-page-header">
            <div className="dn-page-header-row">
              <div className="dn-page-header-left">
                <button type="button" className="dn-back-link" onClick={onBack}>
                  ← Reignite
                </button>
                <button type="button" className="dn-nav-link" onClick={() => setShowSharedModal(true)}>
                  Shared Stories
                </button>
              </div>
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
                <h2 className="dn-hero-start-title">Rank tonight&apos;s adventures</h2>
                <p className="dn-hero-start-desc">
                  Rate twelve curated scenarios, connect with your partner, and discover the story you both want tonight.
                </p>
                <button type="button" className="dn-btn-gold" onClick={startCreateNew}>
                  Begin matching
                </button>
              </div>
            </section>
          ) : (
            renderMainStep()
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
