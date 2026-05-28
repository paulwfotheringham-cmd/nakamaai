export type DateNightScenario = {
  id: string;
  title: string;
  teaser: string;
  image: string;
};

const IMAGES = [
  "/scenes/office.jpg",
  "/scenes/moor.jpg",
  "/scenes/rome.jpg",
  "/scenes/pirate.jpg",
  "/scenes/werewolf.jpg",
  "/scenes/alien.jpg",
  "/tiles/tile5.jpg",
  "/tiles/lover.jpg",
  "/tiles/slowburn.jpg",
  "/tiles/vampire.jpg",
  "/tiles/boat.jpg",
  "/tiles/dragon.jpg",
] as const;

function img(i: number) {
  return IMAGES[i % IMAGES.length];
}

export const DATE_NIGHT_SCENARIOS: DateNightScenario[] = [
  {
    id: "one-bed-hotel-room",
    title: "One-bed hotel room",
    teaser: "The city hums outside — there’s only one place to sleep, and no room left for denial.",
    image: img(0),
  },
  {
    id: "office-work-trip",
    title: "Office work trip",
    teaser: "A late-night debrief becomes something softer, slower, and dangerously honest.",
    image: img(1),
  },
  {
    id: "stranger-at-hotel-bar",
    title: "Stranger at a hotel bar",
    teaser: "A glance, a smile, a seat pulled closer — the kind of night you never plan for.",
    image: img(2),
  },
  {
    id: "snowed-in-cabin",
    title: "Snowed-in cabin",
    teaser: "The storm locks you in. The fire makes its own rules.",
    image: img(3),
  },
  {
    id: "maid-marian-robin-hood",
    title: "Maid Marian & Robin Hood",
    teaser: "Deep in Sherwood, devotion turns bold — and the night belongs to outlaws.",
    image: img(4),
  },
  {
    id: "masquerade-ball",
    title: "Masquerade ball",
    teaser: "Behind a mask, you can finally say what you’ve wanted all along.",
    image: img(5),
  },
  {
    id: "forbidden-professor",
    title: "Forbidden professor",
    teaser: "An after-hours lesson. A voice that lowers. A boundary that trembles.",
    image: img(6),
  },
  {
    id: "mafia-dinner-party",
    title: "Mafia dinner party",
    teaser: "Candlelight, silk, and quiet power — every promise is edged with danger.",
    image: img(7),
  },
  {
    id: "vampire-castle",
    title: "Vampire castle",
    teaser: "Cold stone, warm breath — a kiss that feels like surrender and victory at once.",
    image: img(8),
  },
  {
    id: "wuthering-heights",
    title: "Wuthering Heights",
    teaser: "Wind, longing, and words you should never say — unless you mean them.",
    image: img(9),
  },
  {
    id: "billionaire-penthouse",
    title: "Billionaire penthouse",
    teaser: "The view is endless. The tension is closer than your next inhale.",
    image: img(10),
  },
  {
    id: "wedding-weekend",
    title: "Wedding weekend",
    teaser: "A borrowed suite. A stolen moment. A vow made in whispers.",
    image: img(11),
  },
  {
    id: "neighbor-next-door",
    title: "Neighbor next door",
    teaser: "You’ve heard each other through the walls — tonight, you finally knock.",
    image: img(12),
  },
  {
    id: "artist-and-muse",
    title: "Artist and muse",
    teaser: "A canvas, a gaze, a hand that lingers — and a night that becomes art.",
    image: img(13),
  },
  {
    id: "exes-reconnecting",
    title: "Exes reconnecting",
    teaser: "You know exactly how to hurt each other — and how to make it feel good again.",
    image: img(14),
  },
  {
    id: "private-chef",
    title: "Private chef",
    teaser: "A tasting menu. A touch of spice. A chef who watches you like a secret.",
    image: img(15),
  },
  {
    id: "royal-court-intrigue",
    title: "Royal court intrigue",
    teaser: "Velvet halls, hidden doors — the crown demands restraint, but the body does not.",
    image: img(16),
  },
  {
    id: "paris-apartment",
    title: "Paris apartment",
    teaser: "Rain on the window, champagne on the tongue — and a night that feels inevitable.",
    image: img(17),
  },
  {
    id: "knight-and-noblewoman",
    title: "Knight and noblewoman",
    teaser: "Armor comes off slowly. So do the rules.",
    image: img(18),
  },
  {
    id: "best-friend-tension",
    title: "Best friend tension",
    teaser: "You’ve always been close — tonight, you find out how close you really want to be.",
    image: img(19),
  },
];

