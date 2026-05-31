// picsum.photos/seed/{seed}/480/260 — free, no API key, consistent per seed
const picsumSrc = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/480/260`;

const SCENARIO_IMAGES: Record<string, string> = {
  "Robin Hood & Maid Marian":  picsumSrc("dn-forest-midnight"),
  "Venice After Midnight":     picsumSrc("dn-venice-canal"),
  "Secret Society":            picsumSrc("dn-masquerade-ballroom"),
  "The Last Letter":           picsumSrc("dn-candlelight-letter"),
  "Moonlit Train":             picsumSrc("dn-sleeper-train"),
  "Hidden Kingdom":            picsumSrc("dn-castle-dusk"),
  "Runaway Royalty":           picsumSrc("dn-cobblestone-royal"),
  "Lost in Paris":             picsumSrc("dn-paris-night"),
  "Desert Oasis":              picsumSrc("dn-desert-stars"),
  "Forbidden Masquerade":      picsumSrc("dn-carnival-mask"),
  "Storm on the Coast":        picsumSrc("dn-stormy-ocean"),
  "The Private Library":       picsumSrc("dn-dark-library"),
  "Midnight Rooftop":          picsumSrc("dn-rooftop-skyline"),
  "Winter Chalet":             picsumSrc("dn-winter-chalet"),
  "The Art Collector":         picsumSrc("dn-art-gallery"),
  "Harbor at Dusk":            picsumSrc("dn-harbor-dusk"),
  "Garden of Echoes":          picsumSrc("dn-garden-twilight"),
  "The Jazz Lounge":           picsumSrc("dn-jazz-lounge"),
  "Castle by the Lake":        picsumSrc("dn-castle-lake"),
  "Neon Afterglow":            picsumSrc("dn-neon-city"),
};

export function getScenarioImage(title: string): string {
  return SCENARIO_IMAGES[title] ?? picsumSrc("dn-romantic-default");
}
