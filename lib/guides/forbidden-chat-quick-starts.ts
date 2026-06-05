import type { ChatSetupPreferences } from "@/lib/guides/chat-setup";
import type { ForbiddenMoodId } from "@/lib/guides/forbidden-chat-moods";

export type QuickStartId =
  | "flirt"
  | "company"
  | "distract"
  | "story"
  | "blush"
  | "surprise";

export type QuickStart = {
  id: QuickStartId;
  label: string;
  moodId: ForbiddenMoodId;
  prefs: Omit<ChatSetupPreferences, "mode" | "voiceId" | "voiceName">;
  openings: string[];
};

export const QUICK_STARTS: QuickStart[] = [
  {
    id: "flirt",
    label: "Flirt with me",
    moodId: "playful",
    prefs: {
      experienceLength: "Quick Escape",
      mood: "Playful",
      scenario: "Anonymous Chat",
      character: "Confident Woman",
      interactionStyle: "Sexy Chat",
    },
    openings: [
      "They text first — no hello, just: \"I had a thought about you and couldn't behave.\"",
      "Playful. Direct. Like they've been waiting for you to be awake and available.",
      "You don't have to be clever back. A reaction is enough.",
    ],
  },
  {
    id: "company",
    label: "Keep me company",
    moodId: "comfort-attention",
    prefs: {
      experienceLength: "Ongoing Affair",
      mood: "Emotional",
      scenario: "Late Night Call",
      character: "Protective Type",
      interactionStyle: "Flirty Conversation",
    },
    openings: [
      "It's quiet on your end. On theirs, not demanding — just present.",
      "\"I'm not going anywhere,\" they say. \"You don't have to perform. Just stay.\"",
      "The conversation can be nothing. That's the point.",
    ],
  },
  {
    id: "distract",
    label: "Distract me",
    moodId: "ten-minute-escape",
    prefs: {
      experienceLength: "Quick Escape",
      mood: "Teasing",
      scenario: "Late Night Call",
      character: "Mysterious Stranger",
      interactionStyle: "Sexy Chat",
    },
    openings: [
      "Something pulls you out of your head before you can spiral.",
      "\"Give me ten minutes,\" they say. \"Let me make you forget the rest of tonight.\"",
      "No homework. No choices. Just follow where they lead.",
    ],
  },
  {
    id: "story",
    label: "Tell me a story",
    moodId: "slow-burn",
    prefs: {
      experienceLength: "Slow Burn",
      mood: "Emotional",
      scenario: "Friends to Lovers",
      character: "Confident Man",
      interactionStyle: "Guided Fantasy",
    },
    openings: [
      "\"Close your eyes for a second,\" they murmur.",
      "They begin somewhere small — a hallway, a rain-streaked window, a voice you almost recognize.",
      "You don't need to steer. They're already drawing you in.",
    ],
  },
  {
    id: "blush",
    label: "Make me blush",
    moodId: "romantic-connection",
    prefs: {
      experienceLength: "Slow Burn",
      mood: "Romantic",
      scenario: "Vacation Fantasy",
      character: "Best Friend",
      interactionStyle: "Romantic Roleplay",
    },
    openings: [
      "The message is unfairly specific — something only someone paying attention would notice.",
      "\"I've been thinking about the way you looked at me earlier,\" they write. \"Don't pretend you forgot.\"",
      "Heat rises before you can answer. They know it.",
    ],
  },
  {
    id: "surprise",
    label: "Surprise me",
    moodId: "surprise-me",
    prefs: {
      experienceLength: "Quick Escape",
      mood: "Teasing",
      scenario: "Stranger Encounter",
      character: "Mysterious Stranger",
      interactionStyle: "Flirty Conversation",
    },
    openings: [
      "Your phone lights up with no preview — just an open line waiting.",
      "Wrong time, wrong mood, wrong everything — except it doesn't feel wrong.",
      "Something new is already starting. You only have to stay on the line.",
    ],
  },
];

export function getQuickStartById(id: QuickStartId): QuickStart | undefined {
  return QUICK_STARTS.find((q) => q.id === id);
}
