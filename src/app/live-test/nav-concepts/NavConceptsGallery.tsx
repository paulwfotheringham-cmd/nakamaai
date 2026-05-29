"use client";

import Link from "next/link";
import { useState } from "react";
import type { LiveTestNavId } from "@/lib/nakama-universe-services";
import { NAV_CONCEPTS, type NavConceptId } from "./nav-destinations";
import { NavConceptLayout } from "./NavConceptRenderer";

function ConceptPreviewCard({
  conceptId,
  name,
  tagline,
  live,
}: {
  conceptId: NavConceptId;
  name: string;
  tagline: string;
  live?: boolean;
}) {
  const [activeId, setActiveId] = useState<LiveTestNavId | null>(null);

  return (
    <article className="nav-concept-gallery-card">
      <header className="nav-concept-gallery-card-header">
        <div>
          <p className="nav-concept-gallery-id">Concept {conceptId.toUpperCase()}</p>
          <h2 className="nav-concept-gallery-name">{name}</h2>
          <p className="nav-concept-gallery-tagline">{tagline}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          {live ? (
            <span className="nav-concept-gallery-badge nav-concept-gallery-badge-live">Live in app</span>
          ) : null}
          <Link
            href={`/live-test?concept=${conceptId}`}
            className="nav-concept-gallery-try"
          >
            Try full screen
          </Link>
        </div>
      </header>

      <NavConceptLayout
        concept={conceptId}
        activeId={activeId}
        onHome={() => setActiveId(null)}
        onSelect={setActiveId}
        preview
      />
    </article>
  );
}

export default function NavConceptsGallery() {
  return (
    <div className="nav-concept-gallery-page">
      <div className="nav-concept-gallery-atmosphere pointer-events-none absolute inset-0" aria-hidden />

      <header className="nav-concept-gallery-hero">
        <p className="launcher-eyebrow">Navigation concepts</p>
        <h1 className="launcher-title">Five ways to navigate Nakama Nights</h1>
        <p className="launcher-subtitle max-w-2xl">
          Click destinations inside each preview. Use &quot;Try full screen&quot; to open that concept
          in the live app with real content.
        </p>
        <Link href="/live-test" className="nav-concept-gallery-back">
          ← Back to Live Test
        </Link>
      </header>

      <div className="nav-concept-gallery-grid">
        {NAV_CONCEPTS.map((c) => (
          <ConceptPreviewCard
            key={c.id}
            conceptId={c.id}
            name={c.name}
            tagline={c.tagline}
            live={c.id === "b"}
          />
        ))}
      </div>
    </div>
  );
}
