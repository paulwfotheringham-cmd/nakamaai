export type DateNightScenarioConcept = {
  id: string;
  title: string;
  description: string;
};

export type DateNightMood =
  | "Romantic"
  | "Explicit"
  | "Taboo"
  | "Slow Build"
  | "Dominant"
  | "Submissive"
  | "Voyeur"
  | "Playful"
  | "Sensual";

export type PartnerInviteStatus = "idle" | "pending" | "accepted" | "rejected";

export type DateNightFlowStep =
  | "home"
  | "ratings"
  | "connect"
  | "partner-ratings"
  | "match-loading"
  | "match-reveal"
  | "story-config"
  | "story-generated"
  | "story-starting"
  | "player";

export type DateNightSession = {
  id: string;
  createdAt: number;
  step: DateNightFlowStep;
  scenarios: DateNightScenarioConcept[];
  creatorRatings: Record<string, number>;
  partnerRatings: Record<string, number>;
  partnerUsername: string;
  inviteStatus: PartnerInviteStatus;
  matchedScenario: DateNightScenarioConcept | null;
  friendlyName: string;
  maleVoice: string;
  femaleVoice: string;
  mood: DateNightMood;
  storyGenerated: boolean;
  playback: {
    playing: boolean;
    timeRemainingSec: number;
  };
};

export type SharedDateNightStory = {
  id: string;
  storyName: string;
  scenarioTitle: string;
  partnerName: string;
  dateCreated: number;
  progressPercent: number;
  maleVoice: string;
  femaleVoice: string;
  mood: DateNightMood;
  sessionSnapshot: DateNightSession;
};
