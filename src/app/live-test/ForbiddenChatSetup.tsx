"use client";

import { useCallback, useEffect, useState } from "react";
import { GUIDE_VOICES } from "@/lib/guides/catalog";
import {
  type ChatSetupPreferences,
  writeForbiddenChatSetup,
} from "@/lib/guides/chat-setup";
import {
  getMoodById,
  LANDING_MOOD_GRID,
  pickSurpriseMood,
  openingLinesForMood,
  type ForbiddenMood,
  type ForbiddenMoodId,
} from "@/lib/guides/forbidden-chat-moods";
import {
  QUICK_STARTS,
  type QuickStart,
} from "@/lib/guides/forbidden-chat-quick-starts";
import {
  getContinueLastSession,
  messagesFromOpenings,
  sceneReminderFromOpenings,
  type ForbiddenChatMessage,
} from "@/lib/guides/forbidden-chat-session";
import { readGuidePreferences } from "@/lib/guides/preferences";

export type ForbiddenChatSetupResult = {
  prefs: ChatSetupPreferences;
  title: string;
  moodId?: ForbiddenMoodId;
  sceneReminder?: string;
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
  options?: {
    fresh?: boolean;
    resume?: ForbiddenChatMessage[];
    title?: string;
    openings?: string[];
    sceneReminder?: string;
  },
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
      sceneReminder: options.sceneReminder,
      openingMessages: [],
      resumeMessages: options.resume,
    };
  }

  const lines = options?.openings ?? openingLinesForMood(mood, options?.fresh);
  const openingMessages = messagesFromOpenings(lines);
  return {
    prefs,
    title: options?.title ?? mood.label,
    moodId: mood.id,
    sceneReminder: options?.sceneReminder ?? sceneReminderFromOpenings(lines),
    openingMessages,
  };
}

function buildFromQuickStart(quick: QuickStart): ForbiddenChatSetupResult {
  const mood = getMoodById(quick.moodId);
  if (!mood) {
    return buildStart(
      {
        id: quick.moodId,
        label: quick.label,
        chipLabel: quick.label,
        tagline: quick.label,
        promise: quick.label,
        image: "/tiles/tile4.jpg",
        prefs: quick.prefs,
        openings: [quick.openings],
      },
      { title: quick.label, openings: quick.openings },
    );
  }
  return buildStart(mood, { title: quick.label, openings: quick.openings });
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
      <span className="fc-mood-card-copy">
        <span className="fc-mood-card-title">{mood.chipLabel}</span>
        <span className="fc-mood-card-promise">{mood.promise}</span>
      </span>
    </button>
  );
}

export default function ForbiddenChatSetup({ onComplete, disabled }: ForbiddenChatSetupProps) {
  const [continueTitle, setContinueTitle] = useState("Private Desires");
  const [continueReminder, setContinueReminder] = useState(
    "They had just asked what you wanted tonight — the message still glows on your screen, unanswered.",
  );

  useEffect(() => {
    const session = getContinueLastSession();
    setContinueTitle(session.title);
    const fallback = session.messages.find((m) => m.role === "assistant")?.text;
    const reminder = session.sceneReminder ?? fallback?.split("\n")[0]?.trim();
    if (reminder) {
      setContinueReminder(reminder.length > 110 ? `${reminder.slice(0, 107)}…` : reminder);
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
      getMoodById(session.moodId ?? "comfort-attention") ?? LANDING_MOOD_GRID[0];
    const bridge: ForbiddenChatMessage = {
      id: `resume-bridge-${Date.now()}`,
      role: "assistant",
      text: "You're back. They're still here — pick up the thread whenever you're ready.",
    };
    onComplete({
      prefs: session.prefs,
      title: session.title,
      moodId: session.moodId,
      sceneReminder: session.sceneReminder,
      openingMessages: [],
      resumeMessages: [...session.messages, bridge],
    });
    writeForbiddenChatSetup(session.prefs);
  };

  const handleMood = (id: ForbiddenMoodId) => {
    if (id === "surprise-me") {
      const picked = pickSurpriseMood();
      startMood(
        { ...picked, id: "surprise-me", label: "Surprise Me", chipLabel: "Surprise Me" },
        false,
        "Surprise Me",
      );
      return;
    }
    const mood = getMoodById(id);
    if (mood) startMood(mood);
  };

  const handleQuickStart = (quick: QuickStart) => {
    if (disabled) return;
    onComplete(buildFromQuickStart(quick));
  };

  return (
    <div className="launcher-panel fc-setup fc-emotional-landing">
      <div className="fc-setup-glow" aria-hidden />
      <div className="fc-atmosphere" aria-hidden />

      <div className="fc-browse-scroll">
        <header className="fc-hero fc-hero--compact">
          <p className="fc-hero-eyebrow">Forbidden Chat</p>
          <h1 className="fc-hero-title">What do you need tonight?</h1>
          <p className="fc-hero-sub">
            A little attention. A brief escape. Something familiar.
          </p>
        </header>

        <section className="fc-continue-dest" aria-label="Continue your story">
          <button
            type="button"
            disabled={disabled}
            onClick={handleContinueLast}
            className="fc-continue-story group"
          >
            <img src={CONTINUE_HERO_IMAGE} alt="" className="fc-continue-story-img" />
            <span className="fc-continue-story-veil" aria-hidden />
            <span className="fc-continue-story-body">
              <span className="fc-continue-story-eyebrow">Continue where you left off</span>
              <span className="fc-continue-story-title">{continueTitle}</span>
              <span className="fc-continue-story-reminder">{continueReminder}</span>
              <span className="fc-continue-story-cta">
                Resume
                <svg viewBox="0 0 12 12" fill="currentColor" className="fc-continue-story-cta-icon" aria-hidden>
                  <polygon points="3,2 10,6 3,10" />
                </svg>
              </span>
            </span>
          </button>
        </section>

        <section className="fc-mood-section" aria-labelledby="fc-mood-heading">
          <h2 id="fc-mood-heading" className="fc-section-title">
            Tonight&apos;s Mood
          </h2>
          <div className="fc-mood-cards">
            {LANDING_MOOD_GRID.map((mood) => (
              <MoodCardButton
                key={mood.id}
                mood={mood}
                disabled={disabled}
                onSelect={() => handleMood(mood.id)}
              />
            ))}
          </div>
        </section>

        <section className="fc-quick-starts" aria-labelledby="fc-quick-heading">
          <h2 id="fc-quick-heading" className="fc-section-title">
            Quick Starts
          </h2>
          <p className="fc-quick-starts-hint">Tap one — no typing required.</p>
          <div className="fc-quick-starts-row" role="list">
            {QUICK_STARTS.map((quick) => (
              <button
                key={quick.id}
                type="button"
                role="listitem"
                disabled={disabled}
                onClick={() => handleQuickStart(quick)}
                className="fc-quick-start-btn"
              >
                {quick.label}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
