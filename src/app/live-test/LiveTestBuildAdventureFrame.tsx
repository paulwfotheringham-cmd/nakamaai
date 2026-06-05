"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Perspective = "first" | "third";

const MOODS = [
  "Seductive", "Romantic", "Explicit", "Sensual", "Voyeur",
  "Taboo", "Slow Burn", "Playful", "Dominant", "Submissive", "Neutral",
] as const;
type Mood = (typeof MOODS)[number];

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

const STORY_MIN_LINES = 4;
const STORY_MAX_LINES = 8;
const STORY_LINE_PX = 24;

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
  const [moods, setMoods] = useState<Mood[]>(["Romantic"]);
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

  function toggleMood(mood: Mood) {
    setMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood],
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
    <div className="ba-root ba-root--balanced animate-panel-in">
      <div className="ba-atmosphere" aria-hidden>
        <img src="/tiles/tile2.jpg" alt="" className="ba-atmosphere-img" />
        <div className="ba-atmosphere-veil" />
      </div>

      <div className="ba-page">
        <header className="ba-header">
          <p className="ba-eyebrow">Build Adventure</p>
          <h1 className="ba-hero-title">Build Your Adventure</h1>
          <p className="ba-hero-sub">
            Sit with your storyteller — set the mood, choose your cast, and begin.
          </p>

          <div className="ba-mood-block">
            <div className="ba-mood-head">
              <SectionLabel>Set the mood</SectionLabel>
              <div className="ba-perspective-row ba-perspective-row--header">
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
            <div className="ba-tone-grid ba-tone-grid--hero">
              {MOODS.map((mood) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => toggleMood(mood)}
                  className={`ba-tone-pill${moods.includes(mood) ? " is-active" : ""}`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="ba-stage">
          <section className="ba-stage-panel ba-stage-panel--cast" aria-labelledby="ba-cast-heading">
            <div className="ba-stage-panel-head">
              <SectionLabel>
                <span id="ba-cast-heading">Your characters</span>
              </SectionLabel>
            </div>
            <div className="ba-cast-grid ba-cast-grid--prominent">
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

              {addingChar ? (
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
              ) : (
                <button
                  type="button"
                  className="ba-cast-card ba-cast-card--add"
                  onClick={() => setAddingChar(true)}
                >
                  <span className="ba-cast-add-icon" aria-hidden>
                    +
                  </span>
                  <p className="ba-cast-name">Add character</p>
                </button>
              )}
            </div>
          </section>

          <section
            className="ba-stage-panel ba-stage-panel--narrator"
            aria-labelledby="ba-narrator-heading"
          >
            <div className="ba-stage-panel-head">
              <SectionLabel>
                <span id="ba-narrator-heading">Your narrator</span>
              </SectionLabel>
            </div>
            <div className="ba-narrator-grid">
              {NARRATOR_VOICES.map((v) => (
                <div
                  key={v.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedVoice(v)}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedVoice(v)}
                  className={`ba-narrator-card${selectedVoice.id === v.id ? " is-active" : ""}`}
                >
                  <div className="ba-narrator-portrait">
                    <img src={v.image} alt="" className="ba-narrator-img" />
                  </div>
                  <div className="ba-narrator-body">
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
          </section>
        </div>

        <footer className="ba-footer">
          <section className="ba-story-section">
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

          <div className="ba-footer-actions">
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
          </div>
        </footer>
      </div>
    </div>
  );
}
