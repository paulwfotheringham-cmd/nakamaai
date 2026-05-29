"use client";

import {
  readForbiddenChatSetup,
  writeForbiddenChatSetup,
} from "@/lib/guides/chat-setup";
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

  useEffect(() => {
    if (readForbiddenChatSetup()?.mode) {
      setSetupComplete(true);
    }
  }, []);

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
      <div className="forbidden-chat-panel forbidden-chat-panel-setup">
        <ForbiddenChatSetup onComplete={handleSetupComplete} />
      </div>
    );
  }

  return (
    <div className="forbidden-chat-panel forbidden-chat-panel-active">
      <div className="forbidden-chat-active-atmosphere" aria-hidden />

      <header className="forbidden-chat-active-header">
        <p className="forbidden-chat-eyebrow">Forbidden chat</p>
        <h1 className="forbidden-chat-title">Private desires</h1>
        <p className="forbidden-chat-lead">Your scene is live — say what you want.</p>
      </header>

      <div className="forbidden-chat-thread-wrap">
        <div ref={scrollRef} className="forbidden-chat-thread">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`forbidden-chat-bubble-row${msg.role === "user" ? " is-user" : ""}`}
            >
              <div className={`forbidden-chat-bubble forbidden-chat-bubble-${msg.role}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="forbidden-chat-composer">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type your message…"
            className="forbidden-chat-input"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="forbidden-chat-send"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
