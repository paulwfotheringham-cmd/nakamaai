// All images served from /public — local assets, no external dependency.
// /couples/ = dedicated Date Night photography
// /scenes/  = story scene art from the home page slider
// /tiles/   = genre tile art from the home page

const SCENARIO_IMAGES: Record<string, string> = {
  "Robin Hood & Maid Marian":  "/scenes/moor.jpg",
  "Venice After Midnight":     "/tiles/boat.jpg",
  "Secret Society":            "/tiles/vampire.jpg",
  "The Last Letter":           "/tiles/slowburn.jpg",
  "Moonlit Train":             "/couples/reconnection.jpg",
  "Hidden Kingdom":            "/tiles/dragon.jpg",
  "Runaway Royalty":           "/scenes/rome.jpg",
  "Lost in Paris":             "/tiles/lover.jpg",
  "Desert Oasis":              "/tiles/space.jpg",
  "Forbidden Masquerade":      "/tiles/taboo.jpg",
  "Storm on the Coast":        "/scenes/pirate.jpg",
  "The Private Library":       "/tiles/tile6.jpg",
  "Midnight Rooftop":          "/couples/date-night-hero.jpg",
  "Winter Chalet":             "/couples/surprise-adventure.jpg",
  "The Art Collector":         "/tiles/tile1.jpg",
  "Harbor at Dusk":            "/tiles/tile2.jpg",
  "Garden of Echoes":          "/scenes/werewolf.jpg",
  "The Jazz Lounge":           "/tiles/powerplay.jpg",
  "Castle by the Lake":        "/tiles/tile4.jpg",
  "Neon Afterglow":            "/scenes/alien.jpg",
};

export function getScenarioImage(title: string): string {
  return SCENARIO_IMAGES[title] ?? "/couples/date-night.jpg";
}
