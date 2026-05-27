import type { LiveTestNavId } from "@/lib/nakama-universe-services";

const HELP_INTENT =
  /\b(help|want|need|choose|choosing|pick|picking|find|finding|show|open|start|explore|guide|looking for|take me|switch|go to)\b/i;

type NavRule = {
  id: LiveTestNavId;
  test: (text: string) => boolean;
};

const NAV_RULES: NavRule[] = [
  {
    id: "audiobooks",
    test: (t) => t.includes("audiobook"),
  },
  {
    id: "build-adventure",
    test: (t) =>
      t.includes("building an adventure") ||
      t.includes("build an adventure") ||
      t.includes("build adventure") ||
      (t.includes("build") && t.includes("adventure")),
  },
  {
    id: "interactive-adventures",
    test: (t) => t.includes("interactive adventure") || t.includes("interactive adventures"),
  },
  {
    id: "forbidden-chat",
    test: (t) => t.includes("forbidden chat") || t.includes("forbidden"),
  },
  {
    id: "reignite-couples",
    test: (t) =>
      t.includes("couples section") ||
      t.includes("couples program") ||
      t.includes("for couples") ||
      t.includes("reignite") ||
      t.includes("date night mode"),
  },
  {
    id: "character-voices",
    test: (t) =>
      (t.includes("character") && t.includes("voice")) ||
      t.includes("characters and voices") ||
      t.includes("character & voices"),
  },
];

/** Map guide-chat phrasing to a live-test nav section (center panel). */
export function detectGuideChatNavIntent(message: string): LiveTestNavId | null {
  const text = message.toLowerCase().replace(/\s+/g, " ").trim();
  if (!text || !HELP_INTENT.test(text)) return null;

  for (const rule of NAV_RULES) {
    if (rule.test(text)) return rule.id;
  }

  return null;
}

export function getNavSectionLabel(navId: LiveTestNavId): string {
  switch (navId) {
    case "audiobooks":
      return "Audiobooks";
    case "build-adventure":
      return "Build Adventure";
    case "interactive-adventures":
      return "Interactive Adventures";
    case "forbidden-chat":
      return "Forbidden Chat";
    case "reignite-couples":
      return "Reignite for Couples";
    case "character-voices":
      return "Characters & Voices";
    case "profile":
      return "Profile";
    default:
      return "that section";
  }
}
