import {
  getDefaultGuide,
  getGuideById,
  getVoiceById,
  type GuideTone,
  GUIDE_TONES,
} from "@/lib/guides/catalog";

export const GUIDE_PREFS_KEY = "nakama_guide_prefs";

export type GuidePreferences = {
  guideId: string;
  guideName: string;
  simliFaceId: string;
  voiceId: string;
  voiceName: string;
  tone: GuideTone;
  userName: string;
};

export const DEFAULT_USER_NAME = "Jane";

export function defaultGuidePreferences(): GuidePreferences {
  const guide = getDefaultGuide();
  const voice = getVoiceById("donny")!;
  return {
    guideId: guide.id,
    guideName: guide.name,
    simliFaceId: guide.simliFaceId,
    voiceId: voice.id,
    voiceName: voice.name,
    tone: "Relaxed",
    userName: DEFAULT_USER_NAME,
  };
}

export function parseGuidePreferences(raw: string | null): GuidePreferences {
  if (!raw) return defaultGuidePreferences();
  try {
    const data = JSON.parse(raw) as Partial<GuidePreferences>;
    const guide = getGuideById(data.guideId ?? "") ?? getDefaultGuide();
    const voice = getVoiceById(data.voiceId ?? "") ?? getVoiceById("donny")!;
    const tone = GUIDE_TONES.includes((data.tone ?? "") as GuideTone)
      ? (data.tone as GuideTone)
      : "Relaxed";
    return {
      guideId: guide.id,
      guideName: guide.name,
      simliFaceId: guide.simliFaceId,
      voiceId: voice.id,
      voiceName: voice.name,
      tone,
      userName: (data.userName ?? DEFAULT_USER_NAME).trim() || DEFAULT_USER_NAME,
    };
  } catch {
    return defaultGuidePreferences();
  }
}

export function readGuidePreferences(): GuidePreferences {
  if (typeof window === "undefined") return defaultGuidePreferences();
  return parseGuidePreferences(localStorage.getItem(GUIDE_PREFS_KEY));
}

export function writeGuidePreferences(prefs: GuidePreferences): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUIDE_PREFS_KEY, JSON.stringify(prefs));
  localStorage.setItem("selectedGuide", prefs.guideName);
  localStorage.setItem("selectedVoice", prefs.voiceName);
  localStorage.setItem("selectedTone", prefs.tone);
}
