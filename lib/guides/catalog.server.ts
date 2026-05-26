import { DEFAULT_SIMLI_FACE_ID } from "@/lib/simli/config";
import { GUIDE_FACE_IDS, type GuideFaceKey } from "@/lib/guides/faces";
import {
  ONBOARDING_GUIDES,
  type OnboardingGuide,
} from "@/lib/guides/catalog";

function envFace(key: string, fallback: string): string {
  const raw = process.env[key]?.trim().replace(/^["']|["']$/g, "");
  return raw || fallback;
}

/** Server-only: optional SIMLI_FACE_* overrides from Vercel env. */
export function getOnboardingGuidesForServer(): OnboardingGuide[] {
  const envByGuide: Record<GuideFaceKey, string> = {
    frank: envFace("SIMLI_FACE_FRANK", GUIDE_FACE_IDS.frank),
    marcus: envFace("SIMLI_FACE_MARCUS", GUIDE_FACE_IDS.marcus),
    clint: envFace("SIMLI_FACE_CLINT", GUIDE_FACE_IDS.clint),
    sienna: envFace("SIMLI_FACE_SIENNA", GUIDE_FACE_IDS.sienna),
  };

  return ONBOARDING_GUIDES.map((guide) => ({
    ...guide,
    simliFaceId: envByGuide[guide.id as GuideFaceKey] ?? DEFAULT_SIMLI_FACE_ID,
  }));
}
