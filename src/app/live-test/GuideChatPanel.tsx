"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export type SendHandlers = {
  onDelta: (text: string) => void;
};

type GuideChatPanelProps = {
  onSend: (message: string, handlers: SendHandlers) => Promise<string>;
  isBusy: boolean;
};

export default function GuideChatPanel({ onSend, isBusy }: GuideChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hello — I'm your Nakama Nights concierge. Type a message and I'll reply with voice and lip sync.",
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
    if (!text || sending || isBusy) return;

    setDraft("");
    setSending(true);
    const userId = `user-${Date.now()}`;
    const assistantId = `assistant-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", text },
      { id: assistantId, role: "assistant", text: "" },
    ]);

    try {
      const reply = await onSend(text, {
        onDelta: (partial) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, text: partial } : m)),
          );
        },
      });

      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, text: reply } : m)),
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, text: msg } : m)),
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[min(78vh,720px)] flex-col rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/90">Guide chat</p>
        <p className="mt-1 text-xs text-zinc-500">Text only — no microphone. Avatar speaks GPT replies.</p>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[92%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "rounded-br-sm bg-emerald-500/15 text-zinc-200 ring-1 ring-emerald-500/20"
                  : "rounded-bl-sm bg-white/5 text-zinc-300 ring-1 ring-white/10"
              }`}
            >
              {msg.text || (sending && msg.role === "assistant" ? "…" : "")}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="flex gap-2 border-t border-white/10 p-3">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type your message…"
          disabled={sending || isBusy}
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!draft.trim() || sending || isBusy}
          className="shrink-0 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {sending || isBusy ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}
