"use client";

import { useCallback, useEffect, useState } from "react";
import { GUIDE_VOICES } from "@/lib/guides/catalog";
import {
  type ChatSetupPreferences,
  writeForbiddenChatSetup,
} from "@/lib/guides/chat-setup";
import {
  getMoodById,
  pickNewAdventureMood,
  pickSurpriseMood,
  openingLinesForMood,
  TEN_MINUTE_ESCAPE,
  TONIGHT_MOODS,
  type ForbiddenMood,
  type ForbiddenMoodId,
} from "@/lib/guides/forbidden-chat-moods";
import {
  getContinueLastSession,
  hasSavedSession,
  type ForbiddenChatMessage,
} from "@/lib/guides/forbidden-chat-session";
import { readGuidePreferences } from "@/lib/guides/preferences";

export type ForbiddenChatSetupResult = {
  prefs: ChatSetupPreferences;
  title: string;
  moodId?: ForbiddenMoodId;
  openingMessages: ForbiddenChatMessage[];
  resumeMessages?: ForbiddenChatMessage[];
};

type ForbiddenChatSetupProps = {
  onComplete: (result: ForbiddenChatSetupResult) => void;
  disabled?: boolean;
};

const EXPLORE_SCENES = [
  { title: "Private Desires", moodId: "comfort-attention" as ForbiddenMoodId },
  { title: "Late Night Call", moodId: "slow-burn" as ForbiddenMoodId },
  { title: "Hotel Encounter", moodId: "forbidden-tension" as ForbiddenMoodId },
];

function resolveVoice(): { voiceId: string; voiceName?: string } {
  const guideVoice = readGuidePreferences().voiceId;
  const voice =
    GUIDE_VOICES.find((v) => v.id === guideVoice) ?? GUIDE_VOICES[0];
  return { voiceId: voice?.id ?? "", voiceName: voice?.name };
}

function buildStart(
  mood: ForbiddenMood,
  options?: { fresh?: boolean; resume?: ForbiddenChatMessage[]; title?: string },
): ForbiddenChatSetupResult {
  const { voiceId, voiceName } = resolveVoice();
  const prefs: ChatSetupPreferences = {
    mode: "guided",
    ...mood.prefs,
    voiceId,
    voiceName,
  };
  writeForbiddenChatSetup(prefs);

  if (options?.resume?.length) {
    return {
      prefs,
      title: options.title ?? mood.label,
      moodId: mood.id,
      openingMessages: [],
      resumeMessages: options.resume,
    };
  }

  const lines = openingLinesForMood(mood, options?.fresh);
  return {
    prefs,
    title: options?.title ?? mood.label,
    moodId: mood.id,
    openingMessages: lines.map((text, i) => ({
      id: `open-${Date.now()}-${i}`,
      role: "assistant" as const,
      text,
    })),
  };
}

export default function ForbiddenChatSetup({ onComplete, disabled }: ForbiddenChatSetupProps) {
  const [hasLast, setHasLast] = useState(false);
  const [lastTitle, setLastTitle] = useState("Private Desires");

  useEffect(() => {
    const saved = hasSavedSession();
    setHasLast(saved);
    if (saved) {
      setLastTitle(getContinueLastSession().title);
    }
  }, []);

  const startMood = useCallback(
    (mood: ForbiddenMood, fresh = false, title?: string) => {
      if (disabled) return;
      onComplete(buildStart(mood, { fresh, title }));
    },
    [disabled, onComplete],
  );

  const handleContinueLast = () => {
    if (disabled) return;
    const session = getContinueLastSession();
    const mood =
      getMoodById(session.moodId ?? "comfort-attention") ?? TONIGHT_MOODS[0];
    onComplete({
      prefs: session.prefs,
      title: session.title,
      moodId: session.moodId,
      openingMessages: [],
      resumeMessages: session.messages,
    });
    writeForbiddenChatSetup(session.prefs);
  };

  const handleTenMinuteEscape = () => {
    startMood(TEN_MINUTE_ESCAPE);
  };

  const handleMood = (id: ForbiddenMoodId) => {
    if (id === "surprise-me") {
      const picked = pickSurpriseMood();
      startMood({ ...picked, id: "surprise-me", label: "Surprise Me", chipLabel: "Surprise Me" });
      return;
    }
    const mood = getMoodById(id);
    if (mood) startMood(mood);
  };

  const handleNewAdventure = () => {
    const mood = pickNewAdventureMood();
    startMood(mood, true, "New Adventure");
  };

  const handleExploreScene = (title: string, moodId: ForbiddenMoodId) => {
    const mood = getMoodById(moodId);
    if (mood) startMood(mood, false, title);
  };

  return (
    <div className="launcher-panel fc-setup fc-mood-landing">
      <div className="fc-setup-glow" aria-hidden />

      <div className="fc-browse-scroll">
        <div className="fc-compact-fold">
          <header className="fc-landing-head">
            <p className="fc-hero-eyebrow">Forbidden Chat</p>
            <h1 className="fc-hero-title fc-hero-title--compact">What do you need tonight?</h1>
          </header>

          <button
            type="button"
            disabled={disabled}
            onClick={handleContinueLast}
            className="fc-continue-primary"
          >
            <span className="fc-continue-primary-label">Continue Last Story</span>
            <span className="fc-continue-primary-meta">
              {hasLast ? lastTitle : `${lastTitle} — one tap to resume`}
            </span>
          </button>

          <section className="fc-mood-section" aria-labelledby="fc-mood-heading">
            <h2 id="fc-mood-heading" className="fc-section-title fc-section-title--compact">
              Tonight&apos;s Mood
            </h2>
            <div className="fc-mood-chips" role="list">
              {TONIGHT_MOODS.map((mood) => (
                <button
                  key={mood.id}
                  type="button"
                  role="listitem"
                  disabled={disabled}
                  onClick={() => handleMood(mood.id)}
                  className="fc-mood-chip"
                >
                  {mood.chipLabel}
                </button>
              ))}
            </div>
          </section>

          <div className="fc-quick-actions" role="group" aria-label="Quick starts">
            <button
              type="button"
              disabled={disabled}
              onClick={handleTenMinuteEscape}
              className="fc-action-card"
            >
              <span className="fc-action-card-title">10 Minute Escape</span>
              <span className="fc-action-card-desc">Short, immersive — no setup</span>
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={handleNewAdventure}
              className="fc-action-card"
            >
              <span className="fc-action-card-title">New Adventure</span>
              <span className="fc-action-card-desc">Something fresh tonight</span>
            </button>
          </div>
        </div>

        <section className="fc-secondary" aria-label="More scenes">
          <h3 className="fc-secondary-title">Explore scenes</h3>
          <ul className="fc-secondary-list">
            {EXPLORE_SCENES.map((scene) => (
              <li key={scene.title}>
                <button
                  type="button"
                  disabled={disabled}
                  className="fc-secondary-link"
                  onClick={() => handleExploreScene(scene.title, scene.moodId)}
                >
                  {scene.title}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
