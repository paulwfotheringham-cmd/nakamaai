"use client";

import type { LiveTestNavId } from "@/lib/nakama-universe-services";
import {
  detectGuideChatNavIntent,
  getNavSectionLabel,
} from "@/lib/live-test/chat-nav-intent";
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

type GuideChatPanelProps = {
  onSend: (message: string, handlers: SendHandlers) => Promise<string>;
  onNavigate?: (navId: LiveTestNavId) => void;
  isBusy: boolean;
  className?: string;
  userName?: string;
  guideName?: string;
};

function buildWelcome(userName: string, guideName: string): string {
  return `Hi ${userName}, I'm ${guideName} — welcome back to Nakama Nights!\n\nWhat kind of mood are you in today?`;
}

export default function GuideChatPanel({
  onSend,
  onNavigate,
  isBusy,
  className = "",
  userName = "Jane",
  guideName = "your guide",
}: GuideChatPanelProps) {
  const welcome = buildWelcome(userName, guideName);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", text: welcome },
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

    const navId = detectGuideChatNavIntent(text);
    if (navId && onNavigate) {
      onNavigate(navId);
      setMessages((prev) => [
        ...prev,
        { id: userId, role: "user", text },
        {
          id: assistantId,
          role: "assistant",
          text: `I've opened ${getNavSectionLabel(navId)} for you — take a look in the panel to your left.`,
        },
      ]);
      setSending(false);
      return;
    }

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
    <div className={`launcher-companion flex flex-col ${className}`}>
      <div className="shrink-0 px-4 pt-4 pb-2">
        <p className="launcher-section-label">Companion</p>
        <p className="mt-0.5 font-serif text-sm font-semibold text-stone-200">{guideName}</p>
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-2"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                msg.role === "user"
                  ? "rounded-br-md bg-amber-950/35 text-amber-50/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  : "rounded-bl-md bg-white/[0.04] text-stone-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
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
                className="rounded-full border border-white/[0.06] bg-black/40 px-3.5 py-2 text-xs font-medium text-stone-300 transition-all duration-300 hover:border-amber-900/35 hover:bg-black/55 hover:text-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="flex gap-2 border-t border-white/[0.04] bg-black/30 p-4 backdrop-blur-sm"
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type your message…"
          disabled={sending || isBusy}
          className="launcher-chat-input"
        />
        <button
          type="submit"
          disabled={!draft.trim() || sending || isBusy}
          className="btn-primary shrink-0 px-5 py-2.5"
        >
          {sending || isBusy ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}
