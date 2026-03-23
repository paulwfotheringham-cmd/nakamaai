"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type SavedStory = {
  id: string;
  name: string;
  story_text: string;
  narrator_voice: string;
  male_voice: string;
  female_voice: string;
  setting: string;
  mood: string;
  created_at: string;
};

type CartesiaVoice = {
  id: string;
  name: string;
  description: string;
  language: string;
  gender: string | null;
  accent: string | null;
  age: string | null;
  is_public: boolean;
};

type SelectedVoice = { id: string; title: string };

// ─── Voice Browser Modal ──────────────────────────────────────────────────────

const PAGE_SIZE = 20;
const GENDER_TABS = ["female", "male"] as const;
type GenderTab = typeof GENDER_TABS[number] | "all";

const LANG_NAMES: Record<string, string> = {
  en: "English", fr: "French", de: "German", es: "Spanish", pt: "Portuguese",
  zh: "Chinese", ja: "Japanese", ko: "Korean", hi: "Hindi", it: "Italian",
  nl: "Dutch", pl: "Polish", ru: "Russian", sv: "Swedish", tr: "Turkish",
  tl: "Tagalog", bg: "Bulgarian", ro: "Romanian", ar: "Arabic", cs: "Czech",
  el: "Greek", fi: "Finnish", hr: "Croatian", ms: "Malay", sk: "Slovak",
  da: "Danish", ta: "Tamil", uk: "Ukrainian", hu: "Hungarian", no: "Norwegian",
  vi: "Vietnamese", bn: "Bengali", th: "Thai", he: "Hebrew", ka: "Georgian",
  id: "Indonesian", te: "Telugu", gu: "Gujarati", kn: "Kannada", ml: "Malayalam",
  mr: "Marathi", pa: "Punjabi",
};

function langLabel(code: string) {
  return LANG_NAMES[code?.toLowerCase()] ?? code?.toUpperCase() ?? "Unknown";
}

