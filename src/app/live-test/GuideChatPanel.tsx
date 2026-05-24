"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

export type GuideChatMessage = {
  id: string;
  role: "guide";
  text: string;
};

type GuideChatPanelProps = {
  onSpeak: (text: string) => Promise<void>;
  isSpeaking: boolean;
};

export default function GuideChatPanel({ onSpeak, isSpeaking }: GuideChatPanelProps) {
  const [messages, setMessages] = useState<GuideChatMessage[]>([
    {
      id: "welcome",
      role: "guide",
      text: "Hello I am your avatar AI guide this is a test",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending || isSpeaking) return;

    setDraft("");
    setSending(true);
    const id = `msg-${Date.now()}`;
    setMessages((prev) => [...prev, { id, role: "guide", text }]);

    try {
      await onSpeak(text);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-4 flex flex-col rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/90">Guide chat</p>
        <p className="mt-1 text-xs text-zinc-500">You act as the guide — type a line and the avatar speaks it.</p>
      </div>

      <div ref={scrollRef} className="max-h-48 space-y-3 overflow-y-auto px-4 py-3">
        {messages.map((msg) => (
          <div key={msg.id} className="flex justify-end">
            <div className="max-w-[92%] rounded-xl rounded-br-sm bg-emerald-500/15 px-3 py-2 text-sm leading-relaxed text-zinc-200 ring-1 ring-emerald-500/20">
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="flex gap-2 border-t border-white/10 p-3">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type as the guide…"
          disabled={sending || isSpeaking}
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!draft.trim() || sending || isSpeaking}
          className="shrink-0 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {sending || isSpeaking ? "Speaking…" : "Send"}
        </button>
      </form>
    </div>
  );
}
