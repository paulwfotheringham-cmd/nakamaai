"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createCharacterId,
  DEFAULT_USER_CHARACTERS,
  getCharacterUsage,
  pickCharacterGradient,
  pickCharacterPortrait,
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

function CharacterPortrait({
  character,
  className = "",
}: {
  character: UserCharacter;
  className?: string;
}) {
  const src =
    character.portrait ??
    DEFAULT_USER_CHARACTERS.find((d) => d.id === character.id)?.portrait;
  return (
    <div className={`cv-roster-portrait ${className}`.trim()}>
      {src ? (
        <img src={src} alt="" className="cv-roster-portrait-img" />
      ) : (
        <div
          className="cv-roster-portrait-fallback"
          style={{ background: character.gradient }}
          aria-hidden
        >
          <span>{character.name[0]?.toUpperCase() ?? "?"}</span>
        </div>
      )}
      <div className="cv-roster-portrait-veil" aria-hidden />
    </div>
  );
}

export default function LiveTestCharactersVoicesFrame() {
  const [characters, setCharacters] = useState<UserCharacter[]>([]);
  const [viewCharacter, setViewCharacter] = useState<UserCharacter | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CharacterForm>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setCharacters(readUserCharacters());
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
    setViewCharacter(null);
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
        portrait: pickCharacterPortrait(characters.length),
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
    if (viewCharacter?.id === deleteId) setViewCharacter(null);
    setDeleteId(null);
  }

  return (
    <div className="cv-root animate-panel-in">
      <div className="cv-atmosphere" aria-hidden>
        <img src="/tiles/tile6.jpg" alt="" className="cv-atmosphere-img" />
        <div className="cv-atmosphere-veil" />
      </div>

      <div className="cv-scroll">
        <header className="cv-hero">
          <div className="cv-hero-glow" aria-hidden />
          <div className="cv-hero-inner">
            <div className="cv-hero-copy">
              <p className="cv-hero-eyebrow">Your personal cast</p>
              <h1 className="cv-hero-title">Characters & Voices</h1>
              <p className="cv-hero-subtitle">
                A gallery of the companions who travel with you through every story.
              </p>
            </div>
            <button type="button" className="cv-cta" onClick={openCreate}>
              + New Character
            </button>
          </div>
        </header>

        <section className="cv-block cv-block--gallery" aria-labelledby="cv-cast-heading">
          <div className="cv-block-head">
            <h2 id="cv-cast-heading" className="cv-block-title">
              Character Gallery
            </h2>
            <p className="cv-block-desc">
              Portrait-first companions — the faces that follow you through every story.
            </p>
          </div>
          <div className="cv-roster-grid">
            {characters.map((c) => (
              <article key={c.id} className="cv-roster-card">
                <CharacterPortrait character={c} />
                <span className="cv-roster-archetype">{c.role}</span>
                <div className="cv-roster-body">
                  <h3 className="cv-roster-name">{c.name}</h3>
                  <p className="cv-roster-summary">{c.summary}</p>
                  <div className="cv-roster-usage">
                    <span className="cv-roster-usage-label">Used in</span>
                    <ul className="cv-roster-usage-list">
                      {getCharacterUsage(c).map((place) => (
                        <li key={place}>{place}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="cv-roster-actions">
                    <button
                      type="button"
                      className="cv-roster-btn cv-roster-btn--primary"
                      onClick={() => openEdit(c)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="cv-roster-btn cv-roster-btn--secondary"
                      onClick={() => setViewCharacter(c)}
                    >
                      View
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="cv-block cv-block--activity" aria-labelledby="cv-activity-heading">
          <div className="cv-block-head">
            <h2 id="cv-activity-heading" className="cv-block-title">
              Character Activity
            </h2>
            <p className="cv-block-desc">
              Where your cast appears across Nakama Nights — connected to real experiences.
            </p>
          </div>
          <div className="cv-activity-grid">
            {characters.map((c) => (
              <div key={c.id} className="cv-activity-card">
                <div className="cv-activity-portrait">
                  {c.portrait ? (
                    <img src={c.portrait} alt="" />
                  ) : (
                    <div style={{ background: c.gradient }} aria-hidden>
                      <span>{c.name[0]}</span>
                    </div>
                  )}
                </div>
                <div className="cv-activity-copy">
                  <h3 className="cv-activity-name">{c.name}</h3>
                  <p className="cv-activity-label">Used in</p>
                  <ul className="cv-activity-places">
                    {getCharacterUsage(c).map((place) => (
                      <li key={place}>{place}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {viewCharacter && (
        <div
          className="cv-modal-backdrop"
          role="presentation"
          onClick={() => setViewCharacter(null)}
        >
          <div
            className="cv-view-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cv-view-title"
            onClick={(e) => e.stopPropagation()}
          >
            <CharacterPortrait character={viewCharacter} className="cv-view-portrait" />
            <div className="cv-view-body">
              <p className="cv-view-archetype">{viewCharacter.role}</p>
              <h2 id="cv-view-title" className="cv-view-name">
                {viewCharacter.name}
              </h2>
              <p className="cv-view-summary">{viewCharacter.summary}</p>
              {viewCharacter.details && (
                <p className="cv-view-detail">{viewCharacter.details}</p>
              )}
              {viewCharacter.personality && (
                <p className="cv-view-meta">
                  <strong>Personality</strong> — {viewCharacter.personality}
                </p>
              )}
              {viewCharacter.boundaries && (
                <p className="cv-view-meta">
                  <strong>Boundaries</strong> — {viewCharacter.boundaries}
                </p>
              )}
              <div className="cv-view-usage">
                <p className="cv-view-usage-label">Used in</p>
                <ul>
                  {getCharacterUsage(viewCharacter).map((place) => (
                    <li key={place}>{place}</li>
                  ))}
                </ul>
              </div>
              <div className="cv-view-actions">
                <button
                  type="button"
                  className="cv-roster-btn cv-roster-btn--primary"
                  onClick={() => openEdit(viewCharacter)}
                >
                  Edit character
                </button>
                <button
                  type="button"
                  className="cv-roster-btn cv-roster-btn--danger"
                  onClick={() => {
                    setDeleteId(viewCharacter.id);
                    setViewCharacter(null);
                  }}
                >
                  Remove from cast
                </button>
                <button
                  type="button"
                  className="cv-roster-btn cv-roster-btn--ghost"
                  onClick={() => setViewCharacter(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <span>Archetype / role</span>
                  <input
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    placeholder="Romantic lead"
                  />
                </label>
              </div>
              <label className="cv-field">
                <span>Short description</span>
                <input
                  value={form.summary}
                  onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                  placeholder="Warm, magnetic, and impossible to ignore."
                />
              </label>
              <label className="cv-field">
                <span>Story details (optional)</span>
                <textarea
                  rows={3}
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
                <button type="button" className="cv-roster-btn cv-roster-btn--ghost" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="cv-roster-btn cv-roster-btn--primary">
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
            <p className="cv-modal-title">Remove from your cast?</p>
            <p className="cv-confirm-text">
              This character will leave your gallery. This cannot be undone.
            </p>
            <div className="cv-modal-actions">
              <button type="button" className="cv-roster-btn cv-roster-btn--ghost" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button type="button" className="cv-roster-btn cv-roster-btn--danger" onClick={confirmDelete}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
