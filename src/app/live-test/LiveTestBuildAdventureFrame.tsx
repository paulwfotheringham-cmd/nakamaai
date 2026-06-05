"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

const STORY_MIN_LINES = 5;
const STORY_MAX_LINES = 10;
const STORY_LINE_PX = 22;

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
  const storyRef = useRef<HTMLTextAreaElement>(null);
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

  const resizeStory = useCallback(() => {
    const el = storyRef.current;
    if (!el) return;
    el.style.height = "auto";
    const minH = STORY_LINE_PX * STORY_MIN_LINES;
    const maxH = STORY_LINE_PX * STORY_MAX_LINES;
    el.style.height = `${Math.min(maxH, Math.max(minH, el.scrollHeight))}px`;
  }, []);

  useEffect(() => {
    resizeStory();
  }, [storyPrompt, resizeStory]);

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
    <div className="ba-root ba-root--compact animate-panel-in">
      <div className="ba-atmosphere" aria-hidden>
        <img src="/tiles/tile2.jpg" alt="" className="ba-atmosphere-img" />
        <div className="ba-atmosphere-veil" />
      </div>

      <div className="ba-layout ba-layout--compact">
        <div className="ba-workspace">
          <header className="ba-hero ba-hero--compact">
            <p className="ba-eyebrow">Build Adventure</p>
            <h1 className="ba-hero-title">Build Your Adventure</h1>
            <p className="ba-hero-sub">Create a story as unique as your desires.</p>
          </header>

          <section className="ba-section ba-section--cast">
            <div className="ba-section-header">
              <SectionLabel>Who&apos;s in your story</SectionLabel>
              {!addingChar && (
                <button
                  type="button"
                  className="ba-ghost-btn ba-ghost-btn--sm"
                  onClick={() => setAddingChar(true)}
                >
                  + Add
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
                  <span className="ba-cast-name">{c.name}</span>
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
                  <div className="ba-cast-add-actions">
                    <button type="button" className="ba-ghost-btn ba-ghost-btn--sm" onClick={addCharacter}>
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
            <SectionLabel>Your story</SectionLabel>
            <textarea
              ref={storyRef}
              className="ba-textarea ba-textarea--grow"
              rows={STORY_MIN_LINES}
              value={storyPrompt}
              onChange={(e) => setStoryPrompt(e.target.value)}
              onInput={resizeStory}
              placeholder="Describe the scene, the tension, the fantasy — as much or as little as you like."
            />
          </section>

          <footer className="ba-start-bar">
            <button
              type="button"
              className={`ba-gold-btn ba-gold-btn--primary${generating ? " ba-generating" : ""}`}
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? (
                <>
                  <span className="ba-spinner" aria-hidden />
                  Bringing your story to life…
                </>
              ) : generated ? (
                "Play Your Adventure"
              ) : (
                "Begin Your Adventure"
              )}
            </button>
            <div className="ba-start-options">
              <label className="ba-inline-option">
                <Toggle checked={genVoices} onChange={() => setGenVoices((v) => !v)} />
                <span>Voices</span>
              </label>
              <label className="ba-inline-option">
                <Toggle checked={genCover} onChange={() => setGenCover((v) => !v)} />
                <span>Cover art</span>
              </label>
              <button type="button" className="ba-text-link" onClick={handleGenerate}>
                Surprise me with a story
              </button>
            </div>
          </footer>
        </div>

        <aside className="ba-sidebar">
          <div className="ba-rail-section ba-rail-section--inline">
            <SectionLabel>Perspective</SectionLabel>
            <div className="ba-perspective-row">
              {(["first", "third"] as Perspective[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPerspective(p)}
                  className={`ba-perspective-btn${perspective === p ? " is-active" : ""}`}
                >
                  {p === "first" ? "First person" : "Third person"}
                </button>
              ))}
            </div>
          </div>

          <div className="ba-rail-section ba-rail-section--tones">
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
            <SectionLabel>Narrator</SectionLabel>
            <div className="ba-voice-grid">
              {NARRATOR_VOICES.map((v) => (
                <div
                  key={v.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedVoice(v)}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedVoice(v)}
                  className={`ba-voice-card ba-voice-card--compact${selectedVoice.id === v.id ? " is-active" : ""}`}
                >
                  <img src={v.image} alt="" className="ba-voice-img" />
                  <span className="ba-voice-name">{v.name}</span>
                  <button
                    type="button"
                    aria-label={`Preview ${v.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(v.id);
                    }}
                    className={`ba-voice-play ba-voice-play--sm${previewPlaying === v.id ? " is-playing" : ""}`}
                  >
                    <svg viewBox="0 0 12 12" fill="currentColor" className="ba-voice-play-icon" aria-hidden>
                      {previewPlaying === v.id ? (
                        <>
                          <rect x="2" y="2" width="3" height="8" rx="0.5" />
                          <rect x="7" y="2" width="3" height="8" rx="0.5" />
                        </>
                      ) : (
                        <polygon points="3,2 10,6 3,10" />
                      )}
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
