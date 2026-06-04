import type { LiveTestNavId } from "@/lib/nakama-universe-services";

export type NavTarget = LiveTestNavId | "home";

export type NavDestination = {
  target: NavTarget;
  label: string;
  shortLabel: string;
  poster: string;
};

export const NAV_DESTINATIONS: NavDestination[] = [
  { target: "home", label: "Dashboard", shortLabel: "Hub", poster: "/tiles/tile1.jpg" },
  { target: "audiobooks", label: "Audiobooks", shortLabel: "Audio", poster: "/tiles/tile1.jpg" },
  { target: "build-adventure", label: "Build Adventure", shortLabel: "Build", poster: "/tiles/tile2.jpg" },
  { target: "interactive-adventures", label: "Interactive Adventures", shortLabel: "Adventure", poster: "/tiles/tile3.jpg" },
  { target: "forbidden-chat", label: "Forbidden Chat", shortLabel: "Chat", poster: "/tiles/tile4.jpg" },
  { target: "reignite-couples", label: "Reignite", shortLabel: "Couples", poster: "/tiles/tile5.jpg" },
  { target: "character-voices", label: "Characters", shortLabel: "Characters", poster: "/tiles/tile6.jpg" },
  { target: "profile", label: "Profile", shortLabel: "Profile", poster: "/scenes/moor.jpg" },
];

export const NAV_CONCEPTS = [
  { id: "a", name: "The Hub", tagline: "PS5 home — nav only on the hub screen" },
  { id: "b", name: "The Dock", tagline: "Console OS — floating bottom bar" },
  { id: "c", name: "Command Palette", tagline: "Raycast — Explore opens fullscreen picker" },
  { id: "d", name: "Poster Strip", tagline: "Game launcher — cinematic thumbnail rail" },
  { id: "e", name: "Context Pill", tagline: "Cinema mode — breadcrumb only" },
] as const;

export type NavConceptId = (typeof NAV_CONCEPTS)[number]["id"];

export function parseNavConcept(value: string | null): NavConceptId {
  if (value === "a" || value === "b" || value === "c" || value === "d" || value === "e") {
    return value;
  }
  return "b";
}

export function isActiveTarget(activeId: LiveTestNavId | null, target: NavTarget): boolean {
  if (target === "home") return activeId === null;
  return activeId === target;
}

export function labelForTarget(activeId: LiveTestNavId | null): string {
  if (activeId === null) return "Dashboard";
  return NAV_DESTINATIONS.find((d) => d.target === activeId)?.label ?? "Experience";
}

export function posterForTarget(activeId: LiveTestNavId | null): string {
  if (activeId === null) return "/tiles/tile1.jpg";
  return NAV_DESTINATIONS.find((d) => d.target === activeId)?.poster ?? "/tiles/tile1.jpg";
}
