"use client";

import { useEffect, useState, type ReactNode } from "react";
import { PROTOTYPE_PARTNER_USERNAME } from "@/lib/date-night-prototype/constants";
import { partnerStatusLabel, partnerStepLabel } from "@/lib/date-night-prototype/journey";
import { getScenarioImage } from "@/lib/date-night-prototype/scenario-images";
import type { DateNightScenarioConcept, DateNightSession } from "@/lib/date-night-prototype/types";
import DateNightPlayer from "./DateNightPlayer";
import DateNightRatingPicker, { RatingLegendCompact } from "./DateNightRatingPicker";

const POST_MATCH_STEPS: DateNightSession["step"][] = [
  "match-reveal",
  "story-name",
  "story-voices",
  "story-mood",
  "story-generated",
  "player",
];

function PartnerScenarioList({
  scenarios,
  ratings,
  onChange,
  onSubmit,
  complete,
}: {
  scenarios: DateNightScenarioConcept[];
  ratings: Record<string, number>;
  onChange: (id: string, value: number) => void;
  onSubmit: () => void;
  complete: boolean;
}) {
  return (
    <div className="dn-partner-rank-wrap">
      <RatingLegendCompact />
      <ul className="dn-partner-scenario-grid">
        {scenarios.map((s) => (
          <li key={s.id} className="dn-partner-scenario-card">
            <div
              className="dn-partner-scenario-thumb"
              style={{ backgroundImage: `url(${getScenarioImage(s.title)})` }}
            />
            <div className="dn-partner-scenario-copy">
              <p className="dn-partner-scenario-title">{s.title}</p>
              <DateNightRatingPicker
                compact
                value={ratings[s.id]}
                onChange={(v) => onChange(s.id, v)}
              />
            </div>
          </li>
        ))}
      </ul>
      <button type="button" className="dn-btn-gold w-full" disabled={!complete} onClick={onSubmit}>
        Submit rankings
      </button>
    </div>
  );
}

type PartnerSimulationPanelProps = {
  session: DateNightSession;
  creatorUsername: string;
  onAcceptInvite: () => void;
  onRejectInvite: () => void;
  onPartnerRatingsSubmit: (ratings: Record<string, number>) => void;
  onUpdate: (patch: Partial<DateNightSession>) => void;
};

export default function PartnerSimulationPanel({
  session,
  creatorUsername,
  onAcceptInvite,
  onRejectInvite,
  onPartnerRatingsSubmit,
  onUpdate,
}: PartnerSimulationPanelProps) {
  const [localRatings, setLocalRatings] = useState(session.partnerRatings);

  useEffect(() => {
    setLocalRatings(session.partnerRatings);
  }, [session.partnerRatings]);

  const ratingsComplete = session.scenarios.every(
    (s) => localRatings[s.id] >= 1 && localRatings[s.id] <= 10,
  );

  const status = partnerStatusLabel(session);
  const step = partnerStepLabel(session);
  const match = session.matchedScenario;
  const showMatch = match && POST_MATCH_STEPS.includes(session.step);
  const showStory = session.step === "story-generated" || session.step === "player";

  let body: ReactNode = (
    <p className="dn-partner-muted">Waiting for activity…</p>
  );

  if (session.inviteStatus === "pending") {
    body = (
      <div className="dn-partner-invite-card">
        <p className="dn-partner-invite-text">
          <strong>{creatorUsername}</strong> would like to start Date Night with you.
        </p>
        <div className="dn-partner-invite-actions">
          <button type="button" className="dn-btn-gold" onClick={onAcceptInvite}>
            Accept
          </button>
          <button type="button" className="dn-btn-ghost-ivory" onClick={onRejectInvite}>
            Decline
          </button>
        </div>
      </div>
    );
  } else if (session.inviteStatus === "rejected") {
    body = <p className="dn-partner-muted">You declined the invitation.</p>;
  } else if (session.inviteStatus === "accepted" && session.step === "partner-ratings") {
    body = (
      <PartnerScenarioList
        scenarios={session.scenarios}
        ratings={localRatings}
        onChange={(id, v) => setLocalRatings((r) => ({ ...r, [id]: v }))}
        onSubmit={() => onPartnerRatingsSubmit(localRatings)}
        complete={ratingsComplete}
      />
    );
  } else if (session.step === "match-loading") {
    body = (
      <div className="dn-partner-waiting">
        <div className="dn-spinner dn-spinner-gold" aria-hidden />
        <p>Finding tonight&apos;s match…</p>
      </div>
    );
  } else if (showMatch && session.step === "match-reveal") {
    body = (
      <div className="dn-partner-match-mini">
        <p className="dn-partner-match-label">✨ Match found</p>
        <div
          className="dn-partner-match-art"
          style={{ backgroundImage: `url(${getScenarioImage(match!.title)})` }}
        />
        <p className="dn-partner-match-title">{match!.title}</p>
      </div>
    );
  } else if (
    session.step === "story-name" ||
    session.step === "story-voices" ||
    session.step === "story-mood"
  ) {
    body = <p className="dn-partner-muted">Waiting for story setup…</p>;
  } else if (session.step === "story-generated") {
    body = (
      <div className="dn-partner-waiting">
        <div className="dn-spinner dn-spinner-gold" aria-hidden />
        <p>Generating your adventure…</p>
      </div>
    );
  } else if (session.step === "player" && match) {
    body = (
      <DateNightPlayer
        compact
        showSave={false}
        session={session}
        partnerName={creatorUsername}
        onUpdate={onUpdate}
      />
    );
  } else if (session.step === "ratings" || session.step === "connect") {
    body = <p className="dn-partner-muted">Waiting for invitation…</p>;
  }

  return (
    <aside className="dn-partner-phone">
      <div className="dn-partner-phone-frame">
        <div className="dn-partner-phone-notch" aria-hidden />
        <header className="dn-partner-phone-header">
          <p className="dn-partner-phone-label">Partner View</p>
          <p className="dn-partner-phone-user">@{PROTOTYPE_PARTNER_USERNAME}</p>
        </header>

        <dl className="dn-partner-status-grid">
          <div>
            <dt>Status</dt>
            <dd>{status}</dd>
          </div>
          <div>
            <dt>Current step</dt>
            <dd>{step}</dd>
          </div>
          {showMatch ? (
            <div>
              <dt>Match</dt>
              <dd>{match?.title ?? "—"}</dd>
            </div>
          ) : null}
          {showStory ? (
            <div>
              <dt>Story</dt>
              <dd>{session.step === "player" ? "Playing" : "Generating"}</dd>
            </div>
          ) : null}
        </dl>

        <div className="dn-partner-phone-body">{body}</div>
      </div>
    </aside>
  );
}
