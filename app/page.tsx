"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/* ---------------- SCENES ---------------- */

const fantasyScenes = [
  {
    title: "GOTHIC",
    displayTitle: "GOTHIC",
    subtitle: "A windswept moor with a brooding stranger",
    image: "/scenes/moor.jpg",
  },
  {
    title: "PIRATE",
    displayTitle: "HISTORICAL",
    subtitle: "A pirate ship on the high seas",
    image: "/scenes/pirate.jpg",
  },
  {
    title: "ROME",
    displayTitle: "HISTORICAL",
    subtitle: "A secret love in ancient Rome",
    image: "/scenes/rome.jpg",
  },
  {
    title: "WEREWOLF",
    displayTitle: "SUPERNATURAL",
    subtitle: "A werewolf who only comes out at night",
    image: "/scenes/werewolf.jpg",
  },
  {
    title: "ALIEN",
    displayTitle: "ALIEN",
    subtitle: "An alien encounter on a distant world",
    image: "/scenes/alien.jpg",
  },
  {
    title: "OFFICE",
    displayTitle: "MODERN",
    subtitle: "A dangerous attraction in the office",
    image: "/scenes/office.jpg",
  },
  {
    title: "NEW_TILE_1",
    displayTitle: "ANIME / HENTAI",
    subtitle: "Fun with your hero",
    image: "/scenes/moor.jpg",
  },
  {
    title: "NEW_TILE_2",
    displayTitle: "SUPERNATURAL",
    subtitle: "Meet the Darkest Vampire",
    image: "/scenes/pirate.jpg",
  },
  {
    title: "NEW_TILE_3",
    displayTitle: "SUPERNATURAL",
    subtitle: "Horny Dragons",
    image: "/scenes/rome.jpg",
  },
  {
    title: "NEW_TILE_4",
    displayTitle: "SCI FI",
    subtitle:
      "The space commander has requested your presence in his Quarters",
    image: "/scenes/werewolf.jpg",
  },
  {
    title: "NEW_TILE_5",
    displayTitle: "MODERN",
    subtitle: "An intense and naughty holiday romance",
    image: "/scenes/alien.jpg",
  },
  {
    title: "NEW_TILE_6",
    displayTitle: "MODERN",
    subtitle: "Kinky play with a sugar daddy",
    image: "/scenes/office.jpg",
  },
  {
    title: "NEW_TILE_7",
    displayTitle: "MODERN",
    subtitle: "A slow and passionate story to excite and pleasure",
    image: "/scenes/moor.jpg",
  },
  {
    title: "NEW_TILE_8",
    displayTitle: "MODERN",
    subtitle: "Your nemesis who becomes your lover",
    image: "/scenes/pirate.jpg",
  },
  {
    title: "NEW_TILE_9",
    displayTitle: "DARK & EROTIC",
    subtitle: "Taboo's uncovered",
    image: "/scenes/rome.jpg",
  },
  {
    title: "NEW_TILE_10",
    displayTitle: "DARK & EROTIC",
    subtitle: "BDSM and Fetish",
    image: "/scenes/werewolf.jpg",
  },
  {
    title: "NEW_TILE_11",
    displayTitle: "DARK & EROTIC",
    subtitle: "Powerplay",
    image: "/scenes/alien.jpg",
  },
  {
    title: "NEW_TILE_12",
    displayTitle: "MODERN",
    subtitle: "Holiday romance on an executive yacht",
    image: "/scenes/office.jpg",
  },
  {
    title: "NEW_TILE_13",
    displayTitle: "MODERN",
    subtitle: "Voyerurism – A public beach encounter",
    image: "/scenes/moor.jpg",
  },
];

const sceneAmbience: Record<string, string> = {
  // Temporary hosted placeholders; replace with /public/audio/ambience/*.mp3 anytime.
  GOTHIC: "https://cdn.pixabay.com/audio/2022/10/16/audio_12b862f76b.mp3",
  PIRATE: "https://cdn.pixabay.com/audio/2022/03/10/audio_c8b09af0ab.mp3",
  ROME: "https://cdn.pixabay.com/audio/2021/08/08/audio_dc39d58f77.mp3",
  WEREWOLF: "https://cdn.pixabay.com/audio/2022/02/23/audio_febc508f3e.mp3",
  ALIEN: "https://cdn.pixabay.com/audio/2022/01/18/audio_d1718ab41b.mp3",
  OFFICE: "https://cdn.pixabay.com/audio/2022/03/15/audio_c9fde3e71b.mp3",
};

