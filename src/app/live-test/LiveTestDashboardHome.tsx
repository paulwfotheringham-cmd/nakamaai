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
    <li className={`group launcher-card ${featured ? "launcher-card-featured" : ""}`}>
      <img
        src={item.image}
        alt=""
        className="launcher-card-image"
        style={
          "imagePosition" in item ? { objectPosition: item.imagePosition } : undefined
        }
      />
      <div
        className={`pointer-events-none absolute inset-0 ${featured ? "launcher-card-overlay-featured" : "launcher-card-overlay"}`}
        aria-hidden
      />
      <div className="launcher-card-glow" aria-hidden />

      <div
        className={`relative z-10 flex h-full min-h-0 flex-col justify-end ${
          featured ? "p-6 sm:p-8" : "p-4 sm:p-5"
        }`}
      >
        <p className="launcher-section-label">{item.section}</p>
        <h3
          className={`mt-2 font-serif font-semibold leading-tight text-white ${
            featured ? "text-2xl sm:text-3xl lg:text-4xl" : "text-lg sm:text-xl"
          }`}
        >
          {item.lastActivity}
        </h3>
        <p
          className={`mt-2 font-normal text-stone-400/90 ${
            featured ? "text-sm sm:text-base" : "text-xs sm:text-sm"
          }`}
        >
          {item.when}
        </p>

        <div
          className={`mt-5 flex flex-wrap items-center gap-3 ${
            featured ? "mt-6 sm:mt-8" : "mt-4"
          }`}
        >
          <button type="button" className="btn-primary">
            Yes, continue
          </button>
          <button type="button" className="btn-ghost">
            Not now
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
  const voiceLabel = prefs?.voiceName?.split("—")[0]?.trim() ?? "your voice";
  const tone = prefs?.tone ?? "Relaxed";

  const [featured, ...secondary] = PICK_UP_ITEMS;

  return (
    <div className="launcher-panel animate-panel-in">
      <header className="launcher-panel-header">
        <p className="launcher-eyebrow">Dashboard</p>
        <h1 className="launcher-title">
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300/90 bg-clip-text text-transparent">
            {userName}
          </span>
        </h1>
        <p className="launcher-subtitle">
          Pick up where you left off. Your guide{" "}
          <span className="font-medium text-stone-300">{guideName}</span> ({voiceLabel},{" "}
          {tone} tone) is ready when you are.
        </p>
      </header>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-6 sm:px-8 sm:pb-8">
        <div className="mb-6 shrink-0">
          <h2 className="launcher-section-label">Continue your story</h2>
          <p className="mt-1 text-sm text-stone-500">Where do you want to go tonight?</p>
        </div>

        <ul className="grid min-h-0 flex-1 auto-rows-[minmax(10rem,1fr)] grid-cols-1 gap-4 overflow-y-auto sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:grid-rows-2 lg:gap-6 lg:overflow-hidden">
          <PickUpCard item={featured} featured />
          {secondary.map((item) => (
            <PickUpCard key={item.section} item={item} />
          ))}
        </ul>
      </section>
    </div>
  );
}
