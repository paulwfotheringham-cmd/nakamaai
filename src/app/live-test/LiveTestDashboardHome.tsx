"use client";

import { useEffect, useState } from "react";
import { readGuidePreferences, type GuidePreferences } from "@/lib/guides/preferences";

const TONIGHT_REC = {
  label: "The Moor at Midnight",
  context: "Audiobooks",
  image: "/scenes/moor.jpg",
  imagePosition: "78% center",
} as const;

const EXPERIENCES = [
  {
    id: "audiobooks",
    label: "Audiobooks",
    desc: "Narrated fantasy stories",
    status: "In progress",
    statusType: "active" as const,
    image: "/scenes/moor.jpg",
    imagePosition: "78% center",
    action: "Resume",
  },
  {
    id: "build-adventure",
    label: "Build Adventure",
    desc: "Craft your own story",
    status: "Draft saved",
    statusType: "draft" as const,
    image: "/scenes/office.jpg",
    imagePosition: "32% center",
    action: "Continue",
  },
  {
    id: "interactive-adventures",
    label: "Interactive",
    desc: "Choose your path",
    status: "Chapter 2",
    statusType: "active" as const,
    image: "/tiles/tile3.jpg",
    imagePosition: "52% 38%",
    action: "Continue",
  },
  {
    id: "forbidden-chat",
    label: "Forbidden Chat",
    desc: "Uncensored conversation",
    status: "Active chat",
    statusType: "active" as const,
    image: "/tiles/tile4.jpg",
    action: "Open",
  },
  {
    id: "reignite-couples",
    label: "Reignite",
    desc: "Couples adventures",
    status: "Date Night ready",
    statusType: "couples" as const,
    image: "/tiles/tile5.jpg",
    action: "Enter",
  },
] as const;

const CONTINUE_ITEMS = [
  {
    label: "The Moor at Midnight",
    context: "Audiobooks · 3 days ago",
    image: "/scenes/moor.jpg",
    imagePosition: "78% center",
  },
  {
    label: "Slow burn, office",
    context: "Build Adventure · Draft saved",
    image: "/scenes/office.jpg",
    imagePosition: "32% center",
  },
  {
    label: "Chapter 2 — choice at the door",
    context: "Interactive · In progress",
    image: "/tiles/tile3.jpg",
    imagePosition: "52% 38%",
  },
  {
    label: "Date Night · Reconnection",
    context: "Reignite · 2 days ago",
    image: "/tiles/tile5.jpg",
  },
] as const;

const RECOMMENDED = [
  {
    genre: "PARANORMAL",
    title: "The Masquerade Ball",
    hook: "Behind every mask, a truth you are not prepared for.",
    image: "/tiles/tile6.jpg",
  },
  {
    genre: "SUPERNATURAL",
    title: "Moonlit Forests",
    hook: "Dangerous attraction. A secret you cannot escape.",
    image: "/tiles/tile1.jpg",
  },
  {
    genre: "FORBIDDEN",
    title: "Private Desires",
    hook: "Say what cannot be said aloud.",
    image: "/tiles/tile4.jpg",
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

      {/* ── Greeting / Tonight's Rec ── */}
      <header className="mdb-header">
        <div className="mdb-greeting-block">
          <p className="mdb-eyebrow">Dashboard</p>
          <h1 className="mdb-greeting">
            Good evening, <span>{userName}</span>
          </h1>
        </div>

        <div className="mdb-tonight-rec">
          <div className="mdb-tonight-thumb">
            <img
              src={TONIGHT_REC.image}
              alt=""
              style={{ objectPosition: TONIGHT_REC.imagePosition }}
            />
          </div>
          <div className="mdb-tonight-copy">
            <p className="mdb-tonight-label">Tonight&apos;s recommendation</p>
            <p className="mdb-tonight-title">Continue &ldquo;{TONIGHT_REC.label}&rdquo;</p>
            <p className="mdb-tonight-context">{TONIGHT_REC.context}</p>
          </div>
          <button type="button" className="mdb-tonight-btn">
            <svg viewBox="0 0 12 12" fill="currentColor" className="h-2.5 w-2.5 shrink-0" aria-hidden>
              <polygon points="3,2 10,6 3,10" />
            </svg>
            Continue
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="mdb-body">

        {/* ── Main column ── */}
        <div className="mdb-main">

          {/* Five Experiences */}
          <section className="mdb-section">
            <h2 className="mdb-section-label">Your Experiences</h2>
            <ul className="mdb-exp-row">
              {EXPERIENCES.map((exp) => (
                <li key={exp.id} className="mdb-exp-card group">
                  <div className="mdb-exp-thumb">
                    <img
                      src={exp.image}
                      alt=""
                      style={"imagePosition" in exp ? { objectPosition: exp.imagePosition } : undefined}
                    />
                    <div className="mdb-exp-thumb-veil" aria-hidden />
                  </div>
                  <div className="mdb-exp-body">
                    <p className="mdb-exp-title">{exp.label}</p>
                    <p className="mdb-exp-desc">{exp.desc}</p>
                    <div className="mdb-exp-footer">
                      <span className={`mdb-exp-status mdb-exp-status--${exp.statusType}`}>
                        {exp.status}
                      </span>
                      <button type="button" className="mdb-exp-btn">{exp.action}</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Continue Journey */}
          <section className="mdb-section mdb-section--grow">
            <h2 className="mdb-section-label">Continue your journey</h2>
            <ul className="mdb-continue-list">
              {CONTINUE_ITEMS.map((item) => (
                <li key={item.label} className="mdb-continue-item group">
                  <div className="mdb-continue-thumb">
                    <img
                      src={item.image}
                      alt=""
                      style={"imagePosition" in item ? { objectPosition: item.imagePosition } : undefined}
                    />
                  </div>
                  <div className="mdb-continue-info">
                    <p className="mdb-continue-title">{item.label}</p>
                    <p className="mdb-continue-context">{item.context}</p>
                  </div>
                  <button type="button" className="mdb-continue-btn">
                    Resume
                    <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5 shrink-0" aria-hidden>
                      <path d="M3 6h7M7 3.5 9.5 6 7 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </section>

        </div>

        {/* ── Aside: Recommended Tonight ── */}
        <aside className="mdb-aside">
          <h2 className="mdb-section-label">Recommended tonight</h2>
          <ul className="mdb-rec-list">
            {RECOMMENDED.map((rec) => (
              <li key={rec.title} className="mdb-rec-card group">
                <div className="mdb-rec-thumb">
                  <img src={rec.image} alt="" />
                  <div className="mdb-rec-veil" aria-hidden />
                  <p className="mdb-rec-genre">{rec.genre}</p>
                </div>
                <div className="mdb-rec-body">
                  <p className="mdb-rec-title">{rec.title}</p>
                  <p className="mdb-rec-hook">{rec.hook}</p>
                  <button type="button" className="mdb-rec-btn">
                    Enter
                    <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5 shrink-0" aria-hidden>
                      <path d="M3 6h7M7 3.5 9.5 6 7 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </aside>

      </div>
    </div>
  );
}
