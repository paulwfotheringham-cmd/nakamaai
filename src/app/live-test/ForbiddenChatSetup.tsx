"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GUIDE_VOICES } from "@/lib/guides/catalog";
import {
  buildGuidedStartMessage,
  CHARACTER_OPTIONS,
  CHAT_MOOD_OPTIONS,
  EXPERIENCE_LENGTH_OPTIONS,
  INTERACTION_STYLE_OPTIONS,
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedVoice = readGuidePreferences().voiceId;
    if (savedVoice && GUIDE_VOICES.some((v) => v.id === savedVoice)) {
      setVoiceId(savedVoice);
    }
  }, []);

  const selectedVoice = GUIDE_VOICES.find((v) => v.id === voiceId);

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

  const handleStart = () => {
    if (disabled) return;
    setSetupError(null);

    if (mode === "unfettered") {
      onComplete({
        prefs: {
          mode: "unfettered",
          voiceId: selectedVoice?.id ?? readGuidePreferences().voiceId,
          voiceName: selectedVoice?.name,
        },
        assistantNote:
          "You've got an open canvas — no rules, no script. Say anything and we'll go wherever you want.",
      });
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

    const scenarioLabel =
      scenario === "Create your own" ? customScenario.trim() : scenario;

    onComplete({
      prefs,
      userMessage: buildGuidedStartMessage(prefs),
      assistantNote: `Perfect — ${experienceLength}, ${mood.toLowerCase()} mood, ${scenarioLabel}. Tell me how you'd like to begin.`,
    });
  };

  const startDisabled = disabled || (mode === "guided" && !guidedReady);

  return (
    <div className="launcher-panel fc-setup">
      <div className="fc-setup-glow" aria-hidden />

      <header className="launcher-panel-header fc-setup-header">
        <p className="launcher-eyebrow">Forbidden chat</p>
        <h1 className="launcher-title">Private desires</h1>
        <p className="launcher-subtitle">
          Craft a personalized experience through mood, scenario, character and interaction style.
        </p>
      </header>

      <div className="fc-setup-body">
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
            <p className="launcher-section-label">Your preferences</p>

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
              <div className="fc-field fc-field-full">
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
                  >
                    {previewingVoice ? "Playing…" : "Preview"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="fc-unfiltered-card">
            <p className="fc-unfiltered-title">Begin without boundaries</p>
            <p className="fc-unfiltered-copy">
              Jump straight into conversation — no mood, scene, or character preset. Your companion
              adapts as you go.
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
    </div>
  );
}
