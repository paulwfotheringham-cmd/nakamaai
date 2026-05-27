export const FORBIDDEN_CHAT_SETUP_KEY = "nakama_forbidden_chat_setup";

export const EXPERIENCE_LENGTH_OPTIONS = [
  "Quick Escape",
  "Slow Burn",
  "All Night",
  "Ongoing Affair",
] as const;

export const CHAT_MOOD_OPTIONS = [
  "Romantic",
  "Playful",
  "Forbidden",
  "Dominant",
  "Submissive",
  "Teasing",
  "Passionate",
  "Emotional",
  "Dangerous",
  "Luxury",
] as const;

export const SCENARIO_OPTIONS = [
  "Stranger Encounter",
  "Friends to Lovers",
  "Secret Affair",
  "Office Tension",
  "Vacation Fantasy",
  "Late Night Call",
  "Private Driver",
  "VIP Party",
  "Hotel Encounter",
  "Anonymous Chat",
  "Create your own",
  "Alien fantasy",
  "Paranormal and supernatural",
  "Historical",
] as const;

export const CHARACTER_OPTIONS = [
  "Confident Man",
  "Confident Woman",
  "Older Stranger",
  "Best Friend",
  "Mysterious Stranger",
  "Celebrity Type",
  "Protective Type",
  "Boss / Authority",
  "Rival",
  "Experienced Lover",
] as const;

export const INTERACTION_STYLE_OPTIONS = [
  "Sexy Chat",
  "Voice Fantasy",
  "Roleplay Story",
  "Flirty Conversation",
  "Confession Game",
  "Dirty Truth or Dare",
  "Guided Fantasy",
  "Seduction Coaching",
  "Romantic Roleplay",
  "Power Dynamic",
] as const;

export type ChatSetupMode = "guided" | "unfettered";

export type ChatSetupPreferences = {
  mode: ChatSetupMode;
  experienceLength?: string;
  mood?: string;
  scenario?: string;
  customScenario?: string;
  character?: string;
  interactionStyle?: string;
};

export function readForbiddenChatSetup(): ChatSetupPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(FORBIDDEN_CHAT_SETUP_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ChatSetupPreferences;
  } catch {
    return null;
  }
}

export function writeForbiddenChatSetup(prefs: ChatSetupPreferences): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(FORBIDDEN_CHAT_SETUP_KEY, JSON.stringify(prefs));
}

export function buildGuidedStartMessage(prefs: ChatSetupPreferences): string {
  const scenario =
    prefs.scenario === "Create your own" && prefs.customScenario?.trim()
      ? prefs.customScenario.trim()
      : prefs.scenario;

  return [
    "I'd like to start a guided experience with these preferences:",
    `Experience length: ${prefs.experienceLength}`,
    `Mood: ${prefs.mood}`,
    `Scenario: ${scenario}`,
    `Character: ${prefs.character}`,
    `Interaction style: ${prefs.interactionStyle}`,
    "Please begin in character and match this tone.",
  ].join("\n");
}
