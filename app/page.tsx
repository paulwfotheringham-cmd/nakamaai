"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

/* ---------------- SCENES ---------------- */

const fantasyScenes = [
  {
    title: "MOOR",
    subtitle: "A windswept moor with a brooding stranger",
    image: "/scenes/moor.jpg",
  },
  {
    title: "PIRATE",
    subtitle: "A pirate ship on the high seas",
    image: "/scenes/pirate.jpg",
  },
  {
    title: "ROME",
    subtitle: "A secret love in ancient Rome",
    image: "/scenes/rome.jpg",
  },
  {
    title: "WEREWOLF",
    subtitle: "A werewolf who only comes out at night",
    image: "/scenes/werewolf.jpg",
  },
  {
    title: "ALIEN",
    subtitle: "An alien encounter on a distant world",
    image: "/scenes/alien.jpg",
  },
  {
    title: "OFFICE",
    subtitle: "A dangerous attraction in the office",
    image: "/scenes/office.jpg",
  },
];

/* Short CC0 / permissive samples for hover previews (replace with your own clips in /public when ready). */
const browseServices = [
  {
    title: "Guided story design",
    tag: "Design",
    poster: "/scenes/moor.jpg",
    videoSrc:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    title: "Voice customization",
    tag: "Voices",
    poster: "/scenes/pirate.jpg",
    videoSrc:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    title: "Private audio scenes",
    tag: "Scenes",
    poster: "/scenes/rome.jpg",
    videoSrc:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    title: "Fast iteration",
    tag: "Iterate",
    poster: "/scenes/werewolf.jpg",
    videoSrc:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    title: "Couples play",
    tag: "Couples",
    poster: "/scenes/office.jpg",
    videoSrc:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
];

function ServiceHoverVideoCard({
  title,
  tag,
  poster,
  videoSrc,
}: {
  title: string;
  tag: string;
  poster: string;
  videoSrc: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  return (
    <div
      className="group relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-stone-800 bg-black shadow-lg"
      onMouseEnter={() => {
        const v = videoRef.current;
        if (!v) return;
        void v.play().catch(() => {
          /* autoplay policies: ignore */
        });
      }}
      onMouseLeave={() => {
        const v = videoRef.current;
        if (!v) return;
        v.pause();
        v.currentTime = 0;
      }}
    >
      <img
        src={poster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
      />
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        src={videoSrc}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent px-3 pb-3 pt-16">
        <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400">
          {tag}
        </p>
        <h3 className="mt-0.5 text-sm font-semibold leading-snug text-amber-100/95 sm:text-[15px]">
          {title}
        </h3>
      </div>
    </div>
  );
}

export default function Page() {
  const router = useRouter();

  const [activeScene, setActiveScene] = useState(2);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberPassword, setMemberPassword] = useState("");

  function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (email) params.set("email", email);
    router.push(`/select-plan?${params.toString()}`);
  }

  function handleMemberEnter(e: React.FormEvent) {
    e.preventDefault();
    router.push("/login");
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

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-stone-400 sm:flex-1">
            <a
              href="#browse-services"
              className="transition hover:text-stone-100"
            >
              Services
            </a>
            <a
              href="mailto:hello@nakamaai.com"
              className="transition hover:text-stone-100"
            >
              Contact
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-stone-100"
            >
              Social
            </a>
          </nav>

          <a
            href="#signup"
            className="rounded-full border border-stone-600 px-4 py-2 text-xs uppercase tracking-wide text-stone-300 transition hover:border-stone-500 hover:text-white"
          >
            Begin your journey
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* HERO */}
        <section className="grid gap-12 lg:grid-cols-2">

          {/* LEFT SIDE */}
          <div>

            <h1 className="font-serif text-4xl leading-tight text-white">
              Your Fantasy.<br />
              Your Rules.<br />
              <span className="text-amber-200">Your Pleasure.</span>
            </h1>

            <p className="mt-4 text-xs uppercase tracking-widest text-stone-500">
              Built exclusively for women. No judgment. Immersive audio for you.
            </p>

            {/* Carousel — taller cards so captions are not clipped */}
            <div
              className="relative mt-10 min-h-[500px] w-full overflow-x-hidden overflow-y-visible pb-2 sm:min-h-[520px]"
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
                      onClick={() => setActiveScene(index)}
                      className="absolute cursor-pointer transition-all duration-500 ease-out"
                      style={{
                        transform: `
                        translateX(${offset * 155}px)
                        scale(${isActive ? 1 : 0.85})
                        ${isActive ? `translate(${mouse.x * 12}px, ${mouse.y * 8}px)` : ""}
                      `,
                        zIndex: 10 - Math.abs(offset),
                        opacity: isActive ? 1 : 0.25,
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
                        </div>

                        <div className="relative z-10 shrink-0 rounded-b-xl border-t border-stone-800/90 bg-zinc-950 px-4 py-4">
                          <p className="break-words text-pretty text-left text-sm font-normal leading-relaxed text-stone-300">
                            {scene.subtitle}
                          </p>
                          <h3 className="mt-2 text-left font-serif text-xl leading-tight text-amber-200 sm:text-2xl">
                            {scene.title}
                          </h3>
                        </div>

                      </div>
                    </div>
                  );
                })}

              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#signup"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-stone-200"
              >
                Start free trial
              </a>
              <a
                href="#browse-services"
                className="rounded-full border border-stone-600 px-6 py-3 text-sm text-stone-300 transition hover:border-stone-500 hover:text-white"
              >
                Explore services
              </a>
            </div>

            {/* Browse services — 5 columns, hover video */}
            <div id="browse-services" className="mt-14 scroll-mt-28">
              <h2 className="font-serif text-2xl text-white sm:text-3xl">
                Browse services
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-stone-500">
                Hover a tile for a quick video preview.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {browseServices.map((s) => (
                  <ServiceHoverVideoCard key={s.title} {...s} />
                ))}
              </div>
            </div>

            {/* FEATURES */}
            <div className="mt-14 grid grid-cols-2 gap-4 text-sm text-stone-400">
              <p>Lose yourself in curated steamy audio scenes.</p>
              <p>Create your own story — characters, tone, and heat level.</p>
              <p>Control your adventure in real time.</p>
              <p>Uncensored AI conversation. Voice or text.</p>
            </div>

          </div>

          {/* RIGHT — Sign up / Sign in */}
          <div
            id="signup"
            className="h-fit scroll-mt-28 rounded-2xl border border-stone-800 bg-zinc-950/80 p-8 shadow-xl lg:sticky lg:top-8"
          >

            <h2 className="font-serif text-3xl text-white">
              Begin your fantasy
            </h2>

            <p className="mt-2 text-sm text-stone-400">
              10 days free trial
            </p>

            <div className="mt-8 border-b border-stone-800 pb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Sign up
              </p>
              <p className="mt-2 text-sm text-stone-400">
                Create your account, then pick a plan.
              </p>

              <form onSubmit={handleCreateAccount} className="mt-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl border border-stone-800 bg-black px-3 py-2 text-white placeholder:text-stone-600"
                  />
                  <input
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-stone-800 bg-black px-3 py-2 text-white placeholder:text-stone-600"
                  />
                </div>

                <input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-stone-800 bg-black px-3 py-2 text-white placeholder:text-stone-600"
                />

                <button
                  type="submit"
                  className="w-full rounded-full bg-white py-3 text-sm font-semibold text-black transition hover:bg-stone-200"
                >
                  Create account & choose plan
                </button>
              </form>
            </div>

            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Sign in
              </p>
              <p className="mt-2 text-sm text-stone-400">
                Already a member? Sign in with email and password.
              </p>

              <form onSubmit={handleMemberEnter} className="mt-5 space-y-3">
                <input
                  placeholder="Email"
                  type="email"
                  autoComplete="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="w-full rounded-xl border border-stone-800 bg-black px-3 py-2 text-white placeholder:text-stone-600"
                />
                <input
                  placeholder="Password"
                  type="password"
                  autoComplete="current-password"
                  value={memberPassword}
                  onChange={(e) => setMemberPassword(e.target.value)}
                  className="w-full rounded-xl border border-stone-800 bg-black px-3 py-2 text-white placeholder:text-stone-600"
                />

                <div className="flex items-center justify-between gap-3">
                  <Link
                    href="/login"
                    className="text-xs text-stone-500 underline-offset-4 transition hover:text-stone-300 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full border border-stone-600 py-2.5 text-sm text-stone-200 transition hover:border-stone-500 hover:bg-white/5"
                >
                  Enter
                </button>
              </form>
            </div>

          </div>

        </section>
      </div>
    </div>
  );
}
