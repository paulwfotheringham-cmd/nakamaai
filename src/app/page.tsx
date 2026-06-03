"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/* ── Fantasy scenes carousel data ─────────────────────── */

const fantasyScenes = [
  { title: "GOTHIC",     displayTitle: "GOTHIC",         subtitle: "A windswept moor with a brooding stranger",             image: "/scenes/moor.jpg" },
  { title: "PIRATE",     displayTitle: "HISTORICAL",     subtitle: "A pirate ship on the high seas",                        image: "/scenes/pirate.jpg" },
  { title: "ROME",       displayTitle: "HISTORICAL",     subtitle: "A secret love in ancient Rome",                         image: "/scenes/rome.jpg" },
  { title: "WEREWOLF",   displayTitle: "SUPERNATURAL",   subtitle: "A werewolf who only comes out at night",                image: "/scenes/werewolf.jpg" },
  { title: "ALIEN",      displayTitle: "ALIEN",          subtitle: "An alien encounter on a distant world",                 image: "/scenes/alien.jpg" },
  { title: "OFFICE",     displayTitle: "MODERN",         subtitle: "A dangerous attraction in the office",                  image: "/scenes/office.jpg" },
  { title: "NEW_TILE_1", displayTitle: "ANIME / HENTAI", subtitle: "Fun with your hero",                                    image: "/tiles/anime.jpg" },
  { title: "NEW_TILE_2", displayTitle: "SUPERNATURAL",   subtitle: "Meet the Darkest Vampire",                              image: "/tiles/vampire.jpg" },
  { title: "NEW_TILE_3", displayTitle: "SUPERNATURAL",   subtitle: "Horny Dragons",                                         image: "/tiles/dragon.jpg" },
  { title: "NEW_TILE_4", displayTitle: "SCI FI",         subtitle: "The space commander has requested your presence",       image: "/tiles/space.jpg" },
  { title: "NEW_TILE_6", displayTitle: "MODERN",         subtitle: "Kinky play with a sugar daddy",                         image: "/tiles/daddy.jpg" },
  { title: "NEW_TILE_7", displayTitle: "MODERN",         subtitle: "A slow and passionate story to excite and pleasure",    image: "/tiles/slowburn.jpg" },
  { title: "NEW_TILE_8", displayTitle: "MODERN",         subtitle: "Your nemesis who becomes your lover",                   image: "/tiles/lover.jpg" },
  { title: "NEW_TILE_9", displayTitle: "DARK & EROTIC",  subtitle: "Taboo's uncovered",                                    image: "/tiles/taboo.jpg" },
  { title: "NEW_TILE_10",displayTitle: "DARK & EROTIC",  subtitle: "BDSM and Fetish",                                      image: "/tiles/bdsm.jpg" },
  { title: "NEW_TILE_11",displayTitle: "DARK & EROTIC",  subtitle: "Powerplay",                                             image: "/tiles/powerplay.jpg" },
  { title: "NEW_TILE_12",displayTitle: "MODERN",         subtitle: "Holiday romance on an executive yacht",                 image: "/tiles/boat.jpg" },
  { title: "NEW_TILE_13",displayTitle: "MODERN",         subtitle: "Voyeurism — A public beach encounter",                  image: "/tiles/voyeur.jpg" },
];

const sceneAmbience: Record<string, string> = {
  GOTHIC:   "https://cdn.pixabay.com/audio/2022/10/16/audio_12b862f76b.mp3",
  PIRATE:   "https://cdn.pixabay.com/audio/2022/03/10/audio_c8b09af0ab.mp3",
  ROME:     "https://cdn.pixabay.com/audio/2021/08/08/audio_dc39d58f77.mp3",
  WEREWOLF: "https://cdn.pixabay.com/audio/2022/02/23/audio_febc508f3e.mp3",
  ALIEN:    "https://cdn.pixabay.com/audio/2022/01/18/audio_d1718ab41b.mp3",
  OFFICE:   "https://cdn.pixabay.com/audio/2022/03/15/audio_c9fde3e71b.mp3",
};

