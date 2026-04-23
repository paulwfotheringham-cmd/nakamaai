"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

export default function Page() {
  const router = useRouter();

  const [activeScene, setActiveScene] = useState(2);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <img src="/Nakama-AI-July25-White.png" className="h-8" />
          <a className="rounded-full border border-stone-600 px-4 py-2 text-xs uppercase text-stone-300">
            Begin your journey
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 py-12 grid lg:grid-cols-2 gap-12">

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

          {/* 🔥 FULL WIDTH CAROUSEL */}
          <div
            className="relative mt-10 h-[380px] w-full overflow-hidden"
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
                    className="absolute transition-all duration-500 ease-out cursor-pointer"
                    style={{
                      transform: `
                        translateX(${offset * 140}px)
                        scale(${isActive ? 1 : 0.85})
                        ${isActive ? `translate(${mouse.x * 12}px, ${mouse.y * 8}px)` : ""}
                      `,
                      zIndex: 10 - Math.abs(offset),
                      opacity: isActive ? 1 : 0.25,
                    }}
                  >
                    <div className="relative w-[260px] sm:w-[300px] overflow-hidden rounded-xl border border-stone-700 bg-black shadow-xl">

                      <img
                        src={scene.image}
                        className="h-[320px] w-full object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-stone-300">
                          {scene.subtitle}
                        </p>
                        <h3 className="mt-1 text-xl font-serif text-amber-200">
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
          <div className="mt-10 flex gap-4">
            <a className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black">
              Start free trial
            </a>
            <a className="rounded-full border border-stone-600 px-6 py-3 text-sm text-stone-300">
              Explore services
            </a>
          </div>

          {/* FEATURES (RESTORED) */}
          <div className="mt-10 grid grid-cols-2 gap-4 text-sm text-stone-400">
            <p>Lose yourself in curated steamy audio scenes.</p>
            <p>Create your own story — characters, tone, and heat level.</p>
            <p>Control your adventure in real time.</p>
            <p>Uncensored AI conversation. Voice or text.</p>
          </div>

        </div>

        {/* RIGHT SIDE (FULL SIGNUP RESTORED) */}
        <div className="rounded-2xl border border-stone-800 bg-zinc-950/80 p-8 shadow-xl">

          <h2 className="font-serif text-3xl text-white">
            Begin your fantasy
          </h2>

          <p className="mt-2 text-sm text-stone-400">
            10 days free trial
          </p>

          <form onSubmit={handleCreateAccount} className="mt-6 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl border border-stone-800 bg-black px-3 py-2 text-white"
              />
              <input
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-xl border border-stone-800 bg-black px-3 py-2 text-white"
              />
            </div>

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-stone-800 bg-black px-3 py-2 text-white"
            />

            <button className="w-full rounded-full bg-white py-3 text-black font-semibold">
              Create account & choose plan
            </button>
          </form>

          {/* LOGIN */}
          <div className="mt-6 border-t border-stone-800 pt-6">
            <p className="text-xs uppercase text-stone-500">
              Already a member?
            </p>

            <form onSubmit={handleMemberEnter} className="mt-4 space-y-3">
              <input
                placeholder="Email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                className="w-full rounded-xl border border-stone-800 bg-black px-3 py-2 text-white"
              />
              <input
                placeholder="Password"
                type="password"
                className="w-full rounded-xl border border-stone-800 bg-black px-3 py-2 text-white"
              />

              <button className="w-full rounded-full border border-stone-600 py-2 text-stone-300">
                Enter
              </button>
            </form>
          </div>

        </div>

      </section>
    </div>
  );
}
