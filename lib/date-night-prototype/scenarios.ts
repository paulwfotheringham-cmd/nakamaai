import type { DateNightScenarioConcept } from "./types";

const SCENARIO_POOL: Omit<DateNightScenarioConcept, "id">[] = [
  {
    title: "Robin Hood & Maid Marian",
    description: "A moonlit forest chase ends in a stolen kiss beneath the oaks.",
  },
  {
    title: "Venice After Midnight",
    description: "Gondolas, masked strangers, and a promise made on a deserted bridge.",
  },
  {
    title: "Secret Society",
    description: "Black ties, whispered passwords, and a room where rules dissolve.",
  },
  {
    title: "The Last Letter",
    description: "An old envelope arrives — and every word pulls you closer.",
  },
  {
    title: "Moonlit Train",
    description: "A sleeper car, swaying rails, and nowhere to be until dawn.",
  },
  {
    title: "Hidden Kingdom",
    description: "Palace corridors, forbidden gardens, and a crown you were never meant to wear.",
  },
  {
    title: "Runaway Royalty",
    description: "Luggage by the service door — the city is yours for one reckless night.",
  },
  {
    title: "Lost in Paris",
    description: "Rain on cobblestones, a tiny hotel, and a language only your bodies speak.",
  },
  {
    title: "Desert Oasis",
    description: "Silk tents, starlight, and heat that has nothing to do with the sun.",
  },
  {
    title: "Forbidden Masquerade",
    description: "Gold masks, champagne, and identities revealed one touch at a time.",
  },
  {
    title: "Storm on the Coast",
    description: "A cliffside inn, power out, and the sea pounding like a second heartbeat.",
  },
  {
    title: "The Private Library",
    description: "Leather chairs, locked doors, and stories read aloud in the dark.",
  },
];

function slug(title: string): string {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Fisher-Yates shuffle — returns a new array in random order */
function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function freshScenarioSet(): DateNightScenarioConcept[] {
  return shuffled(SCENARIO_POOL).map((src) => ({
    id: slug(src.title),
    title: src.title,
    description: src.description,
  }));
}
