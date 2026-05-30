const SCENARIO_IMAGES: Record<string, string> = {
  "Robin Hood & Maid Marian": "/tiles/tile4.jpg",
  "Venice After Midnight": "/tiles/boat.jpg",
  "Secret Society": "/tiles/powerplay.jpg",
  "The Last Letter": "/tiles/slowburn.jpg",
  "Moonlit Train": "/tiles/tile5.jpg",
  "Hidden Kingdom": "/tiles/dragon.jpg",
  "Runaway Royalty": "/tiles/tile6.jpg",
  "Lost in Paris": "/tiles/tile3.jpg",
  "Desert Oasis": "/tiles/tile1.jpg",
  "Forbidden Masquerade": "/tiles/vampire.jpg",
  "Storm on the Coast": "/tiles/boat.jpg",
  "The Private Library": "/tiles/tile2.jpg",
  "Midnight Rooftop": "/tiles/tile6.jpg",
  "Winter Chalet": "/tiles/slowburn.jpg",
  "The Art Collector": "/tiles/tile2.jpg",
  "Harbor at Dusk": "/tiles/boat.jpg",
  "Garden of Echoes": "/tiles/tile4.jpg",
  "The Jazz Lounge": "/tiles/tile5.jpg",
  "Castle by the Lake": "/tiles/dragon.jpg",
  "Neon Afterglow": "/tiles/tile3.jpg",
};

export function getScenarioImage(title: string): string {
  return SCENARIO_IMAGES[title] ?? "/tiles/tile2.jpg";
}
