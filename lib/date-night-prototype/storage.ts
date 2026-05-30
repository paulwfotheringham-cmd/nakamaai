import {
  DATE_NIGHT_SESSION_KEY,
  DATE_NIGHT_SHARED_STORIES_KEY,
  DATE_NIGHT_TUTORIAL_KEY,
  MOCK_FEMALE_VOICES,
  MOCK_MALE_VOICES,
  STORY_DURATION_SEC,
} from "./constants";
import { freshScenarioSet } from "./scenarios";
import type { DateNightSession, SharedDateNightStory } from "./types";

export function isTutorialDismissed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DATE_NIGHT_TUTORIAL_KEY) === "1";
}

export function dismissTutorial(permanent: boolean): void {
  if (typeof window === "undefined") return;
  if (permanent) localStorage.setItem(DATE_NIGHT_TUTORIAL_KEY, "1");
}

export function readActiveSession(): DateNightSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DATE_NIGHT_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DateNightSession;
  } catch {
    return null;
  }
}

export function writeActiveSession(session: DateNightSession | null): void {
  if (typeof window === "undefined") return;
  if (!session) {
    localStorage.removeItem(DATE_NIGHT_SESSION_KEY);
    return;
  }
  localStorage.setItem(DATE_NIGHT_SESSION_KEY, JSON.stringify(session));
}

export function createNewSession(): DateNightSession {
  return {
    id: `dn-${Date.now()}`,
    createdAt: Date.now(),
    step: "ratings",
    scenarios: freshScenarioSet(),
    creatorRatings: {},
    partnerRatings: {},
    partnerUsername: "",
    inviteStatus: "idle",
    matchedScenario: null,
    friendlyName: "",
    maleVoice: MOCK_MALE_VOICES[0],
    femaleVoice: MOCK_FEMALE_VOICES[0],
    mood: "Romantic",
    storyGenerated: false,
    playback: { playing: false, timeRemainingSec: STORY_DURATION_SEC },
  };
}

export function readSharedStories(): SharedDateNightStory[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DATE_NIGHT_SHARED_STORIES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SharedDateNightStory[];
  } catch {
    return [];
  }
}

export function writeSharedStories(stories: SharedDateNightStory[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DATE_NIGHT_SHARED_STORIES_KEY, JSON.stringify(stories));
}

export function upsertSharedStory(story: SharedDateNightStory): void {
  const list = readSharedStories();
  const idx = list.findIndex((s) => s.id === story.id);
  if (idx >= 0) list[idx] = story;
  else list.unshift(story);
  writeSharedStories(list);
}

export function deleteSharedStory(id: string): void {
  writeSharedStories(readSharedStories().filter((s) => s.id !== id));
}
