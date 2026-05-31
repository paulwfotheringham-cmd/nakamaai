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
  {
    title: "Midnight Rooftop",
    description: "City lights below, jazz through an open door, and nowhere left to hide.",
  },
  {
    title: "Winter Chalet",
    description: "Firelight, fur blankets, and snow sealing the world outside.",
  },
  {
    title: "The Art Collector",
    description: "A private viewing after hours — the masterpiece is watching you.",
  },
  {
    title: "Harbor at Dusk",
    description: "Salt air, rope burns, and a captain who doesn't ask where you're from.",
  },
  {
    title: "Garden of Echoes",
    description: "Overgrown paths, hidden benches, and memories that feel brand new.",
  },
  {
    title: "The Jazz Lounge",
    description: "Smoke, saxophone, and a table reserved for two past closing.",
  },
  {
    title: "Castle by the Lake",
    description: "Stone halls, candle pools, and a key that opens only one door.",
  },
  {
    title: "Neon Afterglow",
    description: "A late-night diner, vinyl booths, and confessions over cold coffee.",
  },
];

let poolOffset = 0;

function slug(title: string, index: number): string {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}-${Date.now()}`;
}

export function generateScenarioSet(count = 12): DateNightScenarioConcept[] {
  const items: DateNightScenarioConcept[] = [];
  for (let i = 0; i < count; i++) {
    const src = SCENARIO_POOL[(poolOffset + i) % SCENARIO_POOL.length];
    items.push({
      id: slug(src.title, poolOffset + i),
      title: src.title,
      description: src.description,
    });
  }
  poolOffset += count;
  return items;
}

export function freshScenarioSet(): DateNightScenarioConcept[] {
  return generateScenarioSet(12);
}
