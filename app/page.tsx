"use client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type BrowserVoice = SpeechSynthesisVoice;

export default function Home() {
  const [setting, setSetting] = useState("office");
  const [mood, setMood] = useState("romantic");
  const [buildUp, setBuildUp] = useState("slow burn");
  const [maleRole, setMaleRole] = useState("boss");
  const [femaleRole, setFemaleRole] = useState("assistant");
  const [storyType, setStoryType] = useState("romantic encounter");
  const [extraDetail, setExtraDetail] = useState("");
  const [story, setStory] = useState("");

  const [voices, setVoices] = useState<BrowserVoice[]>([]);
  const [narratorVoice, setNarratorVoice] = useState("");
  const [maleVoice, setMaleVoice] = useState("");
  const [femaleVoice, setFemaleVoice] = useState("");

  const speechTimeouts = useRef<number[]>([]);

  async function generateStory() {
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
    setStory(data.story);
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

      setNarratorVoice(english[0].name);
      setMaleVoice(english[1]?.name || english[0].name);
      setFemaleVoice(english[2]?.name || english[0].name);
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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center gap-6 bg-white px-10 py-24 text-center dark:bg-black">
        <Image src="/next.svg" alt="logo" width={100} height={20} />

        <h1 className="text-3xl font-semibold text-black dark:text-white">
          Welcome to Nakama AI
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400">
          Build a custom romance story with guided choices.
        </p>

        <div className="flex w-full max-w-md flex-col gap-4">
          <label>Setting</label>
          <select
            className="rounded-lg border p-3 text-black"
            value={setting}
            onChange={(e) => setSetting(e.target.value)}
          >
            <option>office</option>
            <option>café</option>
            <option>beach</option>
            <option>hotel</option>
            <option>city penthouse</option>
          </select>

          <label>Mood</label>
          <select
            className="rounded-lg border p-3 text-black"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          >
            <option>romantic</option>
            <option>playful</option>
            <option>intense</option>
            <option>dramatic</option>
            <option>tender</option>
          </select>

          <label>Build-up</label>
          <select
            className="rounded-lg border p-3 text-black"
            value={buildUp}
            onChange={(e) => setBuildUp(e.target.value)}
          >
            <option>slow burn</option>
            <option>medium pace</option>
            <option>instant spark</option>
          </select>

          <label>Male Character</label>
          <select
            className="rounded-lg border p-3 text-black"
            value={maleRole}
            onChange={(e) => setMaleRole(e.target.value)}
          >
            <option>boss</option>
            <option>stranger</option>
            <option>chef</option>
            <option>artist</option>
            <option>billionaire</option>
          </select>

          <label>Female Character</label>
          <select
            className="rounded-lg border p-3 text-black"
            value={femaleRole}
            onChange={(e) => setFemaleRole(e.target.value)}
          >
            <option>assistant</option>
            <option>traveler</option>
            <option>writer</option>
            <option>singer</option>
            <option>entrepreneur</option>
          </select>

          <label>Story Type</label>
          <select
            className="rounded-lg border p-3 text-black"
            value={storyType}
            onChange={(e) => setStoryType(e.target.value)}
          >
            <option>romantic encounter</option>
            <option>forbidden romance</option>
            <option>reunion</option>
            <option>enemies to lovers</option>
            <option>late night confession</option>
          </select>

          <label>Extra Detail</label>
          <input
            className="rounded-lg border p-3 text-black"
            placeholder="Optional custom detail..."
            value={extraDetail}
            onChange={(e) => setExtraDetail(e.target.value)}
          />

          <label>Narrator Voice</label>
          <select
            className="rounded-lg border p-3 text-black"
            value={narratorVoice}
            onChange={(e) => setNarratorVoice(e.target.value)}
          >
            {englishVoices.map((v) => (
              <option key={`n-${v.name}`} value={v.name}>
                {cleanVoiceName(v.name)}
              </option>
            ))}
          </select>

          <label>Male Character Voice</label>
          <select
            className="rounded-lg border p-3 text-black"
            value={maleVoice}
            onChange={(e) => setMaleVoice(e.target.value)}
          >
            {englishVoices.map((v) => (
              <option key={`m-${v.name}`} value={v.name}>
                {cleanVoiceName(v.name)}
              </option>
            ))}
          </select>

          <label>Female Character Voice</label>
          <select
            className="rounded-lg border p-3 text-black"
            value={femaleVoice}
            onChange={(e) => setFemaleVoice(e.target.value)}
          >
            {englishVoices.map((v) => (
              <option key={`f-${v.name}`} value={v.name}>
                {cleanVoiceName(v.name)}
              </option>
            ))}
          </select>

          <button
            className="rounded-lg bg-black p-3 text-white"
            onClick={generateStory}
          >
            Generate Story
          </button>

          {story && (
            <div className="mt-4 text-left">
              <h2 className="text-xl font-semibold">Your Story</h2>

              <p className="whitespace-pre-line">{story}</p>

              <div className="mt-3 flex gap-3">
                <button
                  className="rounded-lg bg-black px-4 py-2 text-white"
                  onClick={speakStory}
                >
                  🔊 Listen
                </button>

                <button
                  className="rounded-lg border px-4 py-2"
                  onClick={stopStory}
                >
                  Stop
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
