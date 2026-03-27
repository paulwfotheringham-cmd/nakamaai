/**
 * Category titles + item labels (first column / tiles) for Fantasy Audio admin.
 * Keep in sync with `rows` in app/fantasy-audio/page.tsx.
 */
export type FantasyAudioCategoryOption = {
  categoryTitle: string;
  items: string[];
};

export const FANTASY_AUDIO_CATEGORY_OPTIONS: FantasyAudioCategoryOption[] = [
  { categoryTitle: "Anime / Hentai", items: ["Anime 1", "Anime 2", "Hentai 1", "Hentai 2"] },
  {
    categoryTitle: "Paranormal & Supernatural",
    items: ["Werewolf", "Ghost", "Devil", "Angel"],
  },
  {
    categoryTitle: "Fairy Tales & Monsters",
    items: ["Dragon", "Witch", "Wizard", "Dwarf"],
  },
  {
    categoryTitle: "Sci-Fi / Alien",
    items: ["Star Trek", "Battlestar Galactica", "Alien 1", "Alien 2"],
  },
  {
    categoryTitle: "Power Dynamics",
    items: ["Sub 1", "Sub 2", "Dom 1", "Dom 2"],
  },
  {
    categoryTitle: "Modern",
    items: ["Office", "Travel", "Outdoors", "Stranger Encounter"],
  },
  {
    categoryTitle: "Dark & Erotic",
    items: ["Obsession", "Seduction", "Forbidden", "After Dark"],
  },
  {
    categoryTitle: "Historical Romance",
    items: ["Victorian", "Medieval", "Pirate", "Caveman"],
  },
];
