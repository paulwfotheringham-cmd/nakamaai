"use client";

import { useRef } from "react";
import type { LiveTestNavId } from "@/lib/nakama-universe-services";
import { NAV_CONCEPTS, type NavConceptId } from "./nav-destinations";
import { NavConceptLayout } from "./NavConceptRenderer";

type NavConceptCompareStripProps = {
  onSelectConcept: (id: NavConceptId) => void;
};

export default function NavConceptCompareStrip({ onSelectConcept }: NavConceptCompareStripProps) {
  const demoNav: LiveTestNavId = "reignite-couples";

  return (
    <section className="nav-concept-compare-strip" aria-label="Side-by-side concept comparison">
      <p className="nav-concept-compare-label">All five at a glance — tap to jump</p>
      <div className="nav-concept-compare-scroll">
        {NAV_CONCEPTS.map((c) => (
          <button
            key={c.id}
            type="button"
            className="nav-concept-compare-card"
            onClick={() => onSelectConcept(c.id)}
          >
            <span className="nav-concept-compare-badge">{c.id.toUpperCase()}</span>
            <span className="nav-concept-compare-name">{c.name}</span>
            <div className="nav-concept-compare-preview" aria-hidden>
              <NavConceptLayout
                concept={c.id}
                activeId={c.id === "a" ? null : demoNav}
                onHome={() => {}}
                onSelect={() => {}}
                preview
                compact
              />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export function useScrollToConcept() {
  const refs = useRef<Record<NavConceptId, HTMLElement | null>>({
    a: null,
    b: null,
    c: null,
    d: null,
    e: null,
  });

  function setRef(id: NavConceptId) {
    return (el: HTMLElement | null) => {
      refs.current[id] = el;
    };
  }

  function scrollTo(id: NavConceptId) {
    refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return { setRef, scrollTo };
}
