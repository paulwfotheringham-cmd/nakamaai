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

function resolveVoice(): { voiceId: string; voiceName?: string } {
  const guideVoice = readGuidePreferences().voiceId;
  const voice =
    GUIDE_VOICES.find((v) => v.id === guideVoice) ?? GUIDE_VOICES[0];
  return { voiceId: voice?.id ?? "", voiceName: voice?.name };
}

function buildStart(
  mood: ForbiddenMood,
  options?: { fresh?: boolean; resume?: ForbiddenChatMessage[] },
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
      title: mood.label,
      moodId: mood.id,
      openingMessages: [],
      resumeMessages: options.resume,
    };
  }

  const lines = openingLinesForMood(mood, options?.fresh);
  return {
    prefs,
    title: mood.label,
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
    (mood: ForbiddenMood, fresh = false) => {
      if (disabled) return;
      onComplete(buildStart(mood, { fresh }));
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
      startMood({ ...picked, id: "surprise-me", label: "Surprise Me" });
      return;
    }
    const mood = getMoodById(id);
    if (mood) startMood(mood);
  };

  const handleNewAdventure = () => {
    const mood = pickNewAdventureMood();
    startMood(mood, true);
  };

  return (
    <div className="launcher-panel fc-setup fc-mood-landing">
      <div className="fc-setup-glow" aria-hidden />

      <div className="fc-browse-scroll">
        <header className="fc-landing-head">
          <p className="fc-hero-eyebrow">Forbidden Chat</p>
          <h1 className="fc-hero-title">What do you need tonight?</h1>
          <p className="fc-hero-sub">
            Attention, escape, or something familiar — one tap and you&apos;re in the story.
          </p>
        </header>

        <div className="fc-primary-stack">
          <button
            type="button"
            disabled={disabled}
            onClick={handleContinueLast}
            className="fc-continue-primary"
          >
            <span className="fc-continue-primary-label">Continue Last Story</span>
            <span className="fc-continue-primary-meta">
              {hasLast
                ? `Pick up ${lastTitle} — right where you stopped`
                : `Pick up ${lastTitle} — your most recent scene`}
            </span>
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={handleTenMinuteEscape}
            className="fc-escape-card"
          >
            <img src={TEN_MINUTE_ESCAPE.image} alt="" className="fc-escape-card-img" />
            <span className="fc-escape-card-veil" aria-hidden />
            <span className="fc-escape-card-copy">
              <span className="fc-escape-card-title">10 Minute Escape</span>
              <span className="fc-escape-card-desc">{TEN_MINUTE_ESCAPE.tagline}</span>
            </span>
          </button>
        </div>

        <section className="fc-mood-section" aria-labelledby="fc-mood-heading">
          <div className="fc-mood-section-head">
            <h2 id="fc-mood-heading" className="fc-section-title">
              Tonight&apos;s Mood
            </h2>
            <p className="fc-mood-section-lead">Tap a feeling — the conversation starts immediately.</p>
          </div>
          <div className="fc-mood-grid" role="list">
            {TONIGHT_MOODS.map((mood) => (
              <button
                key={mood.id}
                type="button"
                role="listitem"
                disabled={disabled}
                onClick={() => handleMood(mood.id)}
                className="fc-mood-tile"
              >
                <img src={mood.image} alt="" className="fc-mood-tile-img" />
                <span className="fc-mood-tile-veil" aria-hidden />
                <span className="fc-mood-tile-label">{mood.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="fc-adventure-section" aria-labelledby="fc-adventure-heading">
          <button
            type="button"
            id="fc-adventure-heading"
            disabled={disabled}
            onClick={handleNewAdventure}
            className="fc-adventure-btn"
          >
            <span className="fc-adventure-title">New Adventure</span>
            <span className="fc-adventure-desc">
              A fresh experience woven from tonight&apos;s energy — no forms, no waiting.
            </span>
          </button>
        </section>
      </div>
    </div>
  );
}
