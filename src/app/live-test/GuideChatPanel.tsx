"use client";

import {
  CHARACTER_OPTIONS,
  CHAT_MOOD_OPTIONS,
  EXPERIENCE_LENGTH_OPTIONS,
  INTERACTION_STYLE_OPTIONS,
  SCENARIO_OPTIONS,
  buildGuidedStartMessage,
  readChatSetup,
  writeChatSetup,
  type ChatSetupPreferences,
} from "@/lib/guides/chat-setup";
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
  userName?: string;
  guideName?: string;
};

const SELECT_CLASS =
  "w-full rounded-lg border border-stone-700/80 bg-zinc-950/90 px-2.5 py-2 text-xs text-white focus:border-amber-500/45 focus:outline-none focus:ring-1 focus:ring-amber-500/25 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm";

function buildWelcome(userName: string, guideName: string): string {
  return `Hi ${userName}, I'm ${guideName} — welcome to Nakama Nights.\n\nSet the scene below, or jump straight into open chat.`;
}

function SetupSelect({
  id,
  label,
  value,
  onChange,
  options,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  disabled?: boolean;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-500/90 sm:text-[11px]">
        {label}
      </span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={SELECT_CLASS}
      >
        <option value="">Choose…</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function GuideChatPanel({
  onSend,
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
  const [setupComplete, setSetupComplete] = useState(false);
  const [experienceLength, setExperienceLength] = useState("");
  const [mood, setMood] = useState("");
  const [scenario, setScenario] = useState("");
  const [customScenario, setCustomScenario] = useState("");
  const [character, setCharacter] = useState("");
  const [interactionStyle, setInteractionStyle] = useState("");
  const [setupError, setSetupError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = readChatSetup();
    if (saved?.mode) {
      setSetupComplete(true);
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, setupComplete, scenario]);

  const submitUserMessage = async (text: string) => {
    if (!text.trim() || sending || isBusy) return;

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

  const finishSetup = (prefs: ChatSetupPreferences, assistantNote: string) => {
    writeChatSetup(prefs);
    setSetupComplete(true);
    setSetupError(null);
    setMessages((prev) => [
      ...prev,
      { id: `setup-${Date.now()}`, role: "assistant", text: assistantNote },
    ]);
  };

  const handleUnfettered = () => {
    finishSetup(
      { mode: "unfettered" },
      "You've got an open canvas — no rules, no script. Say anything and we'll go wherever you want.",
    );
  };

  const handleGuidedStart = () => {
    if (!experienceLength || !mood || !scenario || !character || !interactionStyle) {
      setSetupError("Please choose an option for each dropdown.");
      return;
    }
    if (scenario === "Create your own" && !customScenario.trim()) {
      setSetupError("Describe your custom scenario.");
      return;
    }

    const prefs: ChatSetupPreferences = {
      mode: "guided",
      experienceLength,
      mood,
      scenario,
      customScenario: scenario === "Create your own" ? customScenario.trim() : undefined,
      character,
      interactionStyle,
    };

    finishSetup(
      prefs,
      `Perfect — ${experienceLength}, ${mood.toLowerCase()} mood, ${scenario === "Create your own" ? customScenario.trim() : scenario}. Give me a moment to step into character…`,
    );

    void submitUserMessage(buildGuidedStartMessage(prefs));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !setupComplete) return;
    setDraft("");
    await submitUserMessage(text);
  };

  const guidedReady =
    experienceLength &&
    mood &&
    scenario &&
    character &&
    interactionStyle &&
    (scenario !== "Create your own" || customScenario.trim());

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-amber-900/30 bg-gradient-to-b from-zinc-900/90 to-black shadow-[0_0_0_1px_rgba(245,158,11,0.06),0_20px_50px_rgba(0,0,0,0.45)] ${className}`}
    >
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
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

        {!setupComplete && !sending && (
          <div className="space-y-3 rounded-xl border border-amber-900/35 bg-black/40 p-3 sm:p-3.5">
            <button
              type="button"
              onClick={handleUnfettered}
              disabled={isBusy}
              className="w-full rounded-full border border-amber-400/50 bg-gradient-to-b from-amber-200/95 to-amber-600 px-4 py-2.5 text-center text-sm font-bold text-zinc-950 shadow-md shadow-black/30 transition hover:from-amber-100 hover:to-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              I just want an unfettered chat
            </button>

            <p className="text-center text-[10px] font-medium uppercase tracking-[0.14em] text-stone-500">
              or shape your experience
            </p>

            <div className="space-y-2.5">
              <SetupSelect
                id="experience-length"
                label="Choose your experience length"
                value={experienceLength}
                onChange={setExperienceLength}
                options={EXPERIENCE_LENGTH_OPTIONS}
                disabled={isBusy}
              />
              <SetupSelect
                id="chat-mood"
                label="Choose your mood"
                value={mood}
                onChange={setMood}
                options={CHAT_MOOD_OPTIONS}
                disabled={isBusy}
              />
              <SetupSelect
                id="chat-scenario"
                label="Choose your scenario"
                value={scenario}
                onChange={setScenario}
                options={SCENARIO_OPTIONS}
                disabled={isBusy}
              />
              {scenario === "Create your own" && (
                <label htmlFor="custom-scenario" className="block">
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-500/90 sm:text-[11px]">
                    Your scenario
                  </span>
                  <input
                    id="custom-scenario"
                    type="text"
                    value={customScenario}
                    onChange={(e) => setCustomScenario(e.target.value)}
                    placeholder="Describe your scene…"
                    disabled={isBusy}
                    className={SELECT_CLASS}
                  />
                </label>
              )}
              <SetupSelect
                id="chat-character"
                label="Choose your character"
                value={character}
                onChange={setCharacter}
                options={CHARACTER_OPTIONS}
                disabled={isBusy}
              />
              <SetupSelect
                id="interaction-style"
                label="Choose your interaction style"
                value={interactionStyle}
                onChange={setInteractionStyle}
                options={INTERACTION_STYLE_OPTIONS}
                disabled={isBusy}
              />
            </div>

            {setupError && (
              <p className="text-center text-xs text-red-400/90">{setupError}</p>
            )}

            <button
              type="button"
              onClick={handleGuidedStart}
              disabled={isBusy || !guidedReady}
              className="w-full rounded-full border border-stone-500/50 bg-stone-900/80 px-4 py-2.5 text-sm font-semibold text-stone-100 transition hover:border-stone-400 hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Start with these choices
            </button>
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
          placeholder={
            setupComplete ? "Type your message…" : "Complete setup above to chat…"
          }
          disabled={sending || isBusy || !setupComplete}
          className="min-w-0 flex-1 rounded-xl border border-stone-700/80 bg-zinc-950/80 px-3 py-2.5 text-sm text-white placeholder:text-stone-600 focus:border-amber-500/45 focus:outline-none focus:ring-1 focus:ring-amber-500/25 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!draft.trim() || sending || isBusy || !setupComplete}
          className="shrink-0 rounded-xl border border-amber-400/40 bg-gradient-to-b from-amber-200 to-amber-600 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:from-amber-100 hover:to-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {sending || isBusy ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}
