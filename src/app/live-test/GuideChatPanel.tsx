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
  className?: string;
};

export default function GuideChatPanel({
  onSend,
  isBusy,
  className = "",
}: GuideChatPanelProps) {
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
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-amber-900/30 bg-gradient-to-b from-zinc-900/90 to-black shadow-[0_0_0_1px_rgba(245,158,11,0.06),0_20px_50px_rgba(0,0,0,0.45)] ${className}`}
    >
      <div className="border-b border-stone-800/80 px-4 py-3.5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90">
          Guide chat
        </p>
        <p className="mt-1 text-xs text-stone-500">
          Text only — your guide speaks each reply with voice and lip sync.
        </p>
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
                  ? "rounded-br-sm border border-amber-500/25 bg-amber-950/50 text-amber-50"
                  : "rounded-bl-sm border border-stone-700/80 bg-black/50 text-stone-200"
              }`}
            >
              {msg.text || (sending && msg.role === "assistant" ? "…" : "")}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="flex gap-2 border-t border-stone-800/80 bg-black/40 p-3"
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type your message…"
          disabled={sending || isBusy}
          className="min-w-0 flex-1 rounded-xl border border-stone-700/80 bg-zinc-950/80 px-3 py-2.5 text-sm text-white placeholder:text-stone-600 focus:border-amber-500/45 focus:outline-none focus:ring-1 focus:ring-amber-500/25 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!draft.trim() || sending || isBusy}
          className="shrink-0 rounded-xl border border-amber-400/40 bg-gradient-to-b from-amber-200 to-amber-600 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:from-amber-100 hover:to-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {sending || isBusy ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}
