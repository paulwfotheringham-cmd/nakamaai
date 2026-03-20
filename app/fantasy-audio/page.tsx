"use client";

import { useMemo, useState } from "react";
import Image, { StaticImageData } from "next/image";
import animeAudio from "./animeaudio.jpg";

type Row = {
  title: string;
  items: string[];
  thumbnailLabel: string;
  thumbnailEmoji: string;
  gradient: string;
  imageSrc?: StaticImageData;
};

const rows: Row[] = [
  {
    title: "Anime / Hentai",
    items: ["Anime 1", "Anime 2", "Hentai 1", "Hentai 2"],
    thumbnailLabel: "Anime / Hentai",
    thumbnailEmoji: "🦋",
    gradient: "linear-gradient(135deg, #5cc8ff 0%, #7b61ff 52%, #ff6ec7 100%)",
    imageSrc: animeAudio,
  },
  {
    title: "Paranormal & Supernatural",
    items: ["Werewolf", "Ghost", "Devil", "Angel"],
    thumbnailLabel: "Paranormal",
    thumbnailEmoji: "🌙",
    gradient: "linear-gradient(135deg, #29323c 0%, #485563 45%, #8e9eab 100%)",
  },
  {
    title: "Fairy Tales & Monsters",
    items: ["Dragon", "Witch", "Wizard", "Dwarf"],
    thumbnailLabel: "Fairy Tales",
    thumbnailEmoji: "🐉",
    gradient: "linear-gradient(135deg, #3f2b96 0%, #a8c0ff 100%)",
  },
  {
    title: "Sci-Fi / Alien",
    items: ["Star Trek", "Battlestar Galactica", "Alien 1", "Alien 2"],
    thumbnailLabel: "Sci-Fi / Alien",
    thumbnailEmoji: "👽",
    gradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  },
  {
    title: "Power Dynamics",
    items: ["Sub 1", "Sub 2", "Dom 1", "Dom 2"],
    thumbnailLabel: "Power Dynamics",
    thumbnailEmoji: "⚡",
    gradient: "linear-gradient(135deg, #41295a 0%, #2f0743 100%)",
  },
  {
    title: "Modern",
    items: ["Office", "Travel", "Outdoors", "Stranger Encounter"],
    thumbnailLabel: "Modern",
    thumbnailEmoji: "🏙️",
    gradient: "linear-gradient(135deg, #3a6073 0%, #16222a 100%)",
  },
  {
    title: "Dark & Erotic",
    items: ["Obsession", "Seduction", "Forbidden", "After Dark"],
    thumbnailLabel: "Dark & Erotic",
    thumbnailEmoji: "🖤",
    gradient: "linear-gradient(135deg, #200122 0%, #6f0000 100%)",
  },
  {
    title: "Historical Romance",
    items: ["Victorian", "Medieval", "Pirate", "Caveman"],
    thumbnailLabel: "Historical",
    thumbnailEmoji: "👑",
    gradient: "linear-gradient(135deg, #614385 0%, #516395 100%)",
  },
];

const visibleCount = 3;

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  const isLeft = direction === "left";

  return (
    <button
      onClick={onClick}
      aria-label={isLeft ? "Previous options" : "Next options"}
      type="button"
      style={{
        width: 48,
        height: 48,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.04)",
        color: "#d8b26e",
        cursor: "pointer",
        fontSize: 22,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        backdropFilter: "blur(10px)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.background = "rgba(216,178,110,0.12)";
        e.currentTarget.style.border = "1px solid rgba(216,178,110,0.28)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.12)";
      }}
    >
      {isLeft ? "←" : "→"}
    </button>
  );
}

