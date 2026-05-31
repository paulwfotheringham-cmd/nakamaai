// source.unsplash.com keyword + sig: same sig always resolves to the same photo.
// Each scenario gets a unique sig so cards are visually distinct.
const src = (keywords: string, sig: number) =>
  `https://source.unsplash.com/480x260/?${encodeURIComponent(keywords)}&sig=${sig}`;

const SCENARIO_IMAGES: Record<string, string> = {
  "Robin Hood & Maid Marian":   src("misty forest medieval trees moonlight",     101),
  "Venice After Midnight":      src("venice canal gondola night water",           102),
  "Secret Society":             src("masquerade mask candlelight ballroom",       103),
  "The Last Letter":            src("candlelight letter writing desk vintage",    104),
  "Moonlit Train":              src("luxury sleeper train night railway",         105),
  "Hidden Kingdom":             src("castle palace garden fantasy dusk",          106),
  "Runaway Royalty":            src("horse carriage royal cobblestone night",     107),
  "Lost in Paris":              src("paris eiffel tower night streets rain",      108),
  "Desert Oasis":               src("desert dunes stars night sahara",           109),
  "Forbidden Masquerade":       src("masquerade carnival venice mask feathers",  110),
  "Storm on the Coast":         src("dramatic stormy ocean cliff waves",          111),
  "The Private Library":        src("dark library bookshelves candle leather",   112),
  "Midnight Rooftop":           src("rooftop city lights night skyline",          113),
  "Winter Chalet":              src("cozy chalet snow firelight winter cabin",    114),
  "The Art Collector":          src("art gallery painting elegant museum night",  115),
  "Harbor at Dusk":             src("harbor boats golden dusk port sailing",      116),
  "Garden of Echoes":           src("overgrown garden path mystery twilight",     117),
  "The Jazz Lounge":            src("jazz lounge saxophone low light club",       118),
  "Castle by the Lake":         src("fairytale castle lake reflection moonlight", 119),
  "Neon Afterglow":             src("neon city night lights rain reflections",    120),
};

export function getScenarioImage(title: string): string {
  return SCENARIO_IMAGES[title] ?? src("romantic evening candle night", 199);
}
