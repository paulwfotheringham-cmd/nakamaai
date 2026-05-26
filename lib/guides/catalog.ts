import { DEFAULT_SIMLI_FACE_ID } from "@/lib/simli/config";

export type GuideGender = "male" | "female";

export type OnboardingGuide = {
  id: string;
  name: string;
  gender: GuideGender;
  simliFaceId: string;
  tagline: string;
};

export type GuideVoice = {
  id: string;
  name: string;
  previewKey: string;
};

export const GUIDE_TONES = ["Relaxed", "Playful", "Intense"] as const;
export type GuideTone = (typeof GUIDE_TONES)[number];

const FACE_MARCUS = "6ebf0aa7-6fed-443d-a4c6-fd1e3080b215";

/** 3 men + 1 woman — Simli face IDs (override via SIMLI_FACE_* env on Vercel). */
export const ONBOARDING_GUIDES: OnboardingGuide[] = [
  {
    id: "frank",
    name: "Frank",
    gender: "male",
    simliFaceId: DEFAULT_SIMLI_FACE_ID,
    tagline: "Warm concierge energy",
  },
  {
    id: "marcus",
    name: "Marcus",
    gender: "male",
    simliFaceId: FACE_MARCUS,
    tagline: "Steady, grounded presence",
  },
  {
    id: "clint",
    name: "Clint",
    gender: "male",
    simliFaceId: DEFAULT_SIMLI_FACE_ID,
    tagline: "Rugged, direct charm",
  },
  {
    id: "sienna",
    name: "Sienna",
    gender: "female",
    simliFaceId: FACE_MARCUS,
    tagline: "Playful, inviting guide",
  },
];

export const GUIDE_VOICES: GuideVoice[] = [
  { id: "donny", name: "Donny — Steady Presence", previewKey: "donny" },
  { id: "clint", name: "Clint — Rugged Actor", previewKey: "clint" },
  { id: "damon", name: "Damon — Commanding Narrator", previewKey: "damon" },
  { id: "cameron", name: "Cameron — Chill Companion", previewKey: "cameron" },
  { id: "alex", name: "Alex — Smooth Operator", previewKey: "alex" },
];

export function getGuideById(id: string): OnboardingGuide | undefined {
  return ONBOARDING_GUIDES.find((g) => g.id === id);
}

export function getDefaultGuide(): OnboardingGuide {
  return ONBOARDING_GUIDES[0];
}

export function getVoiceById(id: string): GuideVoice | undefined {
  return GUIDE_VOICES.find((v) => v.id === id);
}
