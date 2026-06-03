"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GUIDE_VOICES } from "@/lib/guides/catalog";
import {
  buildGuidedStartMessage,
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

const MOOD_OPTIONS = [
  "Playful", "Dominant", "Forbidden", "Dangerous", "Slow Burn", "Obsessive",
] as const;

const SCENARIO_OPTIONS = [
  "Office Tension", "Stranger", "Bodyguard", "CEO", "Rival", "Professor",
] as const;

const CHARACTER_OPTIONS = [
  "Older Stranger", "Protective Alpha", "Mysterious Billionaire", "Best Friend", "Enemy",
] as const;

const STYLE_OPTIONS = [
  "Flirty", "Explicit", "Slow Burn", "Emotional", "Teasing",
] as const;

const SCENE_OPENERS: Record<string, string> = {
  "Office Tension": "The office is almost empty when he finally speaks.",
  "Stranger": "You weren't expecting him to sit there.",
  "Bodyguard": "He never looks directly at you. But he always knows exactly where you are.",
  "CEO": "His office is on the top floor. You've never been invited before tonight.",
  "Rival": "You've always known it would end like this between you.",
  "Professor": "The lecture hall is empty. Only you stayed behind.",
};

function buildPreview(mood: string, scenario: string, character: string, style: string): string {
  if (!mood && !scenario && !character && !style) return "";
  let s = "";
  if (scenario) s += scenario;
  if (mood && scenario) s += ` — ${mood.toLowerCase()}`;
  else if (mood) s += mood;
  if (character) s += `. A ${character.toLowerCase()}`;
  if (style) s += `. ${style}`;
  return s ? s + "." : "";
}

function Chip({
  label,
  selected,
  onClick,
  disabled,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`fc-chip${selected ? " fc-chip-selected" : ""}`}
    >
      {label}
    </button>
  );
}

export default function ForbiddenChatSetup({ onComplete, disabled }: ForbiddenChatSetupProps) {
  const [mood, setMood] = useState("");
  const [scenario, setScenario] = useState("");
  const [character, setCharacter] = useState("");
  const [style, setStyle] = useState("");
  const [voiceId, setVoiceId] = useState("");
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedVoice = readGuidePreferences().voiceId;
    if (savedVoice && GUIDE_VOICES.some((v) => v.id === savedVoice)) {
      setVoiceId(savedVoice);
    } else if (GUIDE_VOICES.length > 0) {
      setVoiceId(GUIDE_VOICES[0]!.id);
    }
  }, []);

  const preview = buildPreview(mood, scenario, character, style);
  const canStart = !!(mood && scenario && character && style);

  const playVoicePreview = useCallback(async (id: string, name: string) => {
    setPreviewingVoice(id);
    try {
      const res = await fetch("/api/preview-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voice: name, text: "Come closer. I've been waiting for you." }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (!audioRef.current) audioRef.current = new Audio();
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
    if (disabled || !canStart) return;
    const voice = GUIDE_VOICES.find((v) => v.id === voiceId) ?? GUIDE_VOICES[0];
    const prefs: ChatSetupPreferences = {
      mode: "guided",
      experienceLength: "Ongoing Affair",
      mood,
      scenario,
      character,
      interactionStyle: style,
      voiceId: voice?.id,
      voiceName: voice?.name,
    };
    const opener = SCENE_OPENERS[scenario] ?? "The scene opens. You already feel it.";
    onComplete({
      prefs,
      userMessage: buildGuidedStartMessage(prefs),
      assistantNote: opener,
    });
  };

  return (
    <div className="fc-setup">

      {/* Hero header */}
      <div className="fc-setup-hero">
        <p className="fc-setup-eyebrow">Forbidden Chat</p>
        <h1 className="fc-setup-headline">Private Desires</h1>
        <p className="fc-setup-tagline">
          Create a conversation that should never have happened.
        </p>
      </div>

      {/* Live fantasy preview */}
      {preview ? (
        <div className="fc-preview-card">
          <p className="fc-preview-label">Your story</p>
          <p className="fc-preview-text">{preview}</p>
        </div>
      ) : (
        <div className="fc-preview-placeholder">
          <p className="fc-preview-placeholder-text">Your fantasy is taking shape…</p>
        </div>
      )}

      {/* Preference chips */}
      <div className="fc-prefs">

        <div className="fc-pref-group">
          <p className="fc-pref-label">Mood</p>
          <div className="fc-chips">
            {MOOD_OPTIONS.map((opt) => (
              <Chip
                key={opt} label={opt} selected={mood === opt}
                onClick={() => setMood(mood === opt ? "" : opt)} disabled={disabled}
              />
            ))}
          </div>
        </div>

        <div className="fc-pref-group">
          <p className="fc-pref-label">Scenario</p>
          <div className="fc-chips">
            {SCENARIO_OPTIONS.map((opt) => (
              <Chip
                key={opt} label={opt} selected={scenario === opt}
                onClick={() => setScenario(scenario === opt ? "" : opt)} disabled={disabled}
              />
            ))}
          </div>
        </div>

        <div className="fc-pref-group">
          <p className="fc-pref-label">Character</p>
          <div className="fc-chips">
            {CHARACTER_OPTIONS.map((opt) => (
              <Chip
                key={opt} label={opt} selected={character === opt}
                onClick={() => setCharacter(character === opt ? "" : opt)} disabled={disabled}
              />
            ))}
          </div>
        </div>

        <div className="fc-pref-group">
          <p className="fc-pref-label">Interaction Style</p>
          <div className="fc-chips">
            {STYLE_OPTIONS.map((opt) => (
              <Chip
                key={opt} label={opt} selected={style === opt}
                onClick={() => setStyle(style === opt ? "" : opt)} disabled={disabled}
              />
            ))}
          </div>
        </div>

        {GUIDE_VOICES.length > 0 && (
          <div className="fc-pref-group">
            <p className="fc-pref-label">Voice</p>
            <div className="fc-chips">
              {GUIDE_VOICES.map((v) => (
                <div key={v.id} className="fc-voice-chip-row">
                  <Chip
                    label={v.name} selected={voiceId === v.id}
                    onClick={() => setVoiceId(v.id)} disabled={disabled}
                  />
                  <button
                    type="button"
                    disabled={disabled || previewingVoice !== null}
                    onClick={() => void playVoicePreview(v.id, v.name)}
                    className="fc-voice-play-btn"
                    aria-label={`Preview ${v.name}`}
                  >
                    {previewingVoice === v.id ? "…" : "▶"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* CTA */}
      <div className="fc-cta-area">
        <button
          type="button"
          disabled={disabled || !canStart}
          onClick={handleStart}
          className="fc-start-btn"
        >
          Start This Conversation
        </button>
        {!canStart && (
          <p className="fc-cta-hint">Choose a mood, scenario, character and style to begin.</p>
        )}
      </div>

    </div>
  );
}
