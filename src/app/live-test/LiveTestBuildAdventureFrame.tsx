"use client";

import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type Perspective = "first" | "third";

const TONES = [
  "Seductive", "Romantic", "Explicit", "Sensual", "Voyeur",
  "Taboo", "Slow Burn", "Playful", "Dominant", "Submissive", "Neutral",
] as const;
type Tone = typeof TONES[number];

type CharacterCard = {
  id: string;
  name: string;
  role: string;
  gradient: string;
  removable: boolean;
};

type NarratorVoice = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  gender: "male" | "female";
  image: string;
};

// ── Data ─────────────────────────────────────────────────────────────────────

const DEFAULT_CAST: CharacterCard[] = [
  {
    id: "you",
    name: "You",
    role: "The protagonist",
    gradient: "linear-gradient(135deg, #7A5C2E 0%, #C9A227 100%)",
    removable: false,
  },
  {
    id: "stranger",
    name: "Stranger",
    role: "The enigma",
    gradient: "linear-gradient(135deg, #3D2B5C 0%, #7B4F9E 100%)",
    removable: false,
  },
];

const NARRATOR_VOICES: NarratorVoice[] = [
  {
    id: "leo",
    name: "Leo",
    tagline: "Deep, smouldering and commanding.",
    description: "Leo's voice wraps around you like velvet — dark, deliberate, impossible to ignore. Perfect for intense, high-stakes fantasies.",
    gender: "male",
    image: "/guides/imageedit_14_7182524648.png",
  },
  {
    id: "ash",
    name: "Ash",
    tagline: "Warm, intimate and magnetic.",
    description: "Ash draws you in with effortless ease. His tone feels personal, like a secret shared only with you.",
    gender: "male",
    image: "/guides/imageedit_15_8566388634.png",
  },
  {
    id: "aurora",
    name: "Aurora",
    tagline: "Velvet tone. Effortlessly seductive.",
    description: "Aurora's voice is silk over skin — smooth, deliberate and utterly mesmerising. Every word feels like an invitation.",
    gender: "female",
    image: "/guides/imageedit_17_9927503197.png",
  },
  {
    id: "nova",
    name: "Nova",
    tagline: "Crisp, confident and powerfully present.",
    description: "Nova commands the room without raising her voice. Controlled energy, precise delivery, undeniable presence.",
    gender: "female",
    image: "/guides/imageedit_19_7924513571.png",
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

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
  const [cast, setCast] = useState<CharacterCard[]>(DEFAULT_CAST);
  const [selectedCharId, setSelectedCharId] = useState<string>("you");
  const [addingChar, setAddingChar] = useState(false);
  const [newCharName, setNewCharName] = useState("");
  const [newCharRole, setNewCharRole] = useState("");

  const [storyPrompt, setStoryPrompt] = useState("");

  const [tones, setTones] = useState<Tone[]>(["Romantic"]);
  const [perspective, setPerspective] = useState<Perspective>("first");
  const [selectedVoice, setSelectedVoice] = useState<NarratorVoice>(NARRATOR_VOICES[0]);
  const [previewPlaying, setPreviewPlaying] = useState<string | null>(null);

  const [genVoices, setGenVoices] = useState(true);
  const [genCover, setGenCover] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  function addCharacter() {
    const name = newCharName.trim();
    if (!name) return;
    const id = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    const gradients = [
      "linear-gradient(135deg, #1E3A5F 0%, #2E6DA4 100%)",
      "linear-gradient(135deg, #3B1A1A 0%, #8B3030 100%)",
      "linear-gradient(135deg, #1A3B2E 0%, #2E7A5C 100%)",
    ];
    setCast((prev) => [
      ...prev,
      {
        id,
        name,
        role: newCharRole.trim() || "Character",
        gradient: gradients[prev.length % gradients.length],
        removable: true,
      },
    ]);
    setNewCharName("");
    setNewCharRole("");
    setAddingChar(false);
  }

  function removeCharacter(id: string) {
    setCast((prev) => prev.filter((c) => c.id !== id));
    if (selectedCharId === id) setSelectedCharId("you");
  }

  function toggleTone(tone: Tone) {
    setTones((prev) =>
      prev.includes(tone) ? prev.filter((t) => t !== tone) : [...prev, tone],
    );
  }

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 2200);
  }

  return (
    <div className="ba-root animate-panel-in">

      {/* ── Atmospheric background ── */}
      <div className="ba-atmosphere" aria-hidden>
        <img src="/tiles/tile2.jpg" alt="" className="ba-atmosphere-img" />
        <div className="ba-atmosphere-veil" />
      </div>

      {/* ── Single scrollable column ── */}
      <div className="ba-scroll">

        {/* ── 1. Hero ── */}
        <header className="ba-hero">
          <p className="ba-eyebrow">Build Adventure</p>
          <h1 className="ba-hero-title">Build Your Adventure</h1>
          <p className="ba-hero-sub">Create a story as unique as your desires.</p>
        </header>

        {/* ── 2. Character Selection ── */}
        <section className="ba-section">
          <div className="ba-section-header">
            <SectionLabel>Cast your story</SectionLabel>
            {!addingChar && (
              <button type="button" className="ba-ghost-btn" onClick={() => setAddingChar(true)}>
                + Add Character
              </button>
            )}
          </div>

          <div className="ba-cast-grid">
            {cast.map((c) => (
              <div
                key={c.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedCharId(c.id)}
                onKeyDown={(e) => e.key === "Enter" && setSelectedCharId(c.id)}
                className={`ba-cast-card${selectedCharId === c.id ? " is-selected" : ""}`}
              >
                {/* Avatar */}
                <div className="ba-cast-avatar" style={{ background: c.gradient }}>
                  <span className="ba-cast-initial">{c.name[0]}</span>
                </div>
                <p className="ba-cast-name">{c.name}</p>
                <p className="ba-cast-role">{c.role}</p>
                {c.removable && (
                  <button
                    type="button"
                    aria-label={`Remove ${c.name}`}
                    onClick={(e) => { e.stopPropagation(); removeCharacter(c.id); }}
                    className="ba-cast-remove"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {/* Add character inline card */}
            {addingChar && (
              <div className="ba-cast-add-card">
                <input
                  autoFocus
                  type="text"
                  value={newCharName}
                  onChange={(e) => setNewCharName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addCharacter();
                    if (e.key === "Escape") { setAddingChar(false); setNewCharName(""); setNewCharRole(""); }
                  }}
                  placeholder="Name"
                  className="ba-char-input"
                />
                <input
                  type="text"
                  value={newCharRole}
                  onChange={(e) => setNewCharRole(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addCharacter();
                    if (e.key === "Escape") { setAddingChar(false); setNewCharName(""); setNewCharRole(""); }
                  }}
                  placeholder="Role (optional)"
                  className="ba-char-input"
                />
                <div className="ba-cast-add-actions">
                  <button type="button" className="ba-ghost-btn" onClick={addCharacter}>Add</button>
                  <button type="button" className="ba-muted-btn" onClick={() => { setAddingChar(false); setNewCharName(""); setNewCharRole(""); }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── 3. Story Setup (dominant) ── */}
        <section className="ba-section ba-story-section">
          <SectionLabel>Your Story</SectionLabel>
          <textarea
            className="ba-textarea"
            value={storyPrompt}
            onChange={(e) => setStoryPrompt(e.target.value)}
            placeholder="Describe your fantasy, scenario, or idea. The more details you share, the better we can bring it to life."
          />
          <p className="ba-helper-text">
            Yums and yucks from your profile are included automatically when available.
          </p>
        </section>

        {/* ── 4. Tone ── */}
        <section className="ba-section">
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
        </section>

        {/* ── 5. Perspective ── */}
        <section className="ba-section">
          <SectionLabel>Perspective</SectionLabel>
          <div className="ba-perspective-row">
            {(["first", "third"] as Perspective[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPerspective(p)}
                className={`ba-perspective-btn${perspective === p ? " is-active" : ""}`}
              >
                <span className="ba-perspective-label">{p === "first" ? "First Person" : "Third Person"}</span>
                <span className="ba-perspective-desc">{p === "first" ? "Told as your own experience" : "Narrated from outside"}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── 6. Narrator Voice ── */}
        <section className="ba-section">
          <SectionLabel>Narrator Voice</SectionLabel>
          <div className="ba-voice-grid">
            {NARRATOR_VOICES.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVoice(v)}
                className={`ba-voice-card${selectedVoice.id === v.id ? " is-active" : ""}`}
              >
                <div className="ba-voice-img-wrap">
                  <img src={v.image} alt={v.name} className="ba-voice-img" />
                  {/* Play button overlay */}
                  <button
                    type="button"
                    aria-label={`Preview ${v.name}`}
                    onClick={(e) => { e.stopPropagation(); setPreviewPlaying((p) => p === v.id ? null : v.id); }}
                    className={`ba-voice-play-overlay${previewPlaying === v.id ? " is-playing" : ""}`}
                  >
                    {previewPlaying === v.id ? (
                      <svg viewBox="0 0 12 12" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
                        <rect x="2" y="2" width="3" height="8" rx="0.5" />
                        <rect x="7" y="2" width="3" height="8" rx="0.5" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 12 12" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
                        <polygon points="3,2 10,6 3,10" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="ba-voice-body">
                  <p className="ba-voice-name">{v.name}</p>
                  <p className="ba-voice-tagline">{v.tagline}</p>
                  <p className="ba-voice-desc">{v.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── 7 + 8. Generate Options + Button ── */}
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
                <><span className="ba-spinner" aria-hidden />Generating…</>
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

        {/* Bottom breathing room */}
        <div style={{ height: "2rem" }} />

      </div>
    </div>
  );
}
