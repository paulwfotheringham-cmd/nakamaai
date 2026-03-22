"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Phase = "setup" | "generating" | "playing" | "choosing" | "continuing";

const maleNames = ["Luca", "Adrian", "Noah", "Julian", "Theo"];
const femaleNames = ["Elena", "Sofia", "Clara", "Mia", "Isla"];

const rand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export default function InteractiveAudioDemo() {
  const [phase, setPhase] = useState<Phase>("setup");

  // Setup fields
  const [setting, setSetting] = useState("office");
  const [mood, setMood] = useState("romantic");
  const [maleRole, setMaleRole] = useState("boss");
  const [femaleRole, setFemaleRole] = useState("assistant");

  // Names (randomised on start)
  const [maleName] = useState(rand(maleNames));
  const [femaleName] = useState(rand(femaleNames));

  // Story state
  const [storySegments, setStorySegments] = useState<string[]>([]);
  const [choices, setChoices] = useState<string[]>([]);
  const [customChoice, setCustomChoice] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);

  // Voice
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [narratorVoice, setNarratorVoice] = useState("");
  const [maleVoice, setMaleVoice] = useState("");
  const [femaleVoice, setFemaleVoice] = useState("");

  const stoppedRef = useRef(false);
  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition> | null>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  const englishVoices = useMemo(
    () => voices.filter((v) => v.lang.toLowerCase().startsWith("en")),
    [voices]
  );

  useEffect(() => {
    function load() {
      const all = window.speechSynthesis.getVoices();
      setVoices(all);
      const en = all.filter((v) => v.lang.toLowerCase().startsWith("en"));
      if (!en.length) return;
      setNarratorVoice((c) => c || en[0].name);
      setMaleVoice((c) => c || en[1]?.name || en[0].name);
      setFemaleVoice((c) => c || en[2]?.name || en[0].name);
    }
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  function cleanVoiceName(name: string) {
    return name.replace("Microsoft ", "").replace("Google ", "").split(" - ")[0].trim();
  }

  async function fetchSegment(isFirst: boolean, choice?: string) {
    const history = storySegments.join("\n\n");
    const res = await fetch("/api/interactive-story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phase: isFirst ? "open" : "continue",
        setting, mood, maleRole, femaleRole, maleName, femaleName,
        history,
        choice,
      }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data as { story: string; choices: string[] };
  }

  function speakText(text: string, onDone: () => void) {
    stoppedRef.current = false;
    window.speechSynthesis.cancel();

    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    let index = 0;

    const speakNext = () => {
      if (stoppedRef.current || index >= lines.length) {
        onDone();
        return;
      }
      const line = lines[index++];
      let spokenText = line;
      let voiceName = narratorVoice;

      if (line.startsWith("MALE:")) { spokenText = line.replace("MALE:", "").trim(); voiceName = maleVoice; }
      else if (line.startsWith("FEMALE:")) { spokenText = line.replace("FEMALE:", "").trim(); voiceName = femaleVoice; }
      else if (line.startsWith("NARRATOR:")) { spokenText = line.replace("NARRATOR:", "").trim(); voiceName = narratorVoice; }

      const utterance = new SpeechSynthesisUtterance(spokenText);
      const matched = englishVoices.find((v) => v.name === voiceName);
      if (matched) { utterance.voice = matched; utterance.lang = matched.lang; }
      utterance.rate = 0.95;
      utterance.onend = speakNext;
      utterance.onerror = speakNext;
      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  }

  function speakPrompt(onDone: () => void) {
    const utterance = new SpeechSynthesisUtterance("What would you like to do next?");
    const matched = englishVoices.find((v) => v.name === narratorVoice);
    if (matched) { utterance.voice = matched; utterance.lang = matched.lang; }
    utterance.rate = 0.88;
    utterance.pitch = 0.95;
    utterance.onend = onDone;
    window.speechSynthesis.speak(utterance);
  }

  async function handleStart() {
    setPhase("generating");
    setStorySegments([]);
    setChoices([]);
    setCurrentSegmentIndex(0);

    try {
      const { story, choices: newChoices } = await fetchSegment(true);
      setStorySegments([story]);
      setChoices(newChoices);
      setPhase("playing");

      speakText(story, () => {
        if (stoppedRef.current) return;
        speakPrompt(() => {
          if (stoppedRef.current) return;
          setPhase("choosing");
        });
      });
    } catch (e) {
      alert("Error: " + (e instanceof Error ? e.message : "Unknown"));
      setPhase("setup");
    }
  }

  async function handleChoice(chosen: string) {
    setPhase("generating");
    setCustomChoice("");

    const history = storySegments.join("\n\n");

    try {
      const { story, choices: newChoices } = await fetchSegment(false, chosen);
      setStorySegments((prev) => [...prev, `[Choice: ${chosen}]\n\n${story}`]);
      setChoices(newChoices);
      setCurrentSegmentIndex((i) => i + 1);
      setPhase("playing");

      speakText(story, () => {
        if (stoppedRef.current) return;
        speakPrompt(() => {
          if (stoppedRef.current) return;
          setPhase("choosing");
        });
      });
    } catch (e) {
      alert("Error: " + (e instanceof Error ? e.message : "Unknown"));
      setPhase("choosing");
    }
  }

  function handleStop() {
    stoppedRef.current = true;
    window.speechSynthesis.cancel();
    setPhase("setup");
    setStorySegments([]);
    setChoices([]);
  }

  function startListening() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Voice input not supported in this browser. Try Chrome."); return; }

    const recognition = new SR() as InstanceType<typeof window.SpeechRecognition>;
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setCustomChoice(transcript);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  const phaseLabel: Record<Phase, string> = {
    setup: "",
    generating: "Writing your story...",
    playing: "Playing...",
    choosing: "Your turn — what happens next?",
    continuing: "Continuing...",
  };

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at top, #2a0f2e 0%, #110820 40%, #07040d 100%)", color: "white", fontFamily: "Arial, Helvetica, sans-serif" }}>
      <a href="/dashboard" style={backBtnStyle}>← Dashboard</a>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "56px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: "40px", textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: "999px", background: "rgba(180,100,255,0.15)", border: "1px solid rgba(180,100,255,0.3)", fontSize: "13px", color: "#d4aaff", marginBottom: "16px" }}>
            Interactive Demo
          </div>
          <h1 style={{ margin: "0 0 12px", fontSize: "clamp(36px, 6vw, 54px)", fontWeight: 800, letterSpacing: "-0.03em" }}>
            Your Story,<br />
            <span style={{ color: "#d8b26e" }}>Your Choices</span>
          </h1>
          <p style={{ margin: 0, fontSize: "18px", color: "rgba(255,255,255,0.65)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.6 }}>
            The story pauses after each scene and asks what you want to happen next. Pick from options or speak your own.
          </p>
        </div>

        {/* Setup panel */}
        {phase === "setup" && (
          <div style={cardStyle}>
            <h2 style={{ margin: "0 0 20px", fontSize: "22px", fontWeight: 700 }}>Set the scene</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <Field label="Setting">
                <select style={selectStyle} value={setting} onChange={(e) => setSetting(e.target.value)}>
                  {["office", "café", "beach", "hotel", "city penthouse", "forest cabin", "yacht"].map((o) => <option key={o} style={{ color: "black" }}>{o}</option>)}
                </select>
              </Field>
              <Field label="Mood">
                <select style={selectStyle} value={mood} onChange={(e) => setMood(e.target.value)}>
                  {["romantic", "playful", "intense", "forbidden", "tender", "mysterious"].map((o) => <option key={o} style={{ color: "black" }}>{o}</option>)}
                </select>
              </Field>
              <Field label="Male character">
                <select style={selectStyle} value={maleRole} onChange={(e) => setMaleRole(e.target.value)}>
                  {["boss", "stranger", "chef", "artist", "billionaire", "detective", "doctor"].map((o) => <option key={o} style={{ color: "black" }}>{o}</option>)}
                </select>
              </Field>
              <Field label="Female character">
                <select style={selectStyle} value={femaleRole} onChange={(e) => setFemaleRole(e.target.value)}>
                  {["assistant", "traveler", "writer", "singer", "entrepreneur", "journalist", "photographer"].map((o) => <option key={o} style={{ color: "black" }}>{o}</option>)}
                </select>
              </Field>
            </div>

            {/* Voice casting */}
            <div style={{ borderRadius: "16px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", padding: "16px", marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#d8b26e", marginBottom: "12px" }}>Voice Casting</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <Field label="Narrator">
                  <select style={selectStyle} value={narratorVoice} onChange={(e) => setNarratorVoice(e.target.value)}>
                    {englishVoices.map((v) => <option key={v.name} value={v.name} style={{ color: "black" }}>{cleanVoiceName(v.name)}</option>)}
                  </select>
                </Field>
                <Field label="Male voice">
                  <select style={selectStyle} value={maleVoice} onChange={(e) => setMaleVoice(e.target.value)}>
                    {englishVoices.map((v) => <option key={v.name} value={v.name} style={{ color: "black" }}>{cleanVoiceName(v.name)}</option>)}
                  </select>
                </Field>
                <Field label="Female voice">
                  <select style={selectStyle} value={femaleVoice} onChange={(e) => setFemaleVoice(e.target.value)}>
                    {englishVoices.map((v) => <option key={v.name} value={v.name} style={{ color: "black" }}>{cleanVoiceName(v.name)}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            <button onClick={handleStart} style={primaryBtnStyle}>
              ▶ Begin Interactive Story
            </button>
          </div>
        )}

        {/* Generating */}
        {phase === "generating" && (
          <div style={{ ...cardStyle, textAlign: "center", padding: "60px 32px" }}>
            <div style={{ fontSize: "48px", marginBottom: "20px", animation: "pulse 1.5s infinite" }}>✍️</div>
            <div style={{ fontSize: "20px", fontWeight: 600, color: "#d8b26e" }}>Writing your story...</div>
            <div style={{ marginTop: "10px", fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>Crafting the scene and your choices</div>
          </div>
        )}

        {/* Playing */}
        {phase === "playing" && (
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#4caf50", boxShadow: "0 0 12px rgba(76,175,80,0.7)", animation: "pulse 1s infinite" }} />
              <span style={{ fontSize: "15px", fontWeight: 600, color: "#4caf50" }}>Playing — listen for your prompt</span>
              <button onClick={handleStop} style={{ marginLeft: "auto", ...ghostBtnStyle }}>✕ Stop</button>
            </div>
            <div style={{ borderRadius: "14px", background: "rgba(0,0,0,0.25)", padding: "20px", maxHeight: "280px", overflowY: "auto", lineHeight: 1.8, fontSize: "15px", color: "rgba(255,255,255,0.8)" }}>
              {storySegments[storySegments.length - 1]?.split("\n").map((line, i) => (
                <p key={i} style={{ margin: "4px 0", color: line.startsWith("MALE:") ? "#93c5fd" : line.startsWith("FEMALE:") ? "#f9a8d4" : "rgba(255,255,255,0.8)" }}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Choosing */}
        {phase === "choosing" && (
          <div style={cardStyle}>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>🎭</div>
              <h2 style={{ margin: "0 0 6px", fontSize: "24px", fontWeight: 800 }}>What happens next?</h2>
              <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,0.55)" }}>
                Pick an option, speak your choice, or type your own
              </p>
            </div>

            {/* Choice cards */}
            <div style={{ display: "grid", gap: "12px", marginBottom: "24px" }}>
              {choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(choice)}
                  style={choiceBtnStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(216,178,110,0.18)"; e.currentTarget.style.borderColor = "rgba(216,178,110,0.5)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(216,178,110,0.07)"; e.currentTarget.style.borderColor = "rgba(216,178,110,0.2)"; }}
                >
                  <span style={{ fontSize: "18px" }}>{["💋", "🔥", "✨"][i]}</span>
                  <span>{choice}</span>
                </button>
              ))}
            </div>

            {/* Custom input */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "20px" }}>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Or write / speak your own
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  value={customChoice}
                  onChange={(e) => setCustomChoice(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && customChoice.trim() && handleChoice(customChoice.trim())}
                  placeholder="e.g. take me to the balcony..."
                  style={inputStyle}
                />
                <button
                  onClick={isListening ? stopListening : startListening}
                  style={{
                    ...ghostBtnStyle,
                    padding: "0 16px",
                    background: isListening ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)",
                    borderColor: isListening ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.12)",
                    color: isListening ? "#f87171" : "white",
                    flexShrink: 0,
                    fontSize: "20px",
                  }}
                  title={isListening ? "Stop listening" : "Speak your choice"}
                >
                  {isListening ? "⏹" : "🎙"}
                </button>
                <button
                  onClick={() => customChoice.trim() && handleChoice(customChoice.trim())}
                  disabled={!customChoice.trim()}
                  style={{ ...primaryBtnStyle, padding: "0 20px", flexShrink: 0, opacity: customChoice.trim() ? 1 : 0.4 }}
                >
                  Go →
                </button>
              </div>
              {isListening && (
                <div style={{ marginTop: "10px", fontSize: "13px", color: "#f87171", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f87171", display: "inline-block", animation: "pulse 0.8s infinite" }} />
                  Listening... speak your choice
                </div>
              )}
            </div>

            <div style={{ marginTop: "16px", textAlign: "center" }}>
              <button onClick={handleStop} style={{ ...ghostBtnStyle, fontSize: "13px" }}>End story</button>
            </div>
          </div>
        )}

        {/* Story history */}
        {storySegments.length > 1 && (phase === "playing" || phase === "choosing") && (
          <div style={{ marginTop: "20px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "10px" }}>
              Story so far
            </div>
            {storySegments.slice(0, -1).map((seg, i) => (
              <div key={i} style={{ borderRadius: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "16px", marginBottom: "10px", fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                {seg.split("\n").slice(0, 3).map((l, j) => <p key={j} style={{ margin: "2px 0" }}>{l}</p>)}
                <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.25)" }}>...</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "grid", gap: "6px" }}>
      <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{label}</span>
      {children}
    </label>
  );
}

const cardStyle: React.CSSProperties = {
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)",
  padding: "28px",
  backdropFilter: "blur(12px)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
};

const primaryBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "15px 24px",
  borderRadius: "16px",
  border: "none",
  background: "#d8b26e",
  color: "black",
  fontWeight: 700,
  fontSize: "16px",
  cursor: "pointer",
};

const ghostBtnStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600,
};

const choiceBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "16px 20px",
  borderRadius: "16px",
  border: "1px solid rgba(216,178,110,0.2)",
  background: "rgba(216,178,110,0.07)",
  color: "white",
  fontSize: "16px",
  fontWeight: 600,
  cursor: "pointer",
  textAlign: "left",
  transition: "all 0.15s ease",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  padding: "12px 14px",
  outline: "none",
  fontSize: "15px",
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  padding: "12px 16px",
  outline: "none",
  fontSize: "15px",
};

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
