import type { ChatSetupPreferences } from "@/lib/guides/chat-setup";

export type ForbiddenMoodId =
  | "romantic-connection"
  | "forbidden-tension"
  | "confident-energy"
  | "slow-burn"
  | "comfort-attention"
  | "playful"
  | "surprise-me"
  | "ten-minute-escape";

export type ForbiddenMood = {
  id: ForbiddenMoodId;
  label: string;
  /** Short label for compact mood chips */
  chipLabel: string;
  tagline: string;
  image: string;
  prefs: Omit<ChatSetupPreferences, "mode" | "voiceId" | "voiceName">;
  openings: string[][];
};

export const TEN_MINUTE_ESCAPE: ForbiddenMood = {
  id: "ten-minute-escape",
  label: "10 Minute Escape",
  chipLabel: "10 Min Escape",
  tagline: "A short immersive moment — no setup",
  image: "/tiles/tile6.jpg",
  prefs: {
    experienceLength: "Quick Escape",
    mood: "Teasing",
    scenario: "Late Night Call",
    character: "Mysterious Stranger",
    interactionStyle: "Sexy Chat",
  },
  openings: [
    [
      "The room goes quiet except for your breathing.",
      "Someone is already on the line. They do not say hello — they say your name, like they have been waiting.",
      "Ten minutes. That is all they want. They promise it will feel like more.",
    ],
  ],
};

export const TONIGHT_MOODS: ForbiddenMood[] = [
  {
    id: "romantic-connection",
    label: "Romantic Connection",
    chipLabel: "Romantic",
    tagline: "Warm, close, emotionally charged",
    image: "/tiles/lover.jpg",
    prefs: {
      experienceLength: "Slow Burn",
      mood: "Romantic",
      scenario: "Vacation Fantasy",
      character: "Best Friend",
      interactionStyle: "Romantic Roleplay",
    },
    openings: [
      [
        "You notice your phone light up.",
        '"I know it\'s late," the message reads. "But I couldn\'t stop thinking about you."',
        "No pressure to reply. They just want you to know — you are not alone tonight.",
      ],
    ],
  },
  {
    id: "forbidden-tension",
    label: "Forbidden Tension",
    chipLabel: "Forbidden",
    tagline: "High chemistry, dangerous anticipation",
    image: "/tiles/taboo.jpg",
    prefs: {
      experienceLength: "Slow Burn",
      mood: "Forbidden",
      scenario: "Secret Affair",
      character: "Older Stranger",
      interactionStyle: "Guided Fantasy",
    },
    openings: [
      [
        "A message arrives from a number you never saved — and somehow still recognize.",
        "We shouldn't be doing this,\" it says. \"Which is probably why I can't stop.\"",
        "They are not asking for permission. They are asking if you are still awake.",
      ],
    ],
  },
  {
    id: "confident-energy",
    label: "Confident Energy",
    chipLabel: "Confident",
    tagline: "Bold, assured, in control",
    image: "/tiles/powerplay.jpg",
    prefs: {
      experienceLength: "All Night",
      mood: "Dominant",
      scenario: "Office Tension",
      character: "Boss / Authority",
      interactionStyle: "Power Dynamic",
    },
    openings: [
      [
        "Your screen dims — then a single line appears, crisp and unhurried.",
        "I've been patient. Now I want your attention for the next few minutes.",
        "Tell me you're here. Or don't — but we both know you will.",
      ],
    ],
  },
  {
    id: "slow-burn",
    label: "Slow Burn",
    chipLabel: "Slow Burn",
    tagline: "Patient heat that builds slowly",
    image: "/tiles/slowburn.jpg",
    prefs: {
      experienceLength: "Slow Burn",
      mood: "Emotional",
      scenario: "Friends to Lovers",
      character: "Confident Man",
      interactionStyle: "Flirty Conversation",
    },
    openings: [
      [
        "It starts with something small — a song, a memory, a half-finished sentence from earlier.",
        "They pick up the thread like no time passed: \"I've been turning over what you said.\"",
        "Nothing rushed. Just the sense that tonight could go somewhere — if you let it.",
      ],
    ],
  },
  {
    id: "comfort-attention",
    label: "Comfort & Attention",
    chipLabel: "Comfort",
    tagline: "Held, seen, unhurried",
    image: "/tiles/tile4.jpg",
    prefs: {
      experienceLength: "Ongoing Affair",
      mood: "Emotional",
      scenario: "Late Night Call",
      character: "Protective Type",
      interactionStyle: "Flirty Conversation",
    },
    openings: [
      [
        "Soft vibration. No demand — just presence.",
        "Hey. I didn't want anything from you tonight except to check in.",
        "If the day was heavy, stay here a while. They'll match your pace.",
      ],
    ],
  },
  {
    id: "playful",
    label: "Playful",
    chipLabel: "Playful",
    tagline: "Teasing, bright, mischievous",
    image: "/tiles/tile3.jpg",
    prefs: {
      experienceLength: "Quick Escape",
      mood: "Playful",
      scenario: "Anonymous Chat",
      character: "Confident Woman",
      interactionStyle: "Sexy Chat",
    },
    openings: [
      [
        "A notification slides in with a ridiculous emoji and a perfectly straight-faced line underneath.",
        "Be honest — you smiled. I can feel it from here.",
        "They dare you to play along. One message. No stakes. Just fun.",
      ],
    ],
  },
  {
    id: "surprise-me",
    label: "Surprise Me",
    chipLabel: "Surprise Me",
    tagline: "Let tonight choose for you",
    image: "/tiles/vampire.jpg",
    prefs: {
      experienceLength: "Quick Escape",
      mood: "Teasing",
      scenario: "Stranger Encounter",
      character: "Mysterious Stranger",
      interactionStyle: "Flirty Conversation",
    },
    openings: [
      [
        "Your phone buzzes once — then again — like someone testing whether you're still reachable.",
        "Wrong number? Maybe. But the next line doesn't sound like a mistake.",
        "Something new is about to start. You won't know the shape of it until you answer.",
      ],
    ],
  },
];

const SURPRISE_POOL = TONIGHT_MOODS.filter((m) => m.id !== "surprise-me");

export function pickSurpriseMood(): ForbiddenMood {
  return SURPRISE_POOL[Math.floor(Math.random() * SURPRISE_POOL.length)];
}

export function getMoodById(id: ForbiddenMoodId): ForbiddenMood | undefined {
  if (id === "ten-minute-escape") return TEN_MINUTE_ESCAPE;
  return TONIGHT_MOODS.find((m) => m.id === id);
}

/** Fresh adventure: random mood with a rotating opener variant when available */
export function pickNewAdventureMood(): ForbiddenMood {
  const base = pickSurpriseMood();
  return { ...base, id: "surprise-me", label: "New Adventure", chipLabel: "New Adventure" };
}

export function openingLinesForMood(mood: ForbiddenMood, fresh = false): string[] {
  const variants = mood.openings;
  if (!variants.length) return ["Someone is waiting for you."];
  if (fresh && variants.length > 1) {
    return variants[Math.floor(Math.random() * variants.length)];
  }
  return variants[0];
}
