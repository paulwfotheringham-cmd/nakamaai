"use client";

import { useEffect, useState } from "react";
import { readGuidePreferences, type GuidePreferences } from "@/lib/guides/preferences";

const FEATURED_ITEM = {
  section: "Audiobooks",
  title: "Gothic · windswept moor",
  meta: "Last played 3 days ago",
  image: "/scenes/moor.jpg",
  imagePosition: "78% center",
} as const;

const CONTINUE_ITEMS = [
  {
    section: "Build Adventure",
    title: "Slow burn, office",
    meta: "Saved — not finished",
    image: "/scenes/office.jpg",
    imagePosition: "32% center",
  },
  {
    section: "Interactive Adventures",
    title: "Chapter 2 — choice at the door",
    meta: "In progress",
    image: "/tiles/tile3.jpg",
    imagePosition: "52% 38%",
  },
  {
    section: "Forbidden Chat",
    title: "Private desires",
    meta: "Pick up the conversation",
    image: "/tiles/tile4.jpg",
  },
  {
    section: "Reignite",
    title: "Date Night · Reconnection",
    meta: "Last here 2 days ago",
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
    <div className="dash-home animate-panel-in">

      {/* ── Compact header ── */}
      <header className="dash-header">
        <span className="dash-eyebrow">Dashboard</span>
        <h1 className="dash-greeting">
          Welcome back,{" "}
          <em>{userName}</em>
        </h1>
      </header>

      {/* ── Featured card ── */}
      <section className="dash-featured">
        <div className="dash-featured-card group">
          <img
            src={FEATURED_ITEM.image}
            alt=""
            className="dash-featured-img"
            style={{ objectPosition: FEATURED_ITEM.imagePosition }}
          />
          <div className="dash-featured-gradient" aria-hidden />
          <div className="dash-featured-content">
            <span className="dash-featured-eyebrow">{FEATURED_ITEM.section}</span>
            <h2 className="dash-featured-title">{FEATURED_ITEM.title}</h2>
            <p className="dash-featured-meta">{FEATURED_ITEM.meta}</p>
            <button type="button" className="dash-featured-btn">
              <svg viewBox="0 0 12 12" fill="currentColor" className="h-2.5 w-2.5 shrink-0" aria-hidden>
                <polygon points="3,2 10,6 3,10" />
              </svg>
              Continue
            </button>
          </div>
        </div>
      </section>

      {/* ── Continue section ── */}
      <section className="dash-continue">
        <h2 className="dash-section-label">Continue your adventure</h2>
        <ul className="dash-continue-grid">
          {CONTINUE_ITEMS.map((item) => (
            <li key={item.section} className="dash-continue-card group">
              <div className="dash-continue-thumb">
                <img
                  src={item.image}
                  alt=""
                  style={"imagePosition" in item ? { objectPosition: item.imagePosition } : undefined}
                />
              </div>
              <div className="dash-continue-body">
                <span className="dash-continue-eyebrow">{item.section}</span>
                <h3 className="dash-continue-title">{item.title}</h3>
                <p className="dash-continue-meta">{item.meta}</p>
                <button type="button" className="dash-continue-btn">
                  Continue
                  <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5 shrink-0" aria-hidden>
                    <path d="M3 6h7M7 3.5 9.5 6 7 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
}
