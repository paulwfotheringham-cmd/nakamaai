"use client";

import { writeForbiddenChatSetup } from "@/lib/guides/chat-setup";
import {
  readGuidePreferences,
  writeGuidePreferences,
} from "@/lib/guides/preferences";
import { FormEvent, useEffect, useRef, useState } from "react";
import ForbiddenChatSetup, {
  type ForbiddenChatSetupResult,
} from "./ForbiddenChatSetup";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const PLACEHOLDER_REPLY =
  "Thanks for your message. Full Forbidden Chat is coming soon — for now, use your guide on the right or explore another section from the menu.";

export default function LiveTestForbiddenChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [setupComplete, setSetupComplete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Always show setup on entry — do not auto-resume from saved prefs

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, setupComplete]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  const handleSetupComplete = (result: ForbiddenChatSetupResult) => {
    writeForbiddenChatSetup(result.prefs);
    if (result.prefs.voiceId && result.prefs.voiceName) {
      const guidePrefs = readGuidePreferences();
      writeGuidePreferences({
        ...guidePrefs,
        voiceId: result.prefs.voiceId,
        voiceName: result.prefs.voiceName,
      });
    }
    setSetupComplete(true);

    const next: ChatMessage[] = [
      { id: `setup-${Date.now()}`, role: "assistant", text: result.assistantNote },
    ];

    if (result.userMessage) {
      next.unshift({
        id: `user-setup-${Date.now()}`,
        role: "user",
        text: result.userMessage,
      });
    }

    setMessages((prev) => [...prev, ...next]);
    scrollToBottom();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !setupComplete) return;

    setDraft("");
    const userId = `user-${Date.now()}`;
    const assistantId = `assistant-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", text },
      { id: assistantId, role: "assistant", text: PLACEHOLDER_REPLY },
    ]);

    scrollToBottom();
  };

  if (!setupComplete) {
    return (
      <div className="fc-shell">
        <ForbiddenChatSetup onComplete={handleSetupComplete} />
      </div>
    );
  }

  return (
    <div className="launcher-panel fc-active">
      <header className="launcher-panel-header fc-active-header">
        <p className="launcher-eyebrow">Forbidden chat</p>
        <h1 className="launcher-title">Private desires</h1>
        <p className="launcher-subtitle">Your scene is live — say what you want.</p>
      </header>

      <div className="fc-active-body">
        <div ref={scrollRef} className="fc-thread">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`fc-bubble-row${msg.role === "user" ? " is-user" : ""}`}
            >
              <div className={`fc-bubble fc-bubble-${msg.role}`}>{msg.text}</div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="fc-composer">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type your message…"
            className="launcher-chat-input"
          />
          <button type="submit" disabled={!draft.trim()} className="btn-primary shrink-0 px-5 py-2.5">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
