"use client";

import { useEffect, useState } from "react";
import { readGuidePreferences, type GuidePreferences } from "@/lib/guides/preferences";

const CONTINUE_CARD = {
  label: "Continue Where You Left Off",
  title: "The Moor at Midnight",
  context: "Audiobooks · Last played 3 days ago",
  image: "/scenes/moor.jpg",
  imagePosition: "78% center",
} as const;

const TOP_EXPERIENCES = [
  {
    id: "audiobooks",
    category: "Audiobooks",
    title: "The Moor at Midnight",
    desc: "Narrated fantasy stories that pull you into another world.",
    status: "In progress",
    progress: "Last played 3 days ago",
    action: "Resume",
    statusType: "active" as const,
    image: "/scenes/moor.jpg",
    imagePosition: "78% center",
  },
  {
    id: "reignite-couples",
    category: "Couples Experiences",
    title: "Couples Experiences",
    desc: "Shared adventures designed for connection.",
    status: "Ready",
    progress: "Date Night & Surprise Mode",
    action: "Enter",
    statusType: "couples" as const,
    image: "/couples/shared-session.jpg",
    imagePosition: "center center",
  },
] as const;

const BOTTOM_EXPERIENCES = [
  {
    id: "build-adventure",
    category: "Build Adventure",
    title: "Slow Burn, Office",
    desc: "Craft your own story. Every choice is yours.",
    status: "Draft saved",
    progress: "Not finished",
    action: "Continue",
    statusType: "draft" as const,
    image: "/scenes/office.jpg",
    imagePosition: "32% center",
  },
  {
    id: "interactive-adventures",
    category: "Interactive",
    title: "Choice at the Door",
    desc: "A story that adapts to every decision you make.",
    status: "In progress",
    progress: "Chapter 2 of 5",
    action: "Continue",
    statusType: "active" as const,
    image: "/tiles/tile3.jpg",
    imagePosition: "52% 38%",
  },
  {
    id: "forbidden-chat",
    category: "Forbidden Chat",
    title: "Private Desires",
    desc: "Uncensored conversation. No limits.",
    status: "Active",
    progress: "Conversation open",
    action: "Open",
    statusType: "active" as const,
    image: "/tiles/tile4.jpg",
    imagePosition: "center center",
  },
] as const;

type Exp = {
  id: string;
  category: string;
  title: string;
  desc: string;
  status: string;
  progress: string;
  action: string;
  statusType: "active" | "draft" | "couples";
  image: string;
  imagePosition?: string;
};

function ExperienceCard({ exp }: { exp: Exp }) {
  return (
    <div className="mdb-card group">
      <img
        src={exp.image}
        alt=""
        className="mdb-card-img"
        style={exp.imagePosition ? { objectPosition: exp.imagePosition } : undefined}
      />
      <div className="mdb-card-veil" aria-hidden />
      <div className="mdb-card-content">
        <p className="mdb-card-category">{exp.category}</p>
        <h2 className="mdb-card-title">{exp.title}</h2>
        <button type="button" className="mdb-card-btn">
          {exp.action}
          <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5 shrink-0" aria-hidden>
            <path d="M3 6h7M7 3.5 9.5 6 7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function LiveTestDashboardHome() {
  const [prefs, setPrefs] = useState<GuidePreferences | null>(null);

  useEffect(() => {
    setPrefs(readGuidePreferences());
  }, []);

  const userName = prefs?.userName ?? "Jane";

  return (
    <div className="mdb-home animate-panel-in">

      {/* ── Greeting bar ── */}
      <header className="mdb-header">
        <h1 className="mdb-greeting">
          Good evening, <span>{userName}</span>
        </h1>
      </header>

      {/* ── Two-column body ── */}
      <div className="mdb-body">

        {/* Column 1 — Continue card (full height) */}
        <div className="mdb-continue group">
          <img
            src={CONTINUE_CARD.image}
            alt=""
            className="mdb-continue-img"
            style={{ objectPosition: CONTINUE_CARD.imagePosition }}
          />
          <div className="mdb-continue-veil" aria-hidden />
          <div className="mdb-continue-content">
            <p className="mdb-continue-eyebrow">{CONTINUE_CARD.label}</p>
            <h2 className="mdb-continue-title">{CONTINUE_CARD.title}</h2>
            <p className="mdb-continue-context">{CONTINUE_CARD.context}</p>
            <button type="button" className="mdb-continue-btn">
              <svg viewBox="0 0 12 12" fill="currentColor" className="h-2.5 w-2.5 shrink-0" aria-hidden>
                <polygon points="3,2 10,6 3,10" />
              </svg>
              Resume
            </button>
          </div>
        </div>

        {/* Column 2 — Experience grid */}
        <div className="mdb-grid">

          {/* Row 1: Audiobooks + Couples (2 cols) */}
          <div className="mdb-grid-row mdb-grid-row--2">
            {TOP_EXPERIENCES.map((exp) => (
              <ExperienceCard key={exp.id} exp={exp} />
            ))}
          </div>

          {/* Row 2: Build + Interactive + Forbidden Chat (3 cols) */}
          <div className="mdb-grid-row mdb-grid-row--3">
            {BOTTOM_EXPERIENCES.map((exp) => (
              <ExperienceCard key={exp.id} exp={exp} />
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
