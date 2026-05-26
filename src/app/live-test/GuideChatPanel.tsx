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

const MOOD_OPTIONS = [
  "Carry on before",
  "a new adventure",
  "feeling saucy",
  "you choose",
] as const;

const WELCOME_TEXT =
  "Hi Jane, welcome back to Nakama Nights!\n\nWhat kind of mood are you in today?";

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
    { id: "welcome", role: "assistant", text: WELCOME_TEXT },
  ]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [showMoodButtons, setShowMoodButtons] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, showMoodButtons]);

  const submitUserMessage = async (text: string) => {
    if (!text.trim() || sending || isBusy) return;

    setShowMoodButtons(false);
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

  const handleMoodChoice = (choice: string) => {
    void submitUserMessage(choice);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    await submitUserMessage(text);
  };

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-amber-900/30 bg-gradient-to-b from-zinc-900/90 to-black shadow-[0_0_0_1px_rgba(245,158,11,0.06),0_20px_50px_rgba(0,0,0,0.45)] ${className}`}
    >
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[92%] rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-line ${
                msg.role === "user"
                  ? "rounded-br-sm border border-amber-500/25 bg-amber-950/50 text-amber-50"
                  : "rounded-bl-sm border border-stone-700/80 bg-black/50 text-stone-200"
              }`}
            >
              {msg.text || (sending && msg.role === "assistant" ? "…" : "")}
            </div>
          </div>
        ))}

        {showMoodButtons && !sending && (
          <div className="flex flex-wrap gap-2 pt-1">
            {MOOD_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleMoodChoice(opt)}
                disabled={isBusy}
                className="rounded-full border border-amber-500/30 bg-amber-950/40 px-3.5 py-2 text-xs font-semibold text-amber-100 transition hover:border-amber-400/50 hover:bg-amber-900/50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {opt}
              </button>
            ))}
          </div>
        )}
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
