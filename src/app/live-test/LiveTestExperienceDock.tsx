"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { LiveTestNavId } from "@/lib/nakama-universe-services";

type DockTarget = LiveTestNavId | "home";

type DockItem = {
  target: DockTarget;
  label: string;
  icon: ReactNode;
};

const DOCK_ITEMS: DockItem[] = [
  {
    target: "home",
    label: "Hub",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="experience-dock-icon" aria-hidden>
        <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-5v-6H9v6H5a1 1 0 0 1-1-1v-8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    target: "audiobooks",
    label: "Audio",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="experience-dock-icon" aria-hidden>
        <path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    target: "build-adventure",
    label: "Build",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="experience-dock-icon" aria-hidden>
        <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    target: "interactive-adventures",
    label: "Adventure",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="experience-dock-icon" aria-hidden>
        <path d="M6 4h12v16H6V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 9h4M10 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    target: "forbidden-chat",
    label: "Chat",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="experience-dock-icon" aria-hidden>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    target: "reignite-couples",
    label: "Couples",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="experience-dock-icon" aria-hidden>
        <path d="M12 21s-6-4.35-6-10a4 4 0 0 1 7-2.4A4 4 0 0 1 18 11c0 5.65-6 10-6 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    target: "character-voices",
    label: "Characters",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="experience-dock-icon" aria-hidden>
        <circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M19 10v1a7 7 0 0 1-14 0v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    target: "profile",
    label: "Profile",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="experience-dock-icon" aria-hidden>
        <path d="M20 21a8 8 0 1 0-16 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

type LiveTestExperienceDockProps = {
  activeId: LiveTestNavId | null;
  onHome: () => void;
  onSelect: (id: LiveTestNavId) => void;
  hidden?: boolean;
};

export default function LiveTestExperienceDock({
  activeId,
  onHome,
  onSelect,
  hidden = false,
}: LiveTestExperienceDockProps) {
  if (hidden) return null;

  function isActive(target: DockTarget): boolean {
    if (target === "home") return activeId === null;
    return activeId === target;
  }

  function navigate(target: DockTarget) {
    if (target === "home") {
      onHome();
      return;
    }
    onSelect(target);
  }

  return (
    <div className="experience-dock-wrap pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-4 sm:pb-5 md:pb-6">
      <div className="experience-dock pointer-events-auto">
        <Link href="/" className="experience-dock-mark" aria-label="Nakama Nights home">
          <Image
            src="/Nakama-AI-July25-White.png"
            alt=""
            width={72}
            height={20}
            className="h-4 w-auto opacity-70"
          />
        </Link>

        <div className="experience-dock-divider" aria-hidden />

        <div className="experience-dock-items" role="tablist" aria-label="Destinations">
          {DOCK_ITEMS.map((item) => (
            <button
              key={item.target}
              type="button"
              role="tab"
              aria-selected={isActive(item.target)}
              aria-current={isActive(item.target) ? "page" : undefined}
              onClick={() => navigate(item.target)}
              className={`experience-dock-item${isActive(item.target) ? " is-active" : ""}`}
            >
              {item.icon}
              <span className="experience-dock-label">{item.label}</span>
              <span className="experience-dock-dot" aria-hidden />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
