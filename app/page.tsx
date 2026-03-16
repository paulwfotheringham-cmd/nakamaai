"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type BrowserVoice = SpeechSynthesisVoice;

export default function Home() {
  const [setting, setSetting] = useState("office");
  const [mood, setMood] = useState("romantic");
  const [buildUp, setBuildUp] = useState("slow burn");
  const [maleRole, setMaleRole] = useState("boss");
  const [femaleRole, setFemaleRole] = useState("assistant");
  const [storyType, setStoryType] = useState("romantic encounter");
  const [extraPrompt, setExtraPrompt] = useState("");
  const [story, setStory] = useState("");

  const [voices, setVoices] = useState<BrowserVoice[]>([]);
  const [narratorVoice, setNarratorVoice] = useState("");
  const [maleVoice, setMaleVoice] = useState("");
  const [femaleVoice, setFemaleVoice] = useState("");

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
        extraPrompt,
      }),
    });

    const data = await response.json();
    setStory(data.story);
  }

  function cleanVoiceName(name: string) {
    return name
      .replace("Microsoft ", "")
      .replace("Google ", "")
      .replace("Online (Natural) - ", "")
      .split(" - ")[0]
      .trim();
  }

  const englishVoices = useMemo(() => {
    return voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  }, [voices]);

  function pickBestVoice(list: BrowserVoice[], role: "narrator" | "male" | "female") {
    const findByTerms = (terms: string[]) =>
      list.find((v) => terms.some((t) => v.name.toLowerCase().includes(t)));

    if (role === "narrator") {
      return findByTerms(["david", "guy", "mark", "james", "daniel", "male"]) || list[0];
    }

    if (role === "male") {
      return findByTerms(["david", "guy", "mark", "james", "daniel", "male"]) || list[0];
    }

    return findByTerms(["zira", "aria", "jenny", "samantha", "serena", "female"]) || list[0];
  }

  useEffect(() => {
    function loadVoices() {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);

      const english = allVoices.filter((v) => v.lang.toLowerCase().startsWith("en"));
      if (english.length === 0) return;

      const bestNarrator = pickBestVoice(english, "narrator");
      const bestMale = pickBestVoice(english, "male");
      const bestFemale = pickBestVoice(english, "female");

      setNarratorVoice(bestNarrator?.name || english[0].name);
      setMaleVoice(bestMale?.name || english[0].name);
      setFemaleVoice(bestFemale?.name || english[0].name);
    }

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  function speakStory() {
    window.speechSynthesis.cancel();

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
      } else if (line.startsWith("FEMALE:")) {
        text = line.replace("FEMALE:", "").trim();
        voiceName = femaleVoice;
      } else if (line.startsWith("NARRATOR:")) {
        text = line.replace("NARRATOR:", "").trim();
        voiceName = narratorVoice;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const matchedVoice = englishVoices.find((v) => v.name === voiceName);

      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
      } else {
        utterance.lang = "en-US";
      }

      utterance.rate = 0.95;
      utterance.pitch = 1;

      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, delay);

      delay += text.length * 60 + 1200;
    });
  }

  function stopStory() {
    window.speechSynthesis.cancel();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center gap-6 bg-white px-10 py-24 text-center dark:bg-black">
        <Image src="/next.svg" alt="logo" width={100} height={20} priority />

        <h1 className="text-3xl font-semibold text-black dark:text-white">
          Welcome to Nakama AI
        </h1>

        <p className="max-w-md text-zinc-600 dark:text-zinc-400">
          Build a custom romance story with guided choices.
        </p>

        <div className="flex w-full max-w-md flex-col gap-4">
          <label className="text-sm font-semibold text-black dark:text-white">
            Setting
          </label>
          <select
            className="rounded-lg border border-zinc-300 px-4 py-3 text-black"
            value={setting}
            onChange={(e) => setSetting(e.target.value)}
          >
            <option>office</option>
            <option>café</option>
            <option>beach resort</option>
            <option>luxury hotel</option>
            <option>city penthouse</option>
          </select>

          <label className="text-sm font-semibold text-black dark:text-white">
            Mood
          </label>
          <select
            className="rounded-lg border border-zinc-300 px-4 py-3 text-black"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          >
            <option>romantic</option>
            <option>playful</option>
            <option>dramatic</option>
            <option>intense</option>
            <option>tender</option>
          </select>

          <label className="text-sm font-semibold text-black dark:text-white">
            Build-up
          </label>
          <select
            className="rounded-lg border border-zinc-300 px-4 py-3 text-black"
            value={buildUp}
            onChange={(e) => setBuildUp(e.target.value)}
          >
            <option>slow burn</option>
            <option>medium pace</option>
            <option>instant spark</option>
          </select>

          <label className="text-sm font-semibold text-black dark:text-white">
            Male Character
          </label>
          <select
            className="rounded-lg border border-zinc-300 px-4 py-3 text-black"
            value={maleRole}
            onChange={(e) => setMaleRole(e.target.value)}
          >
            <option>boss</option>
            <option>stranger</option>
            <option>chef</option>
            <option>artist</option>
            <option>billionaire</option>
          </select>

          <label className="text-sm font-semibold text-black dark:text-white">
            Female Character
          </label>
          <select
            className="rounded-lg border border-zinc-300 px-4 py-3 text-black"
            value={femaleRole}
            onChange={(e) => setFemaleRole(e.target.value)}
          >
            <option>assistant</option>
            <option>traveler</option>
            <option>writer</option>
            <option>singer</option>
            <option>entrepreneur</option>
          </select>

          <label className="text-sm font-semibold text-black dark:text-white">
            Story Type
          </label>
          <select
            className="rounded-lg border border-zinc-300 px-4 py-3 text-black"
            value={storyType}
            onChange={(e) => setStoryType(e.target.value)}
          >
            <option>romantic encounter</option>
            <option>forbidden romance</option>
            <option>reunion</option>
            <option>enemies to lovers</option>
            <option>late night confession</option>
          </select>

          <label className="text-sm font-semibold text-black dark:text-white">
            Extra Detail
          </label>
          <input
            className="rounded-lg border border-zinc-300 px-4 py-3 text-black"
            placeholder="Optional custom detail..."
            value={extraPrompt}
            onChange={(e) => setExtraPrompt(e.target.value)}
          />

          <label className="text-sm font-semibold text-black dark:text-white">
            Narrator Voice
          </label>
          <select
            className="rounded-lg border border-zinc-300 px-4 py-3 text-black"
            value={narratorVoice}
            onChange={(e) => setNarratorVoice(e.target.value)}
          >
            {englishVoices.map((voice) => (
              <option key={`n-${voice.name}`} value={voice.name}>
                {cleanVoiceName(voice.name)}
              </option>
            ))}
          </select>

          <label className="text-sm font-semibold text-black dark:text-white">
            Male Character Voice
          </label>
          <select
            className="rounded-lg border border-zinc-300 px-4 py-3 text-black"
            value={maleVoice}
            onChange={(e) => setMaleVoice(e.target.value)}
          >
            {englishVoices.map((voice) => (
              <option key={`m-${voice.name}`} value={voice.name}>
                {cleanVoiceName(voice.name)}
              </option>
            ))}
          </select>

          <label className="text-sm font-semibold text-black dark:text-white">
            Female Character Voice
          </label>
          <select
            className="rounded-lg border border-zinc-300 px-4 py-3 text-black"
            value={femaleVoice}
            onChange={(e) => setFemaleVoice(e.target.value)}
          >
            {englishVoices.map((voice) => (
              <option key={`f-${voice.name}`} value={voice.name}>
                {cleanVoiceName(voice.name)}
              </option>
            ))}
          </select>

          <button
            className="rounded-lg bg-black px-6 py-3 text-white hover:bg-zinc-800"
            onClick={generateStory}
          >
            Generate Story
          </button>

          {story && (
            <div className="mt-4 text-left">
              <h2 className="mb-2 text-xl font-semibold">Your Story</h2>

              <p className="whitespace-pre-line text-zinc-700 dark:text-zinc-300">
                {story}
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  className="rounded-lg bg-black px-4 py-2 text-white"
                  onClick={speakStory}
                >
                  🔊 Listen to Story
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
