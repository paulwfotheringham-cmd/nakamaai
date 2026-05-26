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

/** Simli preset faces verified via compose/token (not INVALID_FACE_ID). */
const FACE_MARCUS = "6ebf0aa7-6fed-443d-a4c6-fd1e3080b215";
const FACE_CLINT = "101bef0d-b62d-4fbe-a6b4-89bc3fc66ec6";
const FACE_SIENNA = "4145d354-fd78-4c29-b6b1-0663a04e8d7b";

function envFace(key: string, fallback: string): string {
  const raw = process.env[key]?.trim().replace(/^["']|["']$/g, "");
  return raw || fallback;
}

/** 3 men + 1 woman — each with a unique, API-valid Simli faceId. */
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

/** @deprecated use getOnboardingGuides() */
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
