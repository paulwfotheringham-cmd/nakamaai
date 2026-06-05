import type { ChatSetupPreferences } from "@/lib/guides/chat-setup";
import type { ForbiddenMoodId } from "@/lib/guides/forbidden-chat-moods";

export const FORBIDDEN_CHAT_SESSION_KEY = "nakama_forbidden_chat_last";

export type ForbiddenChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export type ForbiddenChatSession = {
  title: string;
  /** One-line reminder of where the scene left off */
  sceneReminder?: string;
  moodId?: ForbiddenMoodId;
  prefs: ChatSetupPreferences;
  messages: ForbiddenChatMessage[];
  updatedAt: number;
};

const DEFAULT_RESUME: ForbiddenChatSession = {
  title: "Private Desires",
  sceneReminder:
    "They had just asked what you wanted tonight — the message still glows on your screen, unanswered.",
  moodId: "comfort-attention",
  prefs: {
    mode: "guided",
    experienceLength: "Ongoing Affair",
    mood: "Passionate",
    scenario: "Anonymous Chat",
    character: "Mysterious Stranger",
    interactionStyle: "Sexy Chat",
    voiceId: "leo",
    voiceName: "Leo",
  },
  messages: [
    {
      id: "resume-1",
      role: "assistant",
      text: "You left mid-sentence last time. They noticed.",
    },
    {
      id: "resume-2",
      role: "assistant",
      text: "I saved your place. Say the word and we pick up exactly where the heat stopped.",
    },
  ],
  updatedAt: Date.now() - 3600_000,
};

export function readForbiddenChatSession(): ForbiddenChatSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(FORBIDDEN_CHAT_SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as ForbiddenChatSession;
    if (!data?.messages?.length || !data.prefs) return null;
    return data;
  } catch {
    return null;
  }
}

export function writeForbiddenChatSession(session: ForbiddenChatSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    FORBIDDEN_CHAT_SESSION_KEY,
    JSON.stringify({ ...session, updatedAt: Date.now() }),
  );
}

export function getContinueLastSession(): ForbiddenChatSession {
  return readForbiddenChatSession() ?? DEFAULT_RESUME;
}

export function hasSavedSession(): boolean {
  return readForbiddenChatSession() !== null;
}

export function messagesFromOpenings(lines: string[]): ForbiddenChatMessage[] {
  return lines.map((text, i) => ({
    id: `open-${Date.now()}-${i}`,
    role: "assistant" as const,
    text,
  }));
}

/** Short hook for Continue Last Story from the latest assistant line */
export function deriveSceneReminder(messages: ForbiddenChatMessage[]): string | undefined {
  const assistant = [...messages].reverse().find((m) => m.role === "assistant");
  if (!assistant?.text.trim()) return undefined;
  const line = assistant.text.split("\n").find((l) => l.trim())?.trim() ?? assistant.text.trim();
  if (line.length <= 110) return line;
  return `${line.slice(0, 107)}…`;
}

export function sceneReminderFromOpenings(lines: string[]): string {
  return deriveSceneReminder(messagesFromOpenings(lines)) ?? lines[0] ?? "";
}
