"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CreateAudioTile from "./CreateAudioTile";

type Tile = {
  title: string;
  description: string;
  href: string;
  icon: string;
  cta: string;
};

type ChatMessage = {
  id: number;
  role: "guide" | "user";
  text: string;
};

const fantasyTile: Tile = {
  title: "Choose fantasy Audio",
  description: "Browse and begin your next immersive audio experience.",
  href: "/fantasy-audio",
  icon: "📚",
  cta: "Browse Library",
};

function TileCard({ tile }: { tile: Tile }) {
  return (
    <Link href={tile.href} className="block h-full">
      <div className="group h-full rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
          <span aria-hidden="true">{tile.icon}</span>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold tracking-tight text-white">{tile.title}</h3>
          <p className="text-sm leading-6 text-zinc-300">{tile.description}</p>
        </div>
        <div className="mt-6 flex items-center text-sm font-medium text-white">
          <span>{tile.cta}</span>
          <span className="ml-2">→</span>
        </div>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const [guideImage, setGuideImage] = useState("/guides/GUIDE1.png");
  const [voice, setVoice] = useState("Donny - Steady Presence");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("selectedGuide");
    if (stored) setGuideImage(`/guides/${stored}`);

    const userName = localStorage.getItem("userName") || "there";
    setMessages([
      { id: 1, role: "guide", text: `Hello ${userName}... I'm here with you now.` },
    ]);

    const t = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: 2, role: "guide", text: "Tell me your mood and I'll shape tonight for you." },
      ]);
    }, 900);

    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const storedVoice = localStorage.getItem("selectedVoice");
    if (storedVoice) setVoice(storedVoice);
  }, []);

  const playVoice = async (text: string) => {
    try {
      const res = await fetch("/api/preview-voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voice,
          text,
        }),
      });

      if (!res.ok) {
        console.error("Voice API failed");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play();

    } catch (err) {
      console.error("Voice error:", err);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      playVoice("Hello… I'm your guide. Welcome to your dashboard.");
    }, 800);
  }, []);

  return (
    <main className="relative min-h-screen bg-[#07040d] text-white">
      <a href="/" className="fixed left-6 top-5 z-50 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-semibold text-white/75 backdrop-blur-md">← Home</a>

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
        <div className="flex items-start justify-between gap-12">

          {/* LEFT SIDE */}
          <div className="flex-1 max-w-xl">
            <div className="mb-10">
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Pleasure Portal
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-300">
                Choose fantasy audio or create your own fantasy audio.
              </p>
            </div>

            <div className="space-y-6">
              <TileCard tile={fantasyTile} />
              <CreateAudioTile />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-[700px] flex items-start gap-6">

            {/* GUIDE (LEFT) */}
            <img
              src={guideImage}
              className="h-[420px] object-contain"
              alt="Guide"
            />

            {/* CHAT (RIGHT) */}
            <div className="flex-1 rounded-2xl border border-[#1f4f45] bg-[#062f2a] p-4">
              <div className="text-xs tracking-widest text-[#9ed6c7] mb-3">
                GUIDE CHAT
              </div>

              <div className="h-[300px] overflow-y-auto space-y-3 pr-2">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[92%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "ml-auto bg-emerald-200/85 text-black"
                        : "bg-black/35 text-emerald-50"
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>

              <form
                className="mt-4 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const text = draft.trim();
                  if (!text) return;

                  setMessages((prev) => [...prev, { id: Date.now(), role: "user", text }]);
                  setDraft("");

                  setTimeout(() => {
                    setMessages((prev) => [
                      ...prev,
                      {
                        id: Date.now() + 1,
                        role: "guide",
                        text: "I hear you. Stay with me and tell me a little more.",
                      },
                    ]);
                    playVoice("I hear you. Stay with me and tell me more.");
                  }, 450);
                }}
              >
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg bg-[#041f1c] px-3 py-2 text-white outline-none"
                />
                <button type="submit" className="bg-green-500 px-4 rounded-lg text-black font-semibold">
                  Send
                </button>
              </form>
            </div>

          </div>

        </div>
        <audio ref={audioRef} />
      </section>
    </main>
  );
}
