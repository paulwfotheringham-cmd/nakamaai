"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

type BrowserVoice = SpeechSynthesisVoice;

export default function Home() {
  const [prompt, setPrompt] = useState("");
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
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    setStory(data.story);
  }

  useEffect(() => {
    function loadVoices() {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      if (availableVoices.length > 0) {
        if (!narratorVoice) setNarratorVoice(availableVoices[0]?.name || "");
        if (!maleVoice) setMaleVoice(availableVoices[1]?.name || availableVoices[0]?.name || "");
        if (!femaleVoice) setFemaleVoice(availableVoices[2]?.name || availableVoices[0]?.name || "");
      }
    }

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [narratorVoice, maleVoice, femaleVoice]);

  function speakStory() {
    window.speechSynthesis.cancel();

    const lines = story
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    let delay = 0;

    lines.forEach((line) => {
      let text = line;
      let selectedVoiceName = narratorVoice;

      if (line.startsWith("MALE:")) {
        text = line.replace("MALE:", "").trim();
        selectedVoiceName = maleVoice;
      } else if (line.startsWith("FEMALE:")) {
        text = line.replace("FEMALE:", "").trim();
        selectedVoiceName = femaleVoice;
      } else if (line.startsWith("NARRATOR:")) {
        text = line.replace("NARRATOR:", "").trim();
        selectedVoiceName = narratorVoice;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const matchedVoice = voices.find((v) => v.name === selectedVoiceName);

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.lang = matchedVoice?.lang || "en-US";

      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, delay);

      delay += Math.max(text.length * 55, 1800);
    });
  }

  function stopStory() {
    window.speechSynthesis.cancel();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-8 bg-white px-16 py-32 text-center dark:bg-black sm:text-left">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Nakama AI logo"
          width={100}
          height={20}
          priority
        />

        <div className="flex flex-col items-center gap-6 sm:items-start">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Welcome to Nakama AI
          </h1>

          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            AI-generated personalized audio stories created just for you.
          </p>

          <div className="flex w-full max-w-md flex-col gap-4">
            <input
              className="rounded-lg border border-zinc-300 px-4 py-3 text-black"
              placeholder="Describe the story you want..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <select
              className="rounded-lg border border-zinc-300 px-4 py-3 text-black"
              value={narratorVoice}
              onChange={(e) => setNarratorVoice(e.target.value)}
            >
              <option value="">Narrator Voice</option>
              {voices.map((voice) => (
                <option key={`narrator-${voice.name}`} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>

            <select
              className="rounded-lg border border-zinc-300 px-4 py-3 text-black"
              value={maleVoice}
              onChange={(e) => setMaleVoice(e.target.value)}
            >
              <option value="">Male Character Voice</option>
              {voices.map((voice) => (
                <option key={`male-${voice.name}`} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>

            <select
              className="rounded-lg border border-zinc-300 px-4 py-3 text-black"
              value={femaleVoice}
              onChange={(e) => setFemaleVoice(e.target.value)}
            >
              <option value="">Female Character Voice</option>
              {voices.map((voice) => (
                <option key={`female-${voice.name}`} value={voice.name}>
                  {voice.name} ({voice.lang})
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
                <h2 className="mb-2 text-xl font-semibold text-black dark:text-zinc-50">
                  Your Story
                </h2>

                <p className="whitespace-pre-line text-zinc-700 dark:text-zinc-300">
                  {story}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    className="rounded-lg bg-black px-4 py-2 text-white hover:bg-zinc-800"
                    onClick={speakStory}
                  >
                    🔊 Listen to Story
                  </button>

                  <button
                    className="rounded-lg border border-black px-4 py-2 text-black hover:bg-zinc-100 dark:border-white dark:text-white dark:hover:bg-zinc-900"
                    onClick={stopStory}
                  >
                    Stop Audio
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
