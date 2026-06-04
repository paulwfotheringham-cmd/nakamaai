"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  NARRATOR_VOICES,
  narratorFromGuideVoiceId,
  type NarratorVoice,
} from "@/lib/guides/narrator-voices";
import {
  readGuidePreferences,
  writeGuidePreferences,
} from "@/lib/guides/preferences";
import {
  createCharacterId,
  pickCharacterGradient,
  readUserCharacters,
  writeUserCharacters,
  type CharacterGender,
  type UserCharacter,
} from "@/lib/guides/user-characters";

type CharacterForm = {
  name: string;
  gender: CharacterGender;
  role: string;
  summary: string;
  details: string;
  personality: string;
  boundaries: string;
};

const EMPTY_FORM: CharacterForm = {
  name: "",
  gender: "",
  role: "",
  summary: "",
  details: "",
  personality: "",
  boundaries: "",
};

function genderLabel(gender: CharacterGender): string | null {
  if (gender === "male") return "Male";
  if (gender === "female") return "Female";
  if (gender === "nonbinary") return "Non-binary";
  return null;
}

function formFromCharacter(c: UserCharacter): CharacterForm {
  return {
    name: c.name,
    gender: c.gender,
    role: c.role,
    summary: c.summary,
    details: c.details,
    personality: c.personality,
    boundaries: c.boundaries,
  };
}

