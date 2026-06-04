"use client";

import { useState } from "react";

type Perspective = "first" | "third";

const TONES = [
  "Seductive", "Romantic", "Explicit", "Sensual", "Voyeur",
  "Taboo", "Slow Burn", "Playful", "Dominant", "Submissive", "Neutral",
] as const;
type Tone = (typeof TONES)[number];

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
  gender: "male" | "female";
  image: string;
};

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

export default function LiveTestBuildAdventureFrame() {
  const [cast, setCast] = useState<CharacterCard[]>(DEFAULT_CAST);
  const [selectedCharId, setSelectedCharId] = useState<string>("you");
  const [addingChar, setAddingChar] = useState(false);
  const [newCharName, setNewCharName] = useState("");
  const [newCharRole, setNewCharRole] = useState("");

  const [storyPrompt, setStoryPrompt] = useState("");
  const [genVoices, setGenVoices] = useState(true);
  const [genCover, setGenCover] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const [perspective, setPerspective] = useState<Perspective>("first");
  const [tones, setTones] = useState<Tone[]>(["Romantic"]);
  const [selectedVoice, setSelectedVoice] = useState<NarratorVoice>(NARRATOR_VOICES[0]);
  const [previewPlaying, setPreviewPlaying] = useState<string | null>(null);

  function addCharacter() {
    const name = newCharName.trim();
    if (!name) return;
    const id = `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
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
      <div className="ba-atmosphere" aria-hidden>
        <img src="/tiles/tile2.jpg" alt="" className="ba-atmosphere-img" />
        <div className="ba-atmosphere-veil" />
      </div>

      <div className="ba-layout">
        <div className="ba-left">
          <header className="ba-hero">
            <p className="ba-eyebrow">Build Adventure</p>
            <h1 className="ba-hero-title">Build Your Adventure</h1>
            <p className="ba-hero-sub">Create a story as unique as your desires.</p>
          </header>

          <section className="ba-section ba-section--cast">
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

            <div className="ba-cast-grid">
              {cast.map((c) => (
                <div
                  key={c.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedCharId(c.id)}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedCharId(c.id)}
                  className={`ba-cast-card${!c.removable ? " ba-cast-card--core" : ""}${selectedCharId === c.id ? " is-selected" : ""}`}
                >
                  <div className="ba-cast-avatar" style={{ background: c.gradient }}>
                    <span className="ba-cast-initial">{c.name[0]}</span>
                  </div>
                  <p className="ba-cast-name">{c.name}</p>
                  <p className="ba-cast-role">{c.role}</p>
                  {c.removable && (
                    <button
                      type="button"
                      aria-label={`Remove ${c.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCharacter(c.id);
                      }}
                      className="ba-cast-remove"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}

              {addingChar && (
                <div className="ba-cast-add-card">
                  <input
                    autoFocus
                    type="text"
                    value={newCharName}
                    onChange={(e) => setNewCharName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addCharacter();
                      if (e.key === "Escape") {
                        setAddingChar(false);
                        setNewCharName("");
                        setNewCharRole("");
                      }
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
                      if (e.key === "Escape") {
                        setAddingChar(false);
                        setNewCharName("");
                        setNewCharRole("");
                      }
                    }}
                    placeholder="Role (optional)"
                    className="ba-char-input"
                  />
                  <div className="ba-cast-add-actions">
                    <button type="button" className="ba-ghost-btn" onClick={addCharacter}>
                      Add
                    </button>
                    <button
                      type="button"
                      className="ba-muted-btn"
                      onClick={() => {
                        setAddingChar(false);
                        setNewCharName("");
                        setNewCharRole("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

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

          <section className="ba-card ba-auto-story">
            <div className="ba-auto-story-copy">
              <p className="ba-auto-story-label">Auto Story</p>
              <p className="ba-auto-story-desc">
                Let Nakama Nights craft the perfect story for you.
              </p>
            </div>
            <button type="button" className="ba-gold-btn ba-gold-btn--auto">
              Generate Auto Story
            </button>
          </section>

          <section className="ba-card ba-generate-card ba-section--generate">
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

        <aside className="ba-right">
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

          <div className="ba-rail-section ba-rail-section--voices">
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(v.id);
                    }}
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