/* ── Universe experiences ──────────────────────────────── */

const EXPERIENCES = [
  {
    id: "audiobooks",
    label: "IMMERSIVE AUDIO",
    title: "Audiobooks",
    desc: "Surrender to curated fantasy narration. Premium voices. Intimate worlds.",
    image: "/tiles/tile1.jpg",
  },
  {
    id: "build-adventure",
    label: "INTERACTIVE",
    title: "Build Adventure",
    desc: "Shape your fantasy in real time. Choose the path. Feel every turn.",
    image: "/tiles/tile2.jpg",
  },
  {
    id: "interactive-adventures",
    label: "LIVE STORY",
    title: "Interactive Adventures",
    desc: "You direct the scene. The story breathes around your choices.",
    image: "/tiles/tile3.jpg",
  },
  {
    id: "forbidden-chat",
    label: "PRIVATE DESIRES",
    title: "Forbidden Chat",
    desc: "Say what you have never said. A conversation without consequence.",
    image: "/tiles/tile4.jpg",
  },
  {
    id: "reignite",
    label: "FOR COUPLES",
    title: "Reignite",
    desc: "Date Night. Surprise Mode. The Reconnection Series. For two.",
    image: "/tiles/tile5.jpg",
  },
];

/* ── Scene atmosphere effects ─────────────────────────── */

function SceneAtmosphere({ title, isActive }: { title: string; isActive: boolean }) {
  const o = isActive ? "opacity-100" : "opacity-45";
  if (title === "GOTHIC") return (
    <div className={`pointer-events-none absolute inset-0 ${o}`}>
      <div className="fog-layer-1 absolute -inset-x-10 bottom-0 h-28 rounded-full bg-stone-200/20 blur-2xl" />
      <div className="fog-layer-2 absolute -inset-x-14 bottom-6 h-24 rounded-full bg-stone-300/20 blur-xl" />
    </div>
  );
  if (title === "WEREWOLF") return (
    <div className={`pointer-events-none absolute inset-0 ${o}`}>
      <div className="moon-pulse absolute right-5 top-4 h-14 w-14 rounded-full bg-slate-200/25 blur-md" />
      <div className="mist-drift absolute -inset-x-8 bottom-2 h-20 rounded-full bg-slate-300/20 blur-2xl" />
    </div>
  );
  if (title === "ALIEN") return (
    <div className={`pointer-events-none absolute inset-0 ${o}`}>
      <div className="alien-cloud-1 absolute -left-8 top-6 h-24 w-24 rounded-full bg-fuchsia-300/20 blur-2xl" />
      <div className="alien-cloud-2 absolute right-0 top-14 h-20 w-28 rounded-full bg-cyan-300/20 blur-2xl" />
    </div>
  );
  if (title === "ROME") return (
    <div className={`pointer-events-none absolute inset-0 ${o}`}>
      <div className="candle-glow absolute inset-x-6 bottom-10 h-20 rounded-full bg-amber-200/20 blur-2xl" />
    </div>
  );
  return null;
}

/* ── Page ──────────────────────────────────────────────── */

