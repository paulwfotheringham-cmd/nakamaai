"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const [plan, setPlan] = useState<PlanKey>("tease");
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [postcode, setPostcode] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const value = params.get("plan");
    if (value === "tease" || value === "protagonist") {
      setPlan(value);
    }
  }, []);

  const selectedPlan = planConfig[plan];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (!cardholderName || !cardNumber || !expiry || !cvc || !postcode) {
      setMessage("Please fill in all fields.");
      return;
    }

    setSubmitting(true);

    // fake delay for dev/testing
    setTimeout(() => {
      router.push("/dashboard");
    }, 700);
  }

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

            <form onSubmit={handleSubmit} className="mt-6">
              <div className="grid gap-4">
                <input
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="Cardholder name"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-zinc-500"
                />
                <input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Card number"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-zinc-500"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM / YY"
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-zinc-500"
                  />
                  <input
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="CVC"
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-zinc-500"
                  />
                </div>
                <input
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="Billing postcode"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-zinc-500"
                />
              </div>

              {message && (
                <p className="mt-4 text-sm text-red-300">{message}</p>
              )}

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/select-plan"
                  className="rounded-2xl border border-white/10 px-5 py-4 text-center text-base font-medium text-white transition hover:bg-white/5"
                >
                  Back
                </Link>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-2xl bg-[#d2b56f] px-5 py-4 text-center text-base font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Processing..." : "Complete signup"}
                </button>
              </div>
            </form>
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
              Fill in any fake details and click Complete signup to continue to
              the dashboard.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
