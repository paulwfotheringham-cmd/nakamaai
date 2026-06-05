"use client";

import { useCallback, useEffect, useState } from "react";
import { GUIDE_VOICES } from "@/lib/guides/catalog";
import {
  type ChatSetupPreferences,
  writeForbiddenChatSetup,
} from "@/lib/guides/chat-setup";
import {
  getMoodById,
  MOOD_CARD_MOODS,
  pickNewAdventureMood,
  pickSurpriseMood,
  openingLinesForMood,
  SURPRISE_MOOD,
  TEN_MINUTE_ESCAPE,
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

const CONTINUE_HERO_IMAGE = "/tiles/tile4.jpg";

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

function MoodCardButton({
  mood,
  disabled,
  onSelect,
}: {
  mood: ForbiddenMood;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className="fc-mood-card group"
    >
      <img src={mood.image} alt="" className="fc-mood-card-img" />
      <span className="fc-mood-card-veil" aria-hidden />
      <span className="fc-mood-card-label">{mood.chipLabel}</span>
    </button>
  );
}

function HeroActionCard({
  image,
  eyebrow,
  title,
  meta,
  disabled,
  onClick,
  variant,
}: {
  image: string;
  eyebrow: string;
  title: string;
  meta: string;
  disabled?: boolean;
  onClick: () => void;
  variant: "continue" | "surprise";
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`fc-hero-card fc-hero-card--${variant} group`}
    >
      <img src={image} alt="" className="fc-hero-card-img" />
      <span className="fc-hero-card-veil" aria-hidden />
      <span className="fc-hero-card-body">
        <span className="fc-hero-card-eyebrow">{eyebrow}</span>
        <span className="fc-hero-card-title">{title}</span>
        <span className="fc-hero-card-meta">{meta}</span>
      </span>
    </button>
  );
}

export default function ForbiddenChatSetup({ onComplete, disabled }: ForbiddenChatSetupProps) {
  const [lastTitle, setLastTitle] = useState("Private Desires");

  useEffect(() => {
    if (hasSavedSession()) {
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
    onComplete({
      prefs: session.prefs,
      title: session.title,
      moodId: session.moodId,
      openingMessages: [],
      resumeMessages: session.messages,
    });
    writeForbiddenChatSetup(session.prefs);
  };

  const handleSurpriseMe = () => {
    const picked = pickSurpriseMood();
    startMood(
      { ...picked, id: "surprise-me", label: "Surprise Me", chipLabel: "Surprise Me" },
      false,
      "Surprise Me",
    );
  };

  const handleTenMinuteEscape = () => {
    startMood(TEN_MINUTE_ESCAPE);
  };

  const handleMood = (id: ForbiddenMoodId) => {
    const mood = getMoodById(id);
    if (mood) startMood(mood);
  };

  const handleNewAdventure = () => {
    const mood = pickNewAdventureMood();
    startMood(mood, true, "New Adventure");
  };

  return (
    <div className="launcher-panel fc-setup fc-emotional-landing">
      <div className="fc-setup-glow" aria-hidden />
      <div className="fc-atmosphere" aria-hidden />

      <div className="fc-browse-scroll">
        <header className="fc-hero">
          <p className="fc-hero-eyebrow">Forbidden Chat</p>
          <h1 className="fc-hero-title">What do you need tonight?</h1>
          <p className="fc-hero-sub">
            A little attention. A brief escape. Something familiar.
          </p>

          <div className="fc-hero-actions">
            <HeroActionCard
              variant="continue"
              image={CONTINUE_HERO_IMAGE}
              eyebrow="Pick up where you left off"
              title="Continue Last Story"
              meta={lastTitle}
              disabled={disabled}
              onClick={handleContinueLast}
            />
            <HeroActionCard
              variant="surprise"
              image={SURPRISE_MOOD.image}
              eyebrow="Let tonight decide"
              title="Surprise Me"
              meta={SURPRISE_MOOD.tagline}
              disabled={disabled}
              onClick={handleSurpriseMe}
            />
          </div>
        </header>

        <section className="fc-mood-section" aria-labelledby="fc-mood-heading">
          <h2 id="fc-mood-heading" className="fc-section-title">
            Tonight&apos;s Mood
          </h2>
          <div className="fc-mood-cards">
            {MOOD_CARD_MOODS.map((mood) => (
              <MoodCardButton
                key={mood.id}
                mood={mood}
                disabled={disabled}
                onSelect={() => handleMood(mood.id)}
              />
            ))}
          </div>
        </section>

        <section className="fc-shortcuts" aria-label="Quick entry">
          <button
            type="button"
            disabled={disabled}
            onClick={handleTenMinuteEscape}
            className="fc-shortcut group"
          >
            <img src={TEN_MINUTE_ESCAPE.image} alt="" className="fc-shortcut-img" />
            <span className="fc-shortcut-veil" aria-hidden />
            <span className="fc-shortcut-copy">
              <span className="fc-shortcut-title">10 Minute Escape</span>
              <span className="fc-shortcut-desc">A brief immersive moment</span>
            </span>
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={handleNewAdventure}
            className="fc-shortcut group"
          >
            <img src="/tiles/tile3.jpg" alt="" className="fc-shortcut-img" />
            <span className="fc-shortcut-veil" aria-hidden />
            <span className="fc-shortcut-copy">
              <span className="fc-shortcut-title">New Adventure</span>
              <span className="fc-shortcut-desc">Something fresh tonight</span>
            </span>
          </button>
        </section>
      </div>
    </div>
  );
}
