export const USER_CHARACTERS_KEY = "nakama_user_characters";

export type CharacterGender = "male" | "female" | "nonbinary" | "";

export type UserCharacter = {
  id: string;
  name: string;
  gender: CharacterGender;
  role: string;
  summary: string;
  details: string;
  personality: string;
  boundaries: string;
  gradient: string;
  /** Cinematic portrait for gallery cards */
  portrait?: string;
  /** Experiences where this character appears */
  usedIn?: string[];
  createdAt: number;
  updatedAt: number;
};

const PORTRAIT_POOL = [
  "/scenes/moor.jpg",
  "/scenes/rome.jpg",
  "/scenes/office.jpg",
  "/scenes/werewolf.jpg",
  "/scenes/pirate.jpg",
  "/scenes/alien.jpg",
];

export function pickCharacterPortrait(index: number): string {
  return PORTRAIT_POOL[index % PORTRAIT_POOL.length];
}

export function defaultCharacterUsage(name: string): string[] {
  return [`Available in adventures featuring ${name}`];
}

const GRADIENT_POOL = [
  "linear-gradient(135deg, #7A5C2E 0%, #C9A227 100%)",
  "linear-gradient(135deg, #3D2B5C 0%, #7B4F9E 100%)",
  "linear-gradient(135deg, #2B4A3D 0%, #4F9E7B 100%)",
  "linear-gradient(135deg, #4A2B2B 0%, #9E4F4F 100%)",
  "linear-gradient(135deg, #1E3A5F 0%, #4A7BA7 100%)",
  "linear-gradient(135deg, #5C2E4A 0%, #C94F8A 100%)",
];

export function pickCharacterGradient(index: number): string {
  return GRADIENT_POOL[index % GRADIENT_POOL.length];
}

export const DEFAULT_USER_CHARACTERS: UserCharacter[] = [
  {
    id: "elena",
    name: "Elena",
    gender: "female",
    role: "Romantic lead",
    summary: "Warm, magnetic, and impossible to ignore.",
    details:
      "Elena moves through scenes with quiet confidence — the kind of presence that turns a glance into a promise.",
    personality: "Playful, emotionally attuned, slow-burn romantic.",
    boundaries: "Consent-first; no humiliation or non-consent themes.",
    gradient: GRADIENT_POOL[4],
    portrait: "/scenes/rome.jpg",
    usedIn: ["Private Desires", "The Moor at Midnight"],
    createdAt: 0,
    updatedAt: 0,
  },
  {
    id: "marcus",
    name: "Marcus",
    gender: "male",
    role: "Dominant stranger",
    summary: "Commanding voice, deliberate tension, always in control.",
    details:
      "Marcus speaks sparingly but lands every word — built for power dynamics and charged silence.",
    personality: "Direct, intense, protective when it matters.",
    boundaries: "Hard limits respected; safewords honored without question.",
    gradient: GRADIENT_POOL[1],
    portrait: "/scenes/office.jpg",
    usedIn: ["Build Adventure", "Forbidden Chat"],
    createdAt: 0,
    updatedAt: 0,
  },
  {
    id: "sienna",
    name: "Sienna",
    gender: "female",
    role: "Confidante",
    summary: "Your closest ally — witty, loyal, and a little dangerous.",
    details:
      "Sienna is the friend who knows your secrets and pushes you toward the story you actually want.",
    personality: "Sharp humor, emotional honesty, voyeur-friendly energy.",
    boundaries: "Keeps intimacy between adults; avoids cruelty for shock value.",
    gradient: GRADIENT_POOL[5],
    portrait: "/scenes/werewolf.jpg",
    usedIn: ["Interactive Adventures"],
    createdAt: 0,
    updatedAt: 0,
  },
];

export function createCharacterId(): string {
  return `char_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeCharacter(raw: Partial<UserCharacter>, index: number): UserCharacter | null {
  const name = (raw.name ?? "").trim();
  if (!name) return null;
  const id = (raw.id ?? createCharacterId()).trim() || createCharacterId();
  return {
    id,
    name,
    gender: raw.gender === "male" || raw.gender === "female" || raw.gender === "nonbinary" ? raw.gender : "",
    role: (raw.role ?? "").trim() || "Character",
    summary: (raw.summary ?? "").trim() || "A character in your Nakama Nights cast.",
    details: (raw.details ?? "").trim(),
    personality: (raw.personality ?? "").trim(),
    boundaries: (raw.boundaries ?? "").trim(),
    gradient: raw.gradient?.trim() || pickCharacterGradient(index),
    portrait: typeof raw.portrait === "string" ? raw.portrait.trim() : undefined,
    usedIn: Array.isArray(raw.usedIn)
      ? raw.usedIn.filter((x): x is string => typeof x === "string" && x.trim().length > 0)
      : undefined,
    createdAt: typeof raw.createdAt === "number" ? raw.createdAt : Date.now(),
    updatedAt: typeof raw.updatedAt === "number" ? raw.updatedAt : Date.now(),
  };
}

export function getCharacterUsage(c: UserCharacter): string[] {
  if (c.usedIn?.length) return c.usedIn;
  const preset = DEFAULT_USER_CHARACTERS.find((d) => d.id === c.id)?.usedIn;
  if (preset?.length) return preset;
  return defaultCharacterUsage(c.name);
}

export function parseUserCharacters(raw: string | null): UserCharacter[] {
  if (!raw) return [...DEFAULT_USER_CHARACTERS];
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data) || !data.length) return [...DEFAULT_USER_CHARACTERS];
    const parsed = data
      .map((item, i) => normalizeCharacter(item as Partial<UserCharacter>, i))
      .filter((c): c is UserCharacter => c !== null);
    return parsed.length ? parsed : [...DEFAULT_USER_CHARACTERS];
  } catch {
    return [...DEFAULT_USER_CHARACTERS];
  }
}

export function readUserCharacters(): UserCharacter[] {
  if (typeof window === "undefined") return [...DEFAULT_USER_CHARACTERS];
  return parseUserCharacters(localStorage.getItem(USER_CHARACTERS_KEY));
}

export function writeUserCharacters(characters: UserCharacter[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_CHARACTERS_KEY, JSON.stringify(characters));
}

export function resetUserCharacters(): void {
  writeUserCharacters([...DEFAULT_USER_CHARACTERS]);
}
