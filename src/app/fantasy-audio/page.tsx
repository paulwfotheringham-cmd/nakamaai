"use client";

import { Suspense, useMemo, useState, useRef, useEffect, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { StaticImageData } from "next/image";
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

const AUDIOBOOK_LENGTH_OPTIONS = ["5 mins", "10 mins", "15 mins", "more"] as const;
type AudiobookLength = (typeof AUDIOBOOK_LENGTH_OPTIONS)[number];

/* Category/item labels: keep in sync with lib/fantasy-audio-category-options.ts (admin uploads). */
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

const SHELF_TITLES = [
  "Continue Listening",
  "Popular This Week",
  "Recommended For You",
  "New Releases",
  "Trending Fantasy",
  "Paranormal Stories",
  "Relationship Dynamics",
  "Historical Romance",
] as const;

const LENGTH_FILTERS: { value: AudiobookLength | null; label: string }[] = [
  { value: null, label: "All" },
  { value: "5 mins", label: "5 min" },
  { value: "10 mins", label: "10 min" },
  { value: "15 mins", label: "15 min" },
  { value: "more", label: "30+ min" },
];

const FEATURED_COPY: Record<string, string> = {
  "Anime 1": "A vivid anime-inspired fantasy — immersive voice, cinematic mood, and slow-burn tension.",
  Werewolf:
    "Moonlit transformation and primal desire — a paranormal romance that pulls you under.",
  "Star Trek": "Sci-fi seduction among the stars — explore the unknown with every listen.",
};

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
      className="fantasy-arrow-btn"
    >
      {isLeft ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

function FantasyAudioContent() {
  const searchParams = useSearchParams();
  const embed = searchParams.get("embed") === "1";

  const [positions, setPositions] = useState<number[]>(rows.map(() => 0));
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioDurations, setAudioDurations] = useState<{ [key: string]: number }>({});
  const [audiobookLength, setAudiobookLength] = useState<AudiobookLength | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [savedItems, setSavedItems] = useState<Set<string>>(() => new Set());
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

  const tileVisibleCount = embed ? 3 : 3;

  const visibleRows = useMemo(() => {
    return rows.map((row, rowIndex) => {
      const start = positions[rowIndex];
      return Array.from({ length: tileVisibleCount }, (_, offset) => {
        return row.items[(start + offset) % row.items.length];
      });
    });
  }, [positions, tileVisibleCount]);

  const filteredRowIndices = useMemo(() => {
    return rows
      .map((row, i) => ({ row, i }))
      .filter(({ row }) => !selectedCategory || row.title === selectedCategory)
      .map(({ i }) => i);
  }, [selectedCategory]);

  const featuredItem =
    currentlyPlaying ??
    ("Werewolf" in audioFiles ? "Werewolf" : Object.keys(audioFiles)[0] ?? rows[0].items[0]);
  const featuredRow =
    rows.find((row) => row.items.includes(featuredItem)) ?? rows[0];
  const featuredImageSrc =
    itemImages[featuredItem]?.src ?? featuredRow.imageSrc?.src ?? animeAudio.src;
  const featuredDuration = audioDurations[featuredItem];
  const featuredDescription =
    FEATURED_COPY[featuredItem] ??
    `An immersive ${featuredRow.title.toLowerCase()} experience — press play to begin.`;

  function toggleSaved(item: string) {
    setSavedItems((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  }

  return (
    <main className={`fantasy-page${embed ? " fantasy-page-embed" : ""}`}>
      <div className="fantasy-atmosphere" aria-hidden />
      <div className="fantasy-shell">
        <section className="fantasy-hero">
          <div
            className="fantasy-hero-art"
            style={{ backgroundImage: `url(${featuredImageSrc})` }}
          />
          <div className="fantasy-hero-overlay" />
          <div className="fantasy-hero-glow" aria-hidden />
          <div className="fantasy-hero-content">
            <p className="fantasy-hero-eyebrow">{featuredRow.title}</p>
            <h1 className="fantasy-hero-title">{featuredItem}</h1>
            <p className="fantasy-hero-desc">{featuredDescription}</p>
            <div className="fantasy-hero-meta">
              {featuredDuration ? (
                <span>{formatTime(featuredDuration)}</span>
              ) : (
                <span>Immersive audio</span>
              )}
              <span className="fantasy-hero-dot" />
              <span>Fantasy Audio</span>
            </div>
            <div className="fantasy-hero-actions">
              <button
                type="button"
                className="fantasy-btn-primary"
                onClick={() => handleTileClick(featuredItem)}
              >
                {currentlyPlaying === featuredItem && isPlaying ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                className={`fantasy-btn-secondary${savedItems.has(featuredItem) ? " fantasy-btn-secondary-active" : ""}`}
                onClick={() => toggleSaved(featuredItem)}
              >
                {savedItems.has(featuredItem) ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        </section>

        {/* Category selector */}
        <section className="fantasy-categories" aria-label="Category filter">
          <div className="fantasy-categories-inner">
            <button
              type="button"
              aria-pressed={selectedCategory === null}
              onClick={() => setSelectedCategory(null)}
              className={`fantasy-cat-chip${selectedCategory === null ? " fantasy-cat-chip-active" : ""}`}
            >
              All
            </button>
            {rows.map((row) => (
              <button
                key={row.title}
                type="button"
                aria-pressed={selectedCategory === row.title}
                onClick={() => setSelectedCategory(row.title)}
                className={`fantasy-cat-chip${selectedCategory === row.title ? " fantasy-cat-chip-active" : ""}`}
              >
                {row.title}
              </button>
            ))}
          </div>
        </section>

        {/* Duration filters */}
        <section className="fantasy-filters" aria-label="Duration filters">
          <div className="fantasy-filters-inner">
            {LENGTH_FILTERS.map(({ value, label }) => {
              const active = audiobookLength === value;
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setAudiobookLength(value)}
                  className={`fantasy-filter-chip${active ? " fantasy-filter-chip-active" : ""}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="fantasy-shelves">
          {filteredRowIndices.map((rowIndex) => {
            const row = rows[rowIndex];
            return (
            <div
              key={row.title}
              className="fantasy-shelf"
              style={{ animationDelay: `${rowIndex * 60}ms` }}
            >
              <div className="fantasy-shelf-header">
                <h2 className="fantasy-shelf-title">{SHELF_TITLES[rowIndex] ?? row.title}</h2>
                <span className="fantasy-shelf-sub">{row.title}</span>
              </div>

              <div className="fantasy-shelf-carousel">
                <ArrowButton direction="left" onClick={() => goPrev(rowIndex)} />

                <div className="fantasy-tiles">
                  {visibleRows[rowIndex].map((item, itemIndex) => (
                    <div key={`${row.title}-${item}-${itemIndex}`} className="fantasy-tile-wrap">
                      <button
                        type="button"
                        className={`fantasy-tile ${
                          audioFiles[item] ? "fantasy-tile-playable" : ""
                        } ${
                          currentlyPlaying === item && isPlaying ? "fantasy-tile-playing" : ""
                        }`}
                        onClick={() => handleTileClick(item)}
                        style={
                          itemImages[item]
                            ? {
                                backgroundImage: `url(${itemImages[item].src})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }
                            : undefined
                        }
                      >
                        <div className="fantasy-tile-shine" aria-hidden />
                        <div className="fantasy-tile-gradient" aria-hidden />
                        <div className="fantasy-tile-play">
                          {currentlyPlaying === item && isPlaying ? "⏸" : "▶"}
                        </div>
                        <div className="fantasy-tile-body">
                          <span className="fantasy-tile-title">{item}</span>
                          <div className="fantasy-tile-meta">
                            {row.title}
                            {audioFiles[item] && audioDurations[item] ? (
                              <>
                                <span className="fantasy-tile-meta-dot" />
                                {formatTime(audioDurations[item])}
                              </>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>

                <ArrowButton direction="right" onClick={() => goNext(rowIndex)} />
              </div>
            </div>
            );
          })}
        </section>

        {!embed && (
          <div className="fantasy-footer">
            <a href="/dashboard" className="fantasy-back">
              Back to Dashboard
            </a>
            <div className="fantasy-footer-copy">
              Browse and refine your preferred fantasy style.
            </div>
          </div>
        )}
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
          position: relative;
          min-height: 100vh;
          background: #050505;
          color: #e7e5e4;
          padding: 0 0 88px;
          scroll-behavior: smooth;
        }

        .fantasy-atmosphere {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background:
            radial-gradient(ellipse 90% 50% at 50% -10%, rgba(180, 130, 50, 0.12), transparent 55%),
            radial-gradient(ellipse 40% 30% at 100% 20%, rgba(120, 80, 30, 0.06), transparent 50%);
        }

        .fantasy-page-embed {
          width: 100%;
          min-height: 100%;
          height: 100%;
          padding: 0;
          margin: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .fantasy-shell {
          position: relative;
          z-index: 1;
          max-width: none;
          margin: 0;
          display: flex;
          flex-direction: column;
          min-height: 100%;
        }

        .fantasy-page-embed .fantasy-shell {
          flex: 1;
          min-height: 0;
          min-width: 0;
        }

        /* ── Hero ── */
        .fantasy-hero {
          position: relative;
          min-height: clamp(220px, 38vh, 420px);
          overflow: hidden;
          flex-shrink: 0;
        }

        .fantasy-hero-art {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center 20%;
          transform: scale(1.02);
          transition: transform 8s ease;
        }

        .fantasy-hero:hover .fantasy-hero-art {
          transform: scale(1.06);
        }

        .fantasy-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(5, 5, 5, 0.95) 0%,
            rgba(5, 5, 5, 0.72) 42%,
            rgba(5, 5, 5, 0.25) 100%
          );
        }

        .fantasy-hero-overlay::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(5, 5, 5, 1) 0%,
            rgba(5, 5, 5, 0.4) 35%,
            transparent 100%
          );
        }

        .fantasy-hero-glow {
          position: absolute;
          bottom: -20%;
          left: 10%;
          width: 50%;
          height: 60%;
          background: radial-gradient(ellipse, rgba(198, 164, 106, 0.15), transparent 70%);
          pointer-events: none;
        }

        .fantasy-hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          min-height: inherit;
          padding: clamp(20px, 4vw, 40px) clamp(16px, 4vw, 40px) clamp(24px, 5vw, 36px);
          max-width: 640px;
        }

        .fantasy-hero-eyebrow {
          margin: 0 0 8px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(251, 191, 36, 0.75);
        }

        .fantasy-hero-title {
          margin: 0;
          font-family: ui-serif, Georgia, "Times New Roman", serif;
          font-size: clamp(1.75rem, 4.5vw, 3rem);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: #fafaf9;
        }

        .fantasy-hero-desc {
          margin: 12px 0 0;
          font-size: clamp(0.8125rem, 1.8vw, 0.9375rem);
          line-height: 1.55;
          color: rgba(231, 229, 228, 0.82);
          max-width: 520px;
        }

        .fantasy-hero-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 14px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(168, 162, 158, 0.9);
        }

        .fantasy-hero-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(198, 164, 106, 0.7);
        }

        .fantasy-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 20px;
        }

        .fantasy-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 120px;
          padding: 12px 28px;
          border: none;
          border-radius: 999px;
          background: linear-gradient(180deg, #fde68a 0%, #d97706 100%);
          color: #1c1917;
          font-size: 0.9375rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 24px rgba(198, 164, 106, 0.3);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .fantasy-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(198, 164, 106, 0.4);
        }

        .fantasy-btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 100px;
          padding: 12px 24px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.45);
          color: #e7e5e4;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: border-color 0.25s ease, background 0.25s ease;
        }

        .fantasy-btn-secondary:hover {
          border-color: rgba(198, 164, 106, 0.35);
          background: rgba(0, 0, 0, 0.6);
        }

        .fantasy-btn-secondary-active {
          border-color: rgba(198, 164, 106, 0.45);
          color: #fde68a;
        }

        /* ── Category selector ── */
        .fantasy-categories {
          flex-shrink: 0;
          padding: 20px clamp(16px, 4vw, 40px) 0;
        }
        .fantasy-categories-inner {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-bottom: 2px;
        }
        .fantasy-categories-inner::-webkit-scrollbar { display: none; }
        .fantasy-cat-chip {
          flex-shrink: 0;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          color: rgba(245, 242, 235, 0.55);
          font-size: 0.8125rem;
          font-weight: 500;
          padding: 0.5rem 1.125rem;
          cursor: pointer;
          white-space: nowrap;
          transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
          outline: none;
        }
        .fantasy-cat-chip:hover {
          border-color: rgba(212, 175, 55, 0.35);
          color: rgba(245, 242, 235, 0.9);
          background: rgba(212, 175, 55, 0.06);
        }
        .fantasy-cat-chip-active {
          border-color: rgba(212, 175, 55, 0.65);
          background: rgba(212, 175, 55, 0.12);
          color: rgba(212, 175, 55, 0.95);
        }

        /* ── Filters ── */
        .fantasy-filters {
          flex-shrink: 0;
          padding: 12px clamp(16px, 4vw, 40px) 8px;
        }

        .fantasy-filters-inner {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .fantasy-filter-chip {
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.4);
          color: #a8a29e;
          font-size: 0.8125rem;
          font-weight: 600;
          padding: 9px 18px;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .fantasy-filter-chip:hover {
          border-color: rgba(198, 164, 106, 0.3);
          color: #fef3c7;
        }

        .fantasy-filter-chip-active {
          border-color: rgba(251, 191, 36, 0.5);
          background: linear-gradient(180deg, rgba(253, 230, 138, 0.95) 0%, rgba(217, 119, 6, 0.92) 100%);
          color: #1c1917;
          box-shadow: 0 0 20px rgba(198, 164, 106, 0.25);
        }

        /* ── Shelves ── */
        .fantasy-shelves {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 16px clamp(16px, 4vw, 40px) 32px;
          display: flex;
          flex-direction: column;
          gap: clamp(28px, 5vw, 48px);
        }

        .fantasy-page-embed .fantasy-shelves {
          flex: 1;
          min-height: 0;
        }

        .fantasy-shelf {
          animation: shelfIn 0.55s ease both;
        }

        @keyframes shelfIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fantasy-shelf-header {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 14px;
        }

        .fantasy-shelf-title {
          margin: 0;
          font-family: ui-serif, Georgia, "Times New Roman", serif;
          font-size: clamp(1.05rem, 2.2vw, 1.35rem);
          font-weight: 600;
          color: #fafaf9;
        }

        .fantasy-shelf-sub {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(168, 162, 158, 0.55);
        }

        .fantasy-shelf-carousel {
          display: grid;
          grid-template-columns: 2.5rem minmax(0, 1fr) 2.5rem;
          gap: 8px;
          align-items: center;
        }

        .fantasy-arrow-btn {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.55);
          color: #d8b26e;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s ease;
          flex-shrink: 0;
          backdrop-filter: blur(8px);
        }

        .fantasy-arrow-btn:hover {
          transform: scale(1.06);
          background: rgba(198, 164, 106, 0.15);
          border-color: rgba(198, 164, 106, 0.35);
          box-shadow: 0 0 16px rgba(198, 164, 106, 0.2);
        }

        .fantasy-tiles {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          min-width: 0;
        }

        .fantasy-tile-wrap {
          min-width: 0;
        }

        .fantasy-tile {
          position: relative;
          width: 100%;
          min-height: clamp(10rem, 22vw, 13.5rem);
          border: none;
          border-radius: 14px;
          background-color: #18181b;
          background-size: cover;
          background-position: center;
          color: #fafaf9;
          cursor: pointer;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease, filter 0.4s ease;
        }

        .fantasy-tile:hover {
          transform: scale(1.04) translateY(-4px);
          box-shadow: 0 20px 56px rgba(0, 0, 0, 0.55), 0 0 32px rgba(198, 164, 106, 0.12);
          filter: brightness(1.06);
          z-index: 2;
        }

        .fantasy-tile-gradient {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.92) 0%,
            rgba(0, 0, 0, 0.35) 45%,
            rgba(0, 0, 0, 0.08) 100%
          );
          pointer-events: none;
        }

        .fantasy-tile-shine {
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0;
          background: radial-gradient(ellipse at 50% 100%, rgba(198, 164, 106, 0.2), transparent 65%);
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .fantasy-tile:hover .fantasy-tile-shine {
          opacity: 1;
        }

        .fantasy-tile-play {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 3;
          transform: translate(-50%, -50%) scale(0.85);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(198, 164, 106, 0.92);
          color: #1c1917;
          font-size: 14px;
          font-weight: 700;
          opacity: 0;
          transition: opacity 0.3s ease, transform 0.3s ease;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
        }

        .fantasy-tile-playable:hover .fantasy-tile-play,
        .fantasy-tile-playing .fantasy-tile-play {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }

        .fantasy-tile-body {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          padding: 14px 14px 16px;
          text-align: left;
        }

        .fantasy-tile-title {
          display: block;
          font-family: ui-serif, Georgia, serif;
          font-size: 0.9375rem;
          font-weight: 600;
          line-height: 1.25;
          color: #fafaf9;
        }

        .fantasy-tile-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
          font-size: 11px;
          font-weight: 500;
          color: rgba(231, 229, 228, 0.55);
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .fantasy-tile:hover .fantasy-tile-meta,
        .fantasy-tile-playing .fantasy-tile-meta {
          opacity: 1;
          transform: translateY(0);
        }

        .fantasy-tile-meta-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(198, 164, 106, 0.6);
        }

        .fantasy-tile-playable {
          outline: 1px solid rgba(198, 164, 106, 0.12);
        }

        .fantasy-tile-playing {
          outline: 2px solid rgba(251, 191, 36, 0.55);
          box-shadow: 0 0 24px rgba(198, 164, 106, 0.2);
        }

        .fantasy-footer {
          margin-top: 8px;
          padding: 0 clamp(16px, 4vw, 40px) 24px;
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
          background: linear-gradient(180deg, #fde68a 0%, #d97706 100%);
          color: #0c0a09;
          padding: 12px 18px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.875rem;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
          transition: transform 0.2s ease;
        }

        .fantasy-back:hover {
          transform: translateY(-1px);
        }

        .fantasy-footer-copy {
          color: #78716c;
          font-size: 0.875rem;
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
          padding: 12px 20px;
          background: rgba(9, 9, 11, 0.97);
          border-top: 1px solid rgba(120, 53, 15, 0.25);
          backdrop-filter: blur(16px);
          box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.55);
        }

        .fantasy-page-embed .fantasy-player {
          position: sticky;
          bottom: 0;
          width: 100%;
          max-width: none;
          margin: 0;
        }

        .fantasy-page-embed .fantasy-hero {
          min-height: clamp(180px, 32vh, 320px);
        }

        .fantasy-page-embed .fantasy-filters {
          padding: 14px 16px 6px;
        }

        .fantasy-page-embed .fantasy-shelves {
          padding: 12px 16px 20px;
          gap: 28px;
        }

        .fantasy-page-embed .fantasy-filter-chip {
          font-size: 0.75rem;
          padding: 7px 14px;
        }

        .fantasy-page-embed .fantasy-tiles {
          gap: 10px;
        }

        .fantasy-page-embed .fantasy-tile {
          min-height: clamp(8.5rem, 18vw, 11rem);
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
          color: rgba(255, 255, 255, 0.5);
          font-variant-numeric: tabular-nums;
        }

        .fantasy-player-playbtn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid rgba(216, 178, 110, 0.5);
          background: rgba(216, 178, 110, 0.15);
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
          background: rgba(216, 178, 110, 0.28);
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
          box-shadow: 0 0 6px rgba(216, 178, 110, 0.6);
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
          border: 1px solid rgba(216, 178, 110, 0.35);
          background: rgba(216, 178, 110, 0.1);
          color: #d8b26e;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .fantasy-player-download:hover {
          background: rgba(216, 178, 110, 0.2);
        }

        @media (max-width: 760px) {
          .fantasy-tiles {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .fantasy-shelf-carousel {
            grid-template-columns: 2rem minmax(0, 1fr) 2rem;
          }

          .fantasy-hero-content {
            max-width: none;
          }
        }

        @media (max-width: 520px) {
          .fantasy-tiles {
            grid-template-columns: 1fr;
          }

          .fantasy-shelf-sub {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}

export default function FantasyAudioPage() {
  return (
    <Suspense
      fallback={
        <main className="fantasy-page fantasy-page-embed flex min-h-[200px] items-center justify-center text-sm text-stone-400">
          Loading…
        </main>
      }
    >
      <FantasyAudioContent />
    </Suspense>
  );
}
