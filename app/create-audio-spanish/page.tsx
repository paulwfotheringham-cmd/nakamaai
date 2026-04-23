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

/** Decode Cartesia TTS data URI (audio/mpeg base64) to raw bytes for merging. */
function dataUriMp3ToUint8Array(dataUri: string): Uint8Array {
  const base64 = dataUri.slice(dataUri.indexOf(",") + 1);
  const binary = atob(base64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

// ─── Voice Browser Modal ──────────────────────────────────────────────────────

const PAGE_SIZE = 20;
const GENDER_TABS = ["female", "male"] as const;
type GenderTab = typeof GENDER_TABS[number] | "all";

const LANG_NAMES: Record<string, string> = {
  en: "English", fr: "French", de: "German", es: "Español", pt: "Portuguese",
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
  return LANG_NAMES[code?.toLowerCase()] ?? code?.toUpperCase() ?? "Desconocido";
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
  const [langFilter, setLangFilter] = useState("es");
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
          text: `Hola, me llamo ${voice.name}. Puedo ser tu voz para acompañarte en tu aventura.`,
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
              Elegir voz — <span style={{ color: "#d8b26e" }}>{slot}</span>
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginTop: "4px" }}>
              {loading ? "Cargando…" : `${filtered.length.toLocaleString()} voces disponibles`}
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
              placeholder="Buscar voces por nombre…"
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
                    {g === "female" ? "♀ Mujer" : "♂ Hombre"}
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
                Todos los acentos
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
              Cargando voces…
            </div>
          ) : pageVoices.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
              No se encontraron voces.
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
                    {previewingId === voice.id ? "⏳ Generando…" : "▶ Vista previa"}
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
                    Elegir
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
            ← Ant.
          </button>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
            Página {safePage} de {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, safePage + 1))}
            disabled={safePage >= totalPages}
            style={paginationBtnStyle(safePage >= totalPages)}
          >
            Sig. →
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
          {selected ? selected.title : "Ninguna voz seleccionada"}
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
            {isPreviewing ? "⏹ Detener" : "▶ Vista previa"}
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
          Explorar
        </button>
      </div>
    </div>
  );
}

// ─── Interactive Story Types ───────────────────────────────────────────────────
type InterPhase = "setup" | "generating" | "playing" | "choosing";
const randItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

// ─── Categories ──────────────────────────────────────────────────────────────

const CATEGORIES: Record<string, string[]> = {
  "Anime / Hentai":              ["Anime 1", "Anime 2", "Hentai 1", "Hentai 2"],
  "Paranormal y sobrenatural":   ["Hombre lobo", "Fantasma", "Demonio", "Ángel"],
  "Cuentos de hadas y monstruos":["Dragón", "Bruja", "Mago", "Enano"],
  "Ciencia ficción / alienígena":["Star Trek", "Battlestar Galactica", "Alienígena 1", "Alienígena 2"],
  "Dinámicas de poder":          ["Sumiso 1", "Sumiso 2", "Dominante 1", "Dominante 2"],
  "Moderno":                     ["Oficina", "Viajes", "Exterior", "Encuentro con un desconocido"],
  "Oscuro y erótico":            ["Obsesión", "Seducción", "Prohibido", "Tras el anochecer"],
  "Romance histórico":           ["Victoriano", "Medieval", "Pirata", "Hombre de las cavernas"],
};
const CATEGORY_KEYS = Object.keys(CATEGORIES);

// ─── Main Page ─────────────────────────────────────────────────────────────────

