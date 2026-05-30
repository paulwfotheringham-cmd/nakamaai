"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DATE_NIGHT_MOODS,
  MOCK_FEMALE_VOICES,
  MOCK_MALE_VOICES,
  PROTOTYPE_PARTNER_USERNAME,
  STORY_DURATION_SEC,
} from "@/lib/date-night-prototype/constants";
import { findBestMatch } from "@/lib/date-night-prototype/match";
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
import PartnerSimulationPanel, { RatingLegend } from "./PartnerSimulationPanel";

type DateNightPrototypeFlowProps = {
  onBack: () => void;
};

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function DateNightPrototypeFlow({ onBack }: DateNightPrototypeFlowProps) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [session, setSession] = useState<DateNightSession | null>(null);
  const [sharedStories, setSharedStories] = useState<SharedDateNightStory[]>([]);
  const [creatorUsername, setCreatorUsername] = useState(DEFAULT_USER_NAME);
  const [banner, setBanner] = useState<string | null>(null);
  const [manageStoryId, setManageStoryId] = useState<string | null>(null);

  const persist = useCallback((next: DateNightSession | null) => {
    setSession(next);
    writeActiveSession(next);
  }, []);

  const updateSession = useCallback(
    (patch: Partial<DateNightSession>) => {
      setSession((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...patch };
        writeActiveSession(next);
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    setCreatorUsername(readGuidePreferences().userName || DEFAULT_USER_NAME);
    setSharedStories(readSharedStories());
    const existing = readActiveSession();
    if (existing) {
      setSession(existing);
      setShowTutorial(false);
    } else if (!isTutorialDismissed()) {
      setShowTutorial(true);
    }
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
    if (session?.step !== "story-starting") return;
    const t = setTimeout(() => {
      updateSession({ step: "player", playback: { playing: false, timeRemainingSec: STORY_DURATION_SEC } });
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

  const showPartnerPanel =
    session &&
    ["connect", "partner-ratings", "match-loading", "match-reveal", "story-config", "story-generated", "story-starting", "player"].includes(
      session.step,
    );

  function startTutorialContinue() {
    if (dontShowAgain) dismissTutorial(true);
    setShowTutorial(false);
  }

  function startCreateNew() {
    const s = createNewSession();
    persist(s);
    setBanner(null);
    setManageStoryId(null);
  }

  function continueExisting(story: SharedDateNightStory) {
    persist({ ...story.sessionSnapshot, step: "player" });
    setBanner(null);
  }

  function refreshScenarios() {
    updateSession({ scenarios: freshScenarioSet(), creatorRatings: {} });
  }

  function submitCreatorRatings() {
    if (!session) return;
    updateSession({ step: "connect" });
  }

  function connectPartner(username: string) {
    if (!session) return;
    updateSession({
      partnerUsername: username.trim() || PROTOTYPE_PARTNER_USERNAME,
      inviteStatus: "pending",
      step: "connect",
    });
  }

  function acceptInvite() {
    updateSession({ inviteStatus: "accepted", step: "partner-ratings", partnerRatings: {} });
    setBanner(`${PROTOTYPE_PARTNER_USERNAME} accepted your invitation.`);
  }

  function rejectInvite() {
    updateSession({ inviteStatus: "rejected" });
    setBanner(`${PROTOTYPE_PARTNER_USERNAME} declined your invitation.`);
  }

  function submitPartnerRatings(ratings: Record<string, number>) {
    updateSession({ partnerRatings: ratings, step: "match-loading" });
  }

  function beginStoryConfig() {
    updateSession({ step: "story-config" });
  }

  function generateStory() {
    updateSession({ storyGenerated: true, step: "story-generated" });
    setTimeout(() => updateSession({ step: "story-starting" }), 1200);
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
    setBanner("Story saved to Shared Stories.");
  }

  if (showTutorial) {
    return (
      <div className="dn-flow">
        <div className="dn-modal-backdrop">
          <div className="dn-modal" role="dialog" aria-labelledby="dn-tutorial-title">
            <p className="type-label text-amber-500/70">Date Night</p>
            <h2 id="dn-tutorial-title" className="type-card-title mt-2">
              Welcome to Date Night
            </h2>
            <p className="type-body mt-3">
              A 30-minute curated adventure audio story for you and your partner.
            </p>
            <ol className="dn-tutorial-steps">
              <li>Connect with your partner.</li>
              <li>Rate tonight&apos;s story possibilities.</li>
              <li>Discover your best shared match.</li>
              <li>Choose voices and mood.</li>
              <li>Begin your adventure.</li>
            </ol>
            <RatingLegend />
            <label className="dn-checkbox">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              />
              <span className="type-small">Don&apos;t show again</span>
            </label>
            <button type="button" className="btn-primary mt-6 w-full" onClick={startTutorialContinue}>
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="dn-flow">
        <div className="dn-flow-main">
          <button type="button" className="btn-ghost mb-4" onClick={onBack}>
            ← Back to Reignite
          </button>
          <header className="dn-flow-header">
            <p className="type-label text-amber-500/60">Date Night</p>
            <h1 className="type-hero mt-3">Welcome to Date Night</h1>
            <p className="type-body mt-4 max-w-lg">
              A 30-minute curated adventure audio story for you and your partner.
            </p>
          </header>
          <div className="dn-home-actions">
            <button type="button" className="btn-primary" onClick={startCreateNew}>
              Create new story
            </button>
            <button
              type="button"
              className="btn-secondary"
              disabled={sharedStories.length === 0}
              onClick={() => sharedStories[0] && continueExisting(sharedStories[0])}
            >
              Continue existing story
            </button>
          </div>
          <SharedStoriesSection
            stories={sharedStories}
            manageId={manageStoryId}
            onManage={setManageStoryId}
            onContinue={continueExisting}
            onDelete={(id) => {
              deleteSharedStory(id);
              setSharedStories(readSharedStories());
            }}
            onUpdate={(story) => {
              upsertSharedStory(story);
              setSharedStories(readSharedStories());
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`dn-flow${showPartnerPanel ? " dn-flow-with-partner" : ""}`}>
      <div className="dn-flow-main">
        <button type="button" className="btn-ghost mb-4" onClick={onBack}>
          ← Back to Reignite
        </button>

        {banner ? <div className="dn-banner">{banner}</div> : null}

        {session.step === "ratings" && (
          <RatingsStep
            session={session}
            onRefresh={refreshScenarios}
            onSubmit={submitCreatorRatings}
            onChangeRating={(id, v) =>
              updateSession({ creatorRatings: { ...session.creatorRatings, [id]: v } })
            }
          />
        )}

        {session.step === "connect" && session.inviteStatus === "idle" && (
          <ConnectStep
            onConnect={(u) => connectPartner(u)}
            defaultUsername={PROTOTYPE_PARTNER_USERNAME}
          />
        )}

        {session.step === "connect" && session.inviteStatus === "pending" && (
          <div className="dn-panel">
            <p className="type-body">Invitation sent. Waiting for your partner to respond in the simulation panel →</p>
          </div>
        )}

        {session.step === "connect" && session.inviteStatus === "rejected" && (
          <div className="dn-panel">
            <p className="type-body text-luxury-secondary">
              {PROTOTYPE_PARTNER_USERNAME} declined your invitation. You can go back and start again.
            </p>
            <button type="button" className="btn-secondary mt-4" onClick={() => persist(null)}>
              Return home
            </button>
          </div>
        )}

        {session.step === "match-loading" && (
          <div className="dn-panel dn-panel-centered">
            <p className="type-card-title">Finding tonight&apos;s match…</p>
            <div className="dn-spinner" aria-hidden />
          </div>
        )}

        {session.step === "match-reveal" && session.matchedScenario && (
          <div className="dn-panel">
            <p className="type-label text-amber-500/70">✨ Tonight&apos;s match found</p>
            <h2 className="type-card-title mt-3">{session.matchedScenario.title}</h2>
            <p className="type-body mt-4">{session.matchedScenario.description}</p>
            <button type="button" className="btn-primary mt-8" onClick={beginStoryConfig}>
              Configure story
            </button>
          </div>
        )}

        {session.step === "story-config" && session.matchedScenario && (
          <StoryConfigStep session={session} onChange={updateSession} onGenerate={generateStory} />
        )}

        {session.step === "story-generated" && (
          <div className="dn-panel dn-panel-centered">
            <p className="type-body">Story generated successfully.</p>
          </div>
        )}

        {session.step === "story-starting" && (
          <div className="dn-panel dn-panel-centered">
            <p className="type-card-title">Story starting…</p>
          </div>
        )}

        {session.step === "player" && session.matchedScenario && (
          <PlayerStep
            session={session}
            creatorUsername={creatorUsername}
            onUpdate={updateSession}
            onSave={saveStory}
          />
        )}
      </div>

      {showPartnerPanel && session ? (
        <PartnerSimulationPanel
          session={session}
          creatorUsername={creatorUsername}
          onAcceptInvite={acceptInvite}
          onRejectInvite={rejectInvite}
          onPartnerRatingsSubmit={submitPartnerRatings}
        />
      ) : null}
    </div>
  );
}

function RatingsStep({
  session,
  onChangeRating,
  onRefresh,
  onSubmit,
}: {
  session: DateNightSession;
  onChangeRating: (id: string, v: number) => void;
  onRefresh: () => void;
  onSubmit: () => void;
}) {
  const complete = session.scenarios.every(
    (s) => session.creatorRatings[s.id] >= 1 && session.creatorRatings[s.id] <= 10,
  );

  return (
    <div className="dn-panel">
      <h2 className="type-section-heading">Create new story</h2>
      <RatingLegend />
      <ul className="dn-scenario-list">
        {session.scenarios.map((s) => (
          <li key={s.id} className="dn-scenario-row">
            <div className="dn-scenario-copy">
              <p className="dn-scenario-title">{s.title}</p>
              <p className="dn-scenario-desc">{s.description}</p>
            </div>
            <select
              className="dn-rating-select"
              value={session.creatorRatings[s.id] ?? ""}
              onChange={(e) => onChangeRating(s.id, Number(e.target.value))}
            >
              <option value="" disabled>
                Rate
              </option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
      <div className="dn-actions-row">
        <button type="button" className="btn-secondary" onClick={onRefresh}>
          Show me different scenarios
        </button>
        <button type="button" className="btn-primary" disabled={!complete} onClick={onSubmit}>
          Continue
        </button>
      </div>
    </div>
  );
}

function ConnectStep({
  onConnect,
  defaultUsername,
}: {
  onConnect: (username: string) => void;
  defaultUsername: string;
}) {
  const [username, setUsername] = useState(defaultUsername);

  return (
    <div className="dn-panel">
      <h2 className="type-section-heading">Invite your partner</h2>
      <p className="type-body mt-3">Enter your partner&apos;s Nakama username.</p>
      <label className="dn-field mt-6">
        <span className="type-label">Partner username</span>
        <input
          className="launcher-chat-input mt-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Partner username"
        />
      </label>
      <button type="button" className="btn-primary mt-6" onClick={() => onConnect(username)}>
        Connect
      </button>
    </div>
  );
}

function StoryConfigStep({
  session,
  onChange,
  onGenerate,
}: {
  session: DateNightSession;
  onChange: (p: Partial<DateNightSession>) => void;
  onGenerate: () => void;
}) {
  return (
    <div className="dn-panel">
      <h2 className="type-section-heading">Story configuration</h2>
      <p className="type-small mt-2 text-luxury-muted">{session.matchedScenario?.title}</p>
      <label className="dn-field mt-6">
        <span className="type-label">Friendly story name</span>
        <input
          className="launcher-chat-input mt-2"
          value={session.friendlyName}
          onChange={(e) => onChange({ friendlyName: e.target.value })}
          placeholder="Our evening adventure"
        />
      </label>
      <label className="dn-field">
        <span className="type-label">Male voice</span>
        <select
          className="fc-select mt-2"
          value={session.maleVoice}
          onChange={(e) => onChange({ maleVoice: e.target.value })}
        >
          {MOCK_MALE_VOICES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </label>
      <label className="dn-field">
        <span className="type-label">Female voice</span>
        <select
          className="fc-select mt-2"
          value={session.femaleVoice}
          onChange={(e) => onChange({ femaleVoice: e.target.value })}
        >
          {MOCK_FEMALE_VOICES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </label>
      <label className="dn-field">
        <span className="type-label">Mood</span>
        <select
          className="fc-select mt-2"
          value={session.mood}
          onChange={(e) => onChange({ mood: e.target.value as DateNightSession["mood"] })}
        >
          {DATE_NIGHT_MOODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </label>
      <button type="button" className="btn-primary mt-8 w-full" onClick={onGenerate}>
        Generate story
      </button>
    </div>
  );
}

function PlayerStep({
  session,
  creatorUsername,
  onUpdate,
  onSave,
}: {
  session: DateNightSession;
  creatorUsername: string;
  onUpdate: (p: Partial<DateNightSession>) => void;
  onSave: () => void;
}) {
  const partner = session.partnerUsername || PROTOTYPE_PARTNER_USERNAME;

  return (
    <div className="dn-panel">
      <h2 className="type-card-title">{session.friendlyName || session.matchedScenario?.title}</h2>
      <p className="type-small mt-2 text-luxury-muted">{session.matchedScenario?.title}</p>
      <dl className="dn-meta-grid">
        <div>
          <dt className="type-label">Partner</dt>
          <dd className="type-body mt-1">{partner}</dd>
        </div>
        <div>
          <dt className="type-label">Time remaining</dt>
          <dd className="type-body mt-1">{formatTime(session.playback.timeRemainingSec)}</dd>
        </div>
      </dl>
      <div className="dn-player-controls">
        <button
          type="button"
          className="btn-secondary"
          onClick={() =>
            onUpdate({
              playback: {
                ...session.playback,
                playing: true,
              },
            })
          }
        >
          Play
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => onUpdate({ playback: { ...session.playback, playing: false } })}
        >
          Pause
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() =>
            onUpdate({
              playback: { playing: false, timeRemainingSec: STORY_DURATION_SEC },
            })
          }
        >
          Stop
        </button>
        <button type="button" className="btn-primary" onClick={onSave}>
          Save
        </button>
      </div>
      <div className="dn-voice-toggles mt-6">
        <label className="dn-field">
          <span className="type-label">Male voice</span>
          <select
            className="fc-select mt-2"
            value={session.maleVoice}
            onChange={(e) => onUpdate({ maleVoice: e.target.value })}
          >
            {MOCK_MALE_VOICES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="dn-field">
          <span className="type-label">Female voice</span>
          <select
            className="fc-select mt-2"
            value={session.femaleVoice}
            onChange={(e) => onUpdate({ femaleVoice: e.target.value })}
          >
            {MOCK_FEMALE_VOICES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="type-small mt-6 text-luxury-muted">
        Prototype playback — no audio required. Creator: {creatorUsername}
      </p>
    </div>
  );
}

function SharedStoriesSection({
  stories,
  manageId,
  onManage,
  onContinue,
  onDelete,
  onUpdate,
}: {
  stories: SharedDateNightStory[];
  manageId: string | null;
  onManage: (id: string | null) => void;
  onContinue: (s: SharedDateNightStory) => void;
  onDelete: (id: string) => void;
  onUpdate: (s: SharedDateNightStory) => void;
}) {
  if (stories.length === 0) return null;

  return (
    <section className="dn-shared-stories mt-10">
      <h2 className="type-section-heading">Shared stories</h2>
      <ul className="dn-shared-list">
        {stories.map((s) => (
          <li key={s.id} className="dn-shared-item">
            <div className="dn-shared-summary">
              <p className="type-body text-luxury-primary">{s.storyName}</p>
              <p className="type-small mt-1">
                {s.partnerName} · {new Date(s.dateCreated).toLocaleDateString()} · {s.progressPercent}%
                progress
              </p>
            </div>
            <div className="dn-shared-actions">
              <button type="button" className="btn-ghost text-sm" onClick={() => onContinue(s)}>
                Open
              </button>
              <button type="button" className="btn-ghost text-sm" onClick={() => onManage(manageId === s.id ? null : s.id)}>
                Manage
              </button>
            </div>
            {manageId === s.id ? (
              <div className="dn-manage-form">
                <input
                  className="launcher-chat-input"
                  value={s.storyName}
                  onChange={(e) => onUpdate({ ...s, storyName: e.target.value })}
                />
                <input
                  className="launcher-chat-input mt-2"
                  value={s.partnerName}
                  onChange={(e) => onUpdate({ ...s, partnerName: e.target.value })}
                  placeholder="Partner name"
                />
                <select
                  className="fc-select mt-2"
                  value={s.maleVoice}
                  onChange={(e) => onUpdate({ ...s, maleVoice: e.target.value })}
                >
                  {MOCK_MALE_VOICES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <select
                  className="fc-select mt-2"
                  value={s.femaleVoice}
                  onChange={(e) => onUpdate({ ...s, femaleVoice: e.target.value })}
                >
                  {MOCK_FEMALE_VOICES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <select
                  className="fc-select mt-2"
                  value={s.mood}
                  onChange={(e) => onUpdate({ ...s, mood: e.target.value as SharedDateNightStory["mood"] })}
                >
                  {DATE_NIGHT_MOODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <button type="button" className="btn-secondary mt-3 w-full" onClick={() => onDelete(s.id)}>
                  Delete
                </button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
