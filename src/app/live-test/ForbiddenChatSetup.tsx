"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GUIDE_VOICES } from "@/lib/guides/catalog";
import {
  buildGuidedStartMessage,
  CHARACTER_OPTIONS,
  CHAT_MOOD_OPTIONS,
  EXPERIENCE_LENGTH_OPTIONS,
  INTERACTION_STYLE_OPTIONS,
  readForbiddenChatSetup,
  SCENARIO_OPTIONS,
  type ChatSetupPreferences,
} from "@/lib/guides/chat-setup";
import { readGuidePreferences } from "@/lib/guides/preferences";

export type ForbiddenChatSetupResult = {
  prefs: ChatSetupPreferences;
  userMessage?: string;
  assistantNote: string;
};

type ForbiddenChatSetupProps = {
  onComplete: (result: ForbiddenChatSetupResult) => void;
  disabled?: boolean;
};

type ExperienceMode = "unfettered" | "guided";

type MoodPreset = {
  id: string;
  title: string;
  desc: string;
  image: string;
  prefs: Omit<ChatSetupPreferences, "mode" | "voiceId" | "voiceName">;
};

type RecentConversation = {
  id: string;
  title: string;
  lastActive: string;
  image: string;
  imagePosition?: string;
  prefs: ChatSetupPreferences;
};

const MOOD_PRESETS: MoodPreset[] = [
  {
    id: "romantic-connection",
    title: "Romantic Connection",
    desc: "Emotional and intimate",
    image: "/tiles/lover.jpg",
    prefs: {
      experienceLength: "Slow Burn",
      mood: "Romantic",
      scenario: "Vacation Fantasy",
      character: "Best Friend",
      interactionStyle: "Romantic Roleplay",
    },
  },
  {
    id: "quick-escape",
    title: "Quick Escape",
    desc: "Short immersive experience",
    image: "/tiles/tile6.jpg",
    prefs: {
      experienceLength: "Quick Escape",
      mood: "Playful",
      scenario: "Late Night Call",
      character: "Mysterious Stranger",
      interactionStyle: "Sexy Chat",
    },
  },
  {
    id: "surprise-me",
    title: "Surprise Me",
    desc: "Generate something unexpected",
    image: "/tiles/tile3.jpg",
    prefs: {
      experienceLength: "Quick Escape",
      mood: "Teasing",
      scenario: "Stranger Encounter",
      character: "Confident Woman",
      interactionStyle: "Flirty Conversation",
    },
  },
  {
    id: "forbidden-tension",
    title: "Forbidden Tension",
    desc: "High chemistry and anticipation",
    image: "/tiles/taboo.jpg",
    prefs: {
      experienceLength: "Slow Burn",
      mood: "Forbidden",
      scenario: "Secret Affair",
      character: "Older Stranger",
      interactionStyle: "Guided Fantasy",
    },
  },
  {
    id: "dominant-energy",
    title: "Dominant Energy",
    desc: "Confident and commanding",
    image: "/tiles/powerplay.jpg",
    prefs: {
      experienceLength: "All Night",
      mood: "Dominant",
      scenario: "Office Tension",
      character: "Boss / Authority",
      interactionStyle: "Power Dynamic",
    },
  },
];

const HERO_MOOD_IDS = ["romantic-connection", "quick-escape", "surprise-me"] as const;
const HERO_MOODS = HERO_MOOD_IDS.map(
  (id) => MOOD_PRESETS.find((p) => p.id === id)!,
);
const SECONDARY_MOODS = MOOD_PRESETS.filter((p) =>
  ["forbidden-tension", "dominant-energy"].includes(p.id),
);

const MAX_RECENT_STORIES = 3;

