"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CreateAudioTile from "./CreateAudioTile";
import GuideHead3D from "../../components/GuideHead3D";

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

type Stage = "intro" | "mood" | "chat";

const fantasyTile: Tile = {
  title: "Choose fantasy Audio",
  description: "Browse and begin your next immersive audio experience.",
  href: "/fantasy-audio",
  icon: "📚",
  cta: "Browse Library",
};

const introOptions = ["Great", "So so", "Nah not for me"] as const;
const moodOptions = [
  "Something new",
  "Something familiar",
  "Continue something",
  "Deep / immersive",
  "I'll select myself",
] as const;

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
  const [voice, setVoice] = useState("Donny - Steady Presence");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState<Stage>("intro");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speakingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleSpeakingStop = (text: string) => {
    if (speakingTimerRef.current) {
      clearTimeout(speakingTimerRef.current);
    }

    // Keep mouth animation visible even when autoplay/voice playback is blocked.
    const ms = Math.min(7000, Math.max(1200, text.length * 55));
    speakingTimerRef.current = setTimeout(() => {
      setIsSpeaking(false);
      speakingTimerRef.current = null;
    }, ms);
  };

  const speak = async (text: string) => {
    setIsSpeaking(true);
    scheduleSpeakingStop(text);

    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

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
        // Fallback so the demo still speaks if TTS API fails.
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
          if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current);
          setIsSpeaking(false);
        };
        utterance.onerror = () => {
          if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current);
          setIsSpeaking(false);
        };
        speechSynthesis.speak(utterance);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const audio = audioRef.current;
      if (!audio) {
        setIsSpeaking(false);
        return;
      }

      audio.onended = () => {
        if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current);
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current);
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
      };

      audio.src = url;
      await audio.play();
    } catch {
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    return () => {
      if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const storedVoice = localStorage.getItem("selectedVoice");
    if (storedVoice) setVoice(storedVoice);

    const userName = localStorage.getItem("userName") || "Crystal";
    const opener =
      `Hi ${userName}, nice to see you here again - been a while - I think last time was when you gave being romanced by a pirate a go- how did it go?`;

    setMessages([{ id: 1, role: "assistant", content: opener }]);

    const t = setTimeout(() => {
      void speak(opener);
    }, 500);

    return () => clearTimeout(t);
  }, []);

  const handleIntroChoice = (choice: (typeof introOptions)[number]) => {
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", content: choice }]);

    const follow = "Whats your mood today?";
    setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", content: follow }]);
    setStage("mood");
    void speak(follow);
  };

  const handleMoodChoice = (choice: (typeof moodOptions)[number]) => {
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", content: choice }]);

    const follow = "Perfect. Tell me what you want right now, and I'll shape it with you.";
    setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", content: follow }]);
    setStage("chat");
    void speak(follow);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    const userMessage = { id: Date.now(), role: "user", content: userText } as const;
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userText }),
    });

    const data = await res.json();
    const reply =
      (typeof data?.reply === "string" && data.reply.trim()) ||
      "I'm here with you. Tell me what you need.";

    const botMessage = { id: Date.now() + 1, role: "assistant", content: reply } as const;
    setMessages((prev) => [...prev, botMessage]);

    void speak(reply);
  };

  return (
    <main className="relative min-h-screen bg-[#07040d] text-white">
      <a
        href="/"
        className="fixed left-6 top-5 z-50 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-semibold text-white/75 backdrop-blur-md"
      >
        ← Home
      </a>

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
        <div className="flex items-start justify-between gap-12">
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

          <div className="w-[700px] flex items-start gap-6">
            <GuideHead3D isSpeaking={isSpeaking} />

            <div className="flex-1 rounded-2xl border border-[#1f4f45] bg-[#062f2a] p-4">
              <div className="mb-3 text-xs tracking-widest text-[#9ed6c7]">GUIDE CHAT</div>

              <div className="h-[300px] overflow-y-auto space-y-3 pr-2">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[92%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                      m.role === "user" ? "ml-auto bg-emerald-200/85 text-black" : "bg-black/35 text-emerald-50"
                    }`}
                  >
                    {m.content}
                  </div>
                ))}

                {stage === "intro" && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {introOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleIntroChoice(opt)}
                        className="rounded-full border border-emerald-200/30 bg-emerald-400/20 px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-300/30"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {stage === "mood" && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {moodOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleMoodChoice(opt)}
                        className="rounded-full border border-emerald-200/30 bg-[#0b3f37] px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:bg-[#0f5248]"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
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
                  disabled={stage !== "chat"}
                />
                <button
                  type="submit"
                  className="rounded-lg bg-green-500 px-4 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={stage !== "chat"}
                >
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
