import type { DateNightFlowStep, DateNightSession } from "./types";

const STEP_ORDER: DateNightFlowStep[] = [
  "ratings",
  "connect",
  "partner-ratings",
  "match-loading",
  "match-reveal",
  "story-config",
  "story-generated",
  "story-starting",
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
  if (session.step === "story-starting" || session.step === "story-generated") return "Story ready";
  if (session.step === "story-config") return "Waiting for setup";
  if (session.step === "match-reveal" || session.step === "match-loading") return "Matched";
  if (session.step === "partner-ratings") return "Ranking";
  if (session.inviteStatus === "accepted") return "Accepted";
  if (session.inviteStatus === "pending") return "Invited";
  return "Waiting";
}

export function partnerStepLabel(session: DateNightSession): string {
  switch (session.step) {
    case "ratings":
      return "Awaiting invite";
    case "connect":
      return session.inviteStatus === "pending" ? "Reviewing invite" : "Not connected";
    case "partner-ratings":
      return "Ranking adventures";
    case "match-loading":
      return "Finding match";
    case "match-reveal":
      return "Match revealed";
    case "story-config":
      return "Partner configuring";
    case "story-generated":
      return "Generating story";
    case "story-starting":
      return "Story starting";
    case "player":
      return "In progress";
    default:
      return "—";
  }
}
