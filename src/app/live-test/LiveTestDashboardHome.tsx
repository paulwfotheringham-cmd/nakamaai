"use client";

import { useEffect, useState } from "react";
import { readGuidePreferences, type GuidePreferences } from "@/lib/guides/preferences";

const TONIGHT_REC = {
  label: "The Moor at Midnight",
  context: "Audiobooks · Last played 3 days ago",
  image: "/scenes/moor.jpg",
  imagePosition: "78% center",
} as const;

const EXPERIENCES = [
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
  },
  {
    id: "reignite-couples",
    category: "Reignite",
    title: "Date Night",
    desc: "Couples adventures designed for connection.",
    status: "Ready",
    progress: "Date Night available",
    action: "Enter",
    statusType: "couples" as const,
    image: "/tiles/tile5.jpg",
  },
] as const;

export default function LiveTestDashboardHome() {
  const [prefs, setPrefs] = useState<GuidePreferences | null>(null);

  useEffect(() => {
    setPrefs(readGuidePreferences());
  }, []);

  const userName = prefs?.userName ?? "Jane";

  return (
    <div className="mdb-home animate-panel-in">

      {/* ── Header ── */}
      <header className="mdb-header">
        <h1 className="mdb-greeting">
          Good evening, <span>{userName}</span>
        </h1>

        <div className="mdb-tonight">
          <div className="mdb-tonight-thumb">
            <img
              src={TONIGHT_REC.image}
              alt=""
              style={{ objectPosition: TONIGHT_REC.imagePosition }}
            />
          </div>
          <div className="mdb-tonight-copy">
            <p className="mdb-tonight-label">Continue where you left off</p>
            <p className="mdb-tonight-title">{TONIGHT_REC.label}</p>
            <p className="mdb-tonight-context">{TONIGHT_REC.context}</p>
          </div>
          <button type="button" className="mdb-tonight-btn">
            <svg viewBox="0 0 12 12" fill="currentColor" className="h-2.5 w-2.5 shrink-0" aria-hidden>
              <polygon points="3,2 10,6 3,10" />
            </svg>
            Resume
          </button>
        </div>
      </header>

      {/* ── Five Experience Destinations ── */}
      <ul className="mdb-deck">
        {EXPERIENCES.map((exp) => (
          <li key={exp.id} className="mdb-dest group">
            {/* Full-bleed image */}
            <img
              src={exp.image}
              alt=""
              className="mdb-dest-img"
              style={"imagePosition" in exp ? { objectPosition: exp.imagePosition } : undefined}
            />

            {/* Atmospheric gradient */}
            <div className="mdb-dest-veil" aria-hidden />

            {/* Content anchored at the bottom */}
            <div className="mdb-dest-content">
              <p className="mdb-dest-category">{exp.category}</p>
              <h2 className="mdb-dest-title">{exp.title}</h2>
              <p className="mdb-dest-desc">{exp.desc}</p>

              <div className="mdb-dest-meta">
                <span className={`mdb-dest-status mdb-dest-status--${exp.statusType}`}>
                  {exp.status}
                </span>
                <span className="mdb-dest-progress">{exp.progress}</span>
              </div>

              <button type="button" className="mdb-dest-btn">
                {exp.action}
                <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5 shrink-0" aria-hidden>
                  <path d="M3 6h7M7 3.5 9.5 6 7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
}
