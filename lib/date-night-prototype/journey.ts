import type { DateNightFlowStep, DateNightSession } from "./types";

const STEP_ORDER: DateNightFlowStep[] = [
  "tutorial",
  "ratings",
  "connect",
  "partner-ratings",
  "match-loading",
  "match-reveal",
  "story-name",
  "story-voices",
  "story-mood",
  "story-generated",
  "player",
];

export function stepIndex(step: DateNightFlowStep): number {
  const i = STEP_ORDER.indexOf(step);
  return i >= 0 ? i : 0;
}

export function isStepAtLeast(current: DateNightFlowStep, threshold: DateNightFlowStep): boolean {
  return stepIndex(current) >= stepIndex(threshold);
}

export function matchCompatibility(session: DateNightSession): number {
  if (!session.matchedScenario) return 0;
  const id = session.matchedScenario.id;
  const total = (session.creatorRatings[id] ?? 0) + (session.partnerRatings[id] ?? 0);
  return Math.round((total / 20) * 100);
}

export function partnerStatusLabel(session: DateNightSession): string {
  if (session.inviteStatus === "rejected") return "Declined";
  if (session.step === "player") return "Listening";
  if (session.step === "story-generated") return "Generating";
  if (session.step === "story-mood" || session.step === "story-voices" || session.step === "story-name") {
    return "Setting up";
  }
  if (session.step === "match-reveal" || session.step === "match-loading") return "Matched";
  if (session.step === "partner-ratings") return "Ranking";
  if (session.inviteStatus === "accepted") return "Accepted";
  if (session.inviteStatus === "pending") return "Invited";
  return "Waiting";
}

export function partnerStepLabel(session: DateNightSession): string {
  switch (session.step) {
    case "tutorial":
      return "Not started";
    case "ratings":
      return "Awaiting invite";
    case "connect":
      return session.inviteStatus === "pending" ? "Reviewing invite" : "Not connected";
    case "partner-ratings":
      return "Ranking adventures";
    case "match-loading":
      return "Finding match";
    case "match-reveal":
      return "Match found";
    case "story-name":
      return "Story name";
    case "story-voices":
      return "Choosing voices";
    case "story-mood":
      return "Choosing mood";
    case "story-generated":
      return "Generating story";
    case "player":
      return "Audio experience";
    default:
      return "—";
  }
}

export function creatorStepLabel(step: DateNightFlowStep): string {
  switch (step) {
    case "tutorial":
      return "Tutorial";
    case "ratings":
      return "Scenario matching";
    case "connect":
      return "Invite partner";
    case "partner-ratings":
      return "Partner rates scenarios";
    case "match-loading":
      return "Finding match";
    case "match-reveal":
      return "Match found";
    case "story-name":
      return "Story name";
    case "story-voices":
      return "Voices";
    case "story-mood":
      return "Mood";
    case "story-generated":
      return "Generate story";
    case "player":
      return "Audio experience";
    default:
      return "—";
  }
}
