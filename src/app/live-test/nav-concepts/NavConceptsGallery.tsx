"use client";

import Link from "next/link";
import { useState } from "react";
import type { LiveTestNavId } from "@/lib/nakama-universe-services";
import { NAV_CONCEPTS, type NavConceptId } from "./nav-destinations";
import NavConceptCompareStrip, { useScrollToConcept } from "./NavConceptCompareStrip";
import { NavConceptLayout } from "./NavConceptRenderer";

function ConceptPreviewCard({
  conceptId,
  name,
  tagline,
  live,
  cardRef,
}: {
  conceptId: NavConceptId;
  name: string;
  tagline: string;
  live?: boolean;
  cardRef?: (el: HTMLElement | null) => void;
}) {
  const [activeId, setActiveId] = useState<LiveTestNavId | null>(
    conceptId === "a" ? null : "audiobooks",
  );

  return (
    <article ref={cardRef} className="nav-concept-gallery-card" id={`concept-${conceptId}`}>
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
            href={`/live-test?concept=${conceptId}&concepts=1`}
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
  const { setRef, scrollTo } = useScrollToConcept();

  return (
    <div className="nav-concept-gallery-page">
      <div className="nav-concept-gallery-atmosphere pointer-events-none absolute inset-0" aria-hidden />

      <header className="nav-concept-gallery-hero">
        <p className="launcher-eyebrow">Navigation concepts</p>
        <h1 className="launcher-title">Five ways to navigate Nakama Nights</h1>
        <p className="launcher-subtitle max-w-2xl">
          Compare layouts side by side, then click inside any preview to test navigation.
          Open full screen to try with real content.
        </p>
        <Link href="/live-test" className="nav-concept-gallery-back">
          ← Back to Live Test
        </Link>
      </header>

      <NavConceptCompareStrip onSelectConcept={scrollTo} />

      <div className="nav-concept-gallery-grid">
        {NAV_CONCEPTS.map((c) => (
          <ConceptPreviewCard
            key={c.id}
            conceptId={c.id}
            name={c.name}
            tagline={c.tagline}
            live={c.id === "b"}
            cardRef={setRef(c.id)}
          />
        ))}
      </div>
    </div>
  );
}
