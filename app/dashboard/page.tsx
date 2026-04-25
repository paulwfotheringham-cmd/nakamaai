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
  role: "assistant" | "user";
  content: string;
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("selectedGuide");
    if (stored) setGuideImage(`/guides/${stored}`);

    const userName = localStorage.getItem("userName") || "there";
    setMessages([
      { id: 1, role: "assistant", content: `Hello ${userName}... I'm here with you now.` },
    ]);
    speak(`Hello ${userName}... I'm here with you now.`);
  }, []);

  useEffect(() => {
    const storedVoice = localStorage.getItem("selectedVoice");
    if (storedVoice) setVoice(storedVoice);
  }, []);

  const speak = async (text: string) => {
    setIsSpeaking(true);

    const res = await fetch("/api/preview-voice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        voice: localStorage.getItem("selectedVoice"),
        text,
      }),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const audio = new Audio(url);

    audio.onended = () => {
      setIsSpeaking(false);
    };

    audio.play();
  };

  useEffect(() => {
    setTimeout(() => {
      speak("Hello… I'm your guide. Welcome to your dashboard.");
    }, 800);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: "user", content: input } as const;

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    console.log("SENDING:", input);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    const botMessage = { id: Date.now() + 1, role: "assistant", content: data.reply } as const;

    setMessages((prev) => [...prev, botMessage]);

    speak(data.reply);
  };

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
              className={`h-[420px] object-contain transition-all duration-200 ${
                isSpeaking
                  ? "scale-105 -translate-y-2 drop-shadow-[0_0_30px_rgba(0,255,180,0.6)]"
                  : "opacity-90"
              }`}
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
                    {m.content}
                  </div>
                ))}
              </div>

              <form
                className="mt-4 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void sendMessage();
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
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
