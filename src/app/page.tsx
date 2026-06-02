"use client";

import { NakamaUniverseCard } from "@/components/NakamaUniverseCard";
import { NAKAMA_UNIVERSE_SERVICES } from "@/lib/nakama-universe-services";
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
    image: "/tiles/anime.jpg",
  },
  {
    title: "NEW_TILE_2",
    displayTitle: "SUPERNATURAL",
    subtitle: "Meet the Darkest Vampire",
    image: "/tiles/vampire.jpg",
  },
  {
    title: "NEW_TILE_3",
    displayTitle: "SUPERNATURAL",
    subtitle: "Horny Dragons",
    image: "/tiles/dragon.jpg",
  },
  {
    title: "NEW_TILE_4",
    displayTitle: "SCI FI",
    subtitle:
      "The space commander has requested your presence in his Quarters",
    image: "/tiles/space.jpg",
  },
  {
    title: "NEW_TILE_6",
    displayTitle: "MODERN",
    subtitle: "Kinky play with a sugar daddy",
    image: "/tiles/daddy.jpg",
  },
  {
    title: "NEW_TILE_7",
    displayTitle: "MODERN",
    subtitle: "A slow and passionate story to excite and pleasure",
    image: "/tiles/slowburn.jpg",
  },
  {
    title: "NEW_TILE_8",
    displayTitle: "MODERN",
    subtitle: "Your nemesis who becomes your lover",
    image: "/tiles/lover.jpg",
  },
  {
    title: "NEW_TILE_9",
    displayTitle: "DARK & EROTIC",
    subtitle: "Taboo's uncovered",
    image: "/tiles/taboo.jpg",
  },
  {
    title: "NEW_TILE_10",
    displayTitle: "DARK & EROTIC",
    subtitle: "BDSM and Fetish",
    image: "/tiles/bdsm.jpg",
  },
  {
    title: "NEW_TILE_11",
    displayTitle: "DARK & EROTIC",
    subtitle: "Powerplay",
    image: "/tiles/powerplay.jpg",
  },
  {
    title: "NEW_TILE_12",
    displayTitle: "MODERN",
    subtitle: "Holiday romance on an executive yacht",
    image: "/tiles/boat.jpg",
  },
  {
    title: "NEW_TILE_13",
    displayTitle: "MODERN",
    subtitle: "Voyerurism – A public beach encounter",
    image: "/tiles/voyeur.jpg",
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

const browseServices = NAKAMA_UNIVERSE_SERVICES.map((s) => ({
  ...s,
  videoSrc: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
}));

function ServiceHoverVideoCard({
  title,
  description,
  poster,
}: {
  title: string;
  description: string;
  poster: string;
}) {
  return <NakamaUniverseCard title={title} description={description} poster={poster} />;
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
  const fantasySceneCount = fantasyScenes.length;

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
    if (!firstName.trim() || !email.trim()) return;
    router.push(
      `/set-password?email=${encodeURIComponent(email.trim())}&name=${encodeURIComponent(firstName.trim())}`,
    );
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
              alt="Nakama Nights"
              className="block h-[5.1rem] w-auto object-contain object-left sm:h-[6.1rem] md:h-[6.8rem]"
            />
          </Link>

          <div className="ml-auto flex flex-wrap items-center justify-end gap-3 sm:gap-4">
            <a
              href="#fantasy-services"
              className="inline-flex rounded-full bg-[linear-gradient(180deg,#E6C45A_0%,#D4AF37_100%)] px-6 py-2.5 type-label font-medium text-[#111111] shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition hover:brightness-110"
            >
              Fantasy services
            </a>
            <Link
              href="/signup-trial"
              className="inline-flex rounded-full bg-[linear-gradient(180deg,#E6C45A_0%,#D4AF37_100%)] px-5 py-2 type-label font-medium text-[#111111] shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition hover:brightness-110"
            >
              10 Day Free Trial
            </Link>
            <Link
              href="/login"
              className="inline-flex rounded-full bg-[linear-gradient(180deg,#E6C45A_0%,#D4AF37_100%)] px-6 py-2.5 type-label font-medium text-[#111111] shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition hover:brightness-110"
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
            <p className="type-hero text-luxury-primary drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              Nakama Nights
            </p>
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.22em] text-stone-500 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              For women who want more than ordinary.
            </p>

            <div className="mt-14 flex flex-col gap-14 sm:gap-16">
              <div>
                <p className="font-serif text-6xl font-light leading-none tracking-tight text-stone-100 drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)] sm:text-7xl lg:text-8xl">
                  Fantasy
                </p>
                <p className="mt-3 font-serif text-base italic leading-relaxed text-stone-400 sm:text-lg">
                  Step somewhere you've kept private.
                </p>
              </div>
              <div>
                <p className="font-serif text-6xl font-light leading-none tracking-tight text-stone-300 drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)] sm:text-7xl lg:text-8xl">
                  Escape
                </p>
                <p className="mt-3 font-serif text-base italic leading-relaxed text-stone-500 sm:text-lg">
                  The real world ends here.
                </p>
              </div>
              <div>
                <p className="font-serif text-6xl font-light leading-none tracking-tight text-stone-100 drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)] sm:text-7xl lg:text-8xl">
                  Pleasure
                </p>
                <p className="mt-3 font-serif text-base italic leading-relaxed text-stone-400 sm:text-lg">
                  Made to be felt. Not explained.
                </p>
              </div>
            </div>

            <Link
              href="/select-plan"
              className="mt-16 inline-flex w-full max-w-[260px] items-center justify-center rounded-full bg-[linear-gradient(180deg,#E6C45A_0%,#D4AF37_100%)] px-7 py-3 text-xs font-medium tracking-[0.18em] text-[#111111] shadow-[0_4px_24px_rgba(212,175,55,0.35)] transition hover:brightness-110"
            >
              JOIN NAKAMA NOW
            </Link>
          </div>

          <div className="relative z-10 mt-10 w-full border-t border-amber-200/25 bg-black/90 px-6 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 py-5 md:flex-row md:items-start md:gap-10 md:py-6">
              <div className="flex w-full shrink-0 flex-col items-center gap-4 text-center md:w-[280px]">
                <p className="type-card-title text-amber-200/90">
                  New to this?
                </p>
                <Link
                  href="/signup-trial"
                  className="inline-flex w-full max-w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#E6C45A_0%,#D4AF37_100%)] px-5 py-2.5 type-label font-medium text-[#111111] shadow-[0_4px_24px_rgba(212,175,55,0.35)] transition hover:brightness-110 md:w-fit md:px-7 md:py-3"
                >
                  TRY YOUR FIRST EXPERIENCE
                </Link>
              </div>

              <div className="min-w-0 flex-1 space-y-3 md:space-y-4 md:pt-1">
                <p className="text-small leading-relaxed text-luxury-secondary">
                  You&apos;re not alone. Most of our users are exploring this for the first time.
                </p>
                <p className="text-small leading-relaxed text-luxury-secondary">
                  Start with a simple story — no pressure, just curiosity.
                </p>
                <p className="text-small leading-relaxed text-luxury-secondary">
                  Everything is private. Everything is yours.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="fantasy-services" className="mt-14 scroll-mt-28 rounded-2xl bg-zinc-950/80 p-6">
          <h2 className="font-serif text-2xl leading-tight text-luxury-primary sm:text-3xl">
            Nakama Nights Universe
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {browseServices.map((s) => (
              <ServiceHoverVideoCard key={s.title} {...s} />
            ))}
          </div>
        </section>

        <section className="mt-14 pt-6">
          <p className="type-section-heading">
            Nakama Nights favourite fantasies
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
            <div className="pointer-events-none absolute inset-x-2 top-1/2 z-30 flex -translate-y-1/2 items-center justify-between sm:inset-x-3">
              <button
                type="button"
                aria-label="Previous fantasy"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveScene((prev) => {
                    const next = (prev - 1 + fantasySceneCount) % fantasySceneCount;
                    playAmbienceForTitle(fantasyScenes[next]?.title ?? "");
                    return next;
                  });
                }}
                className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-amber-200/45 bg-black/55 text-amber-100 shadow-[0_4px_14px_rgba(0,0,0,0.45)] backdrop-blur-sm transition hover:border-amber-200/80 hover:bg-black/75 sm:h-11 sm:w-11"
              >
                <span aria-hidden="true" className="-ml-0.5 text-xl leading-none">
                  ‹
                </span>
              </button>
              <button
                type="button"
                aria-label="Next fantasy"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveScene((prev) => {
                    const next = (prev + 1) % fantasySceneCount;
                    playAmbienceForTitle(fantasyScenes[next]?.title ?? "");
                    return next;
                  });
                }}
                className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-amber-200/45 bg-black/55 text-amber-100 shadow-[0_4px_14px_rgba(0,0,0,0.45)] backdrop-blur-sm transition hover:border-amber-200/80 hover:bg-black/75 sm:h-11 sm:w-11"
              >
                <span aria-hidden="true" className="ml-0.5 text-xl leading-none">
                  ›
                </span>
              </button>
            </div>

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

        <section className="mt-16 sm:mt-20 lg:mt-24">
          <div
            id="signup"
            className="mx-auto w-full max-w-md scroll-mt-28 rounded-2xl border border-stone-800 bg-zinc-950/80 p-8 shadow-xl"
          >
            <h2 className="font-serif text-3xl text-luxury-primary">
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
                required
                className="w-full rounded-xl border border-stone-800 bg-black px-3 py-2.5 text-luxury-primary placeholder:text-stone-600"
              />
              <input
                placeholder="Your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-stone-800 bg-black px-3 py-2.5 text-luxury-primary placeholder:text-stone-600"
              />
              <button
                type="submit"
                className="w-full rounded-full bg-[linear-gradient(180deg,#E6C45A_0%,#D4AF37_100%)] py-3 type-section-heading font-medium text-[#111111] shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition hover:brightness-110"
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
                className="inline-flex rounded-full border border-[#D4AF37]/50 px-4 py-1.5 text-sm font-medium text-[#D4AF37] transition hover:border-[#D4AF37]/90 hover:text-[#E6C45A]"
              >
                Existing members — login here
              </Link>
            </div>
          </div>
        </section>

        <footer className="mt-14 border-t border-stone-800 py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="shrink-0">
              <img
                src="/Nakama-AI-July25-White.png"
                alt="Nakama Nights"
                className="block h-11 w-auto object-contain sm:h-[52px]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-stone-400">
              <Link href="/terms" className="transition hover:text-stone-100">
                T&amp;Cs
              </Link>
              <Link href="/privacy" className="transition hover:text-stone-100">
                Privacy
              </Link>
              <Link href="/contact" className="transition hover:text-stone-100">
                Contact
              </Link>
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