function CategoryThumbnail({ row }: { row: Row }) {
  return (
    <div className="fantasy-category-card">
      <div
        className="fantasy-category-image"
        style={!row.imageSrc ? { background: row.gradient } : undefined}
      >
        {row.imageSrc ? (
          <Image
            src={row.imageSrc}
            alt={row.thumbnailLabel}
            fill
            className="fantasy-category-photo"
            sizes="70px"
          />
        ) : (
          <>
            <div className="fantasy-category-glow" />
            <div className="fantasy-category-emoji">{row.thumbnailEmoji}</div>
          </>
        )}
      </div>

      <div className="fantasy-category-caption">
        <div className="fantasy-category-caption-title">{row.thumbnailLabel}</div>
      </div>
    </div>
  );
}

export default function FantasyAudioPage() {
  const [positions, setPositions] = useState<number[]>(rows.map(() => 0));

  function goPrev(rowIndex: number) {
    setPositions((prev) =>
      prev.map((value, i) =>
        i === rowIndex
          ? (value - 1 + rows[i].items.length) % rows[i].items.length
          : value
      )
    );
  }

  function goNext(rowIndex: number) {
    setPositions((prev) =>
      prev.map((value, i) =>
        i === rowIndex ? (value + 1) % rows[i].items.length : value
      )
    );
  }

  const visibleRows = useMemo(() => {
    return rows.map((row, rowIndex) => {
      const start = positions[rowIndex];
      return Array.from({ length: visibleCount }, (_, offset) => {
        return row.items[(start + offset) % row.items.length];
      });
    });
  }, [positions]);

  return (
    <main className="fantasy-page">
      <div className="fantasy-shell">
        <div className="fantasy-header">
          <div className="fantasy-badge">Fantasy Audio</div>

          <h1>Choose Your Fantasy Audio</h1>

          <p>
            Explore themed story collections and scroll through each category to
            find the mood, setting, and energy you want.
          </p>
        </div>

        <section className="fantasy-panel">
          <div className="fantasy-panel-glow" />

          <div className="fantasy-panel-top">
            <div>
              <h2>Story Categories</h2>
              <p>
                Each row has its own carousel. Three options are visible at a
                time.
              </p>
            </div>

            <div className="fantasy-note">
              <span className="fantasy-note-dot" />
              Browse by mood, setting, or dynamic
            </div>
          </div>

          <div className="fantasy-rows">
            {rows.map((row, rowIndex) => (
              <div key={row.title} className="fantasy-row">
                <CategoryThumbnail row={row} />

                <div className="fantasy-arrow-wrap fantasy-arrow-left">
                  <ArrowButton
                    direction="left"
                    onClick={() => goPrev(rowIndex)}
                  />
                </div>

                <div className="fantasy-tiles">
                  {visibleRows[rowIndex].map((item, itemIndex) => (
                    <button
                      key={`${row.title}-${item}-${itemIndex}`}
                      type="button"
                      className="fantasy-tile"
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="fantasy-arrow-wrap fantasy-arrow-right">
                  <ArrowButton
                    direction="right"
                    onClick={() => goNext(rowIndex)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="fantasy-footer">
          <a href="/dashboard" className="fantasy-back">
            Back to Dashboard
          </a>

          <div className="fantasy-footer-copy">
            Browse and refine your preferred fantasy style.
          </div>
        </div>
      </div>

      <style jsx>{`
        .fantasy-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top,
              rgba(86, 49, 126, 0.22) 0%,
              rgba(7, 4, 13, 1) 34%
            ),
            linear-gradient(180deg, #09050f 0%, #07040d 100%);
          color: white;
          padding: 40px 20px 56px;
        }

        .fantasy-shell {
          max-width: 1240px;
          margin: 0 auto;
        }

        .fantasy-header {
          margin-bottom: 28px;
        }

        .fantasy-badge {
          display: inline-block;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.78);
          font-size: 13px;
          margin-bottom: 16px;
          backdrop-filter: blur(10px);
        }

        .fantasy-header h1 {
          font-size: clamp(36px, 6vw, 56px);
          line-height: 1.02;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin: 0 0 14px 0;
        }

        .fantasy-header p {
          margin: 0;
          max-width: 760px;
          font-size: 18px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.72);
        }

        .fantasy-panel {
          position: relative;
          overflow: hidden;
          border-radius: 30px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.05),
            rgba(255, 255, 255, 0.025)
          );
          padding: 28px;
          box-shadow: 0 20px 70px rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(14px);
        }

        .fantasy-panel-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(
              circle at top right,
              rgba(216, 178, 110, 0.08),
              transparent 30%
            ),
            radial-gradient(
              circle at bottom left,
              rgba(119, 90, 255, 0.08),
              transparent 28%
            );
        }

        .fantasy-panel-top {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }

        .fantasy-panel-top h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 700;
        }

        .fantasy-panel-top p {
          margin: 0;
          color: rgba(255, 255, 255, 0.62);
          font-size: 15px;
        }

        .fantasy-note {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.72);
          font-size: 14px;
        }

        .fantasy-note-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #d8b26e;
          display: inline-block;
          box-shadow: 0 0 12px rgba(216, 178, 110, 0.6);
        }

        .fantasy-rows {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .fantasy-row {
          display: grid;
          grid-template-columns: 220px 56px minmax(0, 1fr) 56px;
          gap: 14px;
          align-items: stretch;
        }

        .fantasy-category-card {
          min-height: 84px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.06),
            rgba(255, 255, 255, 0.03)
          );
          overflow: hidden;
          box-shadow:
            0 12px 28px rgba(0, 0, 0, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
          display: grid;
          grid-template-columns: 70px 1fr;
        }

        .fantasy-category-image {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .fantasy-category-photo {
          object-fit: cover;
        }

        .fantasy-category-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at top left,
            rgba(255, 255, 255, 0.28),
            transparent 55%
          );
          pointer-events: none;
        }

        .fantasy-category-emoji {
          position: relative;
          z-index: 1;
          font-size: 28px;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.28));
        }

        .fantasy-category-caption {
          padding: 12px 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .fantasy-category-caption-title {
          font-size: 15px;
          font-weight: 700;
          color: #f7f5f2;
          line-height: 1.2;
        }

        .fantasy-arrow-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fantasy-tiles {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .fantasy-tile {
          min-height: 84px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.07),
            rgba(255, 255, 255, 0.035)
          );
          color: white;
          font-size: 18px;
          font-weight: 600;
          padding: 0 18px;
          cursor: pointer;
          box-shadow:
            0 12px 28px rgba(0, 0, 0, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .fantasy-tile:hover {
          transform: translateY(-2px);
          border-color: rgba(216, 178, 110, 0.28);
          background: linear-gradient(
            180deg,
            rgba(216, 178, 110, 0.16),
            rgba(255, 255, 255, 0.05)
          );
        }

        .fantasy-footer {
          margin-top: 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .fantasy-back {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: white;
          color: black;
          padding: 14px 20px;
          border-radius: 14px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
        }

        .fantasy-footer-copy {
          color: rgba(255, 255, 255, 0.56);
          font-size: 14px;
        }

        @media (max-width: 1080px) {
          .fantasy-row {
            grid-template-columns: 1fr;
          }

          .fantasy-arrow-wrap {
            justify-content: space-between;
          }

          .fantasy-arrow-left,
          .fantasy-arrow-right {
            display: inline-flex;
          }
        }

        @media (max-width: 760px) {
          .fantasy-page {
            padding: 28px 16px 48px;
          }

          .fantasy-panel {
            padding: 20px;
            border-radius: 24px;
          }

          .fantasy-header p {
            font-size: 16px;
          }

          .fantasy-tiles {
            grid-template-columns: 1fr;
          }

          .fantasy-category-card,
          .fantasy-tile {
            min-height: 72px;
          }

          .fantasy-category-card {
            grid-template-columns: 64px 1fr;
          }

          .fantasy-category-emoji {
            font-size: 24px;
          }

          .fantasy-tile {
            font-size: 16px;
          }
        }
      `}</style>
    </main>
  );
}
