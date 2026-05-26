"use client";

import { FormEvent, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const WELCOME =
  "Welcome to Forbidden Chat.\n\nThis is a private space for voice and text — tell me what you’re in the mood for, and we’ll take it from there.";

const PLACEHOLDER_REPLY =
  "Thanks for your message. Full Forbidden Chat is coming soon — for now, use your guide on the right or explore another section from the menu.";

export default function LiveTestForbiddenChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", text: WELCOME },
  ]);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    setDraft("");
    const userId = `user-${Date.now()}`;
    const assistantId = `assistant-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", text },
      { id: assistantId, role: "assistant", text: PLACEHOLDER_REPLY },
    ]);

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-amber-900/25 bg-gradient-to-b from-zinc-950/95 to-[#061a1a] shadow-[inset_0_0_60px_rgba(0,0,0,0.25)]">
      <header className="shrink-0 border-b border-stone-800/50 px-3 py-2 sm:px-4 sm:py-2.5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-amber-600/85">
          Forbidden chat
        </p>
        <h1 className="mt-0.5 font-serif text-base font-semibold leading-tight text-white sm:text-lg">
          Private desires
        </h1>
        <p className="mt-1 text-[10px] leading-snug text-stone-400 sm:text-[11px]">
          Real-time chat — voice or messaging. Preview below.
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col p-2 sm:p-3">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-amber-900/30 bg-gradient-to-b from-zinc-900/90 to-black shadow-[0_0_0_1px_rgba(245,158,11,0.06)]">
          <div
            ref={scrollRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "rounded-br-sm border border-amber-500/25 bg-amber-950/50 text-amber-50"
                      : "rounded-bl-sm border border-stone-700/80 bg-black/50 text-stone-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex gap-2 border-t border-stone-800/80 bg-black/40 p-2.5 sm:p-3"
          >
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type your message…"
              className="min-w-0 flex-1 rounded-xl border border-stone-700/80 bg-zinc-950/80 px-3 py-2 text-sm text-white placeholder:text-stone-600 focus:border-amber-500/45 focus:outline-none focus:ring-1 focus:ring-amber-500/25"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="shrink-0 rounded-xl border border-amber-400/40 bg-gradient-to-b from-amber-200 to-amber-600 px-3.5 py-2 text-sm font-semibold text-zinc-950 transition hover:from-amber-100 hover:to-amber-500 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
