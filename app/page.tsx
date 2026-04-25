"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleStart = () => {
    if (!name || !email) return;

    // store temporarily (no auth, just for flow)
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);

    // go straight to onboarding
    router.push("/onboarding");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="w-full max-w-md space-y-6 px-6 text-center">
        <h1 className="text-3xl font-serif">Begin your fantasy</h1>

        <input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded bg-white/10 px-4 py-3 text-white placeholder-white/40 outline-none"
        />

        <input
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded bg-white/10 px-4 py-3 text-white placeholder-white/40 outline-none"
        />

        <button
          onClick={handleStart}
          className="w-full rounded bg-yellow-500 py-3 font-semibold text-black"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
