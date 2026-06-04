export type NarratorVoice = {
  id: string;
  name: string;
  tagline: string;
  gender: "male" | "female";
  image: string;
  /** Passed to /api/preview-voice as `voice`. */
  previewName: string;
  /** Stored in guide preferences via writeGuidePreferences. */
  guideVoiceId: string;
  guideVoiceName: string;
};

export const NARRATOR_VOICES: NarratorVoice[] = [
  {
    id: "leo",
    name: "Leo",
    tagline: "Deep, smouldering and commanding.",
    gender: "male",
    image: "/guides/imageedit_14_7182524648.png",
    previewName: "Leo",
    guideVoiceId: "damon",
    guideVoiceName: "Damon — Commanding Narrator",
  },
  {
    id: "ash",
    name: "Ash",
    tagline: "Warm, intimate and magnetic.",
    gender: "male",
    image: "/guides/imageedit_15_8566388634.png",
    previewName: "Ash",
    guideVoiceId: "donny",
    guideVoiceName: "Donny — Steady Presence",
  },
  {
    id: "aurora",
    name: "Aurora",
    tagline: "Velvet tone. Effortlessly seductive.",
    gender: "female",
    image: "/guides/imageedit_17_9927503197.png",
    previewName: "Aurora",
    guideVoiceId: "alex",
    guideVoiceName: "Alex — Smooth Operator",
  },
  {
    id: "nova",
    name: "Nova",
    tagline: "Crisp, confident and powerfully present.",
    gender: "female",
    image: "/guides/imageedit_19_7924513571.png",
    previewName: "Nova",
    guideVoiceId: "cameron",
    guideVoiceName: "Cameron — Chill Companion",
  },
];

export function narratorFromGuideVoiceId(voiceId: string): NarratorVoice | undefined {
  return NARRATOR_VOICES.find((v) => v.guideVoiceId === voiceId);
}
