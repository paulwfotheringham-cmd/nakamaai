import {
  CHAT_MOOD_OPTIONS,
  CHARACTER_OPTIONS,
  INTERACTION_STYLE_OPTIONS,
  SCENARIO_OPTIONS,
  type ChatSetupPreferences,
} from "@/lib/guides/chat-setup";
import { GUIDE_VOICES } from "@/lib/guides/catalog";

export type MoodTile = {
  value: (typeof CHAT_MOOD_OPTIONS)[number];
  label: string;
  tagline: string;
  image: string;
};

export type ScenarioTile = {
  value: (typeof SCENARIO_OPTIONS)[number];
  label: string;
  tagline: string;
  image: string;
};

export type CharacterTile = {
  value: (typeof CHARACTER_OPTIONS)[number];
  label: string;
  personality: string;
  description: string;
  image: string;
};

export const FORBIDDEN_MOOD_TILES: MoodTile[] = [
  { value: "Playful", label: "Playful", tagline: "Teasing & light", image: "/tiles/lover.jpg" },
  { value: "Forbidden", label: "Forbidden", tagline: "Secret & charged", image: "/tiles/taboo.jpg" },
  { value: "Dominant", label: "Dominant", tagline: "Takes the lead", image: "/tiles/powerplay.jpg" },
  { value: "Romantic", label: "Romantic", tagline: "Slow & intimate", image: "/tiles/slowburn.jpg" },
  { value: "Dangerous", label: "Dangerous", tagline: "Edge & risk", image: "/tiles/vampire.jpg" },
  { value: "Teasing", label: "Teasing", tagline: "Deny & delight", image: "/tiles/voyeur.jpg" },
  { value: "Passionate", label: "Passionate", tagline: "Heat & hunger", image: "/tiles/tile5.jpg" },
  { value: "Luxury", label: "Luxury", tagline: "Velvet & power", image: "/tiles/tile4.jpg" },
];

export const FORBIDDEN_SCENARIO_TILES: ScenarioTile[] = [
  { value: "Office Tension", label: "Office", tagline: "After hours", image: "/scenes/office.jpg" },
  { value: "Historical", label: "Professor", tagline: "Lessons & tension", image: "/scenes/rome.jpg" },
  { value: "Private Driver", label: "Bodyguard", tagline: "Close protection", image: "/tiles/tile2.jpg" },
  { value: "Paranormal and supernatural", label: "Werewolf", tagline: "Moonlit hunger", image: "/scenes/werewolf.jpg" },
  { value: "VIP Party", label: "Billionaire", tagline: "Champagne & power", image: "/tiles/tile4.jpg" },
  { value: "Stranger Encounter", label: "Stranger", tagline: "First glance", image: "/tiles/tile1.jpg" },
  { value: "Hotel Encounter", label: "Hotel", tagline: "Anonymous luxury", image: "/tiles/tile5.jpg" },
  { value: "Late Night Call", label: "Late night", tagline: "Voice only", image: "/tiles/tile3.jpg" },
  { value: "Create your own", label: "Your fantasy", tagline: "Describe it", image: "/tiles/anime.jpg" },
];

export const FORBIDDEN_CHARACTER_TILES: CharacterTile[] = [
  {
    value: "Confident Man",
    label: "Confident man",
    personality: "Assured · direct",
    description: "Knows what he wants and isn't afraid to say it.",
    image: "/tiles/tile2.jpg",
  },
  {
    value: "Confident Woman",
    label: "Confident woman",
    personality: "Bold · magnetic",
    description: "Commands the room — and your attention.",
    image: "/tiles/tile5.jpg",
  },
  {
    value: "Mysterious Stranger",
    label: "Mysterious stranger",
    personality: "Enigmatic · slow reveal",
    description: "Every answer feels like a secret shared.",
    image: "/tiles/vampire.jpg",
  },
  {
    value: "Protective Type",
    label: "Protective type",
    personality: "Steady · intense",
    description: "Guards you — then crosses the line.",
    image: "/tiles/powerplay.jpg",
  },
  {
    value: "Boss / Authority",
    label: "Authority",
    personality: "Power · control",
    description: "Corner office energy. You were summoned.",
    image: "/scenes/office.jpg",
  },
  {
    value: "Experienced Lover",
    label: "Experienced lover",
    personality: "Patient · knowing",
    description: "Has done this before — expertly.",
    image: "/tiles/slowburn.jpg",
  },
];

export const FORBIDDEN_WIZARD_STEPS = [
  { id: "mood", title: "Choose your mood", subtitle: "Set the emotional temperature." },
  { id: "scenario", title: "Choose your scenario", subtitle: "Where does the fantasy begin?" },
  { id: "character", title: "Choose your character", subtitle: "Who are you talking to tonight?" },
  { id: "style", title: "Interaction style", subtitle: "How should this feel?" },
  { id: "voice", title: "Choose your voice", subtitle: "Hear them before you begin." },
] as const;

export function pickSurprisePreferences(preferredVoiceId?: string): ChatSetupPreferences {
  const scenarios = SCENARIO_OPTIONS.filter((s) => s !== "Create your own");
  const voice =
    GUIDE_VOICES.find((v) => v.id === preferredVoiceId) ??
    GUIDE_VOICES[Math.floor(Math.random() * GUIDE_VOICES.length)];

  const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

  return {
    mode: "guided",
    experienceLength: pick(["Quick Escape", "Slow Burn", "All Night"] as const),
    mood: pick(CHAT_MOOD_OPTIONS),
    scenario: pick(scenarios),
    character: pick(CHARACTER_OPTIONS),
    interactionStyle: pick(INTERACTION_STYLE_OPTIONS),
    voiceId: voice.id,
    voiceName: voice.name,
  };
}

export function scenarioLabel(prefs: ChatSetupPreferences): string {
  if (prefs.scenario === "Create your own" && prefs.customScenario?.trim()) {
    return prefs.customScenario.trim();
  }
  const tile = FORBIDDEN_SCENARIO_TILES.find((t) => t.value === prefs.scenario);
  return tile?.label ?? prefs.scenario ?? "Your scene";
}
