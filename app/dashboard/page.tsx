"use client";

import { useEffect, useState } from "react";
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");

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

  return (
    <main className="relative min-h-screen bg-[#07040d] text-white">
      <a href="/" className="fixed left-6 top-5 z-50 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-semibold text-white/75 backdrop-blur-md">← Home</a>

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
        <div className="flex gap-10">
          <div className="flex-1">
            <div className="mb-10">
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Pleasure Portal
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-300">
                Choose fantasy audio or create your own fantasy audio.
              </p>
            </div>

            <div className="max-w-xl space-y-6">
              <TileCard tile={fantasyTile} />
              <CreateAudioTile />
            </div>
          </div>

          <div className="w-[420px] flex flex-col items-center justify-start gap-6 pt-10">
            <img
              src={guideImage}
              alt="Guide"
              className="h-[400px] object-contain animate-alive"
            />

            <div className="w-full h-[260px] overflow-hidden rounded-xl border border-emerald-300/35 bg-emerald-500/15 backdrop-blur-sm">
              <div className="border-b border-emerald-200/30 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100/90">
                Guide Chat
              </div>
              <div className="flex h-[206px] flex-col gap-3 overflow-y-auto px-4 py-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[92%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "self-end bg-emerald-200/85 text-black"
                        : "bg-black/35 text-emerald-50"
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>
            </div>

            <form
              className="w-full"
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
                }, 450);
              }}
            >
              <div className="flex items-center gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type your message..."
                  className="h-11 w-full rounded-lg border border-emerald-200/30 bg-black/35 px-3 text-sm text-emerald-50 outline-none placeholder:text-emerald-100/45 focus:border-emerald-200/60"
                />
                <button
                  type="submit"
                  className="h-11 shrink-0 rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-black transition hover:bg-emerald-300"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
