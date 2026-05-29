import Link from "next/link";
import { NAV_CONCEPTS } from "./nav-destinations";

const CONCEPT_VISUALS: Record<string, { accent: string; hint: string }> = {
  a: { accent: "Hub grid fills the screen", hint: "PS5 home screen" },
  b: { accent: "Floating dock at bottom", hint: "Console OS bar" },
  c: { accent: "Explore opens palette", hint: "Raycast-style picker" },
  d: { accent: "Poster thumbnails on left", hint: "Game launcher rail" },
  e: { accent: "Breadcrumb pill only", hint: "Cinema mode" },
};

export default function NavConceptsGallery() {
  return (
    <div className="nav-mockup-index">
      <div className="nav-mockup-index-atmosphere pointer-events-none" aria-hidden />

      <header className="nav-mockup-index-hero">
        <p className="launcher-eyebrow">Navigation concepts</p>
        <h1 className="launcher-title">Full mockup pages</h1>
        <p className="launcher-subtitle max-w-2xl">
          Each concept opens as a full-screen interactive mock — real layout, real imagery,
          guide panel, and navigation. Pick one to explore.
        </p>
        <Link href="/live-test" className="nav-mockup-index-back">
          ← Back to Live Test
        </Link>
      </header>

      <div className="nav-mockup-index-grid">
        {NAV_CONCEPTS.map((c) => {
          const visual = CONCEPT_VISUALS[c.id];
          return (
            <Link
              key={c.id}
              href={`/live-test/nav-concepts/${c.id}`}
              className="nav-mockup-index-card group"
            >
              <div className="nav-mockup-index-card-visual" data-concept={c.id}>
                <span className="nav-mockup-index-card-letter">{c.id.toUpperCase()}</span>
                <span className="nav-mockup-index-card-hint">{visual.hint}</span>
              </div>
              <div className="nav-mockup-index-card-body">
                <p className="nav-mockup-index-card-id">Concept {c.id.toUpperCase()}</p>
                <h2 className="nav-mockup-index-card-name">{c.name}</h2>
                <p className="nav-mockup-index-card-tagline">{c.tagline}</p>
                <p className="nav-mockup-index-card-accent">{visual.accent}</p>
                <span className="nav-mockup-index-card-cta">Open full mockup →</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