export default function Page() {
  const router = useRouter();
  const [activeScene, setActiveScene] = useState(2);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [ambientEnabled, setAmbientEnabled] = useState(false);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const fantasySceneCount = fantasyScenes.length;

  function stopAllAmbience() {
    Object.values(audioRefs.current).forEach((a) => { if (a) { a.pause(); a.currentTime = 0; } });
  }

  function playAmbienceForTitle(title: string) {
    if (!ambientEnabled) return;
    const target = audioRefs.current[title];
    if (!target) return;
    Object.entries(audioRefs.current).forEach(([t, a]) => { if (a && t !== title) { a.pause(); a.currentTime = 0; } });
    target.volume = 0.12;
    target.loop = true;
    void target.play().catch(() => {});
  }

  useEffect(() => {
    if (!ambientEnabled) { stopAllAmbience(); return; }
    playAmbienceForTitle(fantasyScenes[activeScene]?.title ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ambientEnabled, activeScene]);

  function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) return;
    router.push(`/set-password?email=${encodeURIComponent(email.trim())}&name=${encodeURIComponent(firstName.trim())}`);
  }

  return (
    <div className="bg-[#080808] text-stone-200">

      {/* ── HEADER ───────────────────────────────────────── */}
      <header className="hp-header">
        <Link href="/" className="shrink-0">
          <img
            src="/Nakama-AI-July25-White.png"
            alt="Nakama Nights"
            className="block h-[4.5rem] w-auto object-contain sm:h-[5.5rem]"
          />
        </Link>
        <nav className="ml-auto flex items-center gap-3">
          <a href="#universe" className="hp-nav-link">Experiences</a>
          <a href="#membership" className="hp-nav-link">Membership</a>
          <Link href="/login" className="hp-nav-link">Login</Link>
          <Link href="/select-plan" className="hp-cta-btn">
            Join Nakama Nights
          </Link>
        </nav>
      </header>

      {/* ── SECTION 1: HERO ──────────────────────────────── */}
      <section className="hp-hero">
        <img
          src="/scenes/moor.jpg"
          alt=""
          className="hp-hero-bg"
        />
        <div className="hp-hero-overlay-left" />
        <div className="hp-hero-overlay-top" />
        <div className="hp-hero-overlay-bottom" />

        <div className="hp-hero-content">
          <p className="hp-hero-eyebrow">Nakama Nights</p>

          <div className="hp-hero-pillars">
            <span className="hp-pillar hp-pillar-1">Fantasy</span>
            <span className="hp-pillar hp-pillar-2">Escape</span>
            <span className="hp-pillar hp-pillar-3">Pleasure</span>
          </div>

          <p className="hp-hero-tagline">Private fantasy experiences for women.</p>

          <div className="hp-hero-cta">
            <Link href="/select-plan" className="hp-cta-btn hp-cta-btn-lg">
              Join Nakama Nights
            </Link>
            <p className="hp-hero-cta-note">10 days free · No charge today</p>
          </div>
        </div>

        <div className="hp-hero-scroll-hint" aria-hidden>
          <span />
        </div>
      </section>

      {/* ── SECTION 2: THE UNIVERSE ──────────────────────── */}
      <section id="universe" className="hp-section hp-section-universe">
        <div className="hp-section-inner">
          <div className="hp-section-header">
            <p className="hp-eyebrow">The Nakama Nights Universe</p>
            <h2 className="hp-section-title">Five ways to enter.</h2>
            <p className="hp-section-subtitle">
              Choose your path. Every experience is private, immersive and entirely your own.
            </p>
          </div>

          <div className="hp-experience-grid">
            {EXPERIENCES.map((exp) => (
              <div key={exp.id} className="hp-exp-card">
                <div className="hp-exp-card-img-wrap">
                  <img src={exp.image} alt="" className="hp-exp-card-img" />
                  <div className="hp-exp-card-overlay" />
                  <p className="hp-exp-card-label">{exp.label}</p>
                </div>
                <div className="hp-exp-card-body">
                  <h3 className="hp-exp-card-title">{exp.title}</h3>
                  <p className="hp-exp-card-desc">{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: FAVOURITE FANTASIES ───────────────── */}
      <section className="hp-section hp-section-fantasies">
        <div className="hp-section-inner">
          <div className="hp-section-header">
            <p className="hp-eyebrow">Worlds within the universe</p>
            <h2 className="hp-section-title">Favourite fantasies.</h2>
          </div>
        </div>

        <div
          className="hp-carousel-stage"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setMouse({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
          }}
        >
          {/* Nav arrows */}
          <button
            type="button"
            aria-label="Previous"
            onClick={() => setActiveScene((p) => { const n = (p - 1 + fantasySceneCount) % fantasySceneCount; playAmbienceForTitle(fantasyScenes[n]?.title ?? ""); return n; })}
            className="hp-carousel-arrow hp-carousel-arrow-left"
          >‹</button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => setActiveScene((p) => { const n = (p + 1) % fantasySceneCount; playAmbienceForTitle(fantasyScenes[n]?.title ?? ""); return n; })}
            className="hp-carousel-arrow hp-carousel-arrow-right"
          >›</button>

          {/* Cards */}
          <div className="hp-carousel-track">
            {fantasyScenes.map((scene, idx) => {
              const offset = idx - activeScene;
              const isActive = idx === activeScene;
              return (
                <div
                  key={idx}
                  onClick={() => { setActiveScene(idx); playAmbienceForTitle(scene.title); }}
                  className="hp-carousel-card"
                  style={{
                    transform: `translateX(${offset * 170}px) scale(${isActive ? 1 : 0.82}) ${isActive ? `translate(${mouse.x * 18}px,${mouse.y * 10}px)` : ""}`,
                    zIndex: 10 - Math.abs(offset),
                    opacity: isActive ? 1 : 0.18,
                  }}
                >
                  <div className="hp-carousel-card-img-wrap">
                    <img src={scene.image} alt="" className="hp-carousel-card-img" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                    <SceneAtmosphere title={scene.title} isActive={isActive} />
                  </div>
                  <div className="hp-carousel-card-info">
                    <p className="hp-carousel-card-genre">{scene.displayTitle}</p>
                    <p className="hp-carousel-card-sub">{scene.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ambient toggle */}
        <div className="hp-section-inner mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setAmbientEnabled((p) => !p)}
            className={`hp-ambient-toggle ${ambientEnabled ? "is-on" : ""}`}
          >
            {ambientEnabled ? "Ambience on" : "Enable ambience"}
          </button>
        </div>
      </section>

      {/* ── SECTION 4: WHY MEMBERS STAY ──────────────────── */}
      <section className="hp-section hp-section-pillars">
        <div className="hp-section-inner">
          <div className="hp-section-header">
            <p className="hp-eyebrow">Why members stay</p>
          </div>
          <div className="hp-pillars-grid">
            <div className="hp-pillar-block">
              <h3 className="hp-pillar-word">Private.</h3>
              <p className="hp-pillar-copy">
                Everything you explore here stays here. No judgement. No trace. A space entirely your own.
              </p>
            </div>
            <div className="hp-pillar-block">
              <h3 className="hp-pillar-word">Immersive.</h3>
              <p className="hp-pillar-copy">
                Voice-narrated stories. Live conversations. Adventures that pull you inside the fantasy.
              </p>
            </div>
            <div className="hp-pillar-block">
              <h3 className="hp-pillar-word">Personal.</h3>
              <p className="hp-pillar-copy">
                Your characters. Your voices. Your desires. A fantasy universe built around you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: MEMBERSHIP ────────────────────────── */}
      <section id="membership" className="hp-section hp-section-membership">
        <div className="hp-section-inner">
          <div className="hp-membership-card">
            <div className="hp-membership-top">
              <p className="hp-eyebrow" style={{ color: "rgba(212,175,55,0.7)" }}>Membership</p>
              <h2 className="hp-membership-title">Begin your fantasy.</h2>
              <p className="hp-membership-price">From £9.99 / month</p>
              <p className="hp-membership-trial">10 days free · No charge today</p>
            </div>

            <ul className="hp-membership-benefits">
              <li>Unlimited access to all five experiences</li>
              <li>Create your own character & voice</li>
              <li>Date Night &amp; Surprise Mode for couples</li>
              <li>New fantasies added every week</li>
              <li>Private, secure &amp; completely discreet</li>
            </ul>

            <form onSubmit={handleCreateAccount} className="hp-signup-form">
              <input
                placeholder="Your name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="hp-input"
              />
              <input
                placeholder="Your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="hp-input"
              />
              <button type="submit" className="hp-cta-btn hp-cta-btn-lg w-full justify-center">
                Create account — 10 days free
              </button>
            </form>

            <div className="hp-membership-login">
              <Link href="/login" className="hp-login-link">
                Existing members — login here
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: FINAL CTA ─────────────────────────── */}
      <section className="hp-section hp-section-final">
        <img src="/scenes/werewolf.jpg" alt="" className="hp-final-bg" />
        <div className="hp-final-overlay" />
        <div className="hp-section-inner hp-final-content">
          <p className="hp-eyebrow" style={{ color: "rgba(212,175,55,0.65)" }}>Nakama Nights</p>
          <h2 className="hp-final-title">Your fantasy is waiting.</h2>
          <Link href="/select-plan" className="hp-cta-btn hp-cta-btn-lg">
            Join Nakama Nights
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="hp-footer">
        <img src="/Nakama-AI-July25-White.png" alt="Nakama Nights" className="hp-footer-logo" />

        <div className="hp-footer-links">
          <Link href="/terms">T&amp;Cs</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/faq-support">FAQ &amp; Support</Link>
        </div>

        <div className="hp-footer-social">
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5Zm8.9 1.2a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10A5 5 0 0 1 12 7Zm0 1.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Z" />
            </svg>
          </a>
          <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M14.5 3h2.1c.2 1.6 1.1 3 2.6 3.8 1 .6 2.1.9 3.3.9v2.2a8.1 8.1 0 0 1-3.2-.7v6.2a6.4 6.4 0 1 1-5.5-6.3v2.2a4.2 4.2 0 1 0 3.3 4.1V3h-2.6Z" />
            </svg>
          </a>
        </div>

        <p className="hp-footer-copy">© 2026 Nakama Nights. All rights reserved.</p>
      </footer>

      {/* Hidden audio elements */}
      <div className="sr-only">
        {fantasyScenes.map((scene) => (
          <audio
            key={`ambience-${scene.title}`}
            ref={(el) => { audioRefs.current[scene.title] = el; }}
            src={sceneAmbience[scene.title]}
            preload="none"
          />
        ))}
      </div>

      {/* Atmosphere animations */}
      <style jsx global>{`
        .fog-layer-1 { animation: fogDriftA 8s ease-in-out infinite alternate; }
        .fog-layer-2 { animation: fogDriftB 6.5s ease-in-out infinite alternate; }
        .moon-pulse  { animation: moonGlow 2.8s ease-in-out infinite; }
        .mist-drift  { animation: mistRoll 4.2s ease-in-out infinite alternate; }
        .alien-cloud-1 { animation: alienCloudA 7s ease-in-out infinite alternate; }
        .alien-cloud-2 { animation: alienCloudB 9s ease-in-out infinite alternate; }
        .candle-glow { animation: emberPulse 1.6s ease-in-out infinite; }

        @keyframes fogDriftA   { from { transform: translateX(-8px); }  to { transform: translateX(8px); } }
        @keyframes fogDriftB   { from { transform: translateX(14px); } to { transform: translateX(-12px); } }
        @keyframes moonGlow    { 0%,100% { opacity:.35; } 50% { opacity:.65; } }
        @keyframes mistRoll    { from { transform:translateX(-20px) translateY(0);opacity:.2; } to { transform:translateX(20px) translateY(-6px);opacity:.36; } }
        @keyframes alienCloudA { from { transform:translateX(-10px) translateY(0); } to { transform:translateX(14px) translateY(-7px); } }
        @keyframes alienCloudB { from { transform:translateX(6px) translateY(3px); } to { transform:translateX(-8px) translateY(-5px); } }
        @keyframes emberPulse  { 0%,100% { opacity:.38;transform:scale(.92); } 50% { opacity:.82;transform:scale(1.1); } }
      `}</style>
    </div>
  );
}
