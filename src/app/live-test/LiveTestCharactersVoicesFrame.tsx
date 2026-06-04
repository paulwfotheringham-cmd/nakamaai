"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createCharacterId,
  DEFAULT_USER_CHARACTERS,
  pickCharacterGradient,
  pickCharacterPortrait,
  getCharacterUsage,
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

function portraitSrc(c: UserCharacter): string | undefined {
  return c.portrait ?? DEFAULT_USER_CHARACTERS.find((d) => d.id === c.id)?.portrait;
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

function CastPortrait({ character }: { character: UserCharacter }) {
  const src = portraitSrc(character);
  return (
    <>
      {src ? (
        <img src={src} alt="" className="cv-cast-portrait-img" />
      ) : (
        <div className="cv-cast-portrait-fallback" style={{ background: character.gradient }}>
          <span>{character.name[0]?.toUpperCase() ?? "?"}</span>
        </div>
      )}
      <div className="cv-cast-portrait-shade" aria-hidden />
    </>
  );
}

function CharacterCastCard({
  character,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onEdit,
  onRemove,
}: {
  character: UserCharacter;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handlePointer(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onCloseMenu();
      }
    }
    document.addEventListener("mousedown", handlePointer);
    return () => document.removeEventListener("mousedown", handlePointer);
  }, [menuOpen, onCloseMenu]);

  return (
    <article className="cv-cast-card">
      <div className="cv-cast-portrait">
        <CastPortrait character={character} />
        <div className="cv-cast-portrait-overlay">
          <span className="cv-cast-owned">Your companion</span>
          <div className="cv-cast-menu" ref={menuRef}>
            <button
              type="button"
              className="cv-cast-menu-trigger"
              aria-label={`Options for ${character.name}`}
              aria-expanded={menuOpen}
              onClick={(e) => {
                e.stopPropagation();
                onToggleMenu();
              }}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="cv-cast-menu-icon" aria-hidden>
                <circle cx="10" cy="4" r="1.5" />
                <circle cx="10" cy="10" r="1.5" />
                <circle cx="10" cy="16" r="1.5" />
              </svg>
            </button>
            {menuOpen && (
              <div className="cv-cast-menu-panel" role="menu">
                <button type="button" role="menuitem" onClick={onEdit}>
                  Edit companion
                </button>
                <button type="button" role="menuitem" className="is-remove" onClick={onRemove}>
                  Remove from cast
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="cv-cast-foot">
        <h2 className="cv-cast-name">{character.name}</h2>
        <span className="cv-cast-archetype">{character.role}</span>
        <p className="cv-cast-desc">{character.summary}</p>
      </div>
    </article>
  );
}

export default function LiveTestCharactersVoicesFrame() {
  const [characters, setCharacters] = useState<UserCharacter[]>([]);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CharacterForm>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    setCharacters(readUserCharacters());
  }, []);

  const persistCharacters = useCallback((next: UserCharacter[]) => {
    setCharacters(next);
    writeUserCharacters(next);
  }, []);

  function openCreate() {
    setOpenMenuId(null);
    setForm(EMPTY_FORM);
    setEditingId(null);
    setModalMode("create");
  }

  function openEdit(c: UserCharacter) {
    setOpenMenuId(null);
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
      persistCharacters([
        ...characters,
        {
          id: createCharacterId(),
          name,
          gender: form.gender,
          role: form.role.trim() || "Character",
          summary: form.summary.trim() || "A companion in your Nakama Nights cast.",
          details: form.details.trim(),
          personality: form.personality.trim(),
          boundaries: form.boundaries.trim(),
          gradient: pickCharacterGradient(characters.length),
          portrait: pickCharacterPortrait(characters.length),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ]);
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
      <div className="cv-page">
        <header className="cv-head">
          <div className="cv-head-text">
            <h1 className="cv-head-title">Characters</h1>
            <p className="cv-head-tagline">Choose from your cast of companions</p>
          </div>
          <button type="button" className="cv-head-cta" onClick={openCreate}>
            + New Character
          </button>
        </header>

        <section className="cv-cast-gallery" aria-label="Your cast">
          <div className="cv-cast-grid">
            {characters.map((c) => (
              <CharacterCastCard
                key={c.id}
                character={c}
                menuOpen={openMenuId === c.id}
                onToggleMenu={() => setOpenMenuId((id) => (id === c.id ? null : c.id))}
                onCloseMenu={() => setOpenMenuId(null)}
                onEdit={() => openEdit(c)}
                onRemove={() => {
                  setOpenMenuId(null);
                  setDeleteId(c.id);
                }}
              />
            ))}
            <button type="button" className="cv-cast-card cv-cast-card--invite" onClick={openCreate}>
              <div className="cv-cast-invite-visual" aria-hidden>
                <img src="/tiles/tile6.jpg" alt="" className="cv-cast-invite-img" />
                <div className="cv-cast-invite-veil" />
                <span className="cv-cast-invite-glow" />
              </div>
              <div className="cv-cast-invite-foot">
                <span className="cv-cast-invite-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </span>
                <h2 className="cv-cast-invite-title">Create New Companion</h2>
                <p className="cv-cast-invite-sub">Create your next character</p>
              </div>
            </button>
          </div>
        </section>

        <section className="cv-activity" aria-labelledby="cv-activity-title">
          <div className="cv-activity-head">
            <h2 id="cv-activity-title" className="cv-activity-title">
              Character Activity
            </h2>
            <p className="cv-activity-lead">
              Where your companions have recently appeared across Nakama Nights
            </p>
          </div>
          <ul className="cv-activity-cast">
            {characters.map((c) => {
              const appearances = getCharacterUsage(c);
              return (
                <li key={c.id} className="cv-activity-entry">
                  <span className="cv-activity-name">{c.name}</span>
                  <ul className="cv-activity-stories">
                    {appearances.map((story) => (
                      <li key={story}>{story}</li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
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
              {modalMode === "create" ? "New companion" : "Edit companion"}
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
                  <span>Archetype</span>
                  <input
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    placeholder="Romantic lead"
                  />
                </label>
              </div>
              <label className="cv-field">
                <span>One-line description</span>
                <input
                  value={form.summary}
                  onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
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
                <button type="button" className="cv-cast-btn cv-cast-btn--ghost" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="cv-cast-btn cv-cast-btn--gold">
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
            <p className="cv-modal-title">Remove from your cast?</p>
            <p className="cv-confirm-text">
              {characters.find((c) => c.id === deleteId)?.name ?? "This companion"} will leave your
              collection. This cannot be undone.
            </p>
            <div className="cv-modal-actions">
              <button type="button" className="cv-cast-btn cv-cast-btn--ghost" onClick={() => setDeleteId(null)}>
                Keep companion
              </button>
              <button type="button" className="cv-cast-btn cv-cast-btn--muted" onClick={confirmDelete}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
