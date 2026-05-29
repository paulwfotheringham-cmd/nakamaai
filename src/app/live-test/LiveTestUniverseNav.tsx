"use client";

import Image from "next/image";
import Link from "next/link";
import type { LiveTestNavId } from "@/lib/nakama-universe-services";

type NavTarget = LiveTestNavId | "home";

const PRIMARY_DESTINATIONS: {
  target: NavTarget;
  label: string;
}[] = [
  { target: "home", label: "Dashboard" },
  { target: "audiobooks", label: "Audio" },
  { target: "interactive-adventures", label: "Adventure" },
  { target: "reignite-couples", label: "Couples" },
  { target: "character-voices", label: "Characters" },
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
  function isActive(target: NavTarget): boolean {
    if (target === "home") return activeId === null;
    return activeId === target;
  }

  function navigate(target: NavTarget) {
    if (target === "home") {
      onHome();
      return;
    }
    onSelect(target);
  }

  return (
    <header
      className={`platform-topnav shrink-0 transition-opacity duration-500 ${subdued ? "opacity-45" : "opacity-100"}`}
    >
      <div className="platform-topnav-glow pointer-events-none" aria-hidden />

      <div className="platform-topnav-inner">
        <Link href="/" className="platform-topnav-logo">
          <Image
            src="/Nakama-AI-July25-White.png"
            alt="Nakama Nights"
            width={168}
            height={46}
            className="h-7 w-auto object-contain sm:h-8"
            priority
          />
        </Link>

        <nav
          className="platform-topnav-links"
          aria-label="Main destinations"
        >
          {PRIMARY_DESTINATIONS.map((item) => (
            <TopNavLink
              key={item.target}
              label={item.label}
              active={isActive(item.target)}
              onClick={() => navigate(item.target)}
            />
          ))}
        </nav>

        <div className="platform-topnav-trailing">
          <TopNavLink
            label="Profile"
            active={activeId === "profile"}
            onClick={() => onSelect("profile")}
          />
        </div>
      </div>
    </header>
  );
}

function TopNavLink({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`platform-topnav-link${active ? " is-active" : ""}`}
    >
      <span className="platform-topnav-link-text">{label}</span>
      <span className="platform-topnav-link-indicator" aria-hidden />
    </button>
  );
}