function VoiceBrowserModal({
  slot,
  lockedGender,
  defaultGender,
  onSelect,
  onClose,
}: {
  slot: string;
  lockedGender: GenderTab;
  defaultGender?: "female" | "male";
  onSelect: (voice: SelectedVoice) => void;
  onClose: () => void;
}) {
  const [allVoices, setAllVoices] = useState<CartesiaVoice[]>([]);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState<GenderTab>(lockedGender !== "all" ? lockedGender : (defaultGender ?? "female"));
  const [langFilter, setLangFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/cartesia-voices")
      .then((r) => r.json())
      .then((data) => setAllVoices(data.voices ?? []))
      .catch(() => setAllVoices([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = allVoices.filter((v) => {
    const g = v.gender?.toLowerCase() ?? "";
    const matchesGender =
      gender === "all" ||
      (gender === "female" && (g === "female" || g === "feminine")) ||
      (gender === "male"   && (g === "male"   || g === "masculine"));
    const matchesLang = langFilter === "all" || v.language?.toLowerCase() === langFilter;
    const matchesSearch =
      !search ||
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.description?.toLowerCase().includes(search.toLowerCase());
    return matchesGender && matchesLang && matchesSearch;
  });

  // Derive available languages from gender-filtered voices (before lang filter)
  const genderFiltered = allVoices.filter((v) => {
    const g = v.gender?.toLowerCase() ?? "";
    return gender === "all" ||
      (gender === "female" && (g === "female" || g === "feminine")) ||
      (gender === "male"   && (g === "male"   || g === "masculine"));
  });
  const availableLangs = Array.from(new Set(genderFiltered.map((v) => v.language?.toLowerCase()).filter(Boolean)))
    .sort((a, b) => langLabel(a!).localeCompare(langLabel(b!))) as string[];

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageVoices = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleGender(g: GenderTab) {
    setGender(g);
    setLangFilter("all");
    setPage(1);
  }

  async function previewVoice(voice: CartesiaVoice) {
    if (previewingId === voice.id) {
      previewAudioRef.current?.pause();
      previewAudioRef.current = null;
      setPreviewingId(null);
      return;
    }
    previewAudioRef.current?.pause();
    setPreviewingId(voice.id);
    try {
      const res = await fetch("/api/cartesia-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `Hi, my name is ${voice.name}. I can be your voice to take you on your fantasy journey.`,
          voiceId: voice.id,
        }),
      });
      if (!res.ok) { setPreviewingId(null); return; }
      const { outputUri } = await res.json();
      const audio = new Audio(outputUri);
      previewAudioRef.current = audio;
      audio.onended = () => setPreviewingId(null);
      audio.onerror = () => setPreviewingId(null);
      audio.play().catch(() => setPreviewingId(null));
    } catch {
      setPreviewingId(null);
    }
  }

  const genderIcon = (v: CartesiaVoice) => {
    const g = v.gender?.toLowerCase();
    if (g === "female") return "♀";
    if (g === "male") return "♂";
    return "🎙";
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          maxHeight: "85vh",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.12)",
          background: "#12091a",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Modal header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ fontSize: "18px", fontWeight: 700 }}>
              Choose Voice — <span style={{ color: "#d8b26e" }}>{slot}</span>
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginTop: "4px" }}>
              {loading ? "Loading…" : `${filtered.length.toLocaleString()} voices available`}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              padding: "6px 12px",
              fontSize: "18px",
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Search + filters */}
        <div style={{ padding: "12px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search voices by name…"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              style={{
                flex: 1,
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                color: "white",
                padding: "10px 16px",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {lockedGender === "all" && (
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                {GENDER_TABS.map((g) => (
                  <button
                    key={g}
                    onClick={() => handleGender(g)}
                    style={{
                      borderRadius: "10px",
                      border: "1px solid",
                      borderColor: gender === g ? "#d8b26e" : "rgba(255,255,255,0.1)",
                      background: gender === g ? "rgba(216,178,110,0.15)" : "rgba(255,255,255,0.04)",
                      color: gender === g ? "#d8b26e" : "rgba(255,255,255,0.6)",
                      padding: "6px 14px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {g === "female" ? "♀ Female" : "♂ Male"}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Language / accent filter */}
          {availableLangs.length > 1 && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <button
                onClick={() => { setLangFilter("all"); setPage(1); }}
                style={{
                  borderRadius: "20px",
                  border: "1px solid",
                  borderColor: langFilter === "all" ? "#d8b26e" : "rgba(255,255,255,0.1)",
                  background: langFilter === "all" ? "rgba(216,178,110,0.15)" : "rgba(255,255,255,0.04)",
                  color: langFilter === "all" ? "#d8b26e" : "rgba(255,255,255,0.55)",
                  padding: "4px 12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                All accents
              </button>
              {availableLangs.map((code) => (
                <button
                  key={code}
                  onClick={() => { setLangFilter(code); setPage(1); }}
                  style={{
                    borderRadius: "20px",
                    border: "1px solid",
                    borderColor: langFilter === code ? "#d8b26e" : "rgba(255,255,255,0.1)",
                    background: langFilter === code ? "rgba(216,178,110,0.15)" : "rgba(255,255,255,0.04)",
                    color: langFilter === code ? "#d8b26e" : "rgba(255,255,255,0.55)",
                    padding: "4px 12px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {langLabel(code)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Voice list */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {loading ? (
            <div style={{ padding: "48px", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
              Loading voices…
            </div>
          ) : pageVoices.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
              No voices found.
            </div>
          ) : (
            pageVoices.map((voice) => (
              <div
                key={voice.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px 24px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(216,178,110,0.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: voice.gender?.toLowerCase() === "female"
                      ? "rgba(216,130,178,0.2)"
                      : voice.gender?.toLowerCase() === "male"
                      ? "rgba(110,160,216,0.2)"
                      : "rgba(216,178,110,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  {genderIcon(voice)}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "15px", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {voice.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "2px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {voice.language && (
                      <span style={{ borderRadius: "6px", background: "rgba(255,255,255,0.06)", padding: "1px 6px", fontSize: "11px" }}>
                        {langLabel(voice.language)}
                      </span>
                    )}
                    {voice.accent && (
                      <span style={{ borderRadius: "6px", background: "rgba(255,255,255,0.06)", padding: "1px 6px", fontSize: "11px", textTransform: "capitalize" }}>
                        {voice.accent}
                      </span>
                    )}
                    {voice.age && (
                      <span style={{ borderRadius: "6px", background: "rgba(255,255,255,0.06)", padding: "1px 6px", fontSize: "11px", textTransform: "capitalize" }}>
                        {voice.age}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); previewVoice(voice); }}
                    style={{
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: previewingId === voice.id ? "rgba(216,178,110,0.2)" : "rgba(255,255,255,0.06)",
                      color: previewingId === voice.id ? "#d8b26e" : "rgba(255,255,255,0.7)",
                      padding: "6px 14px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: previewingId !== null && previewingId !== voice.id ? "not-allowed" : "pointer",
                      whiteSpace: "nowrap",
                      opacity: previewingId !== null && previewingId !== voice.id ? 0.4 : 1,
                    }}
                    disabled={previewingId !== null && previewingId !== voice.id}
                  >
                    {previewingId === voice.id ? "⏳ Generating…" : "▶ Preview"}
                  </button>
                  <button
                    onClick={() => { onSelect({ id: voice.id, title: voice.name }); }}
                    style={{
                      borderRadius: "10px",
                      border: "none",
                      background: "#d8b26e",
                      color: "black",
                      padding: "6px 14px",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Select
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setPage(Math.max(1, safePage - 1))}
            disabled={safePage <= 1}
            style={paginationBtnStyle(safePage <= 1)}
          >
            ← Prev
          </button>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
            Page {safePage} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, safePage + 1))}
            disabled={safePage >= totalPages}
            style={paginationBtnStyle(safePage >= totalPages)}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

function paginationBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: disabled ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.07)",
    color: disabled ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.8)",
    padding: "7px 16px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
  };
}

// ─── Voice Slot Picker ────────────────────────────────────────────────────────

function VoiceSlot({
  label,
  selected,
  previewingId,
  onBrowse,
  onPreview,
}: {
  label: string;
  selected: SelectedVoice | null;
  previewingId: string | null;
  onBrowse: () => void;
  onPreview: () => void;
}) {
  const isPreviewing = selected && previewingId === selected.id;
  return (
    <div style={{ display: "grid", gap: "8px" }}>
      <span style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{label}</span>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <div
          style={{
            flex: 1,
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.06)",
            color: selected ? "white" : "rgba(255,255,255,0.35)",
            padding: "14px 16px",
            fontSize: "15px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {selected ? selected.title : "No voice selected"}
        </div>
        {selected && (
          <button
            onClick={onPreview}
            style={{
              flexShrink: 0,
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: isPreviewing ? "rgba(216,178,110,0.2)" : "rgba(255,255,255,0.06)",
              color: isPreviewing ? "#d8b26e" : "rgba(255,255,255,0.7)",
              padding: "0 16px",
              height: "50px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {isPreviewing ? "⏹ Stop" : "▶ Preview"}
          </button>
        )}
        <button
          onClick={onBrowse}
          style={{
            flexShrink: 0,
            borderRadius: "14px",
            border: "1px solid rgba(216,178,110,0.35)",
            background: "rgba(216,178,110,0.1)",
            color: "#d8b26e",
            padding: "0 16px",
            height: "50px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Browse
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

function CreateAudioTestInner() {
  const [setting, setSetting]         = useState("office");
  const [mood, setMood]               = useState("romantic");
  const [buildUp, setBuildUp]         = useState("slow burn");
  const [maleRole, setMaleRole]       = useState("boss");
  const [femaleRole, setFemaleRole]   = useState("assistant");
  const [storyType, setStoryType]     = useState("romantic encounter");
  const [extraDetail, setExtraDetail] = useState("");
  const [story, setStory]             = useState("");
  const [loading, setLoading]         = useState(false);

  const [narratorVoice, setNarratorVoice] = useState<SelectedVoice | null>(null);
  const [maleVoice, setMaleVoice]         = useState<SelectedVoice | null>(null);
  const [femaleVoice, setFemaleVoice]     = useState<SelectedVoice | null>(null);

  const [activeBrowserSlot, setActiveBrowserSlot] = useState<"narrator" | "male" | "female" | null>(null);

  const [isPlaying, setIsPlaying]           = useState(false);
  const [preparingAudio, setPreparingAudio] = useState(false);
  const [audioError, setAudioError]         = useState("");
  const [overallTime, setOverallTime]       = useState(0);
  const [totalDuration, setTotalDuration]   = useState(0);

  const [previewingId, setPreviewingId]   = useState<string | null>(null);

  const [saveStatus, setSaveStatus]         = useState<"idle" | "saving" | "saved">("idle");
  const [savedStories, setSavedStories]     = useState<SavedStory[]>([]);
  const [showDropdown, setShowDropdown]     = useState(false);
  const [loadingStories, setLoadingStories] = useState(false);
  const dropdownRef  = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("story_id");
    if (!id) return;
    fetch("/api/saved-stories")
      .then((r) => r.json())
      .then(({ stories }) => {
        const found = (stories ?? []).find((s: SavedStory) => s.id === id);
        if (found) loadSavedStory(found);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stoppedRef       = useRef(false);
  const currentAudioRef  = useRef<HTMLAudioElement | null>(null);
  const previewAudioRef  = useRef<HTMLAudioElement | null>(null);
  const segmentsRef      = useRef<{ url: string; duration: number; startTime: number }[]>([]);
  const playActiveRef    = useRef(false);

  // ── Voice preview via Cartesia TTS ────────────────────────────────────────
  async function previewSelectedVoice(voice: SelectedVoice) {
    if (previewingId === voice.id) {
      previewAudioRef.current?.pause();
      previewAudioRef.current = null;
      setPreviewingId(null);
      return;
    }
    previewAudioRef.current?.pause();
    setPreviewingId(voice.id);
    try {
      const res = await fetch("/api/cartesia-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `Hi, my name is ${voice.title}. I can be your voice to take you on your fantasy journey.`,
          voiceId: voice.id,
        }),
      });
      if (!res.ok) { setPreviewingId(null); return; }
      const { outputUri } = await res.json();
      const audio = new Audio(outputUri);
      previewAudioRef.current = audio;
      audio.onended = () => setPreviewingId(null);
      audio.onerror = () => setPreviewingId(null);
      audio.play().catch(() => setPreviewingId(null));
    } catch {
      setPreviewingId(null);
    }
  }

  async function generateStory() {
    setLoading(true);
    setStory("");
    setAudioError("");
    setSaveStatus("idle");
    try {
      const response = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setting, mood, buildUp, maleRole, femaleRole, storyType, extraDetail }),
      });
      const data = await response.json();
      setStory(data.story || "");
    } catch {
      alert("Failed to generate story");
    }
    setLoading(false);
  }

  function formatTime(s: number) {
    if (!isFinite(s) || isNaN(s) || s < 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  function autoName() {
    const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    return `${setting.charAt(0).toUpperCase() + setting.slice(1)} · ${mood} · ${date}`;
  }

  async function saveStory() {
    if (!story.trim() || saveStatus === "saving") return;
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/saved-stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: autoName(),
          storyText: story,
          narratorVoice: narratorVoice?.id ?? "",
          maleVoice: maleVoice?.id ?? "",
          femaleVoice: femaleVoice?.id ?? "",
          setting,
          mood,
        }),
      });
      if (res.ok) {
        setSaveStatus("saved");
        if (savedStories.length > 0) fetchSavedStories();
      } else {
        setSaveStatus("idle");
        alert("Failed to save story.");
      }
    } catch {
      setSaveStatus("idle");
      alert("Failed to save story.");
    }
  }

  async function fetchSavedStories() {
    setLoadingStories(true);
    try {
      const res = await fetch("/api/saved-stories");
      const data = await res.json();
      setSavedStories(data.stories ?? []);
    } catch {
      setSavedStories([]);
    }
    setLoadingStories(false);
  }

  async function toggleDropdown() {
    if (!showDropdown && savedStories.length === 0) await fetchSavedStories();
    setShowDropdown((v) => !v);
  }

  function loadSavedStory(s: SavedStory) {
    setStory(s.story_text);
    if (s.narrator_voice) setNarratorVoice({ id: s.narrator_voice, title: s.narrator_voice });
    if (s.male_voice)     setMaleVoice({ id: s.male_voice, title: s.male_voice });
    if (s.female_voice)   setFemaleVoice({ id: s.female_voice, title: s.female_voice });
    if (s.setting) setSetting(s.setting);
    if (s.mood)    setMood(s.mood);
    setSaveStatus("idle");
    setShowDropdown(false);
    stopStory();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function parseLines() {
    return story
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        let text = line, voiceId = narratorVoice?.id ?? "";
        if (line.startsWith("MALE:"))      { text = line.replace("MALE:", "").trim();      voiceId = maleVoice?.id ?? narratorVoice?.id ?? ""; }
        else if (line.startsWith("FEMALE:"))   { text = line.replace("FEMALE:", "").trim();    voiceId = femaleVoice?.id ?? narratorVoice?.id ?? ""; }
        else if (line.startsWith("NARRATOR:")) { text = line.replace("NARRATOR:", "").trim();  voiceId = narratorVoice?.id ?? ""; }
        return { text, voiceId };
      });
  }

  async function speakStory() {
    if (!story.trim() || isPlaying || preparingAudio) return;
    if (!narratorVoice) { setAudioError("Please select a narrator voice first."); return; }

    stoppedRef.current = false;
    playActiveRef.current = true;
    setAudioError("");
    setOverallTime(0);
    setTotalDuration(0);
    setPreparingAudio(true);

    const lineConfigs = parseLines();

    const urls: string[] = [];
    for (const { text, voiceId } of lineConfigs) {
      if (stoppedRef.current) break;
      if (!voiceId) continue;
      try {
        const res = await fetch("/api/cartesia-tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, voiceId }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          setAudioError(errData.error ?? `Audio generation failed (${res.status})`);
          setPreparingAudio(false); setIsPlaying(false); playActiveRef.current = false; return;
        }
        const { outputUri } = await res.json();
        urls.push(outputUri);
      } catch {
        setAudioError("Failed to generate audio."); setPreparingAudio(false); setIsPlaying(false); playActiveRef.current = false; return;
      }
    }

    if (stoppedRef.current) { setPreparingAudio(false); setIsPlaying(false); playActiveRef.current = false; return; }

    const durations = await Promise.all(
      urls.map((url) => new Promise<number>((resolve) => {
        const a = new Audio(url);
        a.onloadedmetadata = () => resolve(isFinite(a.duration) ? a.duration : 0);
        a.onerror = () => resolve(0);
      }))
    );

    let accumulated = 0;
    const segments = urls.map((url, i) => {
      const seg = { url, duration: durations[i], startTime: accumulated };
      accumulated += durations[i];
      return seg;
    });

    segmentsRef.current = segments;
    const total = accumulated;
    setTotalDuration(total);
    setPreparingAudio(false);
    setIsPlaying(true);

    for (const seg of segments) {
      if (stoppedRef.current) break;
      await new Promise<void>((resolve) => {
        if (stoppedRef.current) { resolve(); return; }
        const audio = new Audio(seg.url);
        currentAudioRef.current = audio;
        audio.ontimeupdate = () => setOverallTime(seg.startTime + audio.currentTime);
        audio.onended  = () => resolve();
        audio.onerror  = () => resolve();
        audio.play().catch(() => resolve());
      });
    }

    setIsPlaying(false);
    playActiveRef.current = false;
    setOverallTime(0);
  }

  function stopStory() {
    stoppedRef.current = true;
    playActiveRef.current = false;
    currentAudioRef.current?.pause();
    currentAudioRef.current = null;
    setIsPlaying(false);
    setPreparingAudio(false);
    setOverallTime(0);
    setTotalDuration(0);
  }

  function handleSeek(value: number) {
    const segs = segmentsRef.current;
    if (!segs.length) return;
    const target = segs.findLast((s) => s.startTime <= value) ?? segs[0];
    const offsetInSeg = value - target.startTime;
    if (currentAudioRef.current) {
      currentAudioRef.current.currentTime = offsetInSeg;
      setOverallTime(value);
    }
  }

  function handleVoiceSelect(voice: SelectedVoice) {
    if (activeBrowserSlot === "narrator") setNarratorVoice(voice);
    if (activeBrowserSlot === "male")     setMaleVoice(voice);
    if (activeBrowserSlot === "female")   setFemaleVoice(voice);
    setActiveBrowserSlot(null);
  }

  const slotLabel = activeBrowserSlot === "narrator"
    ? "Narrator Voice"
    : activeBrowserSlot === "male"
    ? "Male Character Voice"
    : "Female Character Voice";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #3a1d2e 0%, #160f18 35%, #09080b 100%)",
        color: "white",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {activeBrowserSlot && (
        <VoiceBrowserModal
          slot={slotLabel}
          lockedGender={activeBrowserSlot === "male" ? "male" : activeBrowserSlot === "female" ? "female" : "all"}
          defaultGender={activeBrowserSlot === "narrator" ? "female" : undefined}
          onSelect={handleVoiceSelect}
          onClose={() => setActiveBrowserSlot(null)}
        />
      )}

      <a href="/dashboard" style={backBtnStyle}>← Dashboard</a>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "32px 24px",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.4em", color: "#d8b26e" }}>
              Nakama
            </div>
            <div style={{ marginTop: "8px", fontSize: "32px", fontWeight: 700 }}>Nakama AI · Customize your adventure</div>
          </div>
        </div>

        {/* Two-column layout */}
        <div style={{ display: "grid", gap: "32px", gridTemplateColumns: "1fr 1.1fr" }}>

          {/* Left: hero text */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div
              style={{
                marginBottom: "16px",
                display: "inline-flex",
                width: "fit-content",
                borderRadius: "999px",
                border: "1px solid rgba(216,178,110,0.3)",
                background: "rgba(216,178,110,0.1)",
                padding: "8px 16px",
                fontSize: "14px",
                color: "#f1d7a1",
              }}
            >
              Premium audio storytelling
            </div>

            <h1
              style={{
                maxWidth: "700px",
                fontSize: "64px",
                fontWeight: 700,
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              500+ voices for your{" "}
              <span style={{ color: "#d8b26e" }}>story</span>
            </h1>

            <p
              style={{
                marginTop: "24px",
                maxWidth: "620px",
                fontSize: "22px",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              Browse our curated English voice library — filter by gender, accent, preview any voice live,
              and cast your narrator, male character, and female character.
            </p>

            <div style={{ marginTop: "32px", display: "grid", gap: "12px", gridTemplateColumns: "1fr 1fr" }}>
              <FeatureCard title="500+ curated voices" text="Hand-picked voice library — filter by male, female, accent and age." />
              <FeatureCard title="Live preview"         text="Hear any voice before committing it to your story." />
              <FeatureCard title="Full cast control"    text="Assign different voices to narrator, male, and female characters." />
              <FeatureCard title="Ultra Fast Generation" text="Create your story and audio in seconds." />
            </div>
          </div>

          {/* Right: form */}
          <div
            style={{
              borderRadius: "28px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.06)",
              padding: "24px",
              boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ margin: 0, fontSize: "32px", fontWeight: 700 }}>Build your scene</h2>
              <p style={{ marginTop: "8px", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
                Adjust the story ingredients, then choose voices and generate.
              </p>
            </div>

            <div style={{ display: "grid", gap: "16px" }}>
              <TwoCol>
                <Field label="Setting">
                  <select style={inputStyle} value={setting} onChange={(e) => setSetting(e.target.value)}>
                    {["office","café","beach","hotel","city penthouse"].map((o) => (
                      <option key={o} style={{ color: "black" }}>{o}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Mood">
                  <select style={inputStyle} value={mood} onChange={(e) => setMood(e.target.value)}>
                    {["romantic","playful","intense","dramatic","tender"].map((o) => (
                      <option key={o} style={{ color: "black" }}>{o}</option>
                    ))}
                  </select>
                </Field>
              </TwoCol>

              <TwoCol>
                <Field label="Build-up">
                  <select style={inputStyle} value={buildUp} onChange={(e) => setBuildUp(e.target.value)}>
                    {["slow burn","medium pace","instant spark"].map((o) => (
                      <option key={o} style={{ color: "black" }}>{o}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Story Type">
                  <select style={inputStyle} value={storyType} onChange={(e) => setStoryType(e.target.value)}>
                    {["romantic encounter","forbidden romance","reunion","enemies to lovers","late night confession"].map((o) => (
                      <option key={o} style={{ color: "black" }}>{o}</option>
                    ))}
                  </select>
                </Field>
              </TwoCol>

              <TwoCol>
                <Field label="Male Character">
                  <select style={inputStyle} value={maleRole} onChange={(e) => setMaleRole(e.target.value)}>
                    {["boss","stranger","chef","artist","billionaire"].map((o) => (
                      <option key={o} style={{ color: "black" }}>{o}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Female Character">
                  <select style={inputStyle} value={femaleRole} onChange={(e) => setFemaleRole(e.target.value)}>
                    {["assistant","traveler","writer","singer","entrepreneur"].map((o) => (
                      <option key={o} style={{ color: "black" }}>{o}</option>
                    ))}
                  </select>
                </Field>
              </TwoCol>

              <Field label="Extra Detail">
                <input
                  style={inputStyle}
                  placeholder="Optional custom detail..."
                  value={extraDetail}
                  onChange={(e) => setExtraDetail(e.target.value)}
                />
              </Field>

              {/* Cartesia Voice Casting */}
              <div
                style={{
                  marginTop: "8px",
                  borderRadius: "20px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(0,0,0,0.2)",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    marginBottom: "16px",
                    fontSize: "13px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "#d8b26e",
                  }}
                >
                  Voice Casting
                </div>

                <div style={{ display: "grid", gap: "16px" }}>
                  <VoiceSlot
                    label="Narrator Voice"
                    selected={narratorVoice}
                    previewingId={previewingId}
                    onBrowse={() => setActiveBrowserSlot("narrator")}
                    onPreview={() => narratorVoice && previewSelectedVoice(narratorVoice)}
                  />
                  <VoiceSlot
                    label="Male Character Voice"
                    selected={maleVoice}
                    previewingId={previewingId}
                    onBrowse={() => setActiveBrowserSlot("male")}
                    onPreview={() => maleVoice && previewSelectedVoice(maleVoice)}
                  />
                  <VoiceSlot
                    label="Female Character Voice"
                    selected={femaleVoice}
                    previewingId={previewingId}
                    onBrowse={() => setActiveBrowserSlot("female")}
                    onPreview={() => femaleVoice && previewSelectedVoice(femaleVoice)}
                  />
                </div>

              </div>

              <button
                style={{
                  marginTop: "8px",
                  borderRadius: "18px",
                  background: "#d8b26e",
                  padding: "14px 24px",
                  fontWeight: 700,
                  color: "black",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  opacity: loading ? 0.7 : 1,
                }}
                onClick={generateStory}
                disabled={loading}
              >
                {loading ? "Generating…" : "Generate Story"}
              </button>
            </div>
          </div>
        </div>

        {/* Story + player */}
        {story && (
          <div
            style={{
              marginTop: "40px",
              borderRadius: "28px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.06)",
              padding: "24px",
              boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              style={{
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: "32px", fontWeight: 700 }}>Your Story</h2>
                <p style={{ marginTop: "6px", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
                  Generated from your chosen settings and cast.
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <button
                  style={{
                    borderRadius: "14px",
                    background: (isPlaying || preparingAudio) ? "rgba(255,255,255,0.1)" : "#d8b26e",
                    padding: "10px 20px",
                    fontWeight: 700,
                    color: (isPlaying || preparingAudio) ? "rgba(255,255,255,0.4)" : "black",
                    border: "none",
                    cursor: (isPlaying || preparingAudio) ? "not-allowed" : "pointer",
                    fontSize: "15px",
                  }}
                  onClick={speakStory}
                  disabled={isPlaying || preparingAudio}
                >
                  🔊 Listen
                </button>

                <button
                  style={{
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.05)",
                    padding: "10px 20px",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "15px",
                  }}
                  onClick={stopStory}
                >
                  ⏹ Stop
                </button>

                <button
                  style={{
                    borderRadius: "14px",
                    border: saveStatus === "saved"
                      ? "1px solid rgba(74,222,128,0.4)"
                      : "1px solid rgba(255,255,255,0.15)",
                    background: saveStatus === "saved"
                      ? "rgba(74,222,128,0.12)"
                      : "rgba(255,255,255,0.05)",
                    padding: "10px 20px",
                    color: saveStatus === "saved" ? "#4ade80" : "white",
                    cursor: saveStatus === "saving" ? "not-allowed" : "pointer",
                    fontSize: "15px",
                    fontWeight: saveStatus === "saved" ? 700 : 400,
                    opacity: saveStatus === "saving" ? 0.6 : 1,
                  }}
                  onClick={saveStory}
                  disabled={saveStatus === "saving"}
                >
                  {saveStatus === "saved" ? "✓ Story Saved" : saveStatus === "saving" ? "Saving…" : "💾 Save Story"}
                </button>

                <div ref={dropdownRef} style={{ position: "relative" }}>
                  <button
                    style={{
                      borderRadius: "14px",
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: showDropdown ? "rgba(216,178,110,0.12)" : "rgba(255,255,255,0.05)",
                      padding: "10px 20px",
                      color: showDropdown ? "#d8b26e" : "white",
                      cursor: "pointer",
                      fontSize: "15px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                    onClick={toggleDropdown}
                  >
                    📚 Saved Stories {showDropdown ? "▲" : "▼"}
                  </button>

                  {showDropdown && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        right: 0,
                        zIndex: 100,
                        minWidth: "300px",
                        maxWidth: "420px",
                        borderRadius: "16px",
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "#1a0f20",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                        overflow: "hidden",
                      }}
                    >
                      <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#d8b26e" }}>
                        Saved Stories
                      </div>

                      {loadingStories ? (
                        <div style={{ padding: "24px", textAlign: "center", fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>
                          Loading…
                        </div>
                      ) : savedStories.length === 0 ? (
                        <div style={{ padding: "24px", textAlign: "center", fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>
                          No saved stories yet.
                        </div>
                      ) : (
                        <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                          {savedStories.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => loadSavedStory(s)}
                              style={{
                                width: "100%",
                                textAlign: "left",
                                padding: "12px 16px",
                                background: "transparent",
                                border: "none",
                                borderBottom: "1px solid rgba(255,255,255,0.05)",
                                cursor: "pointer",
                                color: "white",
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(216,178,110,0.08)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                            >
                              <div style={{ fontSize: "14px", fontWeight: 600 }}>{s.name}</div>
                              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "3px" }}>
                                {new Date(s.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                {s.narrator_voice ? ` · Narrator: ${s.narrator_voice}` : ""}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {audioError && (
              <div
                style={{
                  marginBottom: "16px",
                  borderRadius: "12px",
                  background: "rgba(255,80,80,0.12)",
                  border: "1px solid rgba(255,80,80,0.3)",
                  padding: "12px 16px",
                  fontSize: "14px",
                  color: "#ff8080",
                }}
              >
                {audioError}
              </div>
            )}

            {preparingAudio && (
              <div style={{ marginBottom: "20px", borderRadius: "16px", border: "1px solid rgba(216,178,110,0.2)", background: "rgba(216,178,110,0.06)", padding: "14px 16px", fontSize: "13px", color: "#d8b26e", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</span>
                Preparing audio — this takes a moment…
              </div>
            )}

            {isPlaying && totalDuration > 0 && (
              <div
                style={{
                  marginBottom: "20px",
                  borderRadius: "16px",
                  border: "1px solid rgba(216,178,110,0.25)",
                  background: "rgba(216,178,110,0.06)",
                  padding: "14px 16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", minWidth: "34px", fontVariantNumeric: "tabular-nums" }}>
                    {formatTime(overallTime)}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={totalDuration}
                    step={0.1}
                    value={overallTime}
                    onChange={(e) => handleSeek(parseFloat(e.target.value))}
                    style={{
                      flex: 1,
                      height: "4px",
                      accentColor: "#d8b26e",
                      cursor: "pointer",
                      background: `linear-gradient(to right, #d8b26e ${(overallTime / totalDuration) * 100}%, rgba(255,255,255,0.15) ${(overallTime / totalDuration) * 100}%)`,
                      borderRadius: "4px",
                      outline: "none",
                      border: "none",
                    }}
                  />
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", minWidth: "34px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    {formatTime(totalDuration)}
                  </span>
                </div>
              </div>
            )}

            <div
              style={{
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(0,0,0,0.2)",
                padding: "20px",
              }}
            >
              <p
                style={{
                  whiteSpace: "pre-line",
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.85)",
                  margin: 0,
                  fontSize: "15px",
                }}
              >
                {story}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function TwoCol({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "1fr 1fr" }}>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "grid", gap: "8px", textAlign: "left" }}>
      <span style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{label}</span>
      {children}
    </label>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div
      style={{
        borderRadius: "18px",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.05)",
        padding: "16px",
      }}
    >
      <div style={{ fontSize: "14px", fontWeight: 700, color: "white" }}>{title}</div>
      <div style={{ marginTop: "6px", fontSize: "14px", lineHeight: 1.6, color: "rgba(255,255,255,0.6)" }}>{text}</div>
    </div>
  );
}

const backBtnStyle: React.CSSProperties = {
  position: "fixed",
  top: "20px",
  left: "24px",
  zIndex: 50,
  color: "rgba(255,255,255,0.75)",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 600,
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  padding: "8px 14px",
  borderRadius: "12px",
  backdropFilter: "blur(10px)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  padding: "14px 16px",
  outline: "none",
  fontSize: "16px",
  boxSizing: "border-box",
};

export default function CreateAudioTestPage() {
  return (
    <Suspense>
      <CreateAudioTestInner />
    </Suspense>
  );
}
