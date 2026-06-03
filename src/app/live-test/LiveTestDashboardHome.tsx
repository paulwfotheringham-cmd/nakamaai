"use client";

import { useEffect, useState } from "react";
import { readGuidePreferences, type GuidePreferences } from "@/lib/guides/preferences";

const CONTINUE = {
  label: "The Moor at Midnight",
  context: "Audiobooks · Last played 3 days ago",
  image: "/scenes/moor.jpg",
  imagePosition: "78% center",
} as const;

const ROW_ONE = [
  {
    id: "audiobooks",
    category: "AUDIOBOOKS",
    title: "Narrated fantasy stories.",
    detail: "12 stories available",
    activity: "Last listened: The Moor at Midnight",
    status: "In progress",
    statusType: "active" as const,
    action: "Resume",
    image: "/scenes/moor.jpg",
    imagePosition: "78% center",
  },
  {
    id: "build-adventure",
    category: "BUILD ADVENTURE",
    title: "Create your own story.",
    detail: "Draft saved",
    activity: "Slow Burn, Office — not finished",
    status: "Draft",
    statusType: "draft" as const,
    action: "Continue",
    image: "/scenes/office.jpg",
    imagePosition: "32% center",
  },
  {
    id: "interactive-adventures",
    category: "INTERACTIVE ADVENTURES",
    title: "Choice-driven experiences.",
    detail: "Chapter 2 of 5",
    activity: "Choice at the Door — in progress",
    status: "In progress",
    statusType: "active" as const,
    action: "Continue",
    image: "/tiles/tile3.jpg",
    imagePosition: "52% 38%",
  },
] as const;

const ROW_TWO = [
  {
    id: "forbidden-chat",
    category: "FORBIDDEN CHAT",
    title: "Private AI conversations.",
    detail: "Conversation active",
    activity: "Private Desires — open",
    status: "Active",
    statusType: "active" as const,
    action: "Open",
    image: "/tiles/tile4.jpg",
    imagePosition: "center center",
  },
  {
    id: "reignite-couples",
    category: "COUPLES EXPERIENCES",
    title: "Shared adventures for two.",
    detail: "Date Night & Surprise Mode available",
    activity: "Ready to begin",
    status: "Ready",
    statusType: "couples" as const,
    action: "Enter",
    image: "/couples/shared-session.jpg",
    imagePosition: "center center",
  },
] as const;

type StatusType = "active" | "draft" | "couples";

type ExpCard = {
  id: string;
  category: string;
  title: string;
  detail: string;
  activity: string;
  status: string;
  statusType: StatusType;
  action: string;
  image: string;
  imagePosition: string;
};

function ExperienceCard({ exp }: { exp: ExpCard }) {
  return (
    <li className="mdb-card">
      {/* Left: image strip */}
      <div className="mdb-card-img-wrap">
        <img
          src={exp.image}
          alt=""
          className="mdb-card-img"
          style={{ objectPosition: exp.imagePosition }}
        />
        <div className="mdb-card-img-veil" aria-hidden />
      </div>

      {/* Right: information */}
      <div className="mdb-card-body">
        <p className="mdb-card-category">{exp.category}</p>
        <h2 className="mdb-card-title">{exp.title}</h2>

        <div className="mdb-card-meta">
          <span className={`mdb-card-status mdb-card-status--${exp.statusType}`}>
            {exp.status}
          </span>
          <span className="mdb-card-detail">{exp.detail}</span>
        </div>

        <p className="mdb-card-activity">{exp.activity}</p>

        <button type="button" className="mdb-card-btn">
          {exp.action}
          <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5 shrink-0" aria-hidden>
            <path d="M3 6h7M7 3.5 9.5 6 7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </li>
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

      {/* ── Greeting ── */}
      <header className="mdb-header">
        <h1 className="mdb-greeting">
          Good evening, <span>{userName}</span>
        </h1>
      </header>

      {/* ── Continue banner (full width) ── */}
      <div className="mdb-continue-banner">
        <div className="mdb-continue-img-wrap">
          <img
            src={CONTINUE.image}
            alt=""
            className="mdb-continue-img"
            style={{ objectPosition: CONTINUE.imagePosition }}
          />
          <div className="mdb-continue-veil" aria-hidden />
        </div>
        <div className="mdb-continue-body">
          <p className="mdb-continue-label">Continue where you left off</p>
          <p className="mdb-continue-title">{CONTINUE.label}</p>
          <p className="mdb-continue-context">{CONTINUE.context}</p>
        </div>
        <button type="button" className="mdb-continue-btn">
          <svg viewBox="0 0 12 12" fill="currentColor" className="h-3 w-3 shrink-0" aria-hidden>
            <polygon points="3,2 10,6 3,10" />
          </svg>
          Resume
        </button>
      </div>

      {/* ── Your Experiences ── */}
      <section className="mdb-experiences">
        <h2 className="mdb-experiences-heading">Your Experiences</h2>

        {/* Row 1 — three cards */}
        <ul className="mdb-row mdb-row-3">
          {ROW_ONE.map((exp) => (
            <ExperienceCard key={exp.id} exp={exp} />
          ))}
        </ul>

        {/* Row 2 — two cards */}
        <ul className="mdb-row mdb-row-2">
          {ROW_TWO.map((exp) => (
            <ExperienceCard key={exp.id} exp={exp} />
          ))}
        </ul>
      </section>

    </div>
  );
}
