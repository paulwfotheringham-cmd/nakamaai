import type { DateNightScenarioConcept } from "./types";

export function findBestMatch(
  scenarios: DateNightScenarioConcept[],
  creatorRatings: Record<string, number>,
  partnerRatings: Record<string, number>,
): DateNightScenarioConcept {
  let best = scenarios[0];
  let bestScore = -1;
  const tied: DateNightScenarioConcept[] = [];

  for (const s of scenarios) {
    const score = (creatorRatings[s.id] ?? 0) + (partnerRatings[s.id] ?? 0);
    if (score > bestScore) {
      bestScore = score;
      best = s;
      tied.length = 0;
      tied.push(s);
    } else if (score === bestScore) {
      tied.push(s);
    }
  }

  if (tied.length > 1) {
    return tied[Math.floor(Math.random() * tied.length)];
  }
  return best;
}
