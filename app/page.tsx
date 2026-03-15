"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [story, setStory] = useState("");
  
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
            Choose your preferences, generate custom narratives, and listen instantly.
          </p>
          <div className="flex flex-col gap-4 w-full max-w-md">


<input
  className="border border-zinc-300 rounded-lg px-4 py-3 text-black"
  placeholder="Describe the story you want..."
  value={prompt}
  onChange={(e) => setPrompt(e.target.value)}
/>
<button
  className="bg-black text-white rounded-lg px-6 py-3 hover:bg-zinc-800"
  onClick={() => setStory(prompt)}
>
  Generate Story
</button>
{story && (
  <div className="mt-4 max-w-md text-left">
    <h2 className="mb-2 text-xl font-semibold text-black dark:text-zinc-50">
      Your Story
    </h2>
    <p className="text-zinc-700 dark:text-zinc-300">
      {story}
    </p>
  </div>
)}
</div>
        </div>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">

          <a
            className="flex h-12 w-full items-center justify-center rounded-full bg-black px-6 text-white transition-colors hover:bg-zinc-800 md:w-[220px]"
            href="#"
          >
            Start Creating Stories
          </a>

          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-black px-6 transition-colors hover:bg-zinc-100 md:w-[160px]"
            href="#"
          >
            Sign Up
          </a>

        </div>

      </main>
    </div>
  );
}
