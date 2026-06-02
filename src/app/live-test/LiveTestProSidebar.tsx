"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";
import type { LiveTestNavId } from "@/lib/nakama-universe-services";

type NavItem = {
  id: LiveTestNavId | "home";
  label: string;
  icon: ReactNode;
  badge?: string;
};

type NavSection = {
  id: string;
  label: string;
  items: NavItem[];
  defaultOpen?: boolean;
};

const ICON = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" className="pro-sidebar-icon" aria-hidden>
      <path d="M5 10.5 12 5l7 5.5V19a1 1 0 0 1-1 1h-4.5v-5.5H10.5V20H6a1 1 0 0 1-1-1v-8.5Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  ),
  audio: (
    <svg viewBox="0 0 24 24" fill="none" className="pro-sidebar-icon" aria-hidden>
      <path d="M8 17V7l11-1.5v10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="17" r="2.5" stroke="currentColor" strokeWidth="1" />
      <circle cx="17" cy="15.5" r="2.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  build: (
    <svg viewBox="0 0 24 24" fill="none" className="pro-sidebar-icon" aria-hidden>
      <path d="M12 4 5 7.5v9L12 20l7-3.5v-9L12 4Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      <path d="M12 4v16M5 7.5l7 3.5 7-3.5" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  ),
  adventure: (
    <svg viewBox="0 0 24 24" fill="none" className="pro-sidebar-icon" aria-hidden>
      <rect x="7" y="5" width="10" height="14" rx="1" stroke="currentColor" strokeWidth="1" />
      <path d="M10 9h4M10 12.5h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" fill="none" className="pro-sidebar-icon" aria-hidden>
      <path d="M5 8.5a6.5 6.5 0 0 1 11.3-4.5A6.5 6.5 0 0 1 19 12v5.5H14l-3.5 3-3.5-3H5V8.5Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  ),
  couples: (
    <svg viewBox="0 0 24 24" fill="none" className="pro-sidebar-icon" aria-hidden>
      <path d="M12 20.5S6.5 16.5 6.5 11a4 4 0 0 1 7-2.4A4 4 0 0 1 17.5 11c0 5.5-5.5 9.5-5.5 9.5Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  ),
  character: (
    <svg viewBox="0 0 24 24" fill="none" className="pro-sidebar-icon" aria-hidden>
      <circle cx="12" cy="8.5" r="2.75" stroke="currentColor" strokeWidth="1" />
      <path d="M6.5 19c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" fill="none" className="pro-sidebar-icon" aria-hidden>
      <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1" />
      <path d="M5.5 20.5c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
};

const NAV_SECTIONS: NavSection[] = [
  {
    id: "home",
    label: "Home",
    items: [{ id: "home", label: "Dashboard", icon: ICON.home }],
    defaultOpen: true,
  },
  {
    id: "experiences",
    label: "Experiences",
    items: [
      { id: "audiobooks", label: "Audiobooks", icon: ICON.audio },
      { id: "build-adventure", label: "Build adventure", icon: ICON.build },
      { id: "interactive-adventures", label: "Interactive adventures", icon: ICON.adventure },
      { id: "forbidden-chat", label: "Forbidden chat", icon: ICON.chat },
      { id: "character-voices", label: "Characters & voices", icon: ICON.character },
    ],
    defaultOpen: true,
  },
  {
    id: "couples",
    label: "For couples",
    items: [
      { id: "reignite-couples", label: "Reignite", icon: ICON.couples },
    ],
    defaultOpen: true,
  },
  {
    id: "account",
    label: "Account",
    items: [{ id: "profile", label: "Profile", icon: ICON.profile }],
    defaultOpen: true,
  },
];

function isActive(activeId: LiveTestNavId | null, itemId: NavItem["id"]): boolean {
  if (itemId === "home") return activeId === null;
  return activeId === itemId;
}

type LiveTestProSidebarProps = {
  activeId: LiveTestNavId | null;
  onSelect: (id: LiveTestNavId | null) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
};

export default function LiveTestProSidebar({
  activeId,
  onSelect,
  mobileOpen,
  onMobileClose,
}: LiveTestProSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NAV_SECTIONS.map((s) => [s.id, s.defaultOpen ?? true])),
  );

  function toggleSection(id: string) {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function selectItem(itemId: NavItem["id"]) {
    if (itemId === "home") {
      onSelect(null);
    } else {
      onSelect(itemId);
    }
    onMobileClose();
  }

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          className="pro-sidebar-backdrop"
          aria-label="Close menu"
          onClick={onMobileClose}
        />
      ) : null}

      <aside
        className={`pro-sidebar${mobileOpen ? " pro-sidebar-open" : ""}`}
        aria-label="Main navigation"
      >
        {/* Full-sidebar cinematic atmosphere */}
        <div className="pro-sidebar-bg" aria-hidden>
          <img src="/scenes/moor.jpg" alt="" className="pro-sidebar-bg-img" />
          <div className="pro-sidebar-bg-veil" />
        </div>

        <div className="pro-sidebar-inner">

          {/* ══ BRAND — floats on the atmosphere ══ */}
          <header className="pro-sidebar-brand">
            <Link href="/" className="pro-sidebar-logo-link" onClick={onMobileClose}>
              <Image
                src="/Nakama-AI-July25-White.png"
                alt="Nakama Nights"
                width={288}
                height={77}
                className="pro-sidebar-logo-img"
                priority
              />
            </Link>
          </header>

          {/* ══ NAVIGATION — typography on atmosphere ══ */}
          <nav className="pro-sidebar-nav" aria-label="Main navigation">
            {NAV_SECTIONS.map((section) => {
              const isOpen = openSections[section.id] ?? true;
              const hasActive = section.items.some((item) => isActive(activeId, item.id));

              return (
                <div key={section.id} className="pro-sidebar-section">
                  {/* Section label — spacing marker only, still toggleable */}
                  <button
                    type="button"
                    className={`pro-sidebar-section-label${hasActive ? " has-active" : ""}`}
                    onClick={() => toggleSection(section.id)}
                    aria-expanded={isOpen}
                  >
                    {section.label}
                  </button>

                  {isOpen ? (
                    <ul className="pro-sidebar-items">
                      {section.items.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => selectItem(item.id)}
                            className={`pro-sidebar-item${isActive(activeId, item.id) ? " is-active" : ""}`}
                            aria-current={isActive(activeId, item.id) ? "page" : undefined}
                          >
                            <span className="pro-sidebar-item-label">{item.label}</span>
                            {item.badge ? <span className="pro-sidebar-badge">{item.badge}</span> : null}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <footer className="pro-sidebar-footer">
            <p className="pro-sidebar-footer-text">Nakama Nights</p>
          </footer>

        </div>
      </aside>
    </>
  );
}
