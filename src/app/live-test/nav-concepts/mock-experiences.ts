import type { LiveTestNavId } from "@/lib/nakama-universe-services";
import type { NavTarget } from "./nav-destinations";

export type MockExperience = {
  eyebrow: string;
  title: string;
  subtitle: string;
  poster: string;
  posterPosition?: string;
  cta?: string;
  meta?: string;
};

export const MOCK_HUB_EXPERIENCE: MockExperience = {
  eyebrow: "Tonight",
  title: "Pick up where you left off",
  subtitle: "Your guide remembers your mood, your pace, and what you were craving last time.",
  poster: "/scenes/moor.jpg",
  posterPosition: "70% center",
  cta: "Continue Gothic moor",
  meta: "Audiobooks · last played 3 days ago",
};

export const MOCK_EXPERIENCES: Record<Exclude<NavTarget, "home">, MockExperience> = {
  audiobooks: {
    eyebrow: "Audiobooks",
    title: "Windswept moor",
    subtitle: "Rain on stone. A voice at the window. You decide how far the scene goes.",
    poster: "/scenes/moor.jpg",
    posterPosition: "78% center",
    cta: "Resume listening",
    meta: "42 min remaining",
  },
  "build-adventure": {
    eyebrow: "Build adventure",
    title: "Slow burn, corner office",
    subtitle: "Your draft — tone, heat, and pacing tuned to you. One scene from publish.",
    poster: "/scenes/office.jpg",
    posterPosition: "32% center",
    cta: "Open draft",
    meta: "Saved yesterday",
  },
  "interactive-adventures": {
    eyebrow: "Interactive adventures",
    title: "Chapter 2 — the door",
    subtitle: "Real-time choices. The story bends when you speak.",
    poster: "/tiles/tile3.jpg",
    posterPosition: "52% 38%",
    cta: "Continue story",
    meta: "Choice pending",
  },
  "forbidden-chat": {
    eyebrow: "Forbidden chat",
    title: "Private desires",
    subtitle: "Voice to voice or text — intimate, immediate, yours alone.",
    poster: "/tiles/tile4.jpg",
    cta: "Open chat",
    meta: "Guide is listening",
  },
  "reignite-couples": {
    eyebrow: "Reignite for couples",
    title: "Date Night",
    subtitle: "Match a scenario together. Let the night unfold on your terms.",
    poster: "/tiles/tile5.jpg",
    cta: "Start Date Night",
    meta: "Surprise Mode also available",
  },
  "character-voices": {
    eyebrow: "Characters & voices",
    title: "Your cast",
    subtitle: "The voice you chose travels with you — adventures, chat, and audio.",
    poster: "/tiles/tile6.jpg",
    cta: "Edit character",
    meta: "2 voices saved",
  },
  profile: {
    eyebrow: "Profile",
    title: "Membership & settings",
    subtitle: "Account, preferences, and your Nakama Nights membership.",
    poster: "/scenes/moor.jpg",
    posterPosition: "50% 20%",
    cta: "Manage account",
    meta: "Premium member",
  },
};

export function getMockExperience(activeId: LiveTestNavId | null): MockExperience {
  if (activeId === null) return MOCK_HUB_EXPERIENCE;
  return MOCK_EXPERIENCES[activeId];
}
