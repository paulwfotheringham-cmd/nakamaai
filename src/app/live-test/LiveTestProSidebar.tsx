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
      <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-5v-6H9v6H5a1 1 0 0 1-1-1v-8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  audio: (
    <svg viewBox="0 0 24 24" fill="none" className="pro-sidebar-icon" aria-hidden>
      <path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  build: (
    <svg viewBox="0 0 24 24" fill="none" className="pro-sidebar-icon" aria-hidden>
      <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  adventure: (
    <svg viewBox="0 0 24 24" fill="none" className="pro-sidebar-icon" aria-hidden>
      <path d="M6 4h12v16H6V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 9h4M10 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" fill="none" className="pro-sidebar-icon" aria-hidden>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  couples: (
    <svg viewBox="0 0 24 24" fill="none" className="pro-sidebar-icon" aria-hidden>
      <path d="M12 21s-6-4.35-6-10a4 4 0 0 1 7-2.4A4 4 0 0 1 18 11c0 5.65-6 10-6 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  character: (
    <svg viewBox="0 0 24 24" fill="none" className="pro-sidebar-icon" aria-hidden>
      <circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" fill="none" className="pro-sidebar-icon" aria-hidden>
      <path d="M20 21a8 8 0 1 0-16 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
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
      { id: "reignite-couples", label: "Reignite", icon: ICON.couples, badge: "Date Night" },
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
        <div className="pro-sidebar-bg" aria-hidden>
          <img src="/scenes/moor.jpg" alt="" className="pro-sidebar-bg-image" />
          <div className="pro-sidebar-bg-overlay" />
        </div>

        <div className="pro-sidebar-inner">
          <header className="pro-sidebar-brand">
            <Link href="/" className="pro-sidebar-logo-link" onClick={onMobileClose}>
              <Image
                src="/Nakama-AI-July25-White.png"
                alt="Nakama Nights"
                width={140}
                height={36}
                className="h-7 w-auto"
              />
            </Link>
            <p className="pro-sidebar-brand-tag">Universe</p>
          </header>

          <nav className="pro-sidebar-nav">
            {NAV_SECTIONS.map((section) => {
              const isOpen = openSections[section.id] ?? true;
              const hasActive = section.items.some((item) => isActive(activeId, item.id));

              return (
                <div key={section.id} className="pro-sidebar-section">
                  <button
                    type="button"
                    className={`pro-sidebar-section-toggle${hasActive ? " has-active" : ""}`}
                    onClick={() => toggleSection(section.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="pro-sidebar-section-label">{section.label}</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className={`pro-sidebar-chevron${isOpen ? " is-open" : ""}`}
                      aria-hidden
                    >
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
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
                            {item.icon}
                            <span className="pro-sidebar-item-label">{item.label}</span>
                            {item.badge ? (
                              <span className="pro-sidebar-badge">{item.badge}</span>
                            ) : null}
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
            <p className="pro-sidebar-footer-text">Nakama Nights · Live</p>
          </footer>
        </div>
      </aside>
    </>
  );
}
