"use client";

import { useEffect, useState } from "react";
import { readGuidePreferences, type GuidePreferences } from "@/lib/guides/preferences";

const PICK_UP_ITEMS = [
  {
    section: "Audiobooks",
    lastActivity: "Gothic · windswept moor",
    when: "Last played 3 days ago",
    image: "/scenes/moor.jpg",
    imagePosition: "78% center",
  },
  {
    section: "Build Adventure",
    lastActivity: "Your draft — slow burn, office",
    when: "Saved, not finished",
    image: "/scenes/office.jpg",
    imagePosition: "32% center",
  },
  {
    section: "Interactive Adventures",
    lastActivity: "Chapter 2 — choice at the door",
    when: "In progress",
    image: "/tiles/tile3.jpg",
    imagePosition: "52% 38%",
  },
  {
    section: "Forbidden Chat",
    lastActivity: "Private desires",
    when: "Pick up the conversation",
    image: "/tiles/tile4.jpg",
  },
  {
    section: "Reignite for Couples",
    lastActivity: "Date Night · Reconnection",
    when: "Last here 2 days ago",
    image: "/tiles/tile5.jpg",
  },
] as const;

function PickUpCard({
  item,
  featured = false,
}: {
  item: (typeof PICK_UP_ITEMS)[number];
  featured?: boolean;
}) {
  return (
    <li className={`group dash-story-card ${featured ? "dash-story-card-featured" : ""}`}>
      <img
        src={item.image}
        alt=""
        className="dash-story-card-image"
        style={
          "imagePosition" in item ? { objectPosition: item.imagePosition } : undefined
        }
      />
      <div className="dash-story-card-overlay" aria-hidden />

      <div className={`dash-story-card-content ${featured ? "is-featured" : ""}`}>
        <p className="type-label text-luxury-muted">{item.section}</p>
        <h3 className={`dash-story-card-title ${featured ? "is-featured" : ""}`}>
          {item.lastActivity}
        </h3>
        <p className="dash-story-card-meta">{item.when}</p>

        <div className="dash-story-card-actions">
          <button type="button" className="btn-primary">
            Continue
          </button>
          <button type="button" className="btn-ghost">
            Later
          </button>
        </div>
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
  const guideName = prefs?.guideName ?? "your guide";

  const [featured, ...secondary] = PICK_UP_ITEMS;

  return (
    <div className="dash-home animate-panel-in">
      <header className="dash-home-header">
        <p className="type-label text-amber-500/50">Dashboard</p>
        <h1 className="dash-welcome-heading mt-2">
          Welcome back, <span className="text-luxury-primary">{userName}</span>
        </h1>
        <p className="type-small mt-2 max-w-md text-stone-400">
          Pick up where you left off. {guideName} is ready when you are.
        </p>
      </header>

      <section className="dash-home-stories">
        <div className="dash-home-stories-intro">
          <h2 className="type-section-heading">Continue your adventure</h2>
          <p className="type-small mt-2">Where do you want to go tonight?</p>
        </div>

        <ul className="dash-home-grid">
          <PickUpCard item={featured} featured />
          {secondary.map((item) => (
            <PickUpCard key={item.section} item={item} />
          ))}
        </ul>
      </section>
    </div>
  );
}
