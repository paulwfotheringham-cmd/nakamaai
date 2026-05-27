"use client";

import Link from "next/link";
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
    <div className="min-h-screen bg-black text-stone-200">
      <header className="border-b border-stone-800 bg-black/90">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="shrink-0">
            <img
              src="/Nakama-AI-July25-White.png"
              alt="Nakama Nights"
              className="block h-[4.2rem] w-auto object-contain object-left sm:h-[5.2rem] md:h-[5.8rem]"
            />
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex rounded-full border border-amber-200/50 bg-amber-100/90 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 shadow-[0_10px_28px_rgba(0,0,0,0.25)] transition hover:bg-amber-100"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="relative overflow-hidden rounded-[2rem] border border-stone-700/65 bg-zinc-950 shadow-[0_0_0_1px_rgba(245,158,11,0.08),0_26px_62px_rgba(0,0,0,0.5)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-10%,rgba(180,130,50,0.14),transparent_55%)]" />
          <div className="relative p-8 sm:p-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-600/85">
              Contact
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Contact us
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-400 sm:text-base">
              Ask us anything about Nakama Nights. This form opens your email client and
              pre-fills the message to <span className="text-amber-200/90">info@nakamanights.com</span>.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <input
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-stone-800 bg-black px-3 py-3 text-white placeholder:text-stone-600 focus:border-amber-500/45 focus:outline-none focus:ring-1 focus:ring-amber-500/25"
                />
                <input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-stone-800 bg-black px-3 py-3 text-white placeholder:text-stone-600 focus:border-amber-500/45 focus:outline-none focus:ring-1 focus:ring-amber-500/25"
                />
              </div>

              <textarea
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={7}
                className="w-full resize-none rounded-xl border border-stone-800 bg-black px-3 py-3 text-white placeholder:text-stone-600 focus:border-amber-500/45 focus:outline-none focus:ring-1 focus:ring-amber-500/25"
              />

              <button
                type="submit"
                className="w-full rounded-full border border-amber-200/50 bg-amber-100/90 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition hover:bg-amber-100"
              >
                Send message
              </button>

              <div className="pt-2 text-center text-xs text-stone-500">
                Prefer email?{" "}
                <a
                  href="mailto:info@nakamanights.com"
                  className="text-amber-200/90 underline decoration-amber-300/40 underline-offset-4 hover:text-amber-100"
                >
                  info@nakamanights.com
                </a>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-800 py-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 lg:flex-row lg:items-center lg:justify-between">
          <img
            src="/Nakama-AI-July25-White.png"
            alt="Nakama Nights"
            className="block h-10 w-auto object-contain sm:h-12"
          />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-stone-400">
            <Link href="/terms" className="transition hover:text-stone-100">
              T&amp;Cs
            </Link>
            <Link href="/privacy" className="transition hover:text-stone-100">
              Privacy
            </Link>
            <Link href="/faq-support" className="transition hover:text-stone-100">
              FAQ &amp; Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

