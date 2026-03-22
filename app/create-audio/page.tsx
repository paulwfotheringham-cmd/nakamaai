"use client";

import { useRef, useState } from "react";

const VOICES = [
  { id: "Scarlett", label: "Scarlett", desc: "Young Female · bright & warm",    gender: "female" },
  { id: "Liv",      label: "Liv",      desc: "Young Female · light & breezy",   gender: "female" },
  { id: "Amy",      label: "Amy",      desc: "Mature Female · measured & rich",  gender: "female" },
  { id: "Dan",      label: "Dan",      desc: "Young Male · natural & smooth",   gender: "male" },
  { id: "Will",     label: "Will",     desc: "Mature Male · deep & deliberate", gender: "male" },
];

const MALE_VOICES   = VOICES.filter((v) => v.gender === "male");
const FEMALE_VOICES = VOICES.filter((v) => v.gender === "female");

export default function CreateAudioPage() {
  const [setting, setSetting]       = useState("office");
  const [mood, setMood]             = useState("romantic");
  const [buildUp, setBuildUp]       = useState("slow burn");
  const [maleRole, setMaleRole]     = useState("boss");
  const [femaleRole, setFemaleRole] = useState("assistant");
  const [storyType, setStoryType]   = useState("romantic encounter");
  const [extraDetail, setExtraDetail] = useState("");
  const [story, setStory]           = useState("");
  const [loading, setLoading]       = useState(false);

  const [narratorVoice, setNarratorVoice] = useState("Amy");
  const [maleVoice, setMaleVoice]         = useState("Will");
  const [femaleVoice, setFemaleVoice]     = useState("Scarlett");

  const [isPlaying, setIsPlaying]       = useState(false);
  const [playingLine, setPlayingLine]   = useState(0);
  const [totalLines, setTotalLines]     = useState(0);
  const [audioError, setAudioError]     = useState("");
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration]       = useState(0);
  const [currentLineText, setCurrentLineText]   = useState("");

  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);

  const stoppedRef      = useRef(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const PREVIEW_LINES: Record<string, string> = {
    Scarlett: "Hi, my name is Scarlett. I can be your voice to take you on your fantasy journey.",
    Liv:      "Hi, my name is Liv. I can be your voice to take you on your fantasy journey.",
    Amy:      "Hi, my name is Amy. I can be your voice to take you on your fantasy journey.",
    Dan:      "Hi, my name is Dan. I can be your voice to take you on your fantasy journey.",
    Will:     "Hi, my name is Will. I can be your voice to take you on your fantasy journey.",
  };

  async function previewVoice(voiceId: string) {
    if (previewingVoice === voiceId) {
      previewAudioRef.current?.pause();
      previewAudioRef.current = null;
      setPreviewingVoice(null);
      return;
    }
    previewAudioRef.current?.pause();
    setPreviewingVoice(voiceId);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: PREVIEW_LINES[voiceId], voiceId }),
      });
      if (!res.ok) { setPreviewingVoice(null); return; }
      const { outputUri } = await res.json();
      const audio = new Audio(outputUri);
      previewAudioRef.current = audio;
      audio.onended = () => setPreviewingVoice(null);
      audio.onerror = () => setPreviewingVoice(null);
      audio.play().catch(() => setPreviewingVoice(null));
    } catch {
      setPreviewingVoice(null);
    }
  }

  async function generateStory() {
    setLoading(true);
    setStory("");
    setAudioError("");
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

  async function speakStory() {
    if (!story.trim() || isPlaying) return;

    stoppedRef.current = false;
    setAudioError("");
    setIsPlaying(true);

    const lines = story
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    setTotalLines(lines.length);

    for (let i = 0; i < lines.length; i++) {
      if (stoppedRef.current) break;

      const line = lines[i];
      let text    = line;
      let voiceId = narratorVoice;

      if (line.startsWith("MALE:")) {
        text    = line.replace("MALE:", "").trim();
        voiceId = maleVoice;
      } else if (line.startsWith("FEMALE:")) {
        text    = line.replace("FEMALE:", "").trim();
        voiceId = femaleVoice;
      } else if (line.startsWith("NARRATOR:")) {
        text    = line.replace("NARRATOR:", "").trim();
        voiceId = narratorVoice;
      }

      setPlayingLine(i + 1);
      setCurrentLineText(text);
      setAudioCurrentTime(0);
      setAudioDuration(0);

      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, voiceId }),
        });

        if (!res.ok) {
          const err = await res.json();
          setAudioError(`Audio error: ${err.error}`);
          break;
        }

        const { outputUri } = await res.json();

        await new Promise<void>((resolve) => {
          if (stoppedRef.current) { resolve(); return; }
          const audio = new Audio(outputUri);
          currentAudioRef.current = audio;
          audio.onloadedmetadata = () => setAudioDuration(audio.duration);
          audio.ontimeupdate     = () => setAudioCurrentTime(audio.currentTime);
          audio.onended  = () => resolve();
          audio.onerror  = () => resolve();
          audio.play().catch(() => resolve());
        });
      } catch {
        setAudioError("Failed to generate audio for a line.");
        break;
      }
    }

    setIsPlaying(false);
    setPlayingLine(0);
    setTotalLines(0);
    setAudioCurrentTime(0);
    setAudioDuration(0);
    setCurrentLineText("");
  }

  function stopStory() {
    stoppedRef.current = true;
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    setIsPlaying(false);
    setPlayingLine(0);
    setTotalLines(0);
    setAudioCurrentTime(0);
    setAudioDuration(0);
    setCurrentLineText("");
  }

  function handleSeek(value: number) {
    if (currentAudioRef.current && audioDuration > 0) {
      currentAudioRef.current.currentTime = value;
      setAudioCurrentTime(value);
    }
  }

  function formatTime(s: number) {
    if (!isFinite(s) || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #3a1d2e 0%, #160f18 35%, #09080b 100%)",
        color: "white",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
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
            <div style={{ marginTop: "8px", fontSize: "32px", fontWeight: 700 }}>Nakama AI</div>
          </div>
          <div
            style={{
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              padding: "10px 16px",
              fontSize: "14px",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Guided romance story builder
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
              Create custom romantic audio stories with{" "}
              <span style={{ color: "#d8b26e" }}>Nakama</span>
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
              Shape the setting, mood, pacing, characters, and voice casting.
              Generate a private story scene and listen to it like a mini audio drama.
            </p>

            <div style={{ marginTop: "32px", display: "grid", gap: "12px", gridTemplateColumns: "1fr 1fr" }}>
              <FeatureCard title="Guided story design"  text="Choose the tone, setting, and romantic arc before generating." />
              <FeatureCard title="Voice casting"        text="Assign one of 5 natural AI voices to narrator, male, and female characters." />
              <FeatureCard title="Audio playback"       text="Listen to every line in sequence with your selected cast." />
              <FeatureCard title="Fast iteration"       text="Change one detail and instantly create a new version." />
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
                Adjust the story ingredients, then generate and listen.
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

              {/* Voice Casting */}
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
                  Voice Casting · AI Voices
                </div>

                <div style={{ display: "grid", gap: "16px" }}>
                  <VoicePicker
                    label="Narrator Voice"
                    voices={VOICES}
                    selected={narratorVoice}
                    onSelect={setNarratorVoice}
                    previewingVoice={previewingVoice}
                    onPreview={previewVoice}
                  />
                  <VoicePicker
                    label="Male Character Voice"
                    voices={MALE_VOICES}
                    selected={maleVoice}
                    onSelect={setMaleVoice}
                    previewingVoice={previewingVoice}
                    onPreview={previewVoice}
                  />
                  <VoicePicker
                    label="Female Character Voice"
                    voices={FEMALE_VOICES}
                    selected={femaleVoice}
                    onSelect={setFemaleVoice}
                    previewingVoice={previewingVoice}
                    onPreview={previewVoice}
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

              <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                {isPlaying && (
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#d8b26e",
                      borderRadius: "999px",
                      border: "1px solid rgba(216,178,110,0.3)",
                      background: "rgba(216,178,110,0.1)",
                      padding: "6px 14px",
                    }}
                  >
                    ▶ Line {playingLine} of {totalLines}
                  </span>
                )}

                <button
                  style={{
                    borderRadius: "14px",
                    background: isPlaying ? "rgba(255,255,255,0.1)" : "#d8b26e",
                    padding: "10px 20px",
                    fontWeight: 700,
                    color: isPlaying ? "rgba(255,255,255,0.4)" : "black",
                    border: "none",
                    cursor: isPlaying ? "not-allowed" : "pointer",
                    fontSize: "15px",
                  }}
                  onClick={speakStory}
                  disabled={isPlaying}
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

            {/* Audio player bar */}
            {isPlaying && (
              <div
                style={{
                  marginBottom: "20px",
                  borderRadius: "16px",
                  border: "1px solid rgba(216,178,110,0.25)",
                  background: "rgba(216,178,110,0.06)",
                  padding: "14px 16px",
                }}
              >
                {/* Line counter + current line text */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", gap: "12px" }}>
                  <div style={{ fontSize: "12px", color: "#d8b26e", fontWeight: 600, whiteSpace: "nowrap" }}>
                    Line {playingLine} of {totalLines}
                  </div>
                  {currentLineText && (
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, textAlign: "right" }}>
                      {currentLineText.length > 60 ? currentLineText.slice(0, 60) + "…" : currentLineText}
                    </div>
                  )}
                </div>

                {/* Seek slider */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", minWidth: "32px" }}>
                    {formatTime(audioCurrentTime)}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={audioDuration || 1}
                    step={0.1}
                    value={audioCurrentTime}
                    onChange={(e) => handleSeek(parseFloat(e.target.value))}
                    style={{
                      flex: 1,
                      height: "4px",
                      accentColor: "#d8b26e",
                      cursor: "pointer",
                      background: audioDuration > 0
                        ? `linear-gradient(to right, #d8b26e ${(audioCurrentTime / audioDuration) * 100}%, rgba(255,255,255,0.15) ${(audioCurrentTime / audioDuration) * 100}%)`
                        : "rgba(255,255,255,0.15)",
                      borderRadius: "4px",
                      outline: "none",
                      border: "none",
                    }}
                  />
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", minWidth: "32px", textAlign: "right" }}>
                    {formatTime(audioDuration)}
                  </span>
                </div>

                {/* Overall story progress */}
                {totalLines > 0 && (
                  <div style={{ marginTop: "10px" }}>
                    <div style={{ height: "2px", borderRadius: "2px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${(playingLine / totalLines) * 100}%`,
                          background: "rgba(216,178,110,0.4)",
                          borderRadius: "2px",
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                    <div style={{ marginTop: "4px", fontSize: "11px", color: "rgba(255,255,255,0.3)", textAlign: "right" }}>
                      Story {Math.round((playingLine / totalLines) * 100)}% complete
                    </div>
                  </div>
                )}
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

function VoicePicker({
  label,
  voices,
  selected,
  onSelect,
  previewingVoice,
  onPreview,
}: {
  label: string;
  voices: { id: string; label: string; desc: string; gender: string }[];
  selected: string;
  onSelect: (id: string) => void;
  previewingVoice: string | null;
  onPreview: (id: string) => void;
}) {
  const isPreviewing = previewingVoice === selected;
  return (
    <Field label={label}>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <select
          style={{ ...inputStyle, flex: 1 }}
          value={selected}
          onChange={(e) => onSelect(e.target.value)}
        >
          {voices.map((v) => (
            <option key={v.id} value={v.id} style={{ color: "black" }}>
              {v.label} — {v.desc}
            </option>
          ))}
        </select>
        <button
          onClick={() => onPreview(selected)}
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
      </div>
    </Field>
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
