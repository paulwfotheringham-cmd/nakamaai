"use client";

import { useMemo, useState } from "react";

type Row = {
  title: string;
  items: string[];
};

const rows: Row[] = [
  {
    title: "Anime / Hentai",
    items: ["Anime 1", "Anime 2", "Hentai 1", "Hentai 2"],
  },
  {
    title: "Paranormal & Supernatural",
    items: ["Werewolf", "Ghost", "Devil", "Angel"],
  },
  {
    title: "Fairy tales & Monsters",
    items: ["Dragon", "Witch", "Wizard", "Dwarf"],
  },
  {
    title: "Sci-Fi / Alien",
    items: ["Star Trek", "Battlestar Galactica", "Alien 1", "Alien 2"],
  },
  {
    title: "Power Dynamics",
    items: ["Sub 1", "Sub 2", "Dom 1", "Dom 2"],
  },
  {
    title: "Modern",
    items: ["Office", "Travel", "Outdoors", "Stranger encounter"],
  },
  {
    title: "Dark & Erotic",
    items: ["Anime 1", "Anime 2", "Hentai 1", "Hentai 2"],
  },
  {
    title: "Historical Romance",
    items: ["Victorian", "Medieval", "Pirate", "Caveman"],
  },
];

const VISIBLE = 3;

export default function FantasyAudioPage() {
  const [positions, setPositions] = useState(rows.map(() => 0));

  function prev(rowIndex: number) {
    setPositions((prev) =>
      prev.map((p, i) =>
        i === rowIndex
          ? (p - 1 + rows[i].items.length) % rows[i].items.length
          : p
      )
    );
  }

  function next(rowIndex: number) {
    setPositions((prev) =>
      prev.map((p, i) =>
        i === rowIndex
          ? (p + 1) % rows[i].items.length
          : p
      )
    );
  }

  const visible = useMemo(() => {
    return rows.map((row, i) => {
      const start = positions[i];
      return Array.from({ length: VISIBLE }, (_, j) => {
        return row.items[(start + j) % row.items.length];
      });
    });
  }, [positions]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#07040d",
        color: "white",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "40px", fontWeight: 700 }}>
            Choose Fantasy Audio
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>
            Browse categories and select your experience
          </p>
        </div>

        {/* Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {rows.map((row, rowIndex) => (
            <div
              key={row.title}
              style={{
                display: "grid",
                gridTemplateColumns: "180px 60px 1fr 60px",
                alignItems: "center",
                gap: "16px",
              }}
            >
              {/* Category */}
              <div
                style={{
                  background: "#15698a",
                  border: "2px solid #0b3f56",
                  height: "64px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                }}
              >
                {row.title}
              </div>

              {/* Left Arrow */}
              <button
                onClick={() => prev(rowIndex)}
                style={{
                  height: "50px",
                  cursor: "pointer",
                  background: "transparent",
                  border: "none",
                  fontSize: "28px",
                  color: "#15698a",
                }}
              >
                ←
              </button>

              {/* Tiles */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "16px",
                }}
              >
                {visible[rowIndex].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#15698a",
                      border: "2px solid #0b3f56",
                      height: "64px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 500,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={() => next(rowIndex)}
                style={{
                  height: "50px",
                  cursor: "pointer",
                  background: "transparent",
                  border: "none",
                  fontSize: "28px",
                  color: "#15698a",
                }}
              >
                →
              </button>
            </div>
          ))}
        </div>

        {/* Back */}
        <div style={{ marginTop: "40px" }}>
          <a
            href="/dashboard"
            style={{
              display: "inline-block",
              background: "white",
              color: "black",
              padding: "12px 18px",
              borderRadius: "12px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}
