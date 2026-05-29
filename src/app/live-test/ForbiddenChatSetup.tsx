"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GUIDE_VOICES } from "@/lib/guides/catalog";
import {
  buildGuidedStartMessage,
  INTERACTION_STYLE_OPTIONS,
  type ChatSetupPreferences,
} from "@/lib/guides/chat-setup";
import { readGuidePreferences } from "@/lib/guides/preferences";
import {
  FORBIDDEN_CHARACTER_TILES,
  FORBIDDEN_MOOD_TILES,
  FORBIDDEN_SCENARIO_TILES,
  FORBIDDEN_WIZARD_STEPS,
  pickSurprisePreferences,
} from "./forbidden-chat-ui-data";

export type ForbiddenChatSetupResult = {
  prefs: ChatSetupPreferences;
  userMessage?: string;
  assistantNote: string;
};

type ForbiddenChatSetupProps = {
  onComplete: (result: ForbiddenChatSetupResult) => void;
  disabled?: boolean;
};

type View = "landing" | "wizard";

function completeGuided(
  prefs: ChatSetupPreferences,
  onComplete: (r: ForbiddenChatSetupResult) => void,
) {
  const scenarioLabel =
    prefs.scenario === "Create your own" && prefs.customScenario?.trim()
      ? prefs.customScenario.trim()
      : prefs.scenario;

  onComplete({
    prefs,
    userMessage: buildGuidedStartMessage(prefs),
    assistantNote: `Perfect — ${prefs.experienceLength}, ${prefs.mood?.toLowerCase()} mood, ${scenarioLabel}. Tell me how you'd like to begin.`,
  });
}

