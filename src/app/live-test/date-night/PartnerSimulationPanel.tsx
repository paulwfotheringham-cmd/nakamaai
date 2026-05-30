"use client";

import { useEffect, useState } from "react";
import { PROTOTYPE_PARTNER_USERNAME } from "@/lib/date-night-prototype/constants";
import type { DateNightScenarioConcept, DateNightSession } from "@/lib/date-night-prototype/types";

export function RatingLegend() {
  return (
    <div className="dn-rating-legend">
      <p className="type-label text-luxury-muted">Rate tonight&apos;s possibilities</p>
      <p className="dn-rating-legend-line">10 = I&apos;d love this</p>
      <p className="dn-rating-legend-line">1 = Not for me</p>
      <p className="dn-rating-legend-note">
        There are no right answers. Your rankings are private. We&apos;ll only reveal your best shared match.
      </p>
    </div>
  );
}

function RatingsForm({
  scenarios,
  ratings,
  onChange,
  onSubmit,
  submitLabel,
  disabled,
}: {
  scenarios: DateNightScenarioConcept[];
  ratings: Record<string, number>;
  onChange: (id: string, value: number) => void;
  onSubmit: () => void;
  submitLabel: string;
  disabled?: boolean;
}) {
  const complete = scenarios.every((s) => ratings[s.id] >= 1 && ratings[s.id] <= 10);

  return (
    <div className="dn-partner-ratings">
      <RatingLegend />
      <ul className="dn-scenario-list dn-scenario-list-compact">
        {scenarios.map((s) => (
          <li key={s.id} className="dn-scenario-row">
            <div className="dn-scenario-copy">
              <p className="dn-scenario-title">{s.title}</p>
              <p className="dn-scenario-desc">{s.description}</p>
            </div>
            <select
              className="dn-rating-select"
              value={ratings[s.id] ?? ""}
              onChange={(e) => onChange(s.id, Number(e.target.value))}
              aria-label={`Rate ${s.title}`}
            >
              <option value="" disabled>
                —
              </option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
      <button type="button" className="btn-primary w-full" disabled={!complete || disabled} onClick={onSubmit}>
        {submitLabel}
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
};

export default function PartnerSimulationPanel({
  session,
  creatorUsername,
  onAcceptInvite,
  onRejectInvite,
  onPartnerRatingsSubmit,
}: PartnerSimulationPanelProps) {
  const [localRatings, setLocalRatings] = useState(session.partnerRatings);

  useEffect(() => {
    setLocalRatings(session.partnerRatings);
  }, [session.partnerRatings]);

  let body: React.ReactNode = (
    <p className="type-small text-luxury-muted">Waiting for activity…</p>
  );

  if (session.inviteStatus === "pending") {
    body = (
      <>
        <p className="type-body">
          <span className="text-luxury-primary">{creatorUsername}</span> would like to start Date Night with you.
        </p>
        <div className="dn-partner-actions">
          <button type="button" className="btn-primary flex-1" onClick={onAcceptInvite}>
            Accept
          </button>
          <button type="button" className="btn-secondary flex-1" onClick={onRejectInvite}>
            Reject
          </button>
        </div>
      </>
    );
  } else if (session.inviteStatus === "rejected") {
    body = <p className="type-body text-luxury-secondary">You declined the invitation.</p>;
  } else if (session.inviteStatus === "accepted" && session.step === "match-loading") {
    body = (
      <>
        <p className="type-card-title">Finding tonight&apos;s match…</p>
        <div className="dn-spinner" aria-hidden />
      </>
    );
  } else if (session.inviteStatus === "accepted" && session.step === "partner-ratings") {
    body = (
      <>
        <p className="type-small text-luxury-secondary mb-4">Rank the same scenarios independently.</p>
        <RatingsForm
          scenarios={session.scenarios}
          ratings={localRatings}
          onChange={(id, v) => setLocalRatings((r) => ({ ...r, [id]: v }))}
          onSubmit={() => onPartnerRatingsSubmit(localRatings)}
          submitLabel="Submit rankings"
        />
      </>
    );
  } else if (session.inviteStatus === "accepted" && session.step === "story-config") {
    body = session.matchedScenario ? (
      <>
        <p className="type-label text-amber-500/70">✨ Match found</p>
        <p className="type-card-title mt-2">{session.matchedScenario.title}</p>
        {session.friendlyName ? (
          <p className="type-body mt-2">{session.friendlyName}</p>
        ) : null}
        <p className="type-small mt-3 text-luxury-muted">Waiting for story generation…</p>
      </>
    ) : null;
  } else if (
    session.matchedScenario &&
    ["match-reveal", "story-generated", "story-starting", "player"].includes(session.step)
  ) {
    body = (
      <>
        <p className="type-label text-amber-500/70">✨ Match found</p>
        <p className="type-card-title mt-2">{session.matchedScenario.title}</p>
        <p className="type-small mt-2 text-luxury-secondary">{session.matchedScenario.description}</p>
        {session.friendlyName ? (
          <p className="type-body mt-3">{session.friendlyName}</p>
        ) : null}
        {session.step === "story-generated" || session.step === "story-starting" || session.step === "player" ? (
          <p className="type-small mt-3 text-luxury-muted">
            {session.step === "player" ? "Story in progress" : "Story ready"}
          </p>
        ) : null}
      </>
    );
  }

  return (
    <aside className="dn-partner-panel">
      <p className="type-label text-luxury-muted">Partner view (simulation)</p>
      <p className="type-small mt-1 text-luxury-muted">@{PROTOTYPE_PARTNER_USERNAME}</p>
      <div className="dn-partner-panel-body">{body}</div>
    </aside>
  );
}
