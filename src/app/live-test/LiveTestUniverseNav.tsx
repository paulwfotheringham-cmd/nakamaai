"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { LiveTestNavId } from "@/lib/nakama-universe-services";

const ICON = "world-nav-icon";

const NAV_ICONS: Record<string, ReactNode> = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" className={ICON} aria-hidden>
      <path d="M3 10.5 12 4l9 6.5V19a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  audiobooks: (
    <svg viewBox="0 0 24 24" fill="none" className={ICON} aria-hidden>
      <path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "build-adventure": (
    <svg viewBox="0 0 24 24" fill="none" className={ICON} aria-hidden>
      <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  "interactive-adventures": (
    <svg viewBox="0 0 24 24" fill="none" className={ICON} aria-hidden>
      <path d="M6 4h12v16H6V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 9h4M10 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  "forbidden-chat": (
    <svg viewBox="0 0 24 24" fill="none" className={ICON} aria-hidden>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  "reignite-couples": (
    <svg viewBox="0 0 24 24" fill="none" className={ICON} aria-hidden>
      <path d="M12 21s-6-4.35-6-10a4 4 0 0 1 7-2.4A4 4 0 0 1 18 11c0 5.65-6 10-6 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  "character-voices": (
    <svg viewBox="0 0 24 24" fill="none" className={ICON} aria-hidden>
      <circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" fill="none" className={ICON} aria-hidden>
      <path d="M20 21a8 8 0 1 0-16 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
};

const EXPERIENCES: { id: LiveTestNavId; label: string }[] = [
  { id: "audiobooks", label: "Audiobooks" },
  { id: "build-adventure", label: "Build Adventure" },
  { id: "interactive-adventures", label: "Interactive Adventures" },
  { id: "forbidden-chat", label: "Forbidden Chat" },
];

type LiveTestUniverseNavProps = {
  activeId: LiveTestNavId | null;
  onHome: () => void;
  onSelect: (id: LiveTestNavId) => void;
  subdued?: boolean;
};

export default function LiveTestUniverseNav({
  activeId,
  onHome,
  onSelect,
  subdued = false,
}: LiveTestUniverseNavProps) {
  return (
    <div
      className={`world-launcher-nav-inner flex h-full min-h-0 flex-col transition-opacity duration-500 ${subdued ? "opacity-50" : "opacity-100"}`}
    >
      <div className="world-launcher-brand shrink-0">
        <Link href="/" className="world-launcher-logo">
          <Image
            src="/Nakama-AI-July25-White.png"
            alt="Nakama Nights"
            width={200}
            height={54}
            className="h-8 w-auto max-w-full object-contain object-left md:h-9"
            priority
          />
        </Link>
        <div className="world-launcher-brand-rule" aria-hidden />
      </div>

      <nav className="world-launcher-nav-list flex min-h-0 flex-1 flex-col overflow-y-auto" aria-label="Experiences">
        <div className="world-launcher-home shrink-0">
          <WorldNavDestination
            icon={NAV_ICONS.home}
            label="Dashboard"
            active={activeId === null}
            onClick={onHome}
            featured
          />
        </div>

        <WorldNavSection label="Experiences">
          {EXPERIENCES.map((item) => (
            <WorldNavDestination
              key={item.id}
              icon={NAV_ICONS[item.id]}
              label={item.label}
              active={activeId === item.id}
              onClick={() => onSelect(item.id)}
            />
          ))}
        </WorldNavSection>

        <WorldNavSection label="For Couples">
          <WorldNavDestination
            icon={NAV_ICONS["reignite-couples"]}
            label="Reignite"
            active={activeId === "reignite-couples"}
            onClick={() => onSelect("reignite-couples")}
          />
        </WorldNavSection>

        <WorldNavSection label="Account" className="mt-auto">
          <WorldNavDestination
            icon={NAV_ICONS["character-voices"]}
            label="Characters & Voices"
            active={activeId === "character-voices"}
            onClick={() => onSelect("character-voices")}
          />
          <WorldNavDestination
            icon={NAV_ICONS.profile}
            label="Profile"
            active={activeId === "profile"}
            onClick={() => onSelect("profile")}
          />
        </WorldNavSection>
      </nav>
    </div>
  );
}

function WorldNavSection({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`world-launcher-section ${className}`.trim()}>
      <h2 className="world-launcher-section-label">{label}</h2>
      <div className="world-launcher-section-items">{children}</div>
    </section>
  );
}

function WorldNavDestination({
  icon,
  label,
  active,
  onClick,
  featured = false,
}: {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  featured?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`world-nav-destination${active ? " is-active" : ""}${featured ? " is-featured" : ""}`}
    >
      <span className="world-nav-indicator" aria-hidden />
      {icon}
      <span className="world-nav-label">{label}</span>
    </button>
  );
}
