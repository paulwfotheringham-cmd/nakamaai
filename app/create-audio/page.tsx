"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type BrowserVoice = SpeechSynthesisVoice;

export default function CreateAudioPage() {
  const [setting, setSetting] = useState("office");
  const [mood, setMood] = useState("romantic");
  const [buildUp, setBuildUp] = useState("slow burn");
  const [maleRole, setMaleRole] = useState("boss");
  const [femaleRole, setFemaleRole] = useState("assistant");
  const [storyType, setStoryType] = useState("romantic encounter");
  const [extraDetail, setExtraDetail] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  const [voices, setVoices] = useState<BrowserVoice[]>([]);
  const [narratorVoice, setNarratorVoice] = useState("");
  const [maleVoice, setMaleVoice] = useState("");
  const [femaleVoice, setFemaleVoice] = useState("");

  const speechTimeouts = useRef<number[]>([]);

  async function generateStory() {
    setLoading(true);

    try {
      const response = await fetch("/api/story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          setting,
          mood,
          buildUp,
          maleRole,
          femaleRole,
          storyType,
          extraDetail,
        }),
      });

      const data = await response.json();
      setStory(data.story || "");
    } catch {
      alert("Failed to generate story");
    }

    setLoading(false);
  }

  function cleanVoiceName(name: string) {
    return name
      .replace("Microsoft ", "")
      .replace("Google ", "")
      .split(" - ")[0]
      .trim();
  }

  const englishVoices = useMemo(() => {
    return voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  }, [voices]);

  useEffect(() => {
    function loadVoices() {
      const all = window.speechSynthesis.getVoices();
      setVoices(all);

      const english = all.filter((v) => v.lang.toLowerCase().startsWith("en"));
      if (english.length === 0) return;

      setNarratorVoice((current) => current || english[0].name);
      setMaleVoice((current) => current || english[1]?.name || english[0].name);
      setFemaleVoice((current) => current || english[2]?.name || english[0].name);
    }

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  function speakStory() {
    window.speechSynthesis.cancel();
    speechTimeouts.current.forEach((id) => clearTimeout(id));
    speechTimeouts.current = [];

    const lines = story
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    let delay = 0;

    lines.forEach((line) => {
      let text = line;
      let voiceName = narratorVoice;

      if (line.startsWith("MALE:")) {
        text = line.replace("MALE:", "").trim();
        voiceName = maleVoice;
      }

      if (line.startsWith("FEMALE:")) {
        text = line.replace("FEMALE:", "").trim();
        voiceName = femaleVoice;
      }

      if (line.startsWith("NARRATOR:")) {
        text = line.replace("NARRATOR:", "").trim();
        voiceName = narratorVoice;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const matched = englishVoices.find((v) => v.name === voiceName);

      if (matched) {
        utterance.voice = matched;
        utterance.lang = matched.lang;
      } else {
        utterance.lang = "en-US";
      }

      utterance.rate = 0.95;

      const timeoutId = window.setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, delay);

      speechTimeouts.current.push(timeoutId);
      delay += text.length * 60 + 1200;
    });
  }

  function stopStory() {
    window.speechSynthesis.cancel();
    speechTimeouts.current.forEach((id) => clearTimeout(id));
    speechTimeouts.current = [];
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #3a1d2e 0%, #160f18 35%, #09080b 100%)",
        color: "white",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
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
        <div
          style={{
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.4em",
                color: "#d8b26e",
              }}
            >
              Nakama
            </div>
            <div style={{ marginTop: "8px", fontSize: "32px", fontWeight: 700 }}>
              Nakama AI
            </div>
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

        <div
          style={{
            display: "grid",
            gap: "32px",
            gridTemplateColumns: "1fr 1.1fr",
          }}
        >
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

            <div
              style={{
                marginTop: "32px",
                display: "grid",
                gap: "12px",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <FeatureCard
                title="Guided story design"
                text="Choose the tone, setting, and romantic arc before generating."
              />
              <FeatureCard
                title="Voice casting"
                text="Assign different voices to narrator, male character, and female character."
              />
              <FeatureCard
                title="Audio playback"
                text="Listen to every line in sequence with your selected cast."
              />
              <FeatureCard
                title="Fast iteration"
                text="Change one detail and instantly create a new version."
              />
            </div>
          </div>

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
              <h2 style={{ margin: 0, fontSize: "32px", fontWeight: 700 }}>
                Build your scene
              </h2>
              <p style={{ marginTop: "8px", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
                Adjust the story ingredients, then generate and listen.
              </p>
            </div>

            <div style={{ display: "grid", gap: "16px" }}>
              <TwoCol>
                <Field label="Setting">
                  <select style={inputStyle} value={setting} onChange={(e) => setSetting(e.target.value)}>
                    <option>office</option>
                    <option>café</option>
                    <option>beach</option>
                    <option>hotel</option>
                    <option>city penthouse</option>
                  </select>
                </Field>

                <Field label="Mood">
                  <select style={inputStyle} value={mood} onChange={(e) => setMood(e.target.value)}>
                    <option>romantic</option>
                    <option>playful</option>
                    <option>intense</option>
                    <option>dramatic</option>
                    <option>tender</option>
                  </select>
                </Field>
              </TwoCol>

              <TwoCol>
                <Field label="Build-up">
                  <select style={inputStyle} value={buildUp} onChange={(e) => setBuildUp(e.target.value)}>
                    <option>slow burn</option>
                    <option>medium pace</option>
                    <option>instant spark</option>
                  </select>
                </Field>

                <Field label="Story Type">
                  <select style={inputStyle} value={storyType} onChange={(e) => setStoryType(e.target.value)}>
                    <option>romantic encounter</option>
                    <option>forbidden romance</option>
                    <option>reunion</option>
                    <option>enemies to lovers</option>
                    <option>late night confession</option>
                  </select>
                </Field>
              </TwoCol>

              <TwoCol>
                <Field label="Male Character">
                  <select style={inputStyle} value={maleRole} onChange={(e) => setMaleRole(e.target.value)}>
                    <option>boss</option>
                    <option>stranger</option>
                    <option>chef</option>
                    <option>artist</option>
                    <option>billionaire</option>
                  </select>
                </Field>

                <Field label="Female Character">
                  <select style={inputStyle} value={femaleRole} onChange={(e) => setFemaleRole(e.target.value)}>
                    <option>assistant</option>
                    <option>traveler</option>
                    <option>writer</option>
                    <option>singer</option>
                    <option>entrepreneur</option>
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
                  <Field label="Narrator Voice">
                    <select style={inputStyle} value={narratorVoice} onChange={(e) => setNarratorVoice(e.target.value)}>
                      {englishVoices.map((v) => (
                        <option key={`n-${v.name}`} value={v.name}>
                          {cleanVoiceName(v.name)}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Male Character Voice">
                    <select style={inputStyle} value={maleVoice} onChange={(e) => setMaleVoice(e.target.value)}>
                      {englishVoices.map((v) => (
                        <option key={`m-${v.name}`} value={v.name}>
                          {cleanVoiceName(v.name)}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Female Character Voice">
                    <select style={inputStyle} value={femaleVoice} onChange={(e) => setFemaleVoice(e.target.value)}>
                      {englishVoices.map((v) => (
                        <option key={`f-${v.name}`} value={v.name}>
                          {cleanVoiceName(v.name)}
                        </option>
                      ))}
                    </select>
                  </Field>
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
                  cursor: "pointer",
                  fontSize: "16px",
                }}
                onClick={generateStory}
              >
                {loading ? "Generating..." : "Generate Story"}
              </button>
            </div>
          </div>
        </div>

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
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: "32px", fontWeight: 700 }}>Your Story</h2>
                <p style={{ marginTop: "6px", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
                  Generated from your chosen settings and cast.
                </p>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  style={{
                    borderRadius: "14px",
                    background: "#d8b26e",
                    padding: "10px 16px",
                    fontWeight: 700,
                    color: "black",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={speakStory}
                >
                  🔊 Listen
                </button>

                <button
                  style={{
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.05)",
                    padding: "10px 16px",
                    color: "white",
                    cursor: "pointer",
                  }}
                  onClick={stopStory}
                >
                  Stop
                </button>
              </div>
            </div>

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
    <div
      style={{
        display: "grid",
        gap: "16px",
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "grid", gap: "8px", textAlign: "left" }}>
      <span style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function FeatureCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
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
      <div style={{ marginTop: "6px", fontSize: "14px", lineHeight: 1.6, color: "rgba(255,255,255,0.6)" }}>
        {text}
      </div>
    </div>
  );
}

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