const RECENT_CONVERSATIONS: RecentConversation[] = [
  {
    id: "private-desires",
    title: "Private Desires",
    lastActive: "Active now",
    image: "/tiles/tile4.jpg",
    imagePosition: "center center",
    prefs: {
      mode: "guided",
      experienceLength: "Ongoing Affair",
      mood: "Passionate",
      scenario: "Anonymous Chat",
      character: "Mysterious Stranger",
      interactionStyle: "Sexy Chat",
      voiceId: "leo",
      voiceName: "Leo",
    },
  },
  {
    id: "late-night",
    title: "Late Night Call",
    lastActive: "2 days ago",
    image: "/tiles/slowburn.jpg",
    prefs: {
      mode: "guided",
      experienceLength: "Slow Burn",
      mood: "Romantic",
      scenario: "Late Night Call",
      character: "Confident Man",
      interactionStyle: "Voice Fantasy",
      voiceId: "aurora",
      voiceName: "Aurora",
    },
  },
  {
    id: "hotel-encounter",
    title: "Hotel Encounter",
    lastActive: "Last week",
    image: "/tiles/daddy.jpg",
    prefs: {
      mode: "guided",
      experienceLength: "All Night",
      mood: "Luxury",
      scenario: "Hotel Encounter",
      character: "Experienced Lover",
      interactionStyle: "Roleplay Story",
      voiceId: "ash",
      voiceName: "Ash",
    },
  },
];

function SelectChevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="fc-select-chevron" aria-hidden>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function PremiumSelect({
  id,
  label,
  value,
  onChange,
  options,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  disabled?: boolean;
}) {
  return (
    <label htmlFor={id} className="fc-field">
      <span className="fc-field-label">{label}</span>
      <span className="fc-select-wrap">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="fc-select"
        >
          <option value="">Select…</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <SelectChevron />
      </span>
    </label>
  );
}

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function ForbiddenChatSetup({ onComplete, disabled }: ForbiddenChatSetupProps) {
  const [mode, setMode] = useState<ExperienceMode>("guided");
  const [experienceLength, setExperienceLength] = useState("");
  const [mood, setMood] = useState("");
  const [scenario, setScenario] = useState("");
  const [customScenario, setCustomScenario] = useState("");
  const [character, setCharacter] = useState("");
  const [interactionStyle, setInteractionStyle] = useState("");
  const [voiceId, setVoiceId] = useState("");
  const [setupError, setSetupError] = useState<string | null>(null);
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedVoice = readGuidePreferences().voiceId;
    if (savedVoice && GUIDE_VOICES.some((v) => v.id === savedVoice)) {
      setVoiceId(savedVoice);
    } else if (GUIDE_VOICES[0]) {
      setVoiceId(GUIDE_VOICES[0].id);
    }
  }, []);

  const selectedVoice = GUIDE_VOICES.find((v) => v.id === voiceId);

  const lastSession = useMemo(() => {
    if (typeof window === "undefined") return null;
    return readForbiddenChatSetup();
  }, []);

  const guidedReady =
    experienceLength &&
    mood &&
    scenario &&
    character &&
    interactionStyle &&
    voiceId &&
    (scenario !== "Create your own" || customScenario.trim());

  const playVoicePreview = useCallback(async (id: string, name: string) => {
    setPreviewingVoice(id);
    try {
      const res = await fetch("/api/preview-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voice: name,
          text: "Come closer. I've been waiting for you.",
        }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.pause();
      audioRef.current.src = url;
      await audioRef.current.play();
    } catch {
      /* ignore */
    } finally {
      setPreviewingVoice(null);
    }
  }, []);

  const startGuided = useCallback(
    (prefs: ChatSetupPreferences) => {
      if (disabled) return;
      setSetupError(null);

      const scenarioLabel =
        prefs.scenario === "Create your own" && prefs.customScenario?.trim()
          ? prefs.customScenario.trim()
          : prefs.scenario;

      onComplete({
        prefs,
        userMessage: buildGuidedStartMessage(prefs),
        assistantNote: `Perfect — ${prefs.experienceLength}, ${prefs.mood?.toLowerCase()} mood, ${scenarioLabel}. Tell me how you'd like to begin.`,
      });
    },
    [disabled, onComplete],
  );

  const startUnfettered = useCallback(() => {
    if (disabled) return;
    setSetupError(null);
    onComplete({
      prefs: {
        mode: "unfettered",
        voiceId: selectedVoice?.id ?? readGuidePreferences().voiceId,
        voiceName: selectedVoice?.name,
      },
      assistantNote:
        "You've got an open canvas — no rules, no script. Say anything and we'll go wherever you want.",
    });
  }, [disabled, onComplete, selectedVoice]);

  const resolveVoice = useCallback(
    (fallbackId?: string, fallbackName?: string) => {
      const voice =
        GUIDE_VOICES.find((v) => v.id === voiceId) ??
        GUIDE_VOICES.find((v) => v.id === fallbackId) ??
        GUIDE_VOICES[0];
      return {
        voiceId: voice?.id ?? fallbackId ?? "",
        voiceName: voice?.name ?? fallbackName,
      };
    },
    [voiceId],
  );

  const handleMoodCard = (preset: MoodPreset) => {
    if (disabled) return;
    setSetupError(null);

    if (preset.id === "surprise-me") {
      const { voiceId: vId, voiceName } = resolveVoice();
      if (!vId) {
        setSetupError("Choose a voice in Customize Experience to continue.");
        setCustomizeOpen(true);
        return;
      }
      startGuided({
        mode: "guided",
        experienceLength: pickRandom(EXPERIENCE_LENGTH_OPTIONS),
        mood: pickRandom(CHAT_MOOD_OPTIONS),
        scenario: pickRandom(SCENARIO_OPTIONS.filter((s) => s !== "Create your own")),
        character: pickRandom(CHARACTER_OPTIONS),
        interactionStyle: pickRandom(INTERACTION_STYLE_OPTIONS),
        voiceId: vId,
        voiceName,
      });
      return;
    }

    const { voiceId: vId, voiceName } = resolveVoice();
    if (!vId) {
      setSetupError("Choose a voice in Customize Experience to continue.");
      setCustomizeOpen(true);
      return;
    }

    startGuided({
      mode: "guided",
      ...preset.prefs,
      voiceId: vId,
      voiceName,
    });
  };

  const handleContinueLast = () => {
    if (disabled) return;
    setSetupError(null);
    const saved = readForbiddenChatSetup();
    if (!saved) {
      setSetupError("No recent story found. Pick a mood or start a new experience below.");
      return;
    }
    if (saved.mode === "unfettered") {
      onComplete({
        prefs: saved,
        assistantNote:
          "Welcome back — your open conversation is ready. Pick up wherever your imagination takes you.",
      });
      return;
    }
    const { voiceId: vId, voiceName } = resolveVoice(saved.voiceId, saved.voiceName);
    startGuided({ ...saved, mode: "guided", voiceId: vId, voiceName });
  };

  const handleContinueConversation = (conv: RecentConversation) => {
    if (disabled) return;
    setSetupError(null);
    const { voiceId: vId, voiceName } = resolveVoice(conv.prefs.voiceId, conv.prefs.voiceName);
    if (conv.prefs.mode === "unfettered") {
      onComplete({
        prefs: { ...conv.prefs, voiceId: vId, voiceName },
        assistantNote: "Picking up your conversation — say what happens next.",
      });
      return;
    }
    startGuided({ ...conv.prefs, voiceId: vId, voiceName });
  };

  const handleStart = () => {
    if (disabled) return;
    setSetupError(null);

    if (mode === "unfettered") {
      startUnfettered();
      return;
    }

    if (!guidedReady) {
      setSetupError("Complete each field to begin your guided experience.");
      return;
    }
    if (scenario === "Create your own" && !customScenario.trim()) {
      setSetupError("Describe your custom scenario.");
      return;
    }

    const prefs: ChatSetupPreferences = {
      mode: "guided",
      experienceLength,
      mood,
      scenario,
      customScenario: scenario === "Create your own" ? customScenario.trim() : undefined,
      character,
      interactionStyle,
      voiceId: selectedVoice!.id,
      voiceName: selectedVoice!.name,
    };

    startGuided(prefs);
  };

  const startDisabled = disabled || (mode === "guided" && !guidedReady);

  return (
    <div className="launcher-panel fc-setup fc-browse">
      <div className="fc-setup-glow" aria-hidden />

      <div className="fc-browse-scroll">
        {/* SECTION 1 — Hero: 3 choices + quick actions */}
        <header className="fc-hero">
          <p className="fc-hero-eyebrow">Forbidden Chat</p>
          <h1 className="fc-hero-title">What are you in the mood for tonight?</h1>
          <p className="fc-hero-sub">Choose an experience or continue where you left off.</p>

          <div className="fc-hero-cards">
            {HERO_MOODS.map((card) => (
              <button
                key={card.id}
                type="button"
                disabled={disabled}
                onClick={() => handleMoodCard(card)}
                className="fc-hero-card"
              >
                <img src={card.image} alt="" className="fc-hero-card-img" />
                <span className="fc-hero-card-overlay" aria-hidden />
                <span className="fc-hero-card-copy">
                  <span className="fc-hero-card-title">{card.title}</span>
                  <span className="fc-hero-card-desc">{card.desc}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="fc-action-chips" role="group" aria-label="More options">
            <button
              type="button"
              disabled={disabled}
              onClick={handleContinueLast}
              className={`fc-action-chip${lastSession ? " fc-action-chip--highlight" : ""}`}
            >
              Continue last story
            </button>
            {SECONDARY_MOODS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                disabled={disabled}
                onClick={() => handleMoodCard(preset)}
                className="fc-action-chip"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </header>

        {/* SECTION 2 — Continue your stories (max 3) */}
        <section className="fc-stories-section">
          <h2 className="fc-section-title">Continue your stories</h2>
          <div className="fc-stories-grid">
            {RECENT_CONVERSATIONS.slice(0, MAX_RECENT_STORIES).map((conv) => (
              <div key={conv.id} className="fc-story-card mdb-card group">
                <img
                  src={conv.image}
                  alt=""
                  className="mdb-card-img"
                  style={conv.imagePosition ? { objectPosition: conv.imagePosition } : undefined}
                />
                <div className="mdb-card-veil" aria-hidden />
                <div className="mdb-card-content">
                  <p className="mdb-card-category">Forbidden Chat</p>
                  <h3 className="mdb-card-title">{conv.title}</h3>
                  <p className="fc-story-meta">{conv.lastActive}</p>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => handleContinueConversation(conv)}
                    className="mdb-card-btn"
                  >
                    Continue
                    <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5 shrink-0" aria-hidden>
                      <path
                        d="M3 6h7M7 3.5 9.5 6 7 8.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3 — Customize (collapsed) */}
        <section className="fc-create-section">
          <div className={`fc-customize-panel${customizeOpen ? " is-open" : ""}`}>
            <button
              type="button"
              className="fc-customize-toggle"
              aria-expanded={customizeOpen}
              disabled={disabled}
              onClick={() => setCustomizeOpen((o) => !o)}
            >
              <span className="fc-customize-toggle-label">Customize Experience</span>
              <span className="fc-customize-toggle-hint">
                Mood, character, scenario, voice &amp; more
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className={`fc-customize-chevron${customizeOpen ? " is-open" : ""}`}
                aria-hidden
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </button>

            {customizeOpen ? (
              <div className="fc-customize-body">
                <div className="fc-mode-switch" role="tablist" aria-label="Experience mode">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === "unfettered"}
                    disabled={disabled}
                    onClick={() => {
                      setMode("unfettered");
                      setSetupError(null);
                    }}
                    className={`fc-mode-option${mode === "unfettered" ? " is-active" : ""}`}
                  >
                    <span className="fc-mode-title">Unfiltered chat</span>
                    <span className="fc-mode-desc">Open canvas — no preset scene</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === "guided"}
                    disabled={disabled}
                    onClick={() => {
                      setMode("guided");
                      setSetupError(null);
                    }}
                    className={`fc-mode-option${mode === "guided" ? " is-active" : ""}`}
                  >
                    <span className="fc-mode-title">Guided experience</span>
                    <span className="fc-mode-desc">Shape mood, scene, and voice</span>
                  </button>
                </div>

                {mode === "guided" ? (
                  <div className="fc-form-card">
                    <div className="fc-form-grid">
                      <PremiumSelect
                        id="fc-experience-length"
                        label="Experience length"
                        value={experienceLength}
                        onChange={setExperienceLength}
                        options={EXPERIENCE_LENGTH_OPTIONS}
                        disabled={disabled}
                      />
                      <PremiumSelect
                        id="fc-mood"
                        label="Mood"
                        value={mood}
                        onChange={setMood}
                        options={CHAT_MOOD_OPTIONS}
                        disabled={disabled}
                      />
                      <PremiumSelect
                        id="fc-scenario"
                        label="Scenario"
                        value={scenario}
                        onChange={setScenario}
                        options={SCENARIO_OPTIONS}
                        disabled={disabled}
                      />
                      {scenario === "Create your own" ? (
                        <label htmlFor="fc-custom-scenario" className="fc-field fc-field-full">
                          <span className="fc-field-label">Your scenario</span>
                          <input
                            id="fc-custom-scenario"
                            type="text"
                            value={customScenario}
                            onChange={(e) => setCustomScenario(e.target.value)}
                            placeholder="Describe your scene…"
                            disabled={disabled}
                            className="fc-input"
                          />
                        </label>
                      ) : null}
                      <PremiumSelect
                        id="fc-character"
                        label="Character"
                        value={character}
                        onChange={setCharacter}
                        options={CHARACTER_OPTIONS}
                        disabled={disabled}
                      />
                      <PremiumSelect
                        id="fc-interaction-style"
                        label="Interaction style"
                        value={interactionStyle}
                        onChange={setInteractionStyle}
                        options={INTERACTION_STYLE_OPTIONS}
                        disabled={disabled}
                      />
                      <div className="fc-field">
                        <span className="fc-field-label">Voice</span>
                        <div className="fc-voice-row">
                          <span className="fc-select-wrap fc-select-wrap-grow">
                            <select
                              id="fc-voice"
                              value={voiceId}
                              onChange={(e) => setVoiceId(e.target.value)}
                              disabled={disabled}
                              className="fc-select"
                            >
                              <option value="">Select…</option>
                              {GUIDE_VOICES.map((v) => (
                                <option key={v.id} value={v.id}>
                                  {v.name}
                                </option>
                              ))}
                            </select>
                            <SelectChevron />
                          </span>
                          <button
                            type="button"
                            disabled={disabled || !voiceId || previewingVoice !== null}
                            onClick={() => {
                              const v = GUIDE_VOICES.find((x) => x.id === voiceId);
                              if (v) void playVoicePreview(v.id, v.name);
                            }}
                            className="fc-voice-preview"
                            title="Preview voice"
                          >
                            {previewingVoice ? "…" : "▶"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="fc-unfiltered-card">
                    <p className="fc-unfiltered-title">Begin without boundaries</p>
                    <p className="fc-unfiltered-copy">
                      Jump straight into conversation — no mood, scene, or character preset. Your
                      companion adapts as you go.
                    </p>
                  </div>
                )}

                {setupError ? <p className="fc-setup-error">{setupError}</p> : null}

                <button
                  type="button"
                  disabled={startDisabled}
                  onClick={handleStart}
                  className="fc-start-btn"
                >
                  Start your experience
                </button>
              </div>
            ) : null}
          </div>
        </section>

        {setupError && !customizeOpen ? (
          <p className="fc-setup-error fc-setup-error--floating">{setupError}</p>
        ) : null}
      </div>
    </div>
  );
}