function SceneAtmosphere({
  title,
  isActive,
}: {
  title: string;
  isActive: boolean;
}) {
  const baseOpacity = isActive ? "opacity-100" : "opacity-45";

  if (title === "GOTHIC") {
    return (
      <div className={`pointer-events-none absolute inset-0 ${baseOpacity}`}>
        <div className="fog-layer-1 absolute -inset-x-10 bottom-0 h-28 rounded-full bg-stone-200/20 blur-2xl" />
        <div className="fog-layer-2 absolute -inset-x-14 bottom-6 h-24 rounded-full bg-stone-300/20 blur-xl" />
        <div className="fog-layer-3 absolute -inset-x-8 bottom-10 h-16 rounded-full bg-slate-200/15 blur-lg" />
      </div>
    );
  }

  if (title === "PIRATE") {
    return (
      <div className={`pointer-events-none absolute inset-0 ${baseOpacity}`}>
        <div className="storm-rain absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(180,190,220,0.26)_40%,transparent_70%)]" />
        <div className="sail-shadow absolute left-1/2 top-4 h-24 w-16 -translate-x-1/2 rounded-full bg-black/50 blur-md" />
        <div className="sea-glow absolute inset-x-4 bottom-0 h-12 bg-cyan-300/20 blur-xl" />
      </div>
    );
  }

  if (title === "ROME") {
    return (
      <div className={`pointer-events-none absolute inset-0 ${baseOpacity}`}>
        <div className="candle-glow absolute inset-x-6 bottom-10 h-20 rounded-full bg-amber-200/20 blur-2xl" />
        <div className="spark-drift absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(251,191,36,0.18),transparent_45%)]" />
      </div>
    );
  }

  if (title === "WEREWOLF") {
    return (
      <div className={`pointer-events-none absolute inset-0 ${baseOpacity}`}>
        <div className="moon-pulse absolute right-5 top-4 h-14 w-14 rounded-full bg-slate-200/25 blur-md" />
        <div className="mist-drift absolute -inset-x-8 bottom-2 h-20 rounded-full bg-slate-300/20 blur-2xl" />
      </div>
    );
  }

  if (title === "ALIEN") {
    return (
      <div className={`pointer-events-none absolute inset-0 ${baseOpacity}`}>
        <div className="alien-cloud-1 absolute -left-8 top-6 h-24 w-24 rounded-full bg-fuchsia-300/20 blur-2xl" />
        <div className="alien-cloud-2 absolute right-0 top-14 h-20 w-28 rounded-full bg-cyan-300/20 blur-2xl" />
        <div className="alien-cloud-3 absolute left-10 bottom-10 h-16 w-24 rounded-full bg-violet-300/15 blur-xl" />
      </div>
    );
  }

  if (title === "OFFICE") {
    return (
      <div className={`pointer-events-none absolute inset-0 ${baseOpacity}`}>
        <div className="office-blinds absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_2px,transparent_2px,transparent_10px)]" />
        <div className="office-scan absolute inset-y-0 left-0 w-10 bg-white/10 blur-md" />
        <div className="office-light absolute right-8 top-4 h-16 w-24 rounded-full bg-yellow-100/25 blur-xl" />
      </div>
    );
  }

  return null;
}

