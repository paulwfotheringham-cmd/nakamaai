"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PlanKey = "tease" | "protagonist";

const planConfig: Record<
  PlanKey,
  { name: string; price: string; description: string }
> = {
  tease: {
    name: "The Tease",
    price: "$9.99 / month",
    description: "Perfect for the casual listener testing the waters.",
  },
  protagonist: {
    name: "The Protagonist",
    price: "$14.99 / month",
    description: "Our most popular tier. Dive deep into your fantasies.",
  },
};

export default function FakeCheckoutPage() {
  const [plan, setPlan] = useState<PlanKey>("tease");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const value = params.get("plan");
    if (value === "tease" || value === "protagonist") {
      setPlan(value);
    }
  }, []);

  const selectedPlan = planConfig[plan];

  return (
    <main className="min-h-screen bg-[#07040d] text-white">
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="mb-10">
          <p className="text-sm font-medium text-zinc-400">Dev checkout</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            Complete your subscription
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
            This is a fake billing page for development and testing only. No
            real payment will be taken.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold">Billing details</h2>

            <div className="mt-6 grid gap-4">
              <input
                placeholder="Cardholder name"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-zinc-500"
              />
              <input
                placeholder="Card number"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-zinc-500"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  placeholder="MM / YY"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-zinc-500"
                />
                <input
                  placeholder="CVC"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-zinc-500"
                />
              </div>
              <input
                placeholder="Billing postcode"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-zinc-500"
              />
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/select-plan"
                className="rounded-2xl border border-white/10 px-5 py-4 text-center text-base font-medium text-white transition hover:bg-white/5"
              >
                Back
              </Link>

              <Link
                href="/dashboard"
                className="rounded-2xl bg-[#d2b56f] px-5 py-4 text-center text-base font-semibold text-black transition hover:opacity-90"
              >
                Complete signup
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-sm font-medium uppercase tracking-wide text-zinc-400">
              Order summary
            </p>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-3xl font-semibold">{selectedPlan.name}</h2>
              <p className="mt-3 text-zinc-300">{selectedPlan.description}</p>

              <div className="mt-8 flex items-end justify-between border-b border-white/10 pb-6">
                <span className="text-zinc-400">Subscription</span>
                <span className="text-3xl font-semibold">
                  {selectedPlan.price}
                </span>
              </div>

              <div className="mt-6 space-y-3 text-sm text-zinc-300">
                <div className="flex justify-between">
                  <span>Today</span>
                  <span>Test mode</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment processing</span>
                  <span>Fake</span>
                </div>
                <div className="flex justify-between">
                  <span>Real charge</span>
                  <span>$0.00</span>
                </div>
              </div>
            </div>

            <p className="mt-6 text-sm leading-6 text-zinc-400">
              For development only. When you're ready, this page can be swapped
              for a real Stripe Checkout flow.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
