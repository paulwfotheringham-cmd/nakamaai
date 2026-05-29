"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { LiveTestNavId } from "@/lib/nakama-universe-services";
import LiveTestExperienceDock from "../LiveTestExperienceDock";
import {
  isActiveTarget,
  labelForTarget,
  NAV_DESTINATIONS,
  type NavConceptId,
  type NavTarget,
} from "./nav-destinations";
import MockExperienceContent from "./MockExperienceContent";

export type NavConceptNavProps = {
  activeId: LiveTestNavId | null;
  onHome: () => void;
  onSelect: (id: LiveTestNavId) => void;
  hidden?: boolean;
};

function navigate(
  target: NavTarget,
  onHome: () => void,
  onSelect: (id: LiveTestNavId) => void,
) {
  if (target === "home") {
    onHome();
    return;
  }
  onSelect(target);
}

export function ConceptAHubNav({ activeId, onHome, onSelect, hidden }: NavConceptNavProps) {
  if (hidden) return null;

  if (activeId !== null) {
    return (
      <button type="button" onClick={onHome} className="nav-concept-hub-return">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Return to Hub
      </button>
    );
  }

  return (
    <div className="nav-concept-hub-grid">
      {NAV_DESTINATIONS.map((item) => (
        <button
          key={item.target}
          type="button"
          onClick={() => navigate(item.target, onHome, onSelect)}
          className="nav-concept-hub-tile group"
        >
          <img src={item.poster} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="nav-concept-hub-tile-overlay" aria-hidden />
          <span className="relative z-10 font-serif text-lg font-semibold text-white">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

export function ConceptCCommandNav({ activeId, onHome, onSelect, hidden }: NavConceptNavProps) {
  const [open, setOpen] = useState(false);
  if (hidden) return null;

  return (
    <>
      <header className="nav-concept-command-bar">
        <Link href="/" className="nav-concept-command-logo">
          <Image src="/Nakama-AI-July25-White.png" alt="Nakama Nights" width={120} height={32} className="h-6 w-auto opacity-85" />
        </Link>
        <button type="button" onClick={() => setOpen(true)} className="nav-concept-command-trigger">
          Explore
          <kbd className="nav-concept-command-kbd">⌘K</kbd>
        </button>
      </header>

      {open ? (
        <div className="nav-concept-palette-backdrop" onClick={() => setOpen(false)} role="presentation">
          <div className="nav-concept-palette" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Explore destinations">
            <p className="nav-concept-palette-title">Where tonight?</p>
            <div className="nav-concept-palette-grid">
              {NAV_DESTINATIONS.map((item) => (
                <button
                  key={item.target}
                  type="button"
                  className={`nav-concept-palette-card${isActiveTarget(activeId, item.target) ? " is-active" : ""}`}
                  onClick={() => {
                    navigate(item.target, onHome, onSelect);
                    setOpen(false);
                  }}
                >
                  <img src={item.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="nav-concept-palette-card-overlay" aria-hidden />
                  <span className="relative z-10 font-serif text-base font-semibold text-white">{item.label}</span>
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setOpen(false)} className="nav-concept-palette-close">
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function ConceptDPosterNav({ activeId, onHome, onSelect, hidden }: NavConceptNavProps) {
  const [hovered, setHovered] = useState<NavTarget | null>(null);

  if (hidden) return null;

  return (
    <aside className="nav-concept-poster-rail">
      {NAV_DESTINATIONS.map((item) => (
        <button
          key={item.target}
          type="button"
          onClick={() => navigate(item.target, onHome, onSelect)}
          onMouseEnter={() => setHovered(item.target)}
          onMouseLeave={() => setHovered(null)}
          aria-current={isActiveTarget(activeId, item.target) ? "page" : undefined}
          className={`nav-concept-poster-thumb${isActiveTarget(activeId, item.target) ? " is-active" : ""}`}
        >
          <img src={item.poster} alt="" className="h-full w-full object-cover" />
          {hovered === item.target || isActiveTarget(activeId, item.target) ? (
            <span className="nav-concept-poster-label">{item.shortLabel}</span>
          ) : null}
        </button>
      ))}
    </aside>
  );
}

export function ConceptEContextNav({ activeId, onHome, hidden }: NavConceptNavProps) {
  if (hidden) return null;

  return (
    <div className="nav-concept-context-pill">
      {activeId !== null ? (
        <button type="button" onClick={onHome} className="nav-concept-context-back">
          Hub
        </button>
      ) : (
        <span className="nav-concept-context-back nav-concept-context-back-static">Hub</span>
      )}
      <span className="nav-concept-context-sep" aria-hidden>
        ·
      </span>
      <span className="nav-concept-context-current">{labelForTarget(activeId)}</span>
    </div>
  );
}

export function NavConceptLayout({
  concept,
  activeId,
  onHome,
  onSelect,
  children,
  preview = false,
  hiddenNav = false,
  guide,
  compact = false,
}: {
  concept: NavConceptId;
  activeId: LiveTestNavId | null;
  onHome: () => void;
  onSelect: (id: LiveTestNavId) => void;
  children?: React.ReactNode;
  preview?: boolean;
  hiddenNav?: boolean;
  guide?: React.ReactNode;
  compact?: boolean;
}) {
  const navProps: NavConceptNavProps = {
    activeId,
    onHome,
    onSelect,
    hidden: hiddenNav,
  };

  const content = children ?? (
    <MockExperienceContent label={labelForTarget(activeId)} activeId={activeId} />
  );
  const guideSlot = guide ?? <span className="nav-concept-guide-label">Guide</span>;
  const frameClass = `nav-concept-frame nav-concept-frame-${concept}${
    compact ? " nav-concept-frame-compact" : preview ? " nav-concept-frame-preview" : " nav-concept-frame-live"
  }`;

  if (concept === "a") {
    const onHub = activeId === null;
    return (
      <div className={frameClass}>
        <div className="nav-concept-main">
          {onHub ? (
            <>
              <div className="nav-concept-hub-header">
                <Image src="/Nakama-AI-July25-White.png" alt="" width={140} height={38} className="h-7 w-auto opacity-90" />
                <p className="nav-concept-hub-tagline">Choose your experience</p>
              </div>
              <ConceptAHubNav {...navProps} />
            </>
          ) : (
            <>
              <ConceptAHubNav {...navProps} />
              <div className="nav-concept-body">{content}</div>
            </>
          )}
        </div>
        <div className="nav-concept-guide">{guideSlot}</div>
      </div>
    );
  }

  if (concept === "b") {
    return (
      <div className={frameClass}>
        <div className="nav-concept-main nav-concept-main-dock">
          <div className="nav-concept-body">{content}</div>
          <LiveTestExperienceDock {...navProps} />
        </div>
        <div className="nav-concept-guide">{guideSlot}</div>
      </div>
    );
  }

  if (concept === "c") {
    return (
      <div className={frameClass}>
        <div className="nav-concept-main nav-concept-main-command">
          <ConceptCCommandNav {...navProps} />
          <div className="nav-concept-body">{content}</div>
        </div>
        <div className="nav-concept-guide">{guideSlot}</div>
      </div>
    );
  }

  if (concept === "d") {
    return (
      <div className={frameClass}>
        <ConceptDPosterNav {...navProps} />
        <div className="nav-concept-main">
          <div className="nav-concept-body">{content}</div>
        </div>
        <div className="nav-concept-guide">{guideSlot}</div>
      </div>
    );
  }

  return (
    <div className={frameClass}>
      <div className="nav-concept-main nav-concept-main-context">
        <ConceptEContextNav {...navProps} />
        <div className="nav-concept-body">{content}</div>
      </div>
      <div className="nav-concept-guide">{guideSlot}</div>
    </div>
  );
}
