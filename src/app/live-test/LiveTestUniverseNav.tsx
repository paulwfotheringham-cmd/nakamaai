"use client";

import Link from "next/link";
import type { LiveTestNavId } from "@/lib/nakama-universe-services";

const EXPLORE_DESTINATIONS: { id: LiveTestNavId; label: string }[] = [
  { id: "audiobooks", label: "Audiobooks" },
  { id: "build-adventure", label: "Build Adventure" },
  { id: "interactive-adventures", label: "Interactive Adventures" },
  { id: "forbidden-chat", label: "Forbidden Chat" },
];

type LiveTestUniverseNavProps = {
  activeId: LiveTestNavId | null;
  onHome: () => void;
  onSelect: (id: LiveTestNavId) => void;
};

export default function LiveTestUniverseNav({
  activeId,
  onHome,
  onSelect,
}: LiveTestUniverseNavProps) {
  return (
    <nav className="editorial-nav" aria-label="Nakama Nights">
      <Link href="/" className="editorial-nav-brand">
        Nakama Nights
      </Link>

      <div className="editorial-nav-body">
        <NavDestination
          label="Dashboard"
          active={activeId === null}
          onClick={onHome}
          featured
        />

        <section className="editorial-nav-section">
          <h2 className="editorial-nav-section-label">Explore</h2>
          <ul className="editorial-nav-list editorial-nav-list-scroll">
            {EXPLORE_DESTINATIONS.map((item) => (
              <li key={item.id}>
                <NavDestination
                  label={item.label}
                  active={activeId === item.id}
                  onClick={() => onSelect(item.id)}
                />
              </li>
            ))}
          </ul>
        </section>

        <section className="editorial-nav-section">
          <h2 className="editorial-nav-section-label">Couples</h2>
          <ul className="editorial-nav-list">
            <li>
              <NavDestination
                label="Reignite"
                active={activeId === "reignite-couples"}
                onClick={() => onSelect("reignite-couples")}
              />
            </li>
          </ul>
        </section>

        <section className="editorial-nav-section editorial-nav-section-end">
          <h2 className="editorial-nav-section-label">Account</h2>
          <ul className="editorial-nav-list">
            <li>
              <NavDestination
                label="Profile"
                active={activeId === "profile"}
                onClick={() => onSelect("profile")}
              />
            </li>
          </ul>
        </section>
      </div>
    </nav>
  );
}

function NavDestination({
  label,
  active,
  onClick,
  featured = false,
}: {
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
      className={`editorial-nav-link${active ? " is-active" : ""}${featured ? " is-featured" : ""}`}
    >
      <span className="editorial-nav-marker" aria-hidden />
      <span className="editorial-nav-text">{label}</span>
    </button>
  );
}
