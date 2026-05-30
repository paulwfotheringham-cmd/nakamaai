"use client";

import { useEffect, useState } from "react";
import { PROTOTYPE_PARTNER_USERNAME } from "@/lib/date-night-prototype/constants";
import {
  matchCompatibility,
  partnerStatusLabel,
  partnerStepLabel,
} from "@/lib/date-night-prototype/journey";
import { getScenarioImage } from "@/lib/date-night-prototype/scenario-images";
import type { DateNightScenarioConcept, DateNightSession } from "@/lib/date-night-prototype/types";
import DateNightPlayer from "./DateNightPlayer";
import DateNightRatingPicker from "./DateNightRatingPicker";

function PartnerScenarioCards({
  scenarios,
  ratings,
  onChange,
}: {
  scenarios: DateNightScenarioConcept[];
  ratings: Record<string, number>;
  onChange: (id: string, value: number) => void;
}) {
  return (
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
  const compatibility = matchCompatibility(session);

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
          <div>
            <dt>Match</dt>
            <dd>{match?.title ?? "—"}</dd>
          </div>
          <div>
            <dt>Story</dt>
            <dd>
              {session.step === "player"
                ? "Playing"
                : session.step === "story-generated" || session.step === "story-starting"
                  ? "Ready"
                  : session.storyGenerated
                    ? "Generated"
                    : "Pending"}
            </dd>
          </div>
        </dl>

        <div className="dn-partner-phone-body">
          {session.inviteStatus === "pending" ? (
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
          ) : null}

          {session.inviteStatus === "rejected" ? (
            <p className="dn-partner-muted">You declined the invitation.</p>
          ) : null}

          {session.inviteStatus === "accepted" && session.step === "partner-ratings" ? (
            <div className="dn-partner-rank-wrap">
              <p className="dn-partner-section-title">Rank tonight&apos;s adventures</p>
              <PartnerScenarioCards
                scenarios={session.scenarios}
                ratings={localRatings}
                onChange={(id, v) => setLocalRatings((r) => ({ ...r, [id]: v }))}
              />
              <button
                type="button"
                className="dn-btn-gold w-full"
                disabled={!ratingsComplete}
                onClick={() => onPartnerRatingsSubmit(localRatings)}
              >
                Submit rankings
              </button>
            </div>
          ) : null}

          {session.inviteStatus === "accepted" && session.step === "match-loading" ? (
            <div className="dn-partner-waiting">
              <div className="dn-spinner dn-spinner-gold" aria-hidden />
              <p>Finding tonight&apos;s match…</p>
            </div>
          ) : null}

          {match &&
          ["match-reveal", "story-config", "story-generated", "story-starting"].includes(
            session.step,
          ) ? (
            <div className="dn-partner-match-mini">
              <p className="dn-partner-match-label">✨ Tonight&apos;s match</p>
              <div
                className="dn-partner-match-art"
                style={{ backgroundImage: `url(${getScenarioImage(match.title)})` }}
              />
              <p className="dn-partner-match-title">{match.title}</p>
              {session.friendlyName ? <p className="dn-partner-match-sub">{session.friendlyName}</p> : null}
              {compatibility > 0 ? (
                <p className="dn-partner-match-score">{compatibility}% compatibility</p>
              ) : null}
              {session.step === "story-config" ? (
                <p className="dn-partner-muted">Waiting for story setup…</p>
              ) : null}
              {session.step === "story-generated" ? (
                <div className="dn-partner-waiting">
                  <div className="dn-spinner dn-spinner-gold" aria-hidden />
                  <p>Generating your adventure…</p>
                </div>
              ) : null}
              {session.step === "story-starting" ? (
                <p className="dn-partner-ready">Your story is ready.</p>
              ) : null}
            </div>
          ) : null}

          {session.step === "player" && match ? (
            <DateNightPlayer
              compact
              showSave={false}
              session={session}
              partnerName={creatorUsername}
              onUpdate={onUpdate}
            />
          ) : null}

          {session.inviteStatus === "idle" || (session.step === "ratings" && session.inviteStatus !== "pending") ? (
            <p className="dn-partner-muted">Waiting for your partner to connect…</p>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

export function RatingLegend() {
  return (
    <div className="dn-rating-legend">
      <p className="dn-rating-legend-title">Rate tonight&apos;s possibilities</p>
      <p className="dn-rating-legend-scale">
        <span>10 = I&apos;d love this</span>
        <span>1 = Not for me</span>
      </p>
      <p className="dn-rating-legend-note">
        There are no right answers. Your rankings are private. We&apos;ll only reveal your best shared match.
      </p>
    </div>
  );
}