/* Short CC0 / permissive samples for hover previews (replace with your own clips in /public when ready). */
const browseServices = [
  {
    title: "AUDIOBOOKS",
    description: "Lose yourself in curated fantasy scenes",
    poster: "/tiles/tile1.jpg",
    videoSrc:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    title: "BUILD ADVENTURE",
    description: "Create your own fantasy with tone and heat on your terms",
    poster: "/tiles/tile2.jpg",
    videoSrc:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    title: "INTERACTIVE ADVENTURES",
    description: "Control your fantasy as it plays in real time",
    poster: "/tiles/tile3.jpg",
    videoSrc:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    title: "FORBIDDEN CHAT DESIRES",
    description:
      "Real time, voice to voice or messaging.",
    poster: "/tiles/tile4.jpg",
    videoSrc:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    title: "REINGITE FOR COUPLES",
    description: "Date Night Mode. Surprise Mode. The Reconnection Series.",
    poster: "/tiles/tile5.jpg",
    videoSrc:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    title: "CHARACTER & VOICES",
    description:
      "Create your character that will always be with you. In the voice you most desire",
    poster: "/tiles/tile6.jpg",
    videoSrc:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
];

function ServiceHoverVideoCard({
  title,
  description,
  poster,
}: {
  title: string;
  description: string;
  poster: string;
}) {
  return (
    <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-stone-800 bg-black shadow-lg">
      <img
        src={poster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent px-3 pb-3 pt-16">
        <h3 className="mt-0.5 whitespace-nowrap text-[10px] font-semibold leading-snug tracking-wide text-amber-100/95 sm:text-[11px]">
          {title}
        </h3>
        <p className="mt-1 text-[11px] leading-snug text-stone-200/90">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function Page() {
  const router = useRouter();

  const [activeScene, setActiveScene] = useState(2);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [ambientEnabled, setAmbientEnabled] = useState(false);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  function stopAllAmbience() {
    Object.values(audioRefs.current).forEach((audio) => {
      if (!audio) return;
      audio.pause();
      audio.currentTime = 0;
    });
  }

  function playAmbienceForTitle(title: string) {
    if (!ambientEnabled) return;

    const target = audioRefs.current[title];
    if (!target) return;

    Object.entries(audioRefs.current).forEach(([sceneTitle, audio]) => {
      if (!audio || sceneTitle === title) return;
      audio.pause();
      audio.currentTime = 0;
    });

    target.volume = 0.12;
    target.loop = true;
    void target.play().catch(() => {
      // Ignore autoplay or missing-file failures; visuals still work.
    });
  }

  useEffect(() => {
    if (!ambientEnabled) {
      stopAllAmbience();
      return;
    }
    playAmbienceForTitle(fantasyScenes[activeScene]?.title ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ambientEnabled, activeScene]);

  function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (email) params.set("email", email);
    router.push(`/select-plan?${params.toString()}`);
  }

  function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Nakama Nights Contact - ${contactName}`);
    const body = encodeURIComponent(
      `Name: ${contactName}\nEmail: ${contactEmail}\n\nMessage:\n${contactMessage}`
    );
    window.location.href = `mailto:info@nakamanights.com?subject=${subject}&body=${body}`;
  }

  return (
    <div className="min-h-screen bg-black text-stone-200">

      {/* HEADER */}
      <header className="border-b border-stone-800 bg-black/90">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="shrink-0">
            <img
              src="/Nakama-AI-July25-White.png"
              alt="Nakama"
              className="h-8"
            />
          </Link>

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/select-plan"
              className="inline-flex rounded-full border border-amber-200/50 bg-amber-100/90 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 shadow-[0_10px_28px_rgba(0,0,0,0.25)] transition hover:bg-amber-100"
            >
              10 Day Free Trial
            </Link>

            <Link
              href="/login"
              className="inline-flex rounded-full border border-amber-200/50 bg-amber-100/90 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 shadow-[0_10px_28px_rgba(0,0,0,0.25)] transition hover:bg-amber-100"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[2rem] border border-stone-700/65 bg-zinc-950 shadow-[0_0_0_1px_rgba(245,158,11,0.08),0_26px_62px_rgba(0,0,0,0.5)]">
          <img
            src="/scenes/moor.jpg"
            alt="Moor scene placeholder"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-90"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/88 via-black/58 to-black/22" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/72 via-black/26 to-black/36" />

          <div className="relative z-10 max-w-3xl p-6 sm:p-8 lg:p-10">
            <p className="font-serif text-5xl font-bold tracking-wide text-amber-300 sm:text-6xl">
              Nakama Nights
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.22em] text-stone-300">
              PREMIUM AUDIO ADULT EXPERIENCES. BUILT EXCLUSIVELY FOR WOMAN
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-amber-200/80">
              MORE THAN JUST AUDIOBOOKS
            </p>

            <div className="mt-8 space-y-3">
              <div>
                <p className="font-serif text-4xl leading-[1.08] text-white sm:text-5xl">
                  Your Fantasy<span className="-ml-1">.</span>
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-stone-400">
                  YOUR JOURNEY. WE TAKE YOU THERE. THE REST IS UP TO YOU
                </p>
              </div>
              <div>
                <p className="font-serif text-4xl leading-[1.08] text-white sm:text-5xl">
                  Your Rules.
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-stone-400">
                  YOU ARE NOT JUST A LISTENER. YOU ARE THE AUTHOR, THE CHARACTER AND THE EXPERIENCE.
                </p>
              </div>
              <div>
                <p className="font-serif text-4xl leading-[1.08] text-amber-200 sm:text-5xl">
                  Your Pleasure.
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-amber-200/80">
                  NAKAMA NIGHTS IS EXCLUSIVE. WE ARE PREMIUM. NAKAMA NIGHTS IS YOURS
                </p>
              </div>
            </div>

            <a
              href="#signup"
              className="mt-12 inline-flex rounded-full border border-amber-200/50 bg-amber-100/90 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 shadow-[0_10px_28px_rgba(0,0,0,0.25)] transition hover:bg-amber-100"
            >
              JOIN NAKAMA NOW
            </a>
          </div>
        </section>

        <section className="mt-14 pt-6">
          <p className="font-serif text-2xl leading-tight text-white sm:text-3xl">
            Nakama Nights Favourite Fantasies
          </p>
          <div
            className="relative mt-10 min-h-[430px] w-full overflow-x-hidden overflow-y-visible pb-2 sm:min-h-[460px]"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setMouse({
                x: (e.clientX - rect.left) / rect.width - 0.5,
                y: (e.clientY - rect.top) / rect.height - 0.5,
              });
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">

              {fantasyScenes.map((scene, index) => {
                const offset = index - activeScene;
                const isActive = index === activeScene;

                return (
                  <div
                    key={index}
                    onClick={() => {
                      setActiveScene(index);
                      playAmbienceForTitle(scene.title);
                    }}
                    onMouseEnter={() => playAmbienceForTitle(scene.title)}
                    className="absolute cursor-pointer transition-all duration-500 ease-out"
                    style={{
                      transform: `
                        translateX(${offset * 150}px)
                        scale(${isActive ? 1 : 0.83})
                        ${isActive ? `translate(${mouse.x * 20}px, ${mouse.y * 12}px)` : ""}
                      `,
                      zIndex: 10 - Math.abs(offset),
                      opacity: isActive ? 1 : 0.22,
                    }}
                  >
                    <div className="relative flex w-[300px] flex-col rounded-xl border border-stone-700 bg-zinc-950 shadow-xl sm:w-[340px]">
                      <div className="relative h-[220px] shrink-0 overflow-hidden rounded-t-xl sm:h-[240px]">
                        <img
                          src={scene.image}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                        <SceneAtmosphere title={scene.title} isActive={isActive} />
                      </div>

                      <div className="relative z-10 shrink-0 rounded-b-xl border-t border-stone-800/90 bg-zinc-950 px-4 py-4">
                        <p className="break-words text-pretty text-left font-serif text-[14px] italic leading-relaxed tracking-[0.03em] text-stone-400 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                          {scene.subtitle}
                        </p>
                        <h3 className="mt-2 text-left font-serif text-base leading-tight tracking-wide text-amber-200 sm:text-lg">
                          {scene.displayTitle ?? scene.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="browse-services" className="mt-8 scroll-mt-28 rounded-2xl border border-stone-800 bg-zinc-950/80 p-6">
          <h2 className="font-serif text-2xl leading-tight text-white sm:text-3xl">
            Nakama Nights Universe
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {browseServices.map((s) => (
              <ServiceHoverVideoCard key={s.title} {...s} />
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div
            id="signup"
            className="w-full scroll-mt-28 rounded-2xl border border-stone-800 bg-zinc-950/80 p-8 shadow-xl"
          >

            <h2 className="font-serif text-3xl text-white">
              Begin your fantasy
            </h2>

            <p className="mt-2 text-sm text-stone-400">
              Join Nakama Nights now
            </p>

            <form onSubmit={handleCreateAccount} className="mt-6 space-y-3">
              <input
                placeholder="Your name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl border border-stone-800 bg-black px-3 py-2.5 text-white placeholder:text-stone-600"
              />

              <input
                placeholder="Your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-stone-800 bg-black px-3 py-2.5 text-white placeholder:text-stone-600"
              />

              <button
                type="submit"
                className="w-full rounded-full bg-stone-300 py-3 text-sm font-semibold text-black transition hover:bg-stone-400"
              >
                Create account
              </button>
            </form>
            <p className="mt-3 text-center text-xs uppercase tracking-wide text-stone-400">
              10 days free trial
            </p>

            <div className="mt-6 border-t border-stone-800 pt-5">
              <Link
                href="/login"
                className="inline-flex rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-1.5 text-sm font-medium text-amber-200 transition hover:border-amber-200/70 hover:bg-amber-300/20 hover:text-amber-100"
              >
                Existing members - click here to login
              </Link>
            </div>

          </div>

          <div className="w-full rounded-2xl border border-stone-800 bg-zinc-950/80 p-8 shadow-xl">
            <h2 className="font-serif text-3xl text-white">Contact us</h2>
            <p className="mt-2 text-sm text-stone-400">
              Ask us anything about Nakama Nights.
            </p>

            <form onSubmit={handleContactSubmit} className="mt-6 space-y-3">
              <input
                placeholder="Name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
                className="w-full rounded-xl border border-stone-800 bg-black px-3 py-2.5 text-white placeholder:text-stone-600"
              />
              <input
                placeholder="Email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-stone-800 bg-black px-3 py-2.5 text-white placeholder:text-stone-600"
              />
              <textarea
                placeholder="Message"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                required
                rows={5}
                className="w-full rounded-xl border border-stone-800 bg-black px-3 py-2.5 text-white placeholder:text-stone-600"
              />
              <button
                type="submit"
                className="w-full rounded-full border border-amber-200/50 bg-amber-100/90 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition hover:bg-amber-100"
              >
                Send message
              </button>
            </form>
          </div>
        </section>

        <footer className="mt-14 border-t border-stone-800 py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="shrink-0">
              <img
                src="/Nakama-AI-July25-White.png"
                alt="Nakama"
                className="h-8"
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-stone-400">
              <Link href="/terms" className="transition hover:text-stone-100">
                T&amp;Cs
              </Link>
              <Link href="/privacy" className="transition hover:text-stone-100">
                Privacy
              </Link>
              <a
                href="mailto:info@nakamanights.com"
                className="transition hover:text-stone-100"
              >
                Contact
              </a>
              <Link
                href="/faq-support"
                className="transition hover:text-stone-100"
              >
                FAQ &amp; Support
              </Link>
            </div>

            <div className="flex items-center gap-4 text-stone-400">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-stone-100"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5Zm8.9 1.2a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-stone-100"
                aria-label="TikTok"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M14.5 3h2.1c.2 1.6 1.1 3 2.6 3.8 1 .6 2.1.9 3.3.9v2.2a8.1 8.1 0 0 1-3.2-.7v6.2a6.4 6.4 0 1 1-5.5-6.3v2.2a4.2 4.2 0 1 0 3.3 4.1V3h-2.6Z" />
                </svg>
              </a>
            </div>
          </div>
        </footer>

        <div className="sr-only">
          {fantasyScenes.map((scene) => (
            <audio
              key={`ambience-${scene.title}`}
              ref={(el) => {
                audioRefs.current[scene.title] = el;
              }}
              src={sceneAmbience[scene.title]}
              preload="none"
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
        .fog-layer-1 {
          animation: fogDriftA 8s ease-in-out infinite alternate;
        }
        .fog-layer-2 {
          animation: fogDriftB 6.5s ease-in-out infinite alternate;
        }
        .fog-layer-3 {
          animation: fogDriftC 4.8s ease-in-out infinite alternate;
        }
        .storm-rain {
          animation: rainSweep 1.1s linear infinite;
        }
        .sail-shadow {
          transform-origin: top center;
          animation: sailSwing 1.8s ease-in-out infinite;
        }
        .sea-glow {
          animation: seaPulse 2s ease-in-out infinite;
        }
        .candle-glow {
          animation: emberPulse 1.6s ease-in-out infinite;
        }
        .spark-drift {
          animation: sparkFloat 3.8s linear infinite;
        }
        .moon-pulse {
          animation: moonGlow 2.8s ease-in-out infinite;
        }
        .mist-drift {
          animation: mistRoll 4.2s ease-in-out infinite alternate;
        }
        .alien-cloud-1 {
          animation: alienCloudA 7s ease-in-out infinite alternate;
        }
        .alien-cloud-2 {
          animation: alienCloudB 9s ease-in-out infinite alternate;
        }
        .alien-cloud-3 {
          animation: alienCloudA 11s ease-in-out infinite alternate-reverse;
        }
        .office-blinds {
          animation: blindsFlicker 5s ease-in-out infinite;
        }
        .office-scan {
          animation: scanPass 2.8s ease-in-out infinite;
        }
        .office-light {
          animation: officeFlicker 1.25s ease-in-out infinite;
        }

        @keyframes fogDriftA {
          from {
            transform: translateX(-8px);
          }
          to {
            transform: translateX(8px);
          }
        }
        @keyframes fogDriftB {
          from {
            transform: translateX(14px);
          }
          to {
            transform: translateX(-12px);
          }
        }
        @keyframes fogDriftC {
          from {
            transform: translateX(-18px) translateY(2px);
          }
          to {
            transform: translateX(16px) translateY(-4px);
          }
        }
        @keyframes rainSweep {
          from {
            transform: translateX(-28px);
            opacity: 0.42;
          }
          to {
            transform: translateX(28px);
            opacity: 0.2;
          }
        }
        @keyframes sailSwing {
          0%,
          100% {
            transform: translateX(-50%) rotate(-11deg);
          }
          50% {
            transform: translateX(-50%) rotate(10deg);
          }
        }
        @keyframes seaPulse {
          0%, 100% { opacity: 0.2; transform: scaleX(0.95); }
          50% { opacity: 0.35; transform: scaleX(1.08); }
        }
        @keyframes emberPulse {
          0%,
          100% {
            opacity: 0.38;
            transform: scale(0.92);
          }
          50% {
            opacity: 0.82;
            transform: scale(1.1);
          }
        }
        @keyframes sparkFloat {
          0% {
            transform: translateY(8px);
            opacity: 0.2;
          }
          50% {
            opacity: 0.35;
          }
          100% {
            transform: translateY(-10px);
            opacity: 0.15;
          }
        }
        @keyframes moonGlow {
          0%,
          100% {
            opacity: 0.35;
          }
          50% {
            opacity: 0.65;
          }
        }
        @keyframes alienCloudA {
          from {
            transform: translateX(-10px) translateY(0px);
          }
          to {
            transform: translateX(14px) translateY(-7px);
          }
        }
        @keyframes alienCloudB {
          from {
            transform: translateX(6px) translateY(3px);
          }
          to {
            transform: translateX(-8px) translateY(-5px);
          }
        }
        @keyframes blindsFlicker {
          0%,
          100% {
            opacity: 0.18;
          }
          48% {
            opacity: 0.28;
          }
          52% {
            opacity: 0.12;
          }
        }
        @keyframes scanPass {
          0% {
            transform: translateX(-30px);
            opacity: 0;
          }
          20% {
            opacity: 0.25;
          }
          80% {
            opacity: 0.25;
          }
          100% {
            transform: translateX(320px);
            opacity: 0;
          }
        }
        @keyframes mistRoll {
          from { transform: translateX(-20px) translateY(0px); opacity: 0.2; }
          to { transform: translateX(20px) translateY(-6px); opacity: 0.36; }
        }
        @keyframes officeFlicker {
          0%, 100% { opacity: 0.14; }
          20% { opacity: 0.35; }
          45% { opacity: 0.08; }
          65% { opacity: 0.28; }
          82% { opacity: 0.16; }
        }
      `}</style>
    </div>
  );
}

