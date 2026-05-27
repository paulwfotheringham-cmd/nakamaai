"use client";

import { useEffect, useState } from "react";
import { GUIDE_VOICES } from "@/lib/guides/catalog";
import {
  CHARACTER_OPTIONS,
  CHAT_MOOD_OPTIONS,
  EXPERIENCE_LENGTH_OPTIONS,
  INTERACTION_STYLE_OPTIONS,
  SCENARIO_OPTIONS,
  buildGuidedStartMessage,
  type ChatSetupPreferences,
} from "@/lib/guides/chat-setup";
import { readGuidePreferences } from "@/lib/guides/preferences";

const SELECT_CLASS =
  "w-full rounded-lg border border-stone-700/80 bg-zinc-950/90 px-2.5 py-2 text-xs text-white focus:border-amber-500/45 focus:outline-none focus:ring-1 focus:ring-amber-500/25 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm";

function SetupSelect({
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
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-500/90 sm:text-[11px]">
        {label}
      </span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={SELECT_CLASS}
      >
        <option value="">Choose…</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

export type ForbiddenChatSetupResult = {
  prefs: ChatSetupPreferences;
  userMessage?: string;
  assistantNote: string;
};

type ForbiddenChatSetupProps = {
  onComplete: (result: ForbiddenChatSetupResult) => void;
  disabled?: boolean;
};

export default function ForbiddenChatSetup({ onComplete, disabled }: ForbiddenChatSetupProps) {
  const [experienceLength, setExperienceLength] = useState("");
  const [mood, setMood] = useState("");
  const [scenario, setScenario] = useState("");
  const [customScenario, setCustomScenario] = useState("");
  const [character, setCharacter] = useState("");
  const [interactionStyle, setInteractionStyle] = useState("");
  const [voiceId, setVoiceId] = useState("");
  const [setupError, setSetupError] = useState<string | null>(null);

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

  const handleUnfettered = () => {
    setSetupError(null);
    onComplete({
      prefs: {
        mode: "unfettered",
        voiceId: selectedVoice?.id,
        voiceName: selectedVoice?.name,
      },
      assistantNote:
        "You've got an open canvas — no rules, no script. Say anything and we'll go wherever you want.",
    });
  };

  const handleGuidedStart = () => {
    if (!guidedReady) {
      setSetupError("Please choose an option for each dropdown.");
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

  return (
    <div className="space-y-3 rounded-xl border border-amber-900/35 bg-black/40 p-3 sm:p-3.5">
      <button
        type="button"
        onClick={handleUnfettered}
        disabled={disabled}
        className="w-full rounded-full border border-amber-400/50 bg-gradient-to-b from-amber-200/95 to-amber-600 px-4 py-2.5 text-center text-sm font-bold text-zinc-950 shadow-md shadow-black/30 transition hover:from-amber-100 hover:to-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        I just want an unfettered chat
      </button>

      <p className="text-center text-[10px] font-medium uppercase tracking-[0.14em] text-stone-500">
        or shape your experience
      </p>

      <div className="space-y-2.5">
        <SetupSelect
          id="forbidden-experience-length"
          label="Choose your experience length"
          value={experienceLength}
          onChange={setExperienceLength}
          options={EXPERIENCE_LENGTH_OPTIONS}
          disabled={disabled}
        />
        <SetupSelect
          id="forbidden-chat-mood"
          label="Choose your mood"
          value={mood}
          onChange={setMood}
          options={CHAT_MOOD_OPTIONS}
          disabled={disabled}
        />
        <SetupSelect
          id="forbidden-chat-scenario"
          label="Choose your scenario"
          value={scenario}
          onChange={setScenario}
          options={SCENARIO_OPTIONS}
          disabled={disabled}
        />
        {scenario === "Create your own" && (
          <label htmlFor="forbidden-custom-scenario" className="block">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-500/90 sm:text-[11px]">
              Your scenario
            </span>
            <input
              id="forbidden-custom-scenario"
              type="text"
              value={customScenario}
              onChange={(e) => setCustomScenario(e.target.value)}
              placeholder="Describe your scene…"
              disabled={disabled}
              className={SELECT_CLASS}
            />
          </label>
        )}
        <SetupSelect
          id="forbidden-chat-character"
          label="Choose your character"
          value={character}
          onChange={setCharacter}
          options={CHARACTER_OPTIONS}
          disabled={disabled}
        />
        <SetupSelect
          id="forbidden-interaction-style"
          label="Choose your interaction style"
          value={interactionStyle}
          onChange={setInteractionStyle}
          options={INTERACTION_STYLE_OPTIONS}
          disabled={disabled}
        />
        <label htmlFor="forbidden-voice" className="block">
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-500/90 sm:text-[11px]">
            Choose your voice
          </span>
          <select
            id="forbidden-voice"
            value={voiceId}
            onChange={(e) => setVoiceId(e.target.value)}
            disabled={disabled}
            className={SELECT_CLASS}
          >
            <option value="">Choose…</option>
            {GUIDE_VOICES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {setupError && <p className="text-center text-xs text-red-400/90">{setupError}</p>}

      <button
        type="button"
        onClick={handleGuidedStart}
        disabled={disabled || !guidedReady}
        className="w-full rounded-full border border-stone-500/50 bg-stone-900/80 px-4 py-2.5 text-sm font-semibold text-stone-100 transition hover:border-stone-400 hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Start with these choices
      </button>
    </div>
  );
}