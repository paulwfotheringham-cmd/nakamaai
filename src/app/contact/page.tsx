"use client";

import MarketingPageShell from "@/components/MarketingPageShell";
import { useState } from "react";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Nakama Nights Contact - ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:info@nakamanights.com?subject=${subject}&body=${body}`;
  }

  return (
    <MarketingPageShell>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="relative overflow-hidden rounded-[2rem] border border-stone-700/65 bg-zinc-950 shadow-[0_0_0_1px_rgba(245,158,11,0.08),0_26px_62px_rgba(0,0,0,0.5)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-10%,rgba(180,130,50,0.14),transparent_55%)]" />
          <div className="relative p-8 sm:p-10">
            <h1 className="type-hero">Contact us</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-400 sm:text-base">
              Ask us anything about Nakama Nights.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <input
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-stone-800 bg-black px-3 py-3 text-luxury-primary placeholder:text-stone-600 focus:border-amber-500/45 focus:outline-none focus:ring-1 focus:ring-amber-500/25"
                />
                <input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-stone-800 bg-black px-3 py-3 text-luxury-primary placeholder:text-stone-600 focus:border-amber-500/45 focus:outline-none focus:ring-1 focus:ring-amber-500/25"
                />
              </div>

              <textarea
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={7}
                className="w-full resize-none rounded-xl border border-stone-800 bg-black px-3 py-3 text-luxury-primary placeholder:text-stone-600 focus:border-amber-500/45 focus:outline-none focus:ring-1 focus:ring-amber-500/25"
              />

              <button
                type="submit"
                className="w-full rounded-full border border-amber-200/50 bg-amber-100/90 py-3 type-label text-stone-700 transition hover:bg-amber-100"
              >
                Send message
              </button>
            </form>
          </div>
        </div>
      </div>
    </MarketingPageShell>
  );
}
