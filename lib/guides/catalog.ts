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

/** Verified distinct Simli preset faces (override per guide via env on Vercel). */
const FACE_MARCUS = "6ebf0aa7-6fed-443d-a4c6-fd1e3080b215";
const FACE_CLINT = "0f0e5f59-2e42-4f5e-9f3d-8b2c4d6e8f0a";
const FACE_SIENNA = "7c9e6679-7425-40de-944b-e07fc1f90ae7";

function envFace(key: string, fallback: string): string {
  const raw = process.env[key]?.trim().replace(/^["']|["']$/g, "");
  return raw || fallback;
}

/** 3 men + 1 woman — each with a unique Simli faceId. */
export function getOnboardingGuides(): OnboardingGuide[] {
  return [
    {
      id: "frank",
      name: "Frank",
      gender: "male",
      simliFaceId: envFace("SIMLI_FACE_FRANK", DEFAULT_SIMLI_FACE_ID),
      tagline: "Warm concierge energy",
    },
    {
      id: "marcus",
      name: "Marcus",
      gender: "male",
      simliFaceId: envFace("SIMLI_FACE_MARCUS", FACE_MARCUS),
      tagline: "Steady, grounded presence",
    },
    {
      id: "clint",
      name: "Clint",
      gender: "male",
      simliFaceId: envFace("SIMLI_FACE_CLINT", FACE_CLINT),
      tagline: "Rugged, direct charm",
    },
    {
      id: "sienna",
      name: "Sienna",
      gender: "female",
      simliFaceId: envFace("SIMLI_FACE_SIENNA", FACE_SIENNA),
      tagline: "Playful, inviting guide",
    },
  ];
}

/** @deprecated use getOnboardingGuides() — kept for static imports */
export const ONBOARDING_GUIDES: OnboardingGuide[] = getOnboardingGuides();

export const GUIDE_VOICES: GuideVoice[] = [
  { id: "donny", name: "Donny — Steady Presence", previewKey: "donny" },
  { id: "clint", name: "Clint — Rugged Actor", previewKey: "clint" },
  { id: "damon", name: "Damon — Commanding Narrator", previewKey: "damon" },
  { id: "cameron", name: "Cameron — Chill Companion", previewKey: "cameron" },
  { id: "alex", name: "Alex — Smooth Operator", previewKey: "alex" },
];

export function getGuideById(id: string): OnboardingGuide | undefined {
  return getOnboardingGuides().find((g) => g.id === id);
}

export function getDefaultGuide(): OnboardingGuide {
  return getOnboardingGuides()[0];
}

export function getVoiceById(id: string): GuideVoice | undefined {
  return GUIDE_VOICES.find((v) => v.id === id);
}
