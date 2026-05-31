// Unsplash CDN – background-image usage does not require next/image config
const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=480&h=260&q=80`;

const SCENARIO_IMAGES: Record<string, string> = {
  // Moonlit forest, medieval romance
  "Robin Hood & Maid Marian": U("1448375240586-882707db888b"),
  // Venetian canal at night
  "Venice After Midnight": U("1534430480872-3498386e7856"),
  // Masquerade mask, candlelight
  "Secret Society": U("1558618666-fcd25c85cd64"),
  // Handwritten letter, candlelight
  "The Last Letter": U("1455390582262-044cdead277a"),
  // Luxury sleeper train corridor
  "Moonlit Train": U("1474487548417-781cb6d646b4"),
  // Castle palace at dusk
  "Hidden Kingdom": U("1580587771525-78b9dba3b914"),
  // Horse-drawn carriage at night
  "Runaway Royalty": U("1548199569-3e1c6aa8f469"),
  // Paris night streets, rain-wet cobblestones
  "Lost in Paris": U("1499856871958-5b9627545d1a"),
  // Desert night, stars, dunes
  "Desert Oasis": U("1509316785289-025f5b846b35"),
  // Masquerade carnival
  "Forbidden Masquerade": U("1516450360452-9312f5e86fc7"),
  // Rugged coastline, dramatic waves
  "Storm on the Coast": U("1505118380757-91f5f5632de0"),
  // Dark library, tall bookshelves
  "The Private Library": U("1481627834876-b7833e8f5570"),
  // City skyline at night from rooftop
  "Midnight Rooftop": U("1477959858617-67f85cf4f1df"),
  // Snow-covered chalet, warm firelight glow
  "Winter Chalet": U("1548705085-101177834f47"),
  // Elegant art gallery, sculptures
  "The Art Collector": U("1536924940846-227afb31e2a5"),
  // Golden harbour at dusk, boats
  "Harbor at Dusk": U("1558618047-3c8c76be5c48"),
  // Overgrown English garden path
  "Garden of Echoes": U("1416879595882-3373a0480b5b"),
  // Jazz club, saxophone, low light
  "The Jazz Lounge": U("1514525253161-7a46d19cd819"),
  // Fairytale castle reflected in lake
  "Castle by the Lake": U("1533929736458-ca588d08c8be"),
  // Neon-lit night city
  "Neon Afterglow": U("1518904893539-f74e9eb14e2f"),
};

export function getScenarioImage(title: string): string {
  return SCENARIO_IMAGES[title] ?? U("1481627834876-b7833e8f5570");
}
