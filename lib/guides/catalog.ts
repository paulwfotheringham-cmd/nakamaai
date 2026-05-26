import { GUIDE_FACE_IDS } from "@/lib/guides/faces";

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

/** 3 men + 1 woman — each with a unique Simli faceId (static, client-safe). */
export const ONBOARDING_GUIDES: OnboardingGuide[] = [
  {
    id: "frank",
    name: "Frank",
    gender: "male",
    simliFaceId: GUIDE_FACE_IDS.frank,
    tagline: "Warm concierge energy",
  },
  {
    id: "marcus",
    name: "Marcus",
    gender: "male",
    simliFaceId: GUIDE_FACE_IDS.marcus,
    tagline: "Steady, grounded presence",
  },
  {
    id: "clint",
    name: "Clint",
    gender: "male",
    simliFaceId: GUIDE_FACE_IDS.clint,
    tagline: "Rugged, direct charm",
  },
  {
    id: "sienna",
    name: "Sienna",
    gender: "female",
    simliFaceId: GUIDE_FACE_IDS.sienna,
    tagline: "Playful, inviting guide",
  },
];

export function getOnboardingGuides(): OnboardingGuide[] {
  return ONBOARDING_GUIDES;
}

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
