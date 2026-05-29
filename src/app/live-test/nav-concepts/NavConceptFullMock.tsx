"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { LiveTestNavId } from "@/lib/nakama-universe-services";
import LiveTestExperienceDock from "../LiveTestExperienceDock";
import MockExperienceView from "./MockExperienceView";
import MockGuidePanel from "./MockGuidePanel";
import {
  ConceptAHubNav,
  ConceptCCommandNav,
  ConceptDPosterNav,
  ConceptEContextNav,
} from "./NavConceptRenderer";
import { NAV_CONCEPTS, type NavConceptId } from "./nav-destinations";

const CONCEPT_ORDER: NavConceptId[] = ["a", "b", "c", "d", "e"];

function conceptMeta(id: NavConceptId) {
  return NAV_CONCEPTS.find((c) => c.id === id)!;
}

function prevNext(id: NavConceptId) {
  const i = CONCEPT_ORDER.indexOf(id);
  return {
    prev: i > 0 ? CONCEPT_ORDER[i - 1] : null,
    next: i < CONCEPT_ORDER.length - 1 ? CONCEPT_ORDER[i + 1] : null,
  };
}

export default function NavConceptFullMock({ conceptId }: { conceptId: NavConceptId }) {
  const [activeId, setActiveId] = useState<LiveTestNavId | null>(
    conceptId === "a" ? null : "reignite-couples",
  );
  const meta = conceptMeta(conceptId);
  const { prev, next } = prevNext(conceptId);
  const onHub = conceptId === "a" && activeId === null;

  const navProps = {
    activeId,
    onHome: () => setActiveId(null),
    onSelect: setActiveId,
  };

  return (
    <div className="nav-mockup-page">
      <div className="nav-mockup-atmosphere pointer-events-none" aria-hidden />

      <header className="nav-mockup-chrome">
        <Link href="/live-test/nav-concepts" className="nav-mockup-chrome-back">
          ← All concepts
        </Link>

        <div className="nav-mockup-chrome-center">
          <span className="nav-mockup-chrome-id">{conceptId.toUpperCase()}</span>
          <span className="nav-mockup-chrome-title">{meta.name}</span>
          <span className="nav-mockup-chrome-tagline">{meta.tagline}</span>
        </div>

        <nav className="nav-mockup-chrome-nav" aria-label="Other concepts">
          {prev ? (
            <Link href={`/live-test/nav-concepts/${prev}`} className="nav-mockup-chrome-arrow">
              ← {prev.toUpperCase()}
            </Link>
          ) : (
            <span className="nav-mockup-chrome-arrow nav-mockup-chrome-arrow-disabled">←</span>
          )}
          {next ? (
            <Link href={`/live-test/nav-concepts/${next}`} className="nav-mockup-chrome-arrow">
              {next.toUpperCase()} →
            </Link>
          ) : null}
        </nav>
      </header>

      <div className={`nav-mockup-shell nav-mockup-shell-${conceptId}`}>
        {conceptId === "d" ? <ConceptDPosterNav {...navProps} /> : null}

        <main className="nav-mockup-main">
          {conceptId === "a" && onHub ? (
            <div className="nav-mockup-hub">
              <div className="nav-mockup-hub-header">
                <Image
                  src="/Nakama-AI-July25-White.png"
                  alt="Nakama Nights"
                  width={160}
                  height={44}
                  className="h-8 w-auto opacity-95"
                />
                <h1 className="nav-mockup-hub-title">Choose your experience</h1>
                <p className="nav-mockup-hub-subtitle">
                  Full-screen hub — no persistent nav until you enter an experience.
                </p>
              </div>
              <ConceptAHubNav {...navProps} />
            </div>
          ) : (
            <>
              {conceptId === "a" ? <ConceptAHubNav {...navProps} /> : null}
              {conceptId === "c" ? <ConceptCCommandNav {...navProps} /> : null}
              {conceptId === "e" ? <ConceptEContextNav {...navProps} /> : null}

              <div
                className={`nav-mockup-main-body${conceptId === "e" ? " nav-mockup-main-body-e" : ""}`}
              >
                <MockExperienceView activeId={activeId} />
              </div>

              {conceptId === "b" ? <LiveTestExperienceDock {...navProps} /> : null}
            </>
          )}
        </main>

        <aside className="nav-mockup-guide-column">
          <MockGuidePanel />
        </aside>
      </div>
    </div>
  );
}
