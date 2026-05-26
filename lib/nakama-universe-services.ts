/** Nakama Nights Universe tiles — shared by homepage and live-test nav. */
export const NAKAMA_UNIVERSE_SERVICES = [
  {
    id: "audiobooks",
    title: "AUDIOBOOKS",
    overlayLabel: "Audiobooks",
    description: "Lose yourself in curated fantasy scenes",
    poster: "/tiles/tile1.jpg",
    centerPanel: "fantasy-audio" as const,
  },
  {
    id: "build-adventure",
    title: "BUILD ADVENTURE",
    overlayLabel: "Build adventure",
    description: "Create your own fantasy with tone and heat on your terms",
    poster: "/tiles/tile2.jpg",
  },
  {
    id: "interactive-adventures",
    title: "INTERACTIVE ADVENTURES",
    overlayLabel: "Interactive adventures",
    description: "Control your fantasy as it plays in real time",
    poster: "/tiles/tile3.jpg",
    centerPanel: "create-audio" as const,
  },
  {
    id: "forbidden-chat",
    title: "FORBIDDEN CHAT DESIRES",
    overlayLabel: "Forbidden chat",
    description: "Real time, voice to voice or messaging.",
    poster: "/tiles/tile4.jpg",
  },
  {
    id: "reignite-couples",
    title: "REIGNITE FOR COUPLES",
    overlayLabel: "Reignite for couples",
    description: "Date Night Mode. Surprise Mode. The Reconnection Series.",
    poster: "/tiles/tile5.jpg",
    centerPanel: "couples-program" as const,
  },
  {
    id: "character-voices",
    title: "CHARACTER & VOICES",
    overlayLabel: "Characters & Voices",
    description:
      "Create your character that will always be with you. In the voice you most desire",
    poster: "/tiles/tile6.jpg",
  },
] as const;

export const LIVE_TEST_PROFILE_NAV = {
  id: "profile",
  title: "PROFILE",
  overlayLabel: "Profile",
  description: "Your account, preferences, and membership",
  poster: "/scenes/moor.jpg",
} as const;

/** All seven live-test sidebar items, top to bottom. */
export const LIVE_TEST_NAV_ITEMS = [
  ...NAKAMA_UNIVERSE_SERVICES,
  LIVE_TEST_PROFILE_NAV,
] as const;

export type NakamaUniverseServiceId = (typeof NAKAMA_UNIVERSE_SERVICES)[number]["id"];

export type LiveTestNavId = (typeof LIVE_TEST_NAV_ITEMS)[number]["id"];

export type LiveTestCenterPanel =
  | "dashboard"
  | "fantasy-audio"
  | "create-audio"
  | "couples-program";

export function getLiveTestCenterPanel(navId: LiveTestNavId | null): LiveTestCenterPanel {
  if (navId === "audiobooks") return "fantasy-audio";
  if (navId === "interactive-adventures") return "create-audio";
  if (navId === "reignite-couples") return "couples-program";
  return "dashboard";
}
