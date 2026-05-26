/** Nakama Nights Universe tiles — shared by homepage and live-test nav. */
export const NAKAMA_UNIVERSE_SERVICES = [
  {
    id: "audiobooks",
    title: "AUDIOBOOKS",
    description: "Lose yourself in curated fantasy scenes",
    poster: "/tiles/tile1.jpg",
  },
  {
    id: "build-adventure",
    title: "BUILD ADVENTURE",
    description: "Create your own fantasy with tone and heat on your terms",
    poster: "/tiles/tile2.jpg",
  },
  {
    id: "interactive-adventures",
    title: "INTERACTIVE ADVENTURES",
    description: "Control your fantasy as it plays in real time",
    poster: "/tiles/tile3.jpg",
  },
  {
    id: "forbidden-chat",
    title: "FORBIDDEN CHAT DESIRES",
    description: "Real time, voice to voice or messaging.",
    poster: "/tiles/tile4.jpg",
  },
  {
    id: "reignite-couples",
    title: "REIGNITE FOR COUPLES",
    description: "Date Night Mode. Surprise Mode. The Reconnection Series.",
    poster: "/tiles/tile5.jpg",
  },
  {
    id: "character-voices",
    title: "CHARACTER & VOICES",
    description:
      "Create your character that will always be with you. In the voice you most desire",
    poster: "/tiles/tile6.jpg",
  },
] as const;

export const LIVE_TEST_PROFILE_NAV = {
  id: "profile",
  title: "PROFILE",
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
