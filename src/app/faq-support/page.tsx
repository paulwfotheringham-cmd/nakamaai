"use client";

import Link from "next/link";
import { useState } from "react";

const faqs = [
  {
    question: "What is Nakama Nights?",
    answer:
      "Nakama Nights is a premium immersive audio fantasy platform designed for adults, with customizable story and voice experiences.",
  },
  {
    question: "How does the 10-day free trial work?",
    answer:
      "You can start exploring features right away during your trial. You can upgrade or cancel before the trial ends.",
  },
  {
    question: "Can I choose different story genres?",
    answer:
      "Yes. You can browse multiple fantasy themes and pick the ones that best fit your mood.",
  },
  {
    question: "Can I use Nakama Nights on mobile?",
    answer:
      "Yes. Nakama Nights works on modern mobile browsers and desktop browsers.",
  },
  {
    question: "How do I reset my password?",
    answer:
      "Use the login page password reset flow or contact support if you no longer have access to your original email.",
  },
  {
    question: "How is my privacy handled?",
    answer:
      "We prioritize account privacy and secure handling of personal information. See the Privacy page for details.",
  },
  {
    question: "Do you offer support for billing issues?",
    answer:
      "Yes. Submit a support request and include your account email and billing details so we can help quickly.",
  },
];

export default function FaqSupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Nakama Nights Support - ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nSupport request:\n${message}`
    );
    window.location.href = `mailto:info@nakamanights.com?subject=${subject}&body=${body}`;
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-stone-300">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="text-sm text-stone-500 transition hover:text-stone-300"
        >
          ← Home
        </Link>

        <h1 className="mt-6 font-serif text-4xl text-stone-100">FAQ &amp; Support</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section className="rounded-2xl border border-stone-800 bg-zinc-950/80 p-6">
            <h2 className="font-serif text-2xl text-white">Frequently asked questions</h2>
            <div className="mt-5 space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-xl border border-stone-800 bg-black/60 p-4"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-200">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-400">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-stone-800 bg-zinc-950/80 p-6">
            <h2 className="font-serif text-2xl text-white">Submit a support request</h2>
            <p className="mt-2 text-sm text-stone-400">
              Tell us what you need and we will get back to you as soon as possible.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-stone-800 bg-black px-3 py-2.5 text-white placeholder:text-stone-600"
              />
              <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-stone-800 bg-black px-3 py-2.5 text-white placeholder:text-stone-600"
              />
              <textarea
                placeholder="How can we help?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                className="w-full rounded-xl border border-stone-800 bg-black px-3 py-2.5 text-white placeholder:text-stone-600"
              />
              <button
                type="submit"
                className="w-full rounded-full border border-amber-200/50 bg-amber-100/90 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition hover:bg-amber-100"
              >
                Send support request
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
