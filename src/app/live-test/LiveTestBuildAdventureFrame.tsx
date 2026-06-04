"use client";

import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type Perspective = "first" | "third";

const TONES = [
  "Seductive", "Romantic", "Explicit", "Sensual", "Voyeur",
  "Taboo", "Slow Burn", "Playful", "Dominant", "Submissive", "Neutral",
] as const;
type Tone = typeof TONES[number];

type NarratorVoice = {
  id: string;
  name: string;
  tagline: string;
  gender: "male" | "female";
  image: string;
};

const NARRATOR_VOICES: NarratorVoice[] = [
  {
    id: "leo",
    name: "Leo",
    tagline: "Deep, smouldering and commanding.",
    gender: "male",
    image: "/guides/imageedit_14_7182524648.png",
  },
  {
    id: "ash",
    name: "Ash",
    tagline: "Warm, intimate and magnetic.",
    gender: "male",
    image: "/guides/imageedit_15_8566388634.png",
  },
  {
    id: "aurora",
    name: "Aurora",
    tagline: "Velvet tone. Effortlessly seductive.",
    gender: "female",
    image: "/guides/imageedit_17_9927503197.png",
  },
  {
    id: "nova",
    name: "Nova",
    tagline: "Crisp, confident and powerfully present.",
    gender: "female",
    image: "/guides/imageedit_19_7924513571.png",
  },
];

const DEFAULT_CHARACTERS = ["You", "Stranger"];

