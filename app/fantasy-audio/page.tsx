"use client";

import { useMemo, useState, useRef, useEffect, type ReactNode } from "react";
import Image, { StaticImageData } from "next/image";
import animeAudio from "./animeaudio.jpg";
import werewolfImg from "./Images each category/werewolf.jpg";
import animeImg from "./Images each category/anime3.jpg";
import alienImg from "./Images each category/alien.jpg";

type Row = {
  title: string;
  items: string[];
  thumbnailLabel: string;
  imageSrc?: StaticImageData;
  icon?: ReactNode;
};

const rows: Row[] = [
  {
    title: "Anime / Hentai",
    items: ["Anime 1", "Anime 2", "Hentai 1", "Hentai 2"],
    thumbnailLabel: "Anime / Hentai",
    imageSrc: animeAudio,
  },
  {
    title: "Paranormal & Supernatural",
    items: ["Werewolf", "Ghost", "Devil", "Angel"],
    thumbnailLabel: "Paranormal & Supernatural",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M26 8C26 8 16 14 16 24C16 34 24 40 26 40C14 40 5 33 5 24C5 15 13 8 26 8Z" fill="#c9a96a" opacity="0.9"/>
        <circle cx="34" cy="11" r="2.5" fill="#e5c888" opacity="0.9"/>
        <circle cx="40" cy="19" r="1.8" fill="#e5c888" opacity="0.7"/>
        <circle cx="30" cy="7" r="1.5" fill="#e5c888" opacity="0.7"/>
        <circle cx="42" cy="12" r="1.2" fill="#e5c888" opacity="0.5"/>
      </svg>
    ),
  },
  {
    title: "Fairy Tales & Monsters",
    items: ["Dragon", "Witch", "Wizard", "Dwarf"],
    thumbnailLabel: "Fairy Tales",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <line x1="10" y1="40" x2="34" y2="16" stroke="#c9a96a" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="36" cy="14" r="5" fill="#e5c888" opacity="0.85"/>
        <path d="M40 5L41.8 10.2L47 12L41.8 13.8L40 19L38.2 13.8L33 12L38.2 10.2Z" fill="#e5c888" opacity="0.9"/>
        <path d="M14 10L15.2 13.2L18.5 14.5L15.2 15.8L14 19L12.8 15.8L9.5 14.5L12.8 13.2Z" fill="#c9a96a" opacity="0.7"/>
        <path d="M42 33L43 36L46 37L43 38L42 41L41 38L38 37L41 36Z" fill="#c9a96a" opacity="0.6"/>
      </svg>
    ),
  },
  {
    title: "Sci-Fi / Alien",
    items: ["Star Trek", "Battlestar Galactica", "Alien 1", "Alien 2"],
    thumbnailLabel: "Sci-Fi / Alien",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <ellipse cx="24" cy="30" rx="19" ry="6" fill="#7c6aff" opacity="0.35" stroke="#c9a96a" strokeWidth="1.5"/>
        <path d="M14 30C14 24 18.5 16 24 14C29.5 16 34 24 34 30Z" fill="#7c6aff" opacity="0.75"/>
        <ellipse cx="24" cy="14" rx="7" ry="5.5" fill="#9b8fff" opacity="0.8"/>
        <circle cx="15" cy="32" r="2" fill="#e5c888" opacity="0.85"/>
        <circle cx="24" cy="34" r="2" fill="#e5c888" opacity="0.85"/>
        <circle cx="33" cy="32" r="2" fill="#e5c888" opacity="0.85"/>
      </svg>
    ),
  },
  {
    title: "Power Dynamics",
    items: ["Sub 1", "Sub 2", "Dom 1", "Dom 2"],
    thumbnailLabel: "Power Dynamics",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M8 36L8 20L16 30L24 10L32 30L40 20L40 36Z" fill="#c9a96a" opacity="0.85"/>
        <rect x="8" y="36" width="32" height="5" rx="2.5" fill="#d8b26e" opacity="0.9"/>
        <circle cx="24" cy="10" r="3.5" fill="#e5c888"/>
        <circle cx="8" cy="20" r="3" fill="#e5c888"/>
        <circle cx="40" cy="20" r="3" fill="#e5c888"/>
      </svg>
    ),
  },
  {
    title: "Modern",
    items: ["Office", "Travel", "Outdoors", "Stranger Encounter"],
    thumbnailLabel: "Modern",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="4" y="24" width="8" height="18" rx="1" fill="#c9a96a" opacity="0.65"/>
        <rect x="14" y="16" width="10" height="26" rx="1" fill="#c9a96a" opacity="0.85"/>
        <rect x="26" y="20" width="8" height="22" rx="1" fill="#c9a96a" opacity="0.75"/>
        <rect x="36" y="26" width="8" height="16" rx="1" fill="#c9a96a" opacity="0.6"/>
        <rect x="19" y="11" width="2" height="5" rx="1" fill="#e5c888"/>
        <rect x="4" y="40" width="40" height="2" rx="1" fill="#e5c888" opacity="0.35"/>
        <rect x="17" y="26" width="3" height="4" rx="0.5" fill="#e5c888" opacity="0.5"/>
        <rect x="22" y="26" width="3" height="4" rx="0.5" fill="#e5c888" opacity="0.5"/>
      </svg>
    ),
  },
  {
    title: "Dark & Erotic",
    items: ["Obsession", "Seduction", "Forbidden", "After Dark"],
    thumbnailLabel: "Dark & Erotic",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M24 42C13 42 9 33 11 24C13 17 18 14 18 14C16 21 20 24 20 24C20 17 23 11 30 7C27 18 34 20 34 27C36 20 33 13 33 13C40 18 40 31 35 37C32 40 28 42 24 42Z" fill="#c9a96a" opacity="0.8"/>
        <path d="M24 40C18 40 15 33 17 26C19 21 22 21 22 21C21 25 24 28 24 28C24 23 27 19 29 17C28 24 32 27 31 32C30 36 27 40 24 40Z" fill="#e5c888" opacity="0.9"/>
      </svg>
    ),
  },
  {
    title: "Historical Romance",
    items: ["Victorian", "Medieval", "Pirate", "Caveman"],
    thumbnailLabel: "Historical",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="12" y="10" width="24" height="30" rx="3" stroke="#c9a96a" strokeWidth="1.5" fill="rgba(201,169,106,0.1)"/>
        <path d="M12 14C12 14 7 14 7 19C7 24 12 24 12 24" stroke="#c9a96a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M36 14C36 14 41 14 41 19C41 24 36 24 36 24" stroke="#c9a96a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <line x1="18" y1="20" x2="30" y2="20" stroke="#e5c888" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="18" y1="26" x2="30" y2="26" stroke="#e5c888" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="18" y1="32" x2="27" y2="32" stroke="#e5c888" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M28 34L32 40L24 38L16 40L20 34" stroke="#c9a96a" strokeWidth="1.2" fill="rgba(201,169,106,0.2)" strokeLinejoin="round"/>
      </svg>
    ),
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
      <div className="fantasy-category-image-wrap">
        {row.imageSrc ? (
          <Image
            src={row.imageSrc}
            alt={row.thumbnailLabel}
            width={64}
            height={64}
            className="fantasy-category-photo"
          />
        ) : row.icon ? (
          <div className="fantasy-category-icon">{row.icon}</div>
        ) : (
          <div className="fantasy-category-fallback" />
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
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioDurations, setAudioDurations] = useState<{ [key: string]: number }>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const itemImages: { [key: string]: StaticImageData } = {
    "Anime 1": animeImg,
    "Anime 2": werewolfImg,
    "Hentai 1": animeImg,
    "Hentai 2": werewolfImg,
    "Werewolf": werewolfImg,
    "Ghost": animeImg,
    "Devil": werewolfImg,
    "Angel": animeImg,
    "Dragon": werewolfImg,
    "Witch": animeImg,
    "Wizard": werewolfImg,
    "Dwarf": animeImg,
    "Star Trek": alienImg,
    "Battlestar Galactica": animeImg,
    "Alien 1": werewolfImg,
    "Alien 2": animeImg,
    "Sub 1": werewolfImg,
    "Sub 2": animeImg,
    "Dom 1": werewolfImg,
    "Dom 2": animeImg,
    "Office": werewolfImg,
    "Travel": animeImg,
    "Outdoors": werewolfImg,
    "Stranger Encounter": animeImg,
    "Obsession": werewolfImg,
    "Seduction": animeImg,
    "Forbidden": werewolfImg,
    "After Dark": animeImg,
    "Victorian": werewolfImg,
    "Medieval": animeImg,
    "Pirate": werewolfImg,
    "Caveman": animeImg,
  };

  // Audio URLs
  const audioFiles: { [key: string]: string } = {
    "Anime 1": "https://dowomlnsxwxslpydtitw.supabase.co/storage/v1/object/sign/audio/firstaudio.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZjJiZGI3MS1iNzJkLTQ2Y2MtYjUwZS1kMDYyZTU5NmEyZDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhdWRpby9maXJzdGF1ZGlvLm1wMyIsImlhdCI6MTc3NDEzNTU3MywiZXhwIjoxODA1NjcxNTczfQ.Z7lLEDEAbZD0My_312T8M2YA6GAYdHX0Qh8neROAFZ0",
    "Werewolf": "https://dowomlnsxwxslpydtitw.supabase.co/storage/v1/object/sign/audio/werewolf.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZjJiZGI3MS1iNzJkLTQ2Y2MtYjUwZS1kMDYyZTU5NmEyZDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhdWRpby93ZXJld29sZi5tcDMiLCJpYXQiOjE3NzQxMzY1OTYsImV4cCI6MTgwNTY3MjU5Nn0.hYlkbQGvo0BpzZTX6JTVrH-mryufj2ksbwXwIirSUGY",
    "Star Trek": "/sciencefiction.mp3",
  };

  // Preload durations for all audio files
  useEffect(() => {
    Object.entries(audioFiles).forEach(([name, url]) => {
      const a = new Audio();
      a.preload = "metadata";
      a.src = url;
      a.onloadedmetadata = () => {
        setAudioDurations((prev) => ({ ...prev, [name]: a.duration }));
      };
    });
  }, []);

  const handleTileClick = (item: string) => {
    if (audioFiles[item]) {
      if (currentlyPlaying === item && isPlaying) {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      } else if (currentlyPlaying === item && !isPlaying) {
        // Resume
        if (audioRef.current) {
          audioRef.current.play().catch(() => setIsPlaying(false));
          setIsPlaying(true);
        }
      } else {
        // New track
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setCurrentTime(0);
        setDuration(0);

        const audio = new Audio(audioFiles[item]);
        audioRef.current = audio;
        setCurrentlyPlaying(item);
        setIsPlaying(true);

        audio.onloadedmetadata = () => setDuration(audio.duration);
        audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
        audio.onended = () => {
          setIsPlaying(false);
          setCurrentlyPlaying(null);
          setCurrentTime(0);
        };

        audio.play().catch(() => setIsPlaying(false));
      }
    }
  };

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) audioRef.current.currentTime = val;
  }

  function handleDownload() {
    if (!currentlyPlaying || !audioFiles[currentlyPlaying]) return;
    const a = document.createElement("a");
    a.href = audioFiles[currentlyPlaying];
    a.download = `${currentlyPlaying}.mp3`;
    a.click();
  }

  function formatTime(secs: number) {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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
                    <div key={`${row.title}-${item}-${itemIndex}`} className="fantasy-tile-wrap">
                      <button
                        type="button"
                        className={`fantasy-tile ${
                          audioFiles[item] ? 'fantasy-tile-playable' : ''
                        } ${
                          currentlyPlaying === item && isPlaying ? 'fantasy-tile-playing' : ''
                        }`}
                        onClick={() => handleTileClick(item)}
                        style={itemImages[item] ? {
                          backgroundImage: `url(${itemImages[item].src})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        } : undefined}
                      >
                        <div className="fantasy-tile-content">
                          {audioFiles[item] && (
                            <div className="fantasy-tile-icon">
                              {currentlyPlaying === item && isPlaying ? '⏸️' : '▶️'}
                            </div>
                          )}
                          <span>{item}</span>
                          {audioFiles[item] && audioDurations[item] && (
                            <span className="fantasy-tile-duration">
                              {formatTime(audioDurations[item])}
                            </span>
                          )}
                        </div>
                      </button>
                    </div>
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

      {currentlyPlaying && (
        <div className="fantasy-player">
          <div className="fantasy-player-left">
            <button
              type="button"
              className="fantasy-player-playbtn"
              onClick={() => handleTileClick(currentlyPlaying)}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <div className="fantasy-player-title">{currentlyPlaying}</div>
          </div>

          <div className="fantasy-player-center">
            <div className="fantasy-player-times">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              className="fantasy-player-slider"
              min={0}
              max={duration || 100}
              step={0.5}
              value={currentTime}
              onChange={handleSeek}
              style={{
                background: `linear-gradient(to right, #d8b26e ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255,255,255,0.15) 0%)`,
              }}
            />
          </div>

          <button
            type="button"
            className="fantasy-player-download"
            onClick={handleDownload}
          >
            ↓ Download
          </button>
        </div>
      )}

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
          align-items: center;
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
          grid-template-columns: 74px 1fr;
          align-items: center;
        }

        .fantasy-category-image-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 10px;
        }

        .fantasy-category-photo {
          width: 64px;
          height: 64px;
          object-fit: cover;
          border-radius: 10px;
          display: block;
        }

        .fantasy-category-fallback {
          width: 64px;
          height: 64px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #4b5563 0%, #1f2937 100%);
          color: white;
          font-size: 24px;
          font-weight: 700;
        }

        .fantasy-category-icon {
          width: 64px;
          height: 64px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(201,169,106,0.12) 0%, rgba(124,106,255,0.1) 100%);
        }

        .fantasy-category-caption {
          padding: 12px 14px 12px 10px;
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

        .fantasy-tile-playable {
          background: linear-gradient(
            180deg,
            rgba(76, 175, 80, 0.12),
            rgba(255, 255, 255, 0.035)
          );
          border-color: rgba(76, 175, 80, 0.2);
        }

        .fantasy-tile-playable:hover {
          background: linear-gradient(
            180deg,
            rgba(76, 175, 80, 0.2),
            rgba(255, 255, 255, 0.05)
          );
          border-color: rgba(76, 175, 80, 0.4);
        }

        .fantasy-tile-playing {
          background: linear-gradient(
            180deg,
            rgba(255, 193, 7, 0.15),
            rgba(255, 255, 255, 0.035)
          );
          border-color: rgba(255, 193, 7, 0.4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22), 0 0 0 0 rgba(255, 193, 7, 0.4);
          }
          70% {
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22), 0 0 0 8px rgba(255, 193, 7, 0);
          }
          100% {
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22), 0 0 0 0 rgba(255, 193, 7, 0);
          }
        }

        .fantasy-tile-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 100%;
        }

        .fantasy-tile-icon {
          font-size: 16px;
          opacity: 0.8;
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

        .fantasy-tile-wrap {
          display: flex;
          flex-direction: column;
        }

        .fantasy-tile-duration {
          display: block;
          font-size: 11px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 4px;
          letter-spacing: 0.04em;
        }

        .fantasy-player {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 14px 28px;
          background: rgba(10, 7, 18, 0.96);
          border-top: 1px solid rgba(216, 178, 110, 0.2);
          backdrop-filter: blur(20px);
          box-shadow: 0 -8px 40px rgba(0,0,0,0.5);
        }

        .fantasy-player-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          min-width: 160px;
        }

        .fantasy-player-title {
          font-size: 13px;
          font-weight: 700;
          color: #e5c888;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .fantasy-player-center {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
        }

        .fantasy-player-times {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          font-variant-numeric: tabular-nums;
        }

        .fantasy-player-playbtn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid rgba(216,178,110,0.5);
          background: rgba(216,178,110,0.15);
          color: #d8b26e;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s;
        }

        .fantasy-player-playbtn:hover {
          background: rgba(216,178,110,0.28);
        }

        .fantasy-player-slider {
          width: 100%;
          height: 4px;
          -webkit-appearance: none;
          appearance: none;
          border-radius: 999px;
          outline: none;
          cursor: pointer;
        }

        .fantasy-player-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #d8b26e;
          cursor: pointer;
          box-shadow: 0 0 6px rgba(216,178,110,0.6);
        }

        .fantasy-player-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #d8b26e;
          cursor: pointer;
          border: none;
        }

        .fantasy-player-download {
          flex-shrink: 0;
          padding: 9px 16px;
          border-radius: 12px;
          border: 1px solid rgba(216,178,110,0.35);
          background: rgba(216,178,110,0.1);
          color: #d8b26e;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .fantasy-player-download:hover {
          background: rgba(216,178,110,0.2);
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
            grid-template-columns: 74px 1fr;
          }

          .fantasy-category-photo,
          .fantasy-category-fallback {
            width: 56px;
            height: 56px;
          }

                    .fantasy-tile {
            font-size: 16px;
          }

          .fantasy-tile-icon {
            font-size: 14px;
          }
        }
      `}</style>
    </main>
  );
}
