"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createCharacterId,
  DEFAULT_USER_CHARACTERS,
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

function characterThumbSrc(c: UserCharacter): string | undefined {
  return c.portrait ?? DEFAULT_USER_CHARACTERS.find((d) => d.id === c.id)?.portrait;
}

function CharacterThumb({ character }: { character: UserCharacter }) {
  const src = characterThumbSrc(character);
  return (
    <div className="cv-lib-thumb" aria-hidden>
      {src ? (
        <img src={src} alt="" />
      ) : (
        <div className="cv-lib-thumb-fallback" style={{ background: character.gradient }}>
          <span>{character.name[0]?.toUpperCase() ?? "?"}</span>
        </div>
      )}
    </div>
  );
}

export default function LiveTestCharactersVoicesFrame() {
  const [characters, setCharacters] = useState<UserCharacter[]>([]);
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
    persistCharacters(characters.filter((c) => c.id !== deleteId));
    setDeleteId(null);
  }

  return (
    <div className="cv-root animate-panel-in">
      <div className="cv-scroll">
        <header className="cv-toolbar">
          <div className="cv-toolbar-copy">
            <h1 className="cv-toolbar-title">Characters</h1>
            <p className="cv-toolbar-meta">
              {characters.length} in your cast · manage companions for stories and chat
            </p>
          </div>
          <button type="button" className="cv-cta" onClick={openCreate}>
            + New Character
          </button>
        </header>

        <section className="cv-library" aria-label="Character gallery">
          <div className="cv-lib-grid">
            {characters.map((c) => (
              <article key={c.id} className="cv-lib-card">
                <CharacterThumb character={c} />
                <div className="cv-lib-body">
                  <h2 className="cv-lib-name">{c.name}</h2>
                  <p className="cv-lib-role">{c.role}</p>
                  <p className="cv-lib-desc">{c.summary}</p>
                </div>
                <div className="cv-lib-actions">
                  <button
                    type="button"
                    className="cv-lib-btn cv-lib-btn--edit"
                    onClick={() => openEdit(c)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="cv-lib-btn cv-lib-btn--delete"
                    onClick={() => setDeleteId(c.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
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
                <button type="button" className="cv-lib-btn cv-lib-btn--ghost" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="cv-lib-btn cv-lib-btn--edit">
                  Save
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
            <p className="cv-modal-title">Delete this character?</p>
            <p className="cv-confirm-text">They will be removed from your cast. This cannot be undone.</p>
            <div className="cv-modal-actions">
              <button type="button" className="cv-lib-btn cv-lib-btn--ghost" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button type="button" className="cv-lib-btn cv-lib-btn--delete" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