function CreateAudioSpanishInner() {
  const [category, setCategory]       = useState("Anime / Hentai");
  const [setting, setSetting]         = useState("oficina");
  const [mood, setMood]               = useState("romántico");
  const [buildUp, setBuildUp]         = useState("calor lento");
  const [maleRole, setMaleRole]       = useState("jefe");
  const [femaleRole, setFemaleRole]   = useState("asistente");
  const [storyType, setStoryType]     = useState("encuentro romántico");
  const [extraDetail, setExtraDetail] = useState("");

  function handleCategoryChange(cat: string) {
    setCategory(cat);
  }
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

  const [downloadMp3Loading, setDownloadMp3Loading] = useState(false);
  const [saveStatus, setSaveStatus]         = useState<"idle" | "saving" | "saved">("idle");
  const [savedStories, setSavedStories]     = useState<SavedStory[]>([]);
  const [showDropdown, setShowDropdown]           = useState(false);
  const [showResultDropdown, setShowResultDropdown]           = useState(false);
  const [showInterResultDropdown, setShowInterResultDropdown] = useState(false);
  const [loadingStories, setLoadingStories]                   = useState(false);
  const dropdownRef            = useRef<HTMLDivElement>(null);
  const resultDropdownRef      = useRef<HTMLDivElement>(null);
  const interResultDropdownRef = useRef<HTMLDivElement>(null);
  const innerGridRef           = useRef<HTMLDivElement>(null);
  const [innerGridHeight, setInnerGridHeight] = useState<number | null>(null);
  const searchParams = useSearchParams();

  // Measure the form+tiles column height and pin the result column to it
  useEffect(() => {
    const el = innerGridRef.current;
    if (!el) return;
    const apply = (h: number) => setInnerGridHeight(Math.round(h));
    const measure = () => apply(el.getBoundingClientRect().height);
    measure();
    requestAnimationFrame(measure);
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        apply(entry.contentRect.height);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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

  // ── Interactive story state ───────────────────────────────────────────────
  const [interPhase, setInterPhase]               = useState<InterPhase>("setup");
  const [interSegments, setInterSegments]         = useState<string[]>([]);
  const [interChoices, setInterChoices]           = useState<string[]>([]);
  const [interCustomChoice, setInterCustomChoice] = useState("");
  const [isListening, setIsListening]             = useState(false);
  const [interLoading, setInterLoading]           = useState(false);
  const [interPaused, setInterPaused]             = useState(false);
  const [interSaveStatus, setInterSaveStatus]     = useState<"idle" | "saving" | "saved">("idle");
  const [maleName, setMaleName]   = useState(() => randItem(["Carlos", "Diego", "Mateo", "Lucas", "Adrián"]));
  const [femaleName, setFemaleName] = useState(() => randItem(["Elena", "Sofia", "Clara", "Mia", "Isla"]));
  const interStoppedRef      = useRef(false);
  const interCurrentAudioRef = useRef<HTMLAudioElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

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
          text: `Hola, me llamo ${voice.title}. Puedo ser tu voz para acompañarte en tu aventura.`,
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
    if (!narratorVoice) {
      setAudioError("Selecciona una voz de narrador antes de generar la historia.");
      return;
    }
    setLoading(true);
    setStory("");
    setAudioError("");
    setSaveStatus("idle");
    handleInterStop();
    try {
      const response = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, setting, mood, buildUp, maleRole, femaleRole, storyType, extraDetail, language: "es" }),
      });
      const data = await response.json();
      setStory(data.story || "");
    } catch {
      alert("No se pudo generar la historia");
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
    const date = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short" });
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
        alert("No se pudo guardar la historia.");
      }
    } catch {
      setSaveStatus("idle");
      alert("No se pudo guardar la historia.");
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
    setShowDropdown(false);
    if (s.narrator_voice) setNarratorVoice({ id: s.narrator_voice, title: s.narrator_voice });
    if (s.male_voice)     setMaleVoice({ id: s.male_voice, title: s.male_voice });
    if (s.female_voice)   setFemaleVoice({ id: s.female_voice, title: s.female_voice });
    if (s.setting) setSetting(s.setting);
    if (s.mood)    setMood(s.mood);

    // Detect interactive story saved state
    if (s.story_text.trimStart().startsWith('{"__type":"interactive"')) {
      try {
        const data = JSON.parse(s.story_text);
        stopStory();
        setStory("");
        setSaveStatus("idle");
        if (data.category) setCategory(data.category);
        if (data.setting)  setSetting(data.setting);
        if (data.mood)     setMood(data.mood);
        if (data.maleRole) setMaleRole(data.maleRole);
        if (data.femaleRole) setFemaleRole(data.femaleRole);
        if (data.maleName)   setMaleName(data.maleName);
        if (data.femaleName) setFemaleName(data.femaleName);
        setInterSegments(data.segments ?? []);
        setInterChoices(data.choices ?? []);
        setInterSaveStatus("idle");
        setInterPhase("choosing");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      } catch { /* fall through to plain story load */ }
    }

    // Plain story
    setStory(s.story_text);
    setSaveStatus("idle");
    handleInterStop();
    stopStory();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (resultDropdownRef.current && !resultDropdownRef.current.contains(e.target as Node)) {
        setShowResultDropdown(false);
      }
      if (interResultDropdownRef.current && !interResultDropdownRef.current.contains(e.target as Node)) {
        setShowInterResultDropdown(false);
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
    if (!narratorVoice) { setAudioError("Primero selecciona una voz de narrador."); return; }

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
        setAudioError("Error al generar el audio."); setPreparingAudio(false); setIsPlaying(false); playActiveRef.current = false; return;
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

  async function downloadStoryMp3() {
    if (!story.trim()) return;
    if (!narratorVoice) {
      setAudioError("Selecciona una voz de narrador antes de descargar el audio.");
      return;
    }
    setDownloadMp3Loading(true);
    setAudioError("");
    try {
      const lineConfigs = parseLines();
      const buffers: Uint8Array[] = [];
      for (const { text, voiceId } of lineConfigs) {
        if (!voiceId) continue;
        const res = await fetch("/api/cartesia-tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, voiceId }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error((errData as { error?: string }).error ?? `Error al generar audio (${res.status})`);
        }
        const { outputUri } = (await res.json()) as { outputUri: string };
        buffers.push(dataUriMp3ToUint8Array(outputUri));
      }
      if (buffers.length === 0) {
        setAudioError("No hay líneas reproducibles en esta historia.");
        return;
      }
      const totalLen = buffers.reduce((a, b) => a + b.length, 0);
      const merged = new Uint8Array(totalLen);
      let offset = 0;
      for (const b of buffers) {
        merged.set(b, offset);
        offset += b.length;
      }
      const blob = new Blob([merged], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nakama-historia-${new Date().toISOString().slice(0, 10)}.mp3`;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      setAudioError(e instanceof Error ? e.message : "No se pudo crear la descarga MP3.");
    } finally {
      setDownloadMp3Loading(false);
    }
  }

  // ── Interactive story functions ───────────────────────────────────────────
  async function interSpeakText(text: string, onDone: () => void) {
    interStoppedRef.current = false;
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    for (const line of lines) {
      if (interStoppedRef.current) break;
      let spokenText = line;
      let voiceId = narratorVoice?.id ?? "";
      if (line.startsWith("MALE:"))          { spokenText = line.replace("MALE:", "").trim();      voiceId = maleVoice?.id ?? narratorVoice?.id ?? ""; }
      else if (line.startsWith("FEMALE:"))   { spokenText = line.replace("FEMALE:", "").trim();    voiceId = femaleVoice?.id ?? narratorVoice?.id ?? ""; }
      else if (line.startsWith("NARRATOR:")) { spokenText = line.replace("NARRATOR:", "").trim();  voiceId = narratorVoice?.id ?? ""; }
      if (!voiceId || !spokenText.trim()) continue;
      try {
        const res = await fetch("/api/cartesia-tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: spokenText, voiceId }),
        });
        if (!res.ok || interStoppedRef.current) continue;
        const { outputUri } = await res.json();
        await new Promise<void>((resolve) => {
          if (interStoppedRef.current) { resolve(); return; }
          const audio = new Audio(outputUri);
          interCurrentAudioRef.current = audio;
          audio.onended = () => resolve();
          audio.onerror = () => resolve();
          audio.play().catch(() => resolve());
        });
      } catch { /* continue */ }
    }
    if (!interStoppedRef.current) onDone();
  }

  async function handleInterStart() {
    if (!narratorVoice) { setAudioError("Primero selecciona una voz de narrador."); return; }
    setStory("");
    stopStory();
    setInterLoading(true);
    setInterPhase("generating");
    setInterSegments([]);
    setInterChoices([]);
    setInterSaveStatus("idle");
    setInterPaused(false);
    setAudioError("");
    try {
      const res = await fetch("/api/interactive-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase: "open", category, setting, mood, maleRole, femaleRole, maleName, femaleName, history: "", language: "es" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setInterSegments([data.story]);
      setInterChoices(data.choices);
      setInterLoading(false);
      setInterPhase("playing");
      interSpeakText(data.story, () => { if (!interStoppedRef.current) setInterPhase("choosing"); });
    } catch (e) {
      alert("Error: " + (e instanceof Error ? e.message : "desconocido"));
      setInterPhase("setup");
      setInterLoading(false);
    }
  }

  async function handleInterChoice(chosen: string) {
    setInterPhase("generating");
    setInterCustomChoice("");
    const history = interSegments.join("\n\n");
    try {
      const res = await fetch("/api/interactive-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase: "continue", category, setting, mood, maleRole, femaleRole, maleName, femaleName, history, choice: chosen, language: "es" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setInterSegments((prev) => [...prev, `[Choice: ${chosen}]\n\n${data.story}`]);
      setInterChoices(data.choices);
      setInterPhase("playing");
      interSpeakText(data.story, () => { if (!interStoppedRef.current) setInterPhase("choosing"); });
    } catch (e) {
      alert("Error: " + (e instanceof Error ? e.message : "desconocido"));
      setInterPhase("choosing");
    }
  }

  function handleInterStop() {
    interStoppedRef.current = true;
    interCurrentAudioRef.current?.pause();
    interCurrentAudioRef.current = null;
    setInterPhase("setup");
    setInterSegments([]);
    setInterChoices([]);
    setInterLoading(false);
    setInterPaused(false);
  }

  function startListening() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Entrada por voz no disponible. Prueba con Chrome."); return; }
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = "es-ES";
    recognition.interimResults = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => { setInterCustomChoice(e.results[0][0].transcript); setIsListening(false); };
    recognition.onend  = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  function handleInterPause() {
    interStoppedRef.current = true;
    interCurrentAudioRef.current?.pause();
    interCurrentAudioRef.current = null;
    setInterPaused(true);
    // Phase stays as "playing" — we just stop the audio
  }

  function handleInterResume() {
    setInterPaused(false);
    const currentSegment = interSegments[interSegments.length - 1];
    if (currentSegment) {
      interSpeakText(currentSegment, () => {
        if (!interStoppedRef.current) setInterPhase("choosing");
      });
    } else {
      setInterPhase("choosing");
    }
  }

  async function saveInterStory() {
    if (interSaveStatus === "saving") return;
    setInterSaveStatus("saving");
    const date = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short" });
    const name = `Interactivo · ${setting} · ${mood} · ${date}`;
    const storyText = JSON.stringify({
      __type: "interactive",
      segments: interSegments,
      choices: interChoices,
      category,
      setting,
      mood,
      maleRole,
      femaleRole,
      maleName,
      femaleName,
    });
    try {
      const res = await fetch("/api/saved-stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          storyText,
          narratorVoice: narratorVoice?.id ?? "",
          maleVoice: maleVoice?.id ?? "",
          femaleVoice: femaleVoice?.id ?? "",
          setting,
          mood,
        }),
      });
      if (res.ok) {
        setInterSaveStatus("saved");
        if (savedStories.length > 0) fetchSavedStories();
      } else {
        setInterSaveStatus("idle");
        alert("No se pudo guardar la historia.");
      }
    } catch {
      setInterSaveStatus("idle");
      alert("No se pudo guardar la historia.");
    }
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
    ? "Voz del narrador"
    : activeBrowserSlot === "male"
    ? "Voz personaje masculino"
    : "Voz personaje femenino";

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

      <a href="/dashboard" style={backBtnStyle}>← Panel</a>

      {/* Logo — top right */}
      <div style={{ position: "fixed", top: "14px", right: "24px", zIndex: 50 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/nakama-nights-logo.png" alt="Nakama AI" style={{ height: "40px", width: "auto", display: "block" }} />
      </div>

      <div
        style={{
          maxWidth: "1680px",
          margin: "0 auto",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "32px 24px",
        }}
      >
        {/* Three-column layout: [hero + form] | results */}
        <div style={{ display: "flex", gap: "28px", alignItems: "flex-start" }}>

          {/* Inner flex: hero | form — sized to each other only */}
          <div ref={innerGridRef} style={{ flex: "1.75", display: "grid", gap: "28px", gridTemplateColumns: "0.75fr 1fr", alignItems: "stretch" }}>

          {/* Left: hero text + tiles stacked */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Hero card */}
            <div
              style={{
                borderRadius: "20px",
                border: "1px solid rgba(216,178,110,0.2)",
                background: "rgba(255,255,255,0.04)",
                padding: "28px 24px",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  marginBottom: "16px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  display: "inline-flex",
                  width: "fit-content",
                  borderRadius: "999px",
                  border: "1px solid rgba(216,178,110,0.3)",
                  background: "rgba(216,178,110,0.1)",
                  padding: "6px 14px",
                  fontSize: "13px",
                  color: "#f1d7a1",
                }}
              >
                Narración de audio premium
              </div>

              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  margin: 0,
                  textAlign: "center",
                }}
              >
                Más de 500 voces para tu{" "}
                <span style={{ color: "#d8b26e" }}>historia</span>
              </h1>

              <p
                style={{
                  marginTop: "32px",
                  fontSize: "15px",
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.65)",
                  margin: "32px 0 0 0",
                  textAlign: "center",
                }}
              >
                Explora nuestra biblioteca de voces — filtra por género, acento, escucha cada voz en vivo
                y elige narrador, personaje masculino y femenino. Por defecto se muestran voces en español.
              </p>
            </div>

            {/* Tile: custom story */}
            <div
              style={{
                borderRadius: "20px",
                background: "linear-gradient(135deg, rgba(21,128,61,0.18) 0%, rgba(20,83,45,0.10) 100%)",
                border: "1px solid rgba(74,222,128,0.25)",
                padding: "40px 28px",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: "36px", fontWeight: 800, lineHeight: 1.15, color: "white", textAlign: "center" }}>
                Genera tu historia personalizada
              </div>
              <div style={{ marginTop: "32px", fontSize: "18px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, textAlign: "center" }}>
                Historia completa según tu escena, con las voces que elijas.
              </div>
            </div>

            {/* Tile: interactive */}
            <div
              style={{
                borderRadius: "20px",
                background: "linear-gradient(135deg, rgba(109,40,217,0.18) 0%, rgba(67,20,150,0.10) 100%)",
                border: "1px solid rgba(167,139,250,0.28)",
                padding: "40px 28px",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: "36px", fontWeight: 800, lineHeight: 1.15, color: "white", textAlign: "center" }}>
                Genera con modo interactivo
              </div>
              <div style={{ marginTop: "32px", fontSize: "18px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, textAlign: "center" }}>
                La historia se detiene tras cada escena — tú eliges qué pasa después.
              </div>
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
              <h2 style={{ margin: 0, fontSize: "32px", fontWeight: 700 }}>Personaliza tu aventura</h2>
              <p style={{ marginTop: "8px", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
                Ajusta los ingredientes de la historia, elige voces y genera.
              </p>
            </div>

            <div style={{ display: "grid", gap: "16px" }}>
              <Field label="Categoría">
                <select style={inputStyle} value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
                  {CATEGORY_KEYS.map((c) => (
                    <option key={c} style={{ color: "black" }}>{c}</option>
                  ))}
                </select>
              </Field>

              <TwoCol>
                <Field label="Escenario">
                  <select style={inputStyle} value={setting} onChange={(e) => setSetting(e.target.value)}>
                    {["oficina","café","playa","hotel","ático urbano"].map((o) => (
                      <option key={o} style={{ color: "black" }}>{o}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Ambiente">
                  <select style={inputStyle} value={mood} onChange={(e) => setMood(e.target.value)}>
                    {["romántico","juguetón","intenso","dramático","tierno"].map((o) => (
                      <option key={o} style={{ color: "black" }}>{o}</option>
                    ))}
                  </select>
                </Field>
              </TwoCol>

              <TwoCol>
                <Field label="Desarrollo">
                  <select style={inputStyle} value={buildUp} onChange={(e) => setBuildUp(e.target.value)}>
                    {["calor lento","ritmo medio","chispa instantánea"].map((o) => (
                      <option key={o} style={{ color: "black" }}>{o}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Tipo de historia">
                  <select style={inputStyle} value={storyType} onChange={(e) => setStoryType(e.target.value)}>
                    {["encuentro romántico","romance prohibido","reunión","de enemigos a amantes","confesión nocturna"].map((o) => (
                      <option key={o} style={{ color: "black" }}>{o}</option>
                    ))}
                  </select>
                </Field>
              </TwoCol>

              <TwoCol>
                <Field label="Personaje masculino">
                  <select style={inputStyle} value={maleRole} onChange={(e) => setMaleRole(e.target.value)}>
                    {["jefe","desconocido","chef","artista","multimillonario"].map((o) => (
                      <option key={o} style={{ color: "black" }}>{o}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Personaje femenino">
                  <select style={inputStyle} value={femaleRole} onChange={(e) => setFemaleRole(e.target.value)}>
                    {["asistente","viajera","escritora","cantante","emprendedora"].map((o) => (
                      <option key={o} style={{ color: "black" }}>{o}</option>
                    ))}
                  </select>
                </Field>
              </TwoCol>

              <Field label="Cuéntanos lo que realmente quieres">
                <input
                  style={inputStyle}
                  placeholder="Opcional…"
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
                  Elige tus voces
                </div>

                <div style={{ display: "grid", gap: "16px" }}>
                  <VoiceSlot
                    label="Voz narrador"
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
                    label="Voz personaje femenino"
                    selected={femaleVoice}
                    previewingId={previewingId}
                    onBrowse={() => setActiveBrowserSlot("female")}
                    onPreview={() => femaleVoice && previewSelectedVoice(femaleVoice)}
                  />
                </div>

              </div>

              <div style={{ marginTop: "8px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                {/* Button 1: Generate Story */}
                <button
                  style={{
                    borderRadius: "18px",
                    background: loading ? "rgba(21,128,61,0.5)" : "#15803d",
                    padding: "12px 10px",
                    fontWeight: 700,
                    color: "white",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  onClick={generateStory}
                  disabled={loading}
                >
                  {loading ? "Generando…" : "Generar historia"}
                </button>

                {/* Button 2: Generate Interactive */}
                <button
                  style={{
                    borderRadius: "18px",
                    background: interLoading ? "rgba(21,128,61,0.5)" : "#15803d",
                    padding: "12px 10px",
                    fontWeight: 700,
                    color: "white",
                    border: "none",
                    cursor: interLoading ? "not-allowed" : "pointer",
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    opacity: interLoading ? 0.7 : 1,
                  }}
                  onClick={handleInterStart}
                  disabled={interLoading}
                >
                  {interLoading ? "Escribiendo…" : "Generar interactivo"}
                </button>

                <div ref={dropdownRef} style={{ position: "relative" }}>
                  <button
                    style={{
                      height: "100%",
                      borderRadius: "18px",
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: showDropdown ? "rgba(216,178,110,0.12)" : "rgba(255,255,255,0.06)",
                      padding: "12px 16px",
                      color: showDropdown ? "#d8b26e" : "rgba(255,255,255,0.8)",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      whiteSpace: "nowrap",
                    }}
                    onClick={toggleDropdown}
                  >
                    📚 Tus historias {showDropdown ? "▲" : "▼"}
                  </button>

                  {showDropdown && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "calc(100% + 8px)",
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
                        Historias guardadas
                      </div>

                      {loadingStories ? (
                        <div style={{ padding: "24px", textAlign: "center", fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>
                          Cargando…
                        </div>
                      ) : savedStories.length === 0 ? (
                        <div style={{ padding: "24px", textAlign: "center", fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>
                          Aún no hay historias guardadas.
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
                              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "3px", display: "flex", gap: "8px", alignItems: "center" }}>
                                {new Date(s.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                                {s.story_text.trimStart().startsWith('{"__type":"interactive"') && (
                                  <span style={{ color: "#22d3ee", fontWeight: 700 }}>🎭 Continuar</span>
                                )}
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
          </div>

          </div>{/* end inner grid */}

          {/* Column 3: Results — pinned to inner grid height (never taller than form column) */}
          <div style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            minHeight: 0,
            height: innerGridHeight ? `${innerGridHeight}px` : "auto",
            maxHeight: innerGridHeight ? `${innerGridHeight}px` : "none",
            overflow: "hidden",
          }}>

        {/* Interactive Story result area */}
        {interPhase !== "setup" && (
          <div
            style={{
              borderRadius: "28px",
              border: "1px solid rgba(14,116,144,0.35)",
              background: "rgba(8,60,75,0.25)",
              padding: "28px",
              boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
              backdropFilter: "blur(12px)",
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexShrink: 0 }}>
              <div>
                <h2 style={{ margin: "0 0 8px", fontSize: "26px", fontWeight: 700, lineHeight: 1.3 }}>
                  Tu experiencia de fantasía.{" "}
                  <span style={{ color: "#22d3ee" }}>Guía tu viaje</span>
                </h2>
                <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
                  {setting} · {mood} · {category}
                </p>
              </div>
            </div>

            {/* Phases: fill remaining height; scroll inside */}
            <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Generating */}
            {interPhase === "generating" && (
              <div style={{ textAlign: "center", padding: "48px 32px", flex: 1, overflowY: "auto" }}>
                <div style={{ fontSize: "52px", marginBottom: "20px" }}>✍️</div>
                <div style={{ fontSize: "22px", fontWeight: 600, color: "#22d3ee" }}>Escribiendo tu historia…</div>
                <div style={{ marginTop: "10px", fontSize: "14px", color: "rgba(255,255,255,0.45)" }}>Creando la escena y tus opciones</div>
                <button
                  onClick={handleInterStop}
                  style={{ marginTop: "24px", padding: "10px 22px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}
                >
                  ✕ Cancelar
                </button>
              </div>
            )}

            {/* Playing */}
            {interPhase === "playing" && (
              <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {/* Status bar */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", flexShrink: 0 }}>
                  {interPaused ? (
                    <>
                      <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#d8b26e" }} />
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#d8b26e" }}>Pausado</span>
                    </>
                  ) : (
                    <>
                      <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 12px rgba(74,222,128,0.6)" }} />
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#4ade80" }}>Reproduciendo — escucha la escena</span>
                    </>
                  )}
                  <div style={{ marginLeft: "auto", display: "flex", gap: "8px", alignItems: "center" }}>
                    {interPaused ? (
                      <button
                        onClick={handleInterResume}
                        style={{ padding: "9px 18px", borderRadius: "12px", border: "1px solid rgba(74,222,128,0.4)", background: "rgba(74,222,128,0.1)", color: "#4ade80", cursor: "pointer", fontSize: "14px", fontWeight: 600, whiteSpace: "nowrap" }}
                      >
                        ▶ Reanudar
                      </button>
                    ) : (
                      <button
                        onClick={handleInterPause}
                        style={{ padding: "9px 18px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.07)", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: 600, whiteSpace: "nowrap" }}
                      >
                        ⏸ Pausa
                      </button>
                    )}
                    <button
                      onClick={saveInterStory}
                      disabled={interSaveStatus === "saving"}
                      style={{
                        padding: "9px 18px",
                        borderRadius: "12px",
                        border: interSaveStatus === "saved" ? "1px solid rgba(74,222,128,0.4)" : "1px solid rgba(216,178,110,0.35)",
                        background: interSaveStatus === "saved" ? "rgba(74,222,128,0.1)" : "rgba(216,178,110,0.1)",
                        color: interSaveStatus === "saved" ? "#4ade80" : "#d8b26e",
                        cursor: interSaveStatus === "saving" ? "not-allowed" : "pointer",
                        fontSize: "14px",
                        fontWeight: 600,
                        opacity: interSaveStatus === "saving" ? 0.6 : 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {interSaveStatus === "saved" ? "✓ Guardado" : interSaveStatus === "saving" ? "Guardando…" : "💾 Guardar"}
                    </button>
                    <div ref={interResultDropdownRef} style={{ position: "relative" }}>
                      <button
                        style={{ padding: "9px 18px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.18)", background: showInterResultDropdown ? "rgba(216,178,110,0.12)" : "rgba(255,255,255,0.07)", color: showInterResultDropdown ? "#d8b26e" : "white", cursor: "pointer", fontSize: "14px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}
                        onClick={async () => {
                          if (!showInterResultDropdown && savedStories.length === 0) await fetchSavedStories();
                          setShowInterResultDropdown(v => !v);
                        }}
                      >
                        📚 Explorar {showInterResultDropdown ? "▲" : "▼"}
                      </button>
                      {showInterResultDropdown && (
                        <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 100, minWidth: "260px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.12)", background: "#1a0f20", boxShadow: "0 20px 60px rgba(0,0,0,0.6)", overflow: "hidden" }}>
                          <div style={{ padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#d8b26e" }}>Historias guardadas</div>
                          {loadingStories ? (
                            <div style={{ padding: "16px", textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Cargando…</div>
                          ) : savedStories.length === 0 ? (
                            <div style={{ padding: "16px", textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Aún no hay historias guardadas.</div>
                          ) : (
                            <div style={{ maxHeight: "240px", overflowY: "auto" }}>
                              {savedStories.map((s) => (
                                <button key={s.id} onClick={() => { loadSavedStory(s); setShowInterResultDropdown(false); }} style={{ width: "100%", textAlign: "left", padding: "9px 14px", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer", color: "white" }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(216,178,110,0.08)"; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                                >
                                  <div style={{ fontSize: "13px", fontWeight: 600 }}>{s.name}</div>
                                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px", display: "flex", gap: "8px" }}>
                                    {new Date(s.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                                    {s.story_text.trimStart().startsWith('{"__type":"interactive"') && <span style={{ color: "#22d3ee", fontWeight: 700 }}>🎭 Continuar</span>}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleInterStop}
                      style={{ padding: "9px 18px", borderRadius: "12px", border: "1px solid rgba(255,80,80,0.3)", background: "rgba(255,80,80,0.08)", color: "#ff8080", cursor: "pointer", fontSize: "14px", fontWeight: 600, whiteSpace: "nowrap" }}
                    >
                      ✕ Fin
                    </button>
                  </div>
                </div>

                {/* Current segment text — fills space below toolbar, scrolls */}
                <div style={{ flex: 1, minHeight: 0, overflowY: "auto", borderRadius: "16px", background: "rgba(0,0,0,0.3)", padding: "20px", lineHeight: 1.9, fontSize: "15px" }}>
                  {interSegments[interSegments.length - 1]?.split("\n").map((line, i) => (
                    <p key={i} style={{ margin: "4px 0", color: line.startsWith("MALE:") ? "#93c5fd" : line.startsWith("FEMALE:") ? "#f9a8d4" : "rgba(255,255,255,0.85)" }}>
                      {line}
                    </p>
                  ))}
                </div>

                {/* Paused: show option to advance to choices */}
                {interPaused && interChoices.length > 0 && (
                  <div style={{ marginTop: "12px", textAlign: "center", flexShrink: 0 }}>
                    <button
                      onClick={() => { setInterPaused(false); setInterPhase("choosing"); }}
                      style={{ padding: "10px 24px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}
                    >
                      Ir a las opciones →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Choosing */}
            {interPhase === "choosing" && (
              <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div style={{ flex: 1, minHeight: 0, overflowY: "auto", paddingRight: "4px" }}>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <div style={{ fontSize: "36px", marginBottom: "10px" }}>🎭</div>
                  <h3 style={{ margin: "0 0 6px", fontSize: "24px", fontWeight: 800 }}>¿Qué pasa después?</h3>
                  <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>Elige una opción, di tu elección o escribe la tuya</p>
                </div>

                <div style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
                  {interChoices.map((choice, i) => (
                    <button
                      key={i}
                      onClick={() => handleInterChoice(choice)}
                      style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", borderRadius: "16px", border: "1px solid rgba(34,211,238,0.2)", background: "rgba(34,211,238,0.06)", color: "white", fontSize: "16px", fontWeight: 600, cursor: "pointer", textAlign: "left", width: "100%" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(34,211,238,0.15)"; e.currentTarget.style.borderColor = "rgba(34,211,238,0.45)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(34,211,238,0.06)"; e.currentTarget.style.borderColor = "rgba(34,211,238,0.2)"; }}
                    >
                      <span style={{ fontSize: "20px" }}>{(["💋", "🔥", "✨"] as const)[i]}</span>
                      <span>{choice}</span>
                    </button>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "20px" }}>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    O escribe / di tu propia elección
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "stretch" }}>
                    <input
                      value={interCustomChoice}
                      onChange={(e) => setInterCustomChoice(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && interCustomChoice.trim() && handleInterChoice(interCustomChoice.trim())}
                      placeholder="p. ej. llévame al balcón…"
                      style={{
                        flex: 1,
                        minWidth: 0,
                        height: 48,
                        boxSizing: "border-box",
                        borderRadius: "14px",
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(255,255,255,0.06)",
                        color: "white",
                        padding: "0 18px",
                        outline: "none",
                        fontSize: "15px",
                      }}
                    />
                    <button
                      type="button"
                      onClick={isListening ? stopListening : startListening}
                      style={{
                        width: 48,
                        minWidth: 48,
                        height: 48,
                        boxSizing: "border-box",
                        padding: 0,
                        borderRadius: "14px",
                        border: `1px solid ${isListening ? "rgba(239,68,68,0.45)" : "rgba(255,255,255,0.15)"}`,
                        background: isListening ? "rgba(239,68,68,0.18)" : "rgba(255,255,255,0.08)",
                        color: isListening ? "#f87171" : "rgba(255,255,255,0.95)",
                        cursor: "pointer",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title={isListening ? "Dejar de escuchar" : "Di tu elección"}
                      aria-label={isListening ? "Dejar de escuchar" : "Di tu elección con el micrófono"}
                    >
                      {isListening ? (
                        <span style={{ fontSize: "18px", lineHeight: 1 }}>⏹</span>
                      ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                          <line x1="12" y1="19" x2="12" y2="23" />
                          <line x1="8" y1="23" x2="16" y2="23" />
                        </svg>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => interCustomChoice.trim() && handleInterChoice(interCustomChoice.trim())}
                      disabled={!interCustomChoice.trim()}
                      style={{
                        height: 48,
                        boxSizing: "border-box",
                        padding: "0 22px",
                        borderRadius: "14px",
                        border: "none",
                        background: interCustomChoice.trim() ? "#22d3ee" : "rgba(255,255,255,0.06)",
                        color: interCustomChoice.trim() ? "black" : "rgba(255,255,255,0.35)",
                        cursor: interCustomChoice.trim() ? "pointer" : "not-allowed",
                        fontWeight: 700,
                        fontSize: "15px",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      Ir →
                    </button>
                  </div>
                  {isListening && (
                    <div style={{ marginTop: "10px", fontSize: "13px", color: "#f87171", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f87171", display: "inline-block" }} />
                      Escuchando… di tu elección
                    </div>
                  )}
                </div>
                </div>

                {/* Save & End row */}
                <div style={{ marginTop: "12px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: "10px", justifyContent: "flex-end", alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
                  <button
                    onClick={saveInterStory}
                    disabled={interSaveStatus === "saving"}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "14px",
                      border: interSaveStatus === "saved" ? "1px solid rgba(74,222,128,0.4)" : "1px solid rgba(34,211,238,0.3)",
                      background: interSaveStatus === "saved" ? "rgba(74,222,128,0.1)" : "rgba(34,211,238,0.08)",
                      color: interSaveStatus === "saved" ? "#4ade80" : "#22d3ee",
                      cursor: interSaveStatus === "saving" ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      fontWeight: 600,
                      opacity: interSaveStatus === "saving" ? 0.6 : 1,
                    }}
                  >
                    {interSaveStatus === "saved" ? "✓ Guardado — continuar después" : interSaveStatus === "saving" ? "Guardando…" : "💾 Guardar y continuar después"}
                  </button>
                  <div ref={interResultDropdownRef} style={{ position: "relative" }}>
                    <button
                      style={{ padding: "10px 16px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.15)", background: showInterResultDropdown ? "rgba(216,178,110,0.12)" : "rgba(255,255,255,0.05)", color: showInterResultDropdown ? "#d8b26e" : "rgba(255,255,255,0.8)", cursor: "pointer", fontSize: "14px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}
                      onClick={async () => {
                        if (!showInterResultDropdown && savedStories.length === 0) await fetchSavedStories();
                        setShowInterResultDropdown(v => !v);
                      }}
                    >
                      📚 Tus historias {showInterResultDropdown ? "▲" : "▼"}
                    </button>
                    {showInterResultDropdown && (
                      <div style={{ position: "absolute", bottom: "calc(100% + 8px)", right: 0, zIndex: 100, minWidth: "280px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.12)", background: "#1a0f20", boxShadow: "0 20px 60px rgba(0,0,0,0.6)", overflow: "hidden" }}>
                        <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#d8b26e" }}>Historias guardadas</div>
                        {loadingStories ? (
                          <div style={{ padding: "20px", textAlign: "center", fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>Cargando…</div>
                        ) : savedStories.length === 0 ? (
                          <div style={{ padding: "20px", textAlign: "center", fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>No saved stories yet.</div>
                        ) : (
                          <div style={{ maxHeight: "260px", overflowY: "auto" }}>
                            {savedStories.map((s) => (
                              <button key={s.id} onClick={() => { loadSavedStory(s); setShowInterResultDropdown(false); }} style={{ width: "100%", textAlign: "left", padding: "10px 16px", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer", color: "white" }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(216,178,110,0.08)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                              >
                                <div style={{ fontSize: "13px", fontWeight: 600 }}>{s.name}</div>
                                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px", display: "flex", gap: "8px" }}>
                                  {new Date(s.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                                  {s.story_text.trimStart().startsWith('{"__type":"interactive"') && <span style={{ color: "#22d3ee", fontWeight: 700 }}>🎭 Continuar</span>}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleInterStop}
                    style={{ padding: "10px 20px", borderRadius: "14px", border: "1px solid rgba(255,80,80,0.3)", background: "rgba(255,80,80,0.08)", color: "#ff8080", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}
                  >
                    ✕ Terminar historia
                  </button>
                </div>
              </div>
            )}
            </div>{/* end phases scroll area */}
          </div>
        )}

        {/* Story + player */}
        {story && (
          <div
            style={{
              borderRadius: "28px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.06)",
              padding: "24px",
              boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
              backdropFilter: "blur(12px)",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <h2 style={{ margin: 0, fontSize: "28px", fontWeight: 700 }}>Tu historia</h2>
              <p style={{ marginTop: "4px", marginBottom: "14px", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
                Generada con tu configuración y voces elegidas.
              </p>
              {/* Action buttons */}
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <button
                  style={{
                    borderRadius: "12px",
                    background: (isPlaying || preparingAudio) ? "rgba(255,255,255,0.1)" : "#d8b26e",
                    padding: "9px 16px",
                    fontWeight: 700,
                    color: (isPlaying || preparingAudio) ? "rgba(255,255,255,0.4)" : "black",
                    border: "none",
                    cursor: (isPlaying || preparingAudio) ? "not-allowed" : "pointer",
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                  }}
                  onClick={speakStory}
                  disabled={isPlaying || preparingAudio}
                >
                  🔊 Escuchar
                </button>

                <button
                  style={{
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.05)",
                    padding: "9px 16px",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                  }}
                  onClick={stopStory}
                >
                  ⏸ Pause
                </button>

                <button
                  style={{
                    borderRadius: "12px",
                    border: saveStatus === "saved"
                      ? "1px solid rgba(74,222,128,0.4)"
                      : "1px solid rgba(255,255,255,0.15)",
                    background: saveStatus === "saved"
                      ? "rgba(74,222,128,0.12)"
                      : "rgba(255,255,255,0.05)",
                    padding: "9px 16px",
                    color: saveStatus === "saved" ? "#4ade80" : "white",
                    cursor: saveStatus === "saving" ? "not-allowed" : "pointer",
                    fontSize: "13px",
                    fontWeight: saveStatus === "saved" ? 700 : 400,
                    opacity: saveStatus === "saving" ? 0.6 : 1,
                    whiteSpace: "nowrap",
                  }}
                  onClick={saveStory}
                  disabled={saveStatus === "saving"}
                >
                  {saveStatus === "saved" ? "✓ Guardada" : saveStatus === "saving" ? "Guardando…" : "💾 Guardar historia"}
                </button>

                <button
                  type="button"
                  onClick={downloadStoryMp3}
                  disabled={downloadMp3Loading || preparingAudio}
                  style={{
                    borderRadius: "12px",
                    border: "1px solid rgba(96,165,250,0.35)",
                    background: downloadMp3Loading ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.12)",
                    padding: "9px 14px",
                    color: "#93c5fd",
                    cursor: downloadMp3Loading || preparingAudio ? "not-allowed" : "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    opacity: downloadMp3Loading || preparingAudio ? 0.65 : 1,
                  }}
                >
                  {downloadMp3Loading ? "⏳ Creando…" : "⬇ Descargar .mp3"}
                </button>

                {/* Browse Stories dropdown */}
                <div ref={resultDropdownRef} style={{ position: "relative" }}>
                  <button
                    style={{
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: showResultDropdown ? "rgba(216,178,110,0.12)" : "rgba(255,255,255,0.05)",
                      padding: "9px 14px",
                      color: showResultDropdown ? "#d8b26e" : "rgba(255,255,255,0.8)",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      whiteSpace: "nowrap",
                    }}
                    onClick={async () => {
                      if (!showResultDropdown && savedStories.length === 0) await fetchSavedStories();
                      setShowResultDropdown(v => !v);
                    }}
                  >
                    📚 Tus historias {showResultDropdown ? "▲" : "▼"}
                  </button>
                  {showResultDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 100, minWidth: "280px", maxWidth: "400px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.12)", background: "#1a0f20", boxShadow: "0 20px 60px rgba(0,0,0,0.6)", overflow: "hidden" }}>
                      <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#d8b26e" }}>Historias guardadas</div>
                      {loadingStories ? (
                        <div style={{ padding: "20px", textAlign: "center", fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>Loading…</div>
                      ) : savedStories.length === 0 ? (
                        <div style={{ padding: "20px", textAlign: "center", fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>No saved stories yet.</div>
                      ) : (
                        <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                          {savedStories.map((s) => (
                            <button key={s.id} onClick={() => { loadSavedStory(s); setShowResultDropdown(false); }} style={{ width: "100%", textAlign: "left", padding: "10px 16px", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer", color: "white" }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(216,178,110,0.08)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                            >
                              <div style={{ fontSize: "13px", fontWeight: 600 }}>{s.name}</div>
                              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px", display: "flex", gap: "8px" }}>
                                {new Date(s.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                                {s.story_text.trimStart().startsWith('{"__type":"interactive"') && <span style={{ color: "#22d3ee", fontWeight: 700 }}>🎭 Continuar</span>}
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
                Preparando audio — un momento…
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
                flex: 1,
                overflowY: "auto",
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

        {/* Empty state — nothing generated yet */}
        {interPhase === "setup" && !story && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, borderRadius: "28px", border: audioError ? "1px solid rgba(255,80,80,0.3)" : "1px solid rgba(255,255,255,0.06)", background: audioError ? "rgba(255,80,80,0.05)" : "rgba(255,255,255,0.02)", padding: "40px 24px", textAlign: "center" }}>
            {audioError ? (
              <>
                <div style={{ fontSize: "40px", marginBottom: "14px" }}>⚠️</div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#ff8080", marginBottom: "8px" }}>{audioError}</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                  Usa la sección <strong>Elige tus voces</strong> del formulario para explorar y seleccionar voces.
                </div>
                <button onClick={() => setAudioError("")} style={{ marginTop: "16px", padding: "8px 18px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "13px" }}>Cerrar</button>
              </>
            ) : (
              <>
                <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.4 }}>✨</div>
                <div style={{ fontSize: "16px", fontWeight: 600, color: "rgba(255,255,255,0.35)" }}>Tu historia aparecerá aquí</div>
                <div style={{ marginTop: "8px", fontSize: "13px", color: "rgba(255,255,255,0.2)", lineHeight: 1.6 }}>
                  Ajusta tus opciones, elige voces<br />y pulsa Generar historia o Generar interactivo.
                </div>
              </>
            )}
          </div>
        )}

          </div>{/* end column 3 */}
        </div>{/* end 3-column layout */}
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

export default function CreateAudioSpanishPage() {
  return (
    <Suspense>
      <CreateAudioSpanishInner />
    </Suspense>
  );
}
