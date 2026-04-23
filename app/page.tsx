"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

/* ---------------- SCENES ---------------- */

const fantasyScenes = [
  { title: "MOOR", subtitle: "A windswept moor", image: "/scenes/moor.jpg" },
  { title: "PIRATE", subtitle: "A pirate ship", image: "/scenes/pirate.jpg" },
  { title: "ROME", subtitle: "A secret love", image: "/scenes/rome.jpg" },
  { title: "WEREWOLF", subtitle: "A creature of night", image: "/scenes/werewolf.jpg" },
  { title: "ALIEN", subtitle: "A distant world", image: "/scenes/alien.jpg" },
  { title: "OFFICE", subtitle: "A dangerous attraction", image: "/scenes/office.jpg" },
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
        <div className="relative">

          <h1 className="font-serif text-4xl leading-tight text-white">
            Your Fantasy.<br />
            Your Rules.<br />
            <span className="text-amber-200">Your Pleasure.</span>
          </h1>

          {/* 🔥 FIXED CAROUSEL */}
          <div
            className="relative mt-10 h-[360px] w-full overflow-hidden"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setMouse({
                x: (e.clientX - rect.left) / rect.width - 0.5,
                y: (e.clientY - rect.top) / rect.height - 0.5,
              });
            }}
          >
            <div className="relative h-full w-full flex items-center justify-center">

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
                        translateX(${offset * 120}px)
                        translateY(${Math.abs(offset) * 10}px)
                        scale(${isActive ? 1 : 0.85})
                        ${isActive ? `translate(${mouse.x * 10}px, ${mouse.y * 6}px)` : ""}
                      `,
                      zIndex: 10 - Math.abs(offset),
                      opacity: isActive ? 1 : 0.3,
                    }}
                  >
                    <div className="relative w-[220px] sm:w-[260px] overflow-hidden rounded-xl border border-stone-700 bg-black shadow-xl">

                      <img
                        src={scene.image}
                        className="h-[300px] w-full object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                      {/* subtle glow */}
                      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-[radial-gradient(circle,rgba(255,200,150,0.15),transparent)]" />

                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-[10px] tracking-widest text-stone-400 uppercase">
                          {scene.subtitle}
                        </p>
                        <h3 className="mt-1 text-lg font-serif text-amber-200">
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

        </div>

        {/* RIGHT SIDE FORM (RESTORED PROPERLY) */}
        <div className="rounded-2xl border border-stone-800 bg-zinc-950/80 p-8 shadow-xl">

          <h2 className="font-serif text-3xl text-white">
            Begin your fantasy
          </h2>

          <form onSubmit={handleCreateAccount} className="mt-6 space-y-3">
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
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-stone-800 bg-black px-3 py-2 text-white"
            />

            <button className="w-full rounded-full bg-white py-3 text-black">
              Create account
            </button>
          </form>

          <div className="mt-6 border-t border-stone-800 pt-4">
            <input
              placeholder="Email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              className="w-full rounded-xl border border-stone-800 bg-black px-3 py-2 text-white"
            />
            <button className="mt-2 w-full rounded-full border border-stone-600 py-2 text-stone-300">
              Enter
            </button>
          </div>

        </div>

      </section>
    </div>
  );
}
