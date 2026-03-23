"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase-browser";

type EbookFile = {
  name: string;
  path: string;
  created_at: string | null;
};

export default function ConvertEbookTile() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [ebooks, setEbooks]             = useState<EbookFile[]>([]);
  const [loading, setLoading]           = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  async function openDropdown() {
    if (!showDropdown && ebooks.length === 0) {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase.storage
            .from("ebooks")
            .list(user.id, { limit: 50, sortBy: { column: "created_at", order: "desc" } });
          setEbooks(
            (data ?? []).map((item) => ({
              name: item.name,
              path: `${user.id}/${item.name}`,
              created_at: item.created_at ?? null,
            }))
          );
        }
      } catch {
        setEbooks([]);
      }
      setLoading(false);
    }
    setShowDropdown((v) => !v);
  }

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function formatName(name: string) {
    // Strip leading timestamp (e.g. "1711234567890-") if present
    return name.replace(/^\d{10,}-/, "").replace(/\.(epub|pdf)$/i, "");
  }

  return (
    <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-200 hover:border-white/20 hover:bg-white/10">
      {/* Icon */}
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
        <span aria-hidden="true">🎧</span>
      </div>

      {/* Title + description */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold tracking-tight text-white">
          Convert ebook to fantasy audio
        </h3>
        <p className="text-sm leading-6 text-zinc-300">
          Upload your favourite ebook and transform it into an immersive fantasy audio experience.
        </p>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-3 flex-wrap">
        {/* Convert button */}
        <Link
          href="/convert-ebook-to-fantasy-audio"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            borderRadius: "12px",
            background: "rgba(216,178,110,0.15)",
            border: "1px solid rgba(216,178,110,0.3)",
            padding: "8px 14px",
            fontSize: "13px",
            fontWeight: 600,
            color: "#f1d7a1",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          Convert →
        </Link>

        {/* Converted ebooks dropdown */}
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
            📖 Converted Ebooks {showDropdown ? "▲" : "▼"}
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
                Your Converted Ebooks
              </div>

              {loading ? (
                <div style={{ padding: "20px", textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                  Loading…
                </div>
              ) : ebooks.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                  No ebooks uploaded yet.
                </div>
              ) : (
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {ebooks.map((e) => (
                    <Link
                      key={e.path}
                      href="/convert-ebook-to-fantasy-audio"
                      onClick={() => setShowDropdown(false)}
                      style={{
                        display: "block",
                        padding: "11px 16px",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        textDecoration: "none",
                        color: "white",
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={(el) => { (el.currentTarget as HTMLElement).style.background = "rgba(216,178,110,0.08)"; }}
                      onMouseLeave={(el) => { (el.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <div style={{ fontSize: "14px", fontWeight: 600 }}>{formatName(e.name)}</div>
                      {e.created_at && (
                        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
                          {new Date(e.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          {" · "}{e.name.endsWith(".epub") ? "EPUB" : "PDF"}
                        </div>
                      )}
                    </Link>
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