export default function ForbiddenChatSetup({ onComplete, disabled }: ForbiddenChatSetupProps) {
  const [view, setView] = useState<View>("landing");
  const [step, setStep] = useState(0);
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
    const saved = readGuidePreferences().voiceId;
    if (saved && GUIDE_VOICES.some((v) => v.id === saved)) {
      setVoiceId(saved);
    }
  }, []);

  const selectedVoice = GUIDE_VOICES.find((v) => v.id === voiceId);
  const currentStep = FORBIDDEN_WIZARD_STEPS[step];

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

  const handleSurpriseMe = () => {
    if (disabled) return;
    setSetupError(null);
    const prefs = pickSurprisePreferences(readGuidePreferences().voiceId);
    completeGuided(prefs, onComplete);
  };

  const handleUnfettered = () => {
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
  };

  const canAdvanceStep = () => {
    if (step === 0) return Boolean(mood);
    if (step === 1) return Boolean(scenario) && (scenario !== "Create your own" || customScenario.trim());
    if (step === 2) return Boolean(character);
    if (step === 3) return Boolean(interactionStyle);
    if (step === 4) return Boolean(voiceId);
    return false;
  };

  const handleWizardNext = () => {
    if (!canAdvanceStep()) {
      setSetupError("Pick an option to continue.");
      return;
    }
    setSetupError(null);
    if (step < FORBIDDEN_WIZARD_STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }

    const prefs: ChatSetupPreferences = {
      mode: "guided",
      experienceLength: "Slow Burn",
      mood,
      scenario,
      customScenario: scenario === "Create your own" ? customScenario.trim() : undefined,
      character,
      interactionStyle,
      voiceId: selectedVoice!.id,
      voiceName: selectedVoice!.name,
    };
    completeGuided(prefs, onComplete);
  };

  const handleWizardBack = () => {
    setSetupError(null);
    if (step === 0) {
      setView("landing");
      return;
    }
    setStep((s) => s - 1);
  };

  const startWizard = () => {
    setSetupError(null);
    setStep(0);
    setView("wizard");
  };

  if (view === "landing") {
    return (
      <div className="forbidden-chat-setup">
        <div className="forbidden-chat-setup-atmosphere" aria-hidden />
        <div className="forbidden-chat-setup-glow forbidden-chat-setup-glow-a" aria-hidden />
        <div className="forbidden-chat-setup-glow forbidden-chat-setup-glow-b" aria-hidden />

        <header className="forbidden-chat-hero">
          <p className="forbidden-chat-eyebrow">Forbidden chat</p>
          <h1 className="forbidden-chat-title">Private desires</h1>
          <p className="forbidden-chat-lead">
            Voice or text — intimate, immediate, yours alone. Start in seconds or craft every detail.
          </p>
        </header>

        <section className="forbidden-chat-path forbidden-chat-path-primary">
          <p className="forbidden-chat-path-label">Quick start</p>
          <button
            type="button"
            disabled={disabled}
            onClick={handleSurpriseMe}
            className="forbidden-surprise-card group"
          >
            <img src="/tiles/tile4.jpg" alt="" className="forbidden-surprise-card-bg" />
            <div className="forbidden-surprise-card-overlay" aria-hidden />
            <div className="forbidden-surprise-card-content">
              <span className="forbidden-surprise-badge">Recommended</span>
              <h2 className="forbidden-surprise-title">Surprise me</h2>
              <p className="forbidden-surprise-copy">
                One tap — Nakama picks mood, character, and scenario from your taste and history.
              </p>
              <span className="forbidden-surprise-cta">Begin now →</span>
            </div>
          </button>
        </section>

        <section className="forbidden-chat-path">
          <p className="forbidden-chat-path-label">Custom experience</p>
          <button
            type="button"
            disabled={disabled}
            onClick={startWizard}
            className="forbidden-custom-card"
          >
            <div className="forbidden-custom-card-visual">
              <img src="/scenes/werewolf.jpg" alt="" className="forbidden-custom-thumb" />
              <img src="/scenes/office.jpg" alt="" className="forbidden-custom-thumb" />
              <img src="/tiles/tile5.jpg" alt="" className="forbidden-custom-thumb" />
            </div>
            <div className="forbidden-custom-card-body">
              <h3 className="forbidden-custom-title">Shape your fantasy</h3>
              <p className="forbidden-custom-copy">
                Mood, scenario, character, style, and voice — one choice at a time.
              </p>
              <span className="forbidden-custom-cta">Start wizard →</span>
            </div>
          </button>
        </section>

        <footer className="forbidden-chat-setup-footer">
          <button
            type="button"
            disabled={disabled}
            onClick={handleUnfettered}
            className="forbidden-link-btn"
          >
            Skip setup — open chat with no rules
          </button>
        </footer>
      </div>
    );
  }

  return (
    <div className="forbidden-chat-setup forbidden-chat-setup-wizard">
      <div className="forbidden-chat-setup-atmosphere" aria-hidden />

      <header className="forbidden-wizard-header">
        <button type="button" onClick={handleWizardBack} className="forbidden-wizard-back">
          ← Back
        </button>
        <div className="forbidden-wizard-progress" aria-label={`Step ${step + 1} of ${FORBIDDEN_WIZARD_STEPS.length}`}>
          {FORBIDDEN_WIZARD_STEPS.map((_, i) => (
            <span
              key={i}
              className={`forbidden-wizard-dot${i <= step ? " is-active" : ""}${i === step ? " is-current" : ""}`}
            />
          ))}
        </div>
        <span className="forbidden-wizard-step-count">
          {step + 1} / {FORBIDDEN_WIZARD_STEPS.length}
        </span>
      </header>

      <div className="forbidden-wizard-step-header">
        <h2 className="forbidden-wizard-title">{currentStep.title}</h2>
        <p className="forbidden-wizard-subtitle">{currentStep.subtitle}</p>
      </div>

      <div className="forbidden-wizard-body">
        {step === 0 && (
          <div className="forbidden-mood-grid">
            {FORBIDDEN_MOOD_TILES.map((tile) => (
              <button
                key={tile.value}
                type="button"
                disabled={disabled}
                onClick={() => setMood(tile.value)}
                className={`forbidden-select-card forbidden-mood-card${mood === tile.value ? " is-selected" : ""}`}
              >
                <img src={tile.image} alt="" className="forbidden-select-card-img" />
                <div className="forbidden-select-card-overlay" aria-hidden />
                <span className="forbidden-select-card-label">{tile.label}</span>
                <span className="forbidden-select-card-tag">{tile.tagline}</span>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <>
            <div className="forbidden-scenario-grid">
              {FORBIDDEN_SCENARIO_TILES.map((tile) => (
                <button
                  key={tile.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => setScenario(tile.value)}
                  className={`forbidden-select-card forbidden-scenario-card${scenario === tile.value ? " is-selected" : ""}`}
                >
                  <img src={tile.image} alt="" className="forbidden-select-card-img" />
                  <div className="forbidden-select-card-overlay" aria-hidden />
                  <span className="forbidden-select-card-label">{tile.label}</span>
                  <span className="forbidden-select-card-tag">{tile.tagline}</span>
                </button>
              ))}
            </div>
            {scenario === "Create your own" && (
              <label className="forbidden-custom-scenario-field">
                <span className="forbidden-custom-scenario-label">Describe your scene</span>
                <input
                  type="text"
                  value={customScenario}
                  onChange={(e) => setCustomScenario(e.target.value)}
                  placeholder="A penthouse, a storm, a secret…"
                  disabled={disabled}
                  className="forbidden-custom-scenario-input"
                />
              </label>
            )}
          </>
        )}

        {step === 2 && (
          <div className="forbidden-character-grid">
            {FORBIDDEN_CHARACTER_TILES.map((tile) => (
              <button
                key={tile.value}
                type="button"
                disabled={disabled}
                onClick={() => setCharacter(tile.value)}
                className={`forbidden-character-card${character === tile.value ? " is-selected" : ""}`}
              >
                <img src={tile.image} alt="" className="forbidden-character-img" />
                <div className="forbidden-character-overlay" aria-hidden />
                <div className="forbidden-character-body">
                  <p className="forbidden-character-personality">{tile.personality}</p>
                  <h3 className="forbidden-character-name">{tile.label}</h3>
                  <p className="forbidden-character-desc">{tile.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="forbidden-style-chips">
            {INTERACTION_STYLE_OPTIONS.map((style) => (
              <button
                key={style}
                type="button"
                disabled={disabled}
                onClick={() => setInteractionStyle(style)}
                className={`forbidden-style-chip${interactionStyle === style ? " is-selected" : ""}`}
              >
                {style}
              </button>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="forbidden-voice-list">
            {GUIDE_VOICES.map((v) => (
              <div
                key={v.id}
                className={`forbidden-voice-row${voiceId === v.id ? " is-selected" : ""}`}
              >
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => setVoiceId(v.id)}
                  className="forbidden-voice-select"
                >
                  <span className="forbidden-voice-name">{v.name}</span>
                  {voiceId === v.id ? <span className="forbidden-voice-check">Selected</span> : null}
                </button>
                <button
                  type="button"
                  disabled={disabled || previewingVoice !== null}
                  onClick={() => playVoicePreview(v.id, v.name)}
                  className="forbidden-voice-preview"
                  aria-label={`Preview ${v.name}`}
                >
                  {previewingVoice === v.id ? "…" : "▶ Preview"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {setupError ? <p className="forbidden-setup-error">{setupError}</p> : null}

      <footer className="forbidden-wizard-footer">
        <button
          type="button"
          disabled={disabled || !canAdvanceStep()}
          onClick={handleWizardNext}
          className="forbidden-wizard-next"
        >
          {step === FORBIDDEN_WIZARD_STEPS.length - 1 ? "Begin chat" : "Continue"}
        </button>
      </footer>
    </div>
  );
}
