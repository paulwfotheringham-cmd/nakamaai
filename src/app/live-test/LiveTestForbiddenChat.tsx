"use client";

import { writeForbiddenChatSetup } from "@/lib/guides/chat-setup";
import {
  writeForbiddenChatSession,
  type ForbiddenChatMessage,
} from "@/lib/guides/forbidden-chat-session";
import type { ForbiddenMoodId } from "@/lib/guides/forbidden-chat-moods";
import {
  readGuidePreferences,
  writeGuidePreferences,
} from "@/lib/guides/preferences";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import ForbiddenChatSetup, {
  type ForbiddenChatSetupResult,
} from "./ForbiddenChatSetup";

const PLACEHOLDER_REPLY =
  "Thanks for your message. Full Forbidden Chat is coming soon — for now, keep going and your companion will meet you there.";

export default function LiveTestForbiddenChat() {
  const [messages, setMessages] = useState<ForbiddenChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [inChat, setInChat] = useState(false);
  const [chatTitle, setChatTitle] = useState("Forbidden Chat");
  const sessionRef = useRef<{
    title: string;
    moodId?: ForbiddenMoodId;
    prefs: ForbiddenChatSetupResult["prefs"];
  } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const persistSession = useCallback((nextMessages: ForbiddenChatMessage[]) => {
    const s = sessionRef.current;
    if (!s) return;
    writeForbiddenChatSession({
      title: s.title,
      moodId: s.moodId,
      prefs: s.prefs,
      messages: nextMessages,
      updatedAt: Date.now(),
    });
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, inChat]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  const handleStart = (result: ForbiddenChatSetupResult) => {
    writeForbiddenChatSetup(result.prefs);
    if (result.prefs.voiceId && result.prefs.voiceName) {
      const guidePrefs = readGuidePreferences();
      writeGuidePreferences({
        ...guidePrefs,
        voiceId: result.prefs.voiceId,
        voiceName: result.prefs.voiceName,
      });
    }

    const initial = result.resumeMessages?.length
      ? result.resumeMessages
      : result.openingMessages;

    sessionRef.current = {
      title: result.title,
      moodId: result.moodId,
      prefs: result.prefs,
    };
    setChatTitle(result.title);
    setMessages(initial);
    setInChat(true);
    writeForbiddenChatSession({
      title: result.title,
      moodId: result.moodId,
      prefs: result.prefs,
      messages: initial,
      updatedAt: Date.now(),
    });
    scrollToBottom();
  };

  const handleBackToLanding = () => {
    setInChat(false);
    setMessages([]);
    setDraft("");
    sessionRef.current = null;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !inChat) return;

    setDraft("");
    const userId = `user-${Date.now()}`;
    const assistantId = `assistant-${Date.now()}`;

    setMessages((prev) => {
      const next = [
        ...prev,
        { id: userId, role: "user" as const, text },
        { id: assistantId, role: "assistant" as const, text: PLACEHOLDER_REPLY },
      ];
      persistSession(next);
      return next;
    });

    scrollToBottom();
  };

  if (!inChat) {
    return (
      <div className="fc-shell">
        <ForbiddenChatSetup onComplete={handleStart} />
      </div>
    );
  }

  return (
    <div className="launcher-panel fc-active">
      <header className="launcher-panel-header fc-active-header">
        <button type="button" className="fc-back-link" onClick={handleBackToLanding}>
          ← Moods
        </button>
        <p className="launcher-eyebrow">Forbidden chat</p>
        <h1 className="launcher-title">{chatTitle}</h1>
        <p className="launcher-subtitle">You&apos;re in the scene — reply when you&apos;re ready.</p>
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
