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

      const allVoices = window.speechSynthesis.getVoices();

      const englishVoices = allVoices.filter(
        (v) => v.lang.startsWith("en")
      );

      setVoices(englishVoices);

      if (englishVoices.length > 0) {

        setNarratorVoice(englishVoices[0].name);

        setMaleVoice(
          englishVoices[1]?.name || englishVoices[0].name
        );

        setFemaleVoice(
          englishVoices[2]?.name || englishVoices[0].name
        );

      }

    }

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

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

      const matchedVoice = voices.find(
        (v) => v.name === voiceName
      );

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.rate = 0.95;

      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, delay);

      delay += text.length * 60 + 1200;

    });

  }

  function stopStory() {
    window.speechSynthesis.cancel();
  }

  function cleanVoiceName(name: string) {
    return name
      .replace("Microsoft ", "")
      .replace("Google ", "")
      .split(" - ")[0];
  }

  return (

    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">

      <main className="flex w-full max-w-3xl flex-col items-center gap-6 py-24 px-10 bg-white dark:bg-black text-center">

        <Image
          src="/next.svg"
          alt="logo"
          width={100}
          height={20}
        />

        <h1 className="text-3xl font-semibold text-black dark:text-white">
          Welcome to Nakama AI
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400 max-w-md">
          AI-generated personalized audio stories created just for you.
        </p>

        <div className="flex flex-col gap-4 w-full max-w-md">

          <input
            className="border border-zinc-300 rounded-lg px-4 py-3 text-black"
            placeholder="Describe the story you want..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <label className="text-sm font-semibold text-black dark:text-white">
            Narrator Voice
          </label>

          <select
            className="border border-zinc-300 rounded-lg px-4 py-3 text-black"
            value={narratorVoice}
            onChange={(e) => setNarratorVoice(e.target.value)}
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {cleanVoiceName(voice.name)}
              </option>
            ))}
          </select>

          <label className="text-sm font-semibold text-black dark:text-white">
            Male Character Voice
          </label>

          <select
            className="border border-zinc-300 rounded-lg px-4 py-3 text-black"
            value={maleVoice}
            onChange={(e) => setMaleVoice(e.target.value)}
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {cleanVoiceName(voice.name)}
              </option>
            ))}
          </select>

          <label className="text-sm font-semibold text-black dark:text-white">
            Female Character Voice
          </label>

          <select
            className="border border-zinc-300 rounded-lg px-4 py-3 text-black"
            value={femaleVoice}
            onChange={(e) => setFemaleVoice(e.target.value)}
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {cleanVoiceName(voice.name)}
              </option>
            ))}
          </select>

          <button
            className="bg-black text-white rounded-lg px-6 py-3 hover:bg-zinc-800"
            onClick={generateStory}
          >
            Generate Story
          </button>

          {story && (

            <div className="text-left mt-4">

              <h2 className="text-xl font-semibold mb-2">
                Your Story
              </h2>

              <p className="whitespace-pre-line text-zinc-700 dark:text-zinc-300">
                {story}
              </p>

              <div className="flex gap-3 mt-4">

                <button
                  className="bg-black text-white px-4 py-2 rounded-lg"
                  onClick={speakStory}
                >
                  🔊 Listen to Story
                </button>

                <button
                  className="border px-4 py-2 rounded-lg"
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