export default function LiveTestCharactersVoicesFrame() {
  const [characters, setCharacters] = useState<UserCharacter[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CharacterForm>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [selectedNarratorId, setSelectedNarratorId] = useState(NARRATOR_VOICES[0].id);
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setCharacters(readUserCharacters());
    const prefs = readGuidePreferences();
    const match = narratorFromGuideVoiceId(prefs.voiceId);
    if (match) setSelectedNarratorId(match.id);
  }, []);

  const persistCharacters = useCallback((next: UserCharacter[]) => {
    setCharacters(next);
    writeUserCharacters(next);
  }, []);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setModalMode("create");
  }

  function openEdit(c: UserCharacter) {
    setForm(formFromCharacter(c));
    setEditingId(c.id);
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function handleSaveCharacter(e: React.FormEvent) {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return;

    if (modalMode === "edit" && editingId) {
      persistCharacters(
        characters.map((c) =>
          c.id === editingId
            ? {
                ...c,
                name,
                gender: form.gender,
                role: form.role.trim() || "Character",
                summary: form.summary.trim() || c.summary,
                details: form.details.trim(),
                personality: form.personality.trim(),
                boundaries: form.boundaries.trim(),
                updatedAt: Date.now(),
              }
            : c,
        ),
      );
    } else {
      const next: UserCharacter = {
        id: createCharacterId(),
        name,
        gender: form.gender,
        role: form.role.trim() || "Character",
        summary: form.summary.trim() || "A character in your Nakama Nights cast.",
        details: form.details.trim(),
        personality: form.personality.trim(),
        boundaries: form.boundaries.trim(),
        gradient: pickCharacterGradient(characters.length),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      persistCharacters([...characters, next]);
    }
    closeModal();
  }

  function confirmDelete() {
    if (!deleteId) return;
    const next = characters.filter((c) => c.id !== deleteId);
    persistCharacters(next);
    if (expandedId === deleteId) setExpandedId(null);
    setDeleteId(null);
  }

  const playVoicePreview = useCallback(async (voice: NarratorVoice) => {
    setPreviewingVoice(voice.id);
    try {
      const res = await fetch("/api/preview-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voice: voice.previewName,
          text: "Come closer. I've been waiting for you.",
        }),
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

  function selectNarrator(voice: NarratorVoice) {
    setSelectedNarratorId(voice.id);
    const prefs = readGuidePreferences();
    writeGuidePreferences({
      ...prefs,
      voiceId: voice.guideVoiceId,
      voiceName: voice.guideVoiceName,
    });
  }

  return (
    <div className="cv-root animate-panel-in">
      <div className="cv-atmosphere" aria-hidden>
        <img src="/tiles/tile6.jpg" alt="" className="cv-atmosphere-img" />
        <div className="cv-atmosphere-veil" />
      </div>

      <div className="cv-scroll">
        <header className="cv-header">
          <div className="cv-header-copy">
            <h1 className="cv-title">Characters & Voices</h1>
            <p className="cv-subtitle">Your cast of characters across Nakama Nights.</p>
          </div>
          <button type="button" className="cv-cta" onClick={openCreate}>
            + New Character
          </button>
        </header>

        <section className="cv-section" aria-labelledby="cv-cast-heading">
          <h2 id="cv-cast-heading" className="cv-section-label">
            Your cast
          </h2>
          <div className="cv-grid">
            {characters.map((c) => {
              const expanded = expandedId === c.id;
              const gLabel = genderLabel(c.gender);
              return (
                <article key={c.id} className={`cv-char-card${expanded ? " is-expanded" : ""}`}>
                  <div
                    className="cv-char-portrait"
                    style={{ background: c.gradient }}
                    aria-hidden
                  >
                    <span className="cv-char-initial">{c.name[0]?.toUpperCase() ?? "?"}</span>
                  </div>
                  <h3 className="cv-char-name">{c.name}</h3>
                  <div className="cv-char-tags">
                    {gLabel && <span className="cv-tag">{gLabel}</span>}
                    <span className="cv-tag cv-tag--role">{c.role}</span>
                  </div>
                  <p className="cv-char-summary">{c.summary}</p>

                  {expanded && (
                    <div className="cv-char-details">
                      {c.details && <p>{c.details}</p>}
                      {c.personality && (
                        <p>
                          <strong>Personality:</strong> {c.personality}
                        </p>
                      )}
                      {c.boundaries && (
                        <p>
                          <strong>Boundaries:</strong> {c.boundaries}
                        </p>
                      )}
                      {!c.details && !c.personality && !c.boundaries && (
                        <p className="cv-char-details-empty">
                          Add more detail when editing this character.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="cv-char-actions">
                    <button type="button" className="cv-btn cv-btn--primary" onClick={() => openEdit(c)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="cv-btn cv-btn--danger"
                      onClick={() => setDeleteId(c.id)}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="cv-btn cv-btn--link"
                      onClick={() => setExpandedId(expanded ? null : c.id)}
                      aria-expanded={expanded}
                    >
                      {expanded ? "Collapse" : "Expand details"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="cv-section cv-section--voices" aria-labelledby="cv-voices-heading">
          <h2 id="cv-voices-heading" className="cv-section-label">
            Narrator Voices
          </h2>
          <p className="cv-voices-hint">
            Your narrator travels with you across adventures, chat, and audio.
          </p>
          <div className="cv-voice-row">
            {NARRATOR_VOICES.map((v) => {
              const active = selectedNarratorId === v.id;
              const previewing = previewingVoice === v.id;
              return (
                <div
                  key={v.id}
                  className={`cv-voice-card${active ? " is-active" : ""}`}
                >
                  <div className="cv-voice-img-wrap">
                    <img src={v.image} alt="" className="cv-voice-img" />
                  </div>
                  <div className="cv-voice-info">
                    <p className="cv-voice-name">{v.name}</p>
                    <p className="cv-voice-tagline">{v.tagline}</p>
                  </div>
                  <div className="cv-voice-actions">
                    <button
                      type="button"
                      className={`cv-voice-preview${previewing ? " is-playing" : ""}`}
                      aria-label={`Preview ${v.name}`}
                      onClick={() => playVoicePreview(v)}
                    >
                      {previewing ? "…" : "Preview"}
                    </button>
                    <button
                      type="button"
                      className={`cv-voice-select${active ? " is-selected" : ""}`}
                      onClick={() => selectNarrator(v)}
                    >
                      {active ? "Selected" : "Select"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {modalMode && (
        <div className="cv-modal-backdrop" role="presentation" onClick={closeModal}>
          <div
            className="cv-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cv-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="cv-modal-title" className="cv-modal-title">
              {modalMode === "create" ? "New character" : "Edit character"}
            </h2>
            <form className="cv-modal-form" onSubmit={handleSaveCharacter}>
              <label className="cv-field">
                <span>Name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  autoFocus
                />
              </label>
              <div className="cv-field-row">
                <label className="cv-field">
                  <span>Gender</span>
                  <select
                    value={form.gender}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, gender: e.target.value as CharacterGender }))
                    }
                  >
                    <option value="">—</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="nonbinary">Non-binary</option>
                  </select>
                </label>
                <label className="cv-field">
                  <span>Role</span>
                  <input
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    placeholder="Romantic lead"
                  />
                </label>
              </div>
              <label className="cv-field">
                <span>One-line summary</span>
                <input
                  value={form.summary}
                  onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                  placeholder="Warm, magnetic, and impossible to ignore."
                />
              </label>
              <label className="cv-field">
                <span>Details (optional)</span>
                <textarea
                  rows={2}
                  value={form.details}
                  onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))}
                />
              </label>
              <label className="cv-field">
                <span>Personality (optional)</span>
                <input
                  value={form.personality}
                  onChange={(e) => setForm((f) => ({ ...f, personality: e.target.value }))}
                />
              </label>
              <label className="cv-field">
                <span>Boundaries (optional)</span>
                <input
                  value={form.boundaries}
                  onChange={(e) => setForm((f) => ({ ...f, boundaries: e.target.value }))}
                />
              </label>
              <div className="cv-modal-actions">
                <button type="button" className="cv-btn cv-btn--ghost" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="cv-btn cv-btn--primary">
                  Save character
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="cv-modal-backdrop" role="presentation" onClick={() => setDeleteId(null)}>
          <div
            className="cv-modal cv-modal--confirm"
            role="alertdialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="cv-modal-title">Remove this character?</p>
            <p className="cv-confirm-text">
              They will be removed from your cast. This cannot be undone.
            </p>
            <div className="cv-modal-actions">
              <button type="button" className="cv-btn cv-btn--ghost" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button type="button" className="cv-btn cv-btn--danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
