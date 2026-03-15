"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [story, setStory] = useState("");
  const [voiceType, setVoiceType] = useState("female");

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

 function speakStory() {
  const voices = window.speechSynthesis.getVoices()

  const narratorVoice = voices[0]
  const maleVoice = voices.find(v => v.name.toLowerCase().includes("male")) || voices[0]
  const femaleVoice = voices.find(v => v.name.toLowerCase().includes("female")) || voices[1]

  const lines = story.split("\n")

  lines.forEach((line, index) => {
    let text = line
    let voice = narratorVoice

    if (line.startsWith("MALE:")) {
      text = line.replace("MALE:", "")
      voice = maleVoice
    }

    if (line.startsWith("FEMALE:")) {
      text = line.replace("FEMALE:", "")
      voice = femaleVoice
    }

    if (line.startsWith("NARRATOR:")) {
      text = line.replace("NARRATOR:", "")
      voice = narratorVoice
    }

    const speech = new SpeechSynthesisUtterance(text.trim())
    speech.voice = voice
    speech.rate = 0.95
    speech.pitch = 1

    setTimeout(() => {
      window.speechSynthesis.speak(speech)
    }, index * 1500)
  })
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-8 py-32 px-16 bg-white dark:bg-black text-center sm:text-left">

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

          <div className="flex flex-col gap-4 w-full max-w-md">

            <input
              className="border border-zinc-300 rounded-lg px-4 py-3 text-black"
              placeholder="Describe the story you want..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <select
              className="border border-zinc-300 rounded-lg px-4 py-3 text-black"
              value={voiceType}
              onChange={(e) => setVoiceType(e.target.value)}
            >
              <option value="female">Female Voice</option>
              <option value="male">Male Voice</option>
            </select>

            <button
              className="bg-black text-white rounded-lg px-6 py-3 hover:bg-zinc-800"
              onClick={generateStory}
            >
              Generate Story
            </button>

            {story && (
              <div className="mt-4 text-left">
                <h2 className="mb-2 text-xl font-semibold text-black dark:text-zinc-50">
                  Your Story
                </h2>

                <p className="text-zinc-700 dark:text-zinc-300">
                  {story}
                </p>

                <button
                  className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-zinc-800"
                  onClick={speakStory}
                >
                  🔊 Listen to Story
                </button>
              </div>
            )}

          </div>

        </div>

      </main>
    </div>
  );
}