// ── Sub-components ───────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`ba-toggle${checked ? " ba-toggle--on" : ""}`}
    >
      <span className="ba-toggle-knob" />
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="ba-section-label">{children}</p>;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function LiveTestBuildAdventureFrame() {
  // Left column state
  const [characters, setCharacters] = useState<string[]>(DEFAULT_CHARACTERS);
  const [addingChar, setAddingChar] = useState(false);
  const [newCharName, setNewCharName] = useState("");
  const [storyPrompt, setStoryPrompt] = useState("");
  const [genVoices, setGenVoices] = useState(true);
  const [genCover, setGenCover] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  // Right column state
  const [perspective, setPerspective] = useState<Perspective>("first");
  const [tones, setTones] = useState<Tone[]>(["Romantic"]);
  const [selectedVoice, setSelectedVoice] = useState<NarratorVoice>(NARRATOR_VOICES[0]);
  const [previewPlaying, setPreviewPlaying] = useState<string | null>(null);

  function addCharacter() {
    const name = newCharName.trim();
    if (name && !characters.includes(name)) {
      setCharacters((prev) => [...prev, name]);
    }
    setNewCharName("");
    setAddingChar(false);
  }

  function removeCharacter(name: string) {
    if (DEFAULT_CHARACTERS.includes(name)) return;
    setCharacters((prev) => prev.filter((c) => c !== name));
  }

  function toggleTone(tone: Tone) {
    setTones((prev) =>
      prev.includes(tone)
        ? prev.filter((t) => t !== tone)
        : [...prev, tone],
    );
  }

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2200);
  }

  function handlePreview(voiceId: string) {
    setPreviewPlaying((prev) => (prev === voiceId ? null : voiceId));
  }

  return (
    <div className="ba-root animate-panel-in">

      {/* ── Atmospheric background ── */}
      <div className="ba-atmosphere" aria-hidden>
        <img src="/tiles/tile2.jpg" alt="" className="ba-atmosphere-img" />
        <div className="ba-atmosphere-veil" />
      </div>

      {/* ── Two-column layout ── */}
      <div className="ba-layout">

        {/* ════════════════════════════════
            LEFT COLUMN — 70%
        ════════════════════════════════ */}
        <div className="ba-left">

          {/* Hero */}
          <header className="ba-hero">
            <p className="ba-eyebrow">Build Adventure</p>
            <h1 className="ba-hero-title">Build Your Adventure</h1>
            <p className="ba-hero-sub">Create a story as unique as your desires.</p>
          </header>

          {/* ── Section 1: Characters ── */}
          <section className="ba-section">
            <div className="ba-section-header">
              <SectionLabel>Characters in this story</SectionLabel>
              {!addingChar && (
                <button
                  type="button"
                  className="ba-ghost-btn"
                  onClick={() => setAddingChar(true)}
                >
                  + Add Character
                </button>
              )}
            </div>

            <div className="ba-chars-row">
              {characters.map((c) => (
                <span key={c} className="ba-char-chip group">
                  {c}
                  {!DEFAULT_CHARACTERS.includes(c) && (
                    <button
                      type="button"
                      aria-label={`Remove ${c}`}
                      onClick={() => removeCharacter(c)}
                      className="ba-char-chip-remove"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}

              {addingChar && (
                <div className="ba-char-add-row">
                  <input
                    autoFocus
                    type="text"
                    value={newCharName}
                    onChange={(e) => setNewCharName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addCharacter();
                      if (e.key === "Escape") { setAddingChar(false); setNewCharName(""); }
                    }}
                    placeholder="Character name"
                    className="ba-char-input"
                  />
                  <button type="button" className="ba-ghost-btn" onClick={addCharacter}>Add</button>
                  <button type="button" className="ba-muted-btn" onClick={() => { setAddingChar(false); setNewCharName(""); }}>Cancel</button>
                </div>
              )}
            </div>
          </section>

          {/* ── Section 2: Auto Story ── */}
          <section className="ba-card ba-auto-story">
            <div className="ba-auto-story-copy">
              <p className="ba-auto-story-label">Auto Story</p>
              <p className="ba-auto-story-desc">Let Nakama Nights craft the perfect story for you.</p>
            </div>
            <button type="button" className="ba-gold-btn ba-gold-btn--auto">
              Generate Auto Story
            </button>
          </section>

          {/* ── Section 3: Story Setup ── */}
          <section className="ba-section">
            <SectionLabel>Your Story</SectionLabel>
            <textarea
              className="ba-textarea"
              value={storyPrompt}
              onChange={(e) => setStoryPrompt(e.target.value)}
              placeholder="Describe your fantasy, scenario, or idea. The more details you share, the better we can bring it to life."
              rows={7}
            />
            <p className="ba-helper-text">
              Yums and yucks from your profile are included automatically when available.
            </p>
          </section>

          {/* ── Section 4: Generate Audiobook ── */}
          <section className="ba-card ba-generate-card">
            <div className="ba-generate-toggles">
              <div className="ba-toggle-row">
                <div>
                  <p className="ba-toggle-label">Generate voices</p>
                  <p className="ba-toggle-desc">AI narration for all characters</p>
                </div>
                <Toggle checked={genVoices} onChange={() => setGenVoices((v) => !v)} />
              </div>
              <div className="ba-toggle-divider" />
              <div className="ba-toggle-row">
                <div>
                  <p className="ba-toggle-label">Generate cover image</p>
                  <p className="ba-toggle-desc">Unique artwork for your story</p>
                </div>
                <Toggle checked={genCover} onChange={() => setGenCover((v) => !v)} />
              </div>
            </div>

            <div className="ba-generate-actions">
              <button
                type="button"
                className={`ba-gold-btn ba-gold-btn--primary${generating ? " ba-generating" : ""}`}
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? (
                  <>
                    <span className="ba-spinner" aria-hidden />
                    Generating…
                  </>
                ) : generated ? (
                  "Story Ready — Play"
                ) : (
                  "Generate Audiobook"
                )}
              </button>
              <button type="button" className="ba-secondary-btn">
                Reload Last Setup
              </button>
            </div>
          </section>

        </div>

        {/* ════════════════════════════════
            RIGHT COLUMN — 30%
        ════════════════════════════════ */}
        <aside className="ba-right">

          {/* ── Perspective ── */}
          <div className="ba-rail-section">
            <SectionLabel>Perspective</SectionLabel>
            <div className="ba-perspective-row">
              {(["first", "third"] as Perspective[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPerspective(p)}
                  className={`ba-perspective-btn${perspective === p ? " is-active" : ""}`}
                >
                  {p === "first" ? "First Person" : "Third Person"}
                </button>
              ))}
            </div>
          </div>

          {/* ── Tone ── */}
          <div className="ba-rail-section">
            <SectionLabel>Tone</SectionLabel>
            <div className="ba-tone-grid">
              {TONES.map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => toggleTone(tone)}
                  className={`ba-tone-pill${tones.includes(tone) ? " is-active" : ""}`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          {/* ── Narrator Voice ── */}
          <div className="ba-rail-section">
            <SectionLabel>Narrator Voice</SectionLabel>
            <div className="ba-voice-list">
              {NARRATOR_VOICES.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVoice(v)}
                  className={`ba-voice-card${selectedVoice.id === v.id ? " is-active" : ""}`}
                >
                  <div className="ba-voice-img-wrap">
                    <img src={v.image} alt={v.name} className="ba-voice-img" />
                  </div>
                  <div className="ba-voice-info">
                    <p className="ba-voice-name">{v.name}</p>
                    <p className="ba-voice-tagline">{v.tagline}</p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Preview ${v.name}`}
                    onClick={(e) => { e.stopPropagation(); handlePreview(v.id); }}
                    className={`ba-voice-play${previewPlaying === v.id ? " is-playing" : ""}`}
                  >
                    {previewPlaying === v.id ? (
                      <svg viewBox="0 0 12 12" fill="currentColor" className="h-3 w-3" aria-hidden>
                        <rect x="2" y="2" width="3" height="8" rx="0.5" />
                        <rect x="7" y="2" width="3" height="8" rx="0.5" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 12 12" fill="currentColor" className="h-3 w-3" aria-hidden>
                        <polygon points="3,2 10,6 3,10" />
                      </svg>
                    )}
                  </button>
                </button>
              ))}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}
