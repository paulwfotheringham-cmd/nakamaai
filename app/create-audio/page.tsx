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
    } catch (error) {
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#3a1d2e_0%,_#160f18_35%,_#09080b_100%)] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 md:px-10">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-[#d8b26e]">
              Nakama
            </div>
            <div className="mt-2 text-2xl font-semibold">Nakama AI</div>
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
            Guided romance story builder
          </div>
        </header>

        <div className="grid flex-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
          <section className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit rounded-full border border-[#d8b26e]/30 bg-[#d8b26e]/10 px-4 py-1 text-sm text-[#f1d7a1]">
              Premium audio storytelling
            </div>

            <h1 className="max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">
              Create custom romantic audio stories with
              <span className="text-[#d8b26e]"> Nakama</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
              Shape the setting, mood, pacing, characters, and voice casting.
              Generate a private story scene and listen to it like a mini audio drama.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
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
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Build your scene</h2>
              <p className="mt-2 text-sm text-white/60">
                Adjust the story ingredients, then generate and listen.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Setting">
                  <select
                    className="nakama-input"
                    value={setting}
                    onChange={(e) => setSetting(e.target.value)}
                  >
                    <option>office</option>
                    <option>café</option>
                    <option>beach</option>
                    <option>hotel</option>
                    <option>city penthouse</option>
                  </select>
                </Field>

                <Field label="Mood">
                  <select
                    className="nakama-input"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                  >
                    <option>romantic</option>
                    <option>playful</option>
                    <option>intense</option>
                    <option>dramatic</option>
                    <option>tender</option>
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Build-up">
                  <select
                    className="nakama-input"
                    value={buildUp}
                    onChange={(e) => setBuildUp(e.target.value)}
                  >
                    <option>slow burn</option>
                    <option>medium pace</option>
                    <option>instant spark</option>
                  </select>
                </Field>

                <Field label="Story Type">
                  <select
                    className="nakama-input"
                    value={storyType}
                    onChange={(e) => setStoryType(e.target.value)}
                  >
                    <option>romantic encounter</option>
                    <option>forbidden romance</option>
                    <option>reunion</option>
                    <option>enemies to lovers</option>
                    <option>late night confession</option>
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Male Character">
                  <select
                    className="nakama-input"
                    value={maleRole}
                    onChange={(e) => setMaleRole(e.target.value)}
                  >
                    <option>boss</option>
                    <option>stranger</option>
                    <option>chef</option>
                    <option>artist</option>
                    <option>billionaire</option>
                  </select>
                </Field>

                <Field label="Female Character">
                  <select
                    className="nakama-input"
                    value={femaleRole}
                    onChange={(e) => setFemaleRole(e.target.value)}
                  >
                    <option>assistant</option>
                    <option>traveler</option>
                    <option>writer</option>
                    <option>singer</option>
                    <option>entrepreneur</option>
                  </select>
                </Field>
              </div>

              <Field label="Extra Detail">
                <input
                  className="nakama-input"
                  placeholder="Optional custom detail..."
                  value={extraDetail}
                  onChange={(e) => setExtraDetail(e.target.value)}
                />
              </Field>

              <div className="mt-2 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[#d8b26e]">
                  Voice Casting
                </div>

                <div className="grid gap-4">
                  <Field label="Narrator Voice">
                    <select
                      className="nakama-input"
                      value={narratorVoice}
                      onChange={(e) => setNarratorVoice(e.target.value)}
                    >
                      {englishVoices.map((v) => (
                        <option key={`n-${v.name}`} value={v.name}>
                          {cleanVoiceName(v.name)}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Male Character Voice">
                    <select
                      className="nakama-input"
                      value={maleVoice}
                      onChange={(e) => setMaleVoice(e.target.value)}
                    >
                      {englishVoices.map((v) => (
                        <option key={`m-${v.name}`} value={v.name}>
                          {cleanVoiceName(v.name)}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Female Character Voice">
                    <select
                      className="nakama-input"
                      value={femaleVoice}
                      onChange={(e) => setFemaleVoice(e.target.value)}
                    >
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
                className="mt-2 rounded-2xl bg-[#d8b26e] px-6 py-3 font-medium text-black transition hover:bg-[#e7c98c]"
                onClick={generateStory}
              >
                {loading ? "Generating..." : "Generate Story"}
              </button>
            </div>
          </section>
        </div>

        {story && (
          <section className="mt-10 rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-xl backdrop-blur-xl">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Your Story</h2>
                <p className="mt-1 text-sm text-white/60">
                  Generated from your chosen settings and cast.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  className="rounded-xl bg-[#d8b26e] px-4 py-2 font-medium text-black transition hover:bg-[#e7c98c]"
                  onClick={speakStory}
                >
                  🔊 Listen
                </button>

                <button
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-white transition hover:bg-white/10"
                  onClick={stopStory}
                >
                  Stop
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="whitespace-pre-line leading-8 text-white/85">
                {story}
              </p>
            </div>
          </section>
        )}

        <style jsx global>{`
          .nakama-input {
            width: 100%;
            border-radius: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.06);
            color: white;
            padding: 0.9rem 1rem;
            outline: none;
          }

          .nakama-input::placeholder {
            color: rgba(255, 255, 255, 0.4);
          }

          .nakama-input:focus {
            border-color: rgba(216, 178, 110, 0.75);
            box-shadow: 0 0 0 3px rgba(216, 178, 110, 0.14);
          }

          .nakama-input option {
            color: black;
          }
        `}</style>
      </div>
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
    <label className="grid gap-2 text-left">
      <span className="text-sm font-medium text-white/80">{label}</span>
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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-1 text-sm leading-6 text-white/60">{text}</div>
    </div>
  );
}
