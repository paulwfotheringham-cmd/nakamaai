"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SavedStory = {
  id: string;
  name: string;
  narrator_voice: string;
  created_at: string;
};

export default function CreateAudioTile() {
  const [showDropdown, setShowDropdown]     = useState(false);
  const [stories, setStories]               = useState<SavedStory[]>([]);
  const [loading, setLoading]               = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  async function openDropdown() {
    if (!showDropdown && stories.length === 0) {
      setLoading(true);
      try {
        const res = await fetch("/api/saved-stories");
        const data = await res.json();
        setStories(data.stories ?? []);
      } catch {
        setStories([]);
      }
      setLoading(false);
    }
    setShowDropdown((v) => !v);
  }

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function goToStory(id: string) {
    setShowDropdown(false);
    router.push(`/create-audio?story_id=${id}`);
  }

  return (
    <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-200 hover:border-white/20 hover:bg-white/10">
      {/* Icon */}
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
        <span aria-hidden="true">✨</span>
      </div>

      {/* Title + description */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold tracking-tight text-white">
          Create your own fantasy audio
        </h3>
        <p className="text-sm leading-6 text-zinc-300">
          Adjust mood, voices, characters, and generate your scene.
        </p>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-3 flex-wrap">
        {/* Create New */}
        <Link
          href="/create-audio"
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
          style={{ background: "rgba(216,178,110,0.15)", borderColor: "rgba(216,178,110,0.3)", color: "#f1d7a1" }}
        >
          Create New →
        </Link>

        {/* Explore saved stories dropdown */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            onClick={openDropdown}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              borderRadius: "12px",
              border: showDropdown ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.1)",
              background: showDropdown ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)",
              padding: "8px 14px",
              fontSize: "13px",
              fontWeight: 600,
              color: "white",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            📚 Saved Stories {showDropdown ? "▲" : "▼"}
          </button>

          {showDropdown && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                zIndex: 200,
                minWidth: "280px",
                maxWidth: "380px",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "#1a0f20",
                boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#d8b26e" }}>
                Your Saved Stories
              </div>

              {loading ? (
                <div style={{ padding: "20px", textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                  Loading…
                </div>
              ) : stories.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                  No saved stories yet. Create one first!
                </div>
              ) : (
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {stories.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => goToStory(s.id)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "11px 16px",
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        cursor: "pointer",
                        color: "white",
                        display: "block",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(216,178,110,0.08)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <div style={{ fontSize: "14px", fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
                        {new Date(s.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        {s.narrator_voice ? ` · ${s.narrator_voice}` : ""}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
