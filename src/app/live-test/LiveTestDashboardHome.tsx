"use client";

import { useEffect, useState } from "react";
import { readGuidePreferences, type GuidePreferences } from "@/lib/guides/preferences";

const HERO = {
  genre: "GOTHIC ROMANCE",
  title: "The Moor at Midnight",
  hook: "A stranger appears at the edge of the known world. Some desires refuse to be contained.",
  moods: ["Gothic", "Slow burn", "Desire"],
  experience: "Audiobooks",
  meta: "Listening · 3 days ago",
  image: "/scenes/moor.jpg",
  imagePosition: "78% center",
} as const;

const COLLECTIONS = [
  {
    id: "tonight",
    label: "Most Desired Tonight",
    caption: "Curated for this hour",
    items: [
      {
        genre: "FORBIDDEN",
        title: "Private Desires",
        hook: "Say what cannot be said aloud.",
        image: "/tiles/tile4.jpg",
        experience: "Forbidden Chat",
      },
      {
        genre: "SLOW BURN",
        title: "Late Hours",
        hook: "The line between professional and dangerous.",
        image: "/scenes/office.jpg",
        imagePosition: "32% center",
        experience: "Build Adventure",
      },
      {
        genre: "CHAPTER 2",
        title: "Choice at the Door",
        hook: "Every decision rewrites what comes next.",
        image: "/tiles/tile3.jpg",
        imagePosition: "52% 38%",
        experience: "Interactive",
      },
    ],
  },
  {
    id: "dark",
    label: "Dark Romance",
    caption: "Intensity. Consequence. No easy endings.",
    items: [
      {
        genre: "REIGNITE",
        title: "Date Night",
        hook: "A shared evening that changes everything.",
        image: "/tiles/tile5.jpg",
        experience: "Couples",
      },
      {
        genre: "MASQUERADE",
        title: "The Ball",
        hook: "Behind every mask, a truth you are not prepared for.",
        image: "/tiles/tile6.jpg",
        experience: "Audiobooks",
      },
      {
        genre: "SUPERNATURAL",
        title: "Moonlit Forests",
        hook: "Dangerous attraction. A secret you cannot escape.",
        image: "/tiles/tile1.jpg",
        experience: "Build Adventure",
      },
    ],
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
      <div className="dash-scroll">

        {/* ── Cinematic Hero ──────────────────────────── */}
        <section className="dash-hero">
          <div className="dash-hero-scene">
            <img
              src={HERO.image}
              alt=""
              className="dash-hero-img"
              style={{ objectPosition: HERO.imagePosition }}
            />
            <div className="dash-hero-veil" aria-hidden />
          </div>

          <div className="dash-hero-body">
            <div className="dash-hero-top">
              <span className="dash-hero-welcome">Good evening, {userName}</span>
            </div>

            <div className="dash-hero-story">
              <p className="dash-hero-genre">{HERO.genre}</p>
              <h1 className="dash-hero-title">{HERO.title}</h1>
              <p className="dash-hero-hook">{HERO.hook}</p>

              <ul className="dash-hero-moods" aria-label="Mood">
                {HERO.moods.map((m) => (
                  <li key={m} className="dash-hero-mood">{m}</li>
                ))}
              </ul>

              <div className="dash-hero-actions">
                <button type="button" className="dash-hero-cta">
                  <svg viewBox="0 0 12 12" fill="currentColor" className="h-2.5 w-2.5 shrink-0" aria-hidden>
                    <polygon points="3,2 10,6 3,10" />
                  </svg>
                  Continue listening
                </button>
                <span className="dash-hero-meta">{HERO.meta}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Curated Collections ─────────────────────── */}
        {COLLECTIONS.map((col) => (
          <section key={col.id} className="dash-collection">
            <header className="dash-col-header">
              <h2 className="dash-col-label">{col.label}</h2>
              <p className="dash-col-caption">{col.caption}</p>
            </header>

            <ul className="dash-col-grid">
              {col.items.map((item) => (
                <li key={item.title} className="dash-card group">
                  <div className="dash-card-visual">
                    <img
                      src={item.image}
                      alt=""
                      className="dash-card-img"
                      style={"imagePosition" in item ? { objectPosition: item.imagePosition } : undefined}
                    />
                    <div className="dash-card-veil" aria-hidden />
                    <p className="dash-card-genre">{item.genre}</p>
                  </div>
                  <div className="dash-card-body">
                    <h3 className="dash-card-title">{item.title}</h3>
                    <p className="dash-card-hook">{item.hook}</p>
                    <button type="button" className="dash-card-enter">
                      Enter
                      <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5 shrink-0" aria-hidden>
                        <path d="M3 6h7M7 3.5 9.5 6 7 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}

      </div>
    </div>
  );
}
