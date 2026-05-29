"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CouplesPartnerInvitePanel from "@/components/CouplesPartnerInvitePanel";
import { persistAccountEmail } from "@/lib/account-email";

export default function CcardTrialPage() {
  const router = useRouter();

  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [postcode, setPostcode] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const email = params.get("email");
    if (name) setCardholderName(name);
    if (email) persistAccountEmail(email);
    if (!localStorage.getItem("plan")) {
      localStorage.setItem("plan", "free");
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (!cardholderName || !cardNumber || !expiry || !cvc || !postcode) {
      setMessage("Please fill in all fields.");
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      router.push("/onboarding");
    }, 700);
  }

  return (
    <main className="min-h-screen bg-[#07040d] text-luxury-primary">
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="mb-10">
          <p className="text-sm font-medium text-zinc-400">10-day free trial</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            Start your free trial
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
            Fake checkout for the 10-day trial. No real payment will be taken — use
            any test card details. You won&apos;t be charged today; cancel anytime
            before day 10.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.85fr_0.85fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold">Billing details</h2>

            <form onSubmit={handleSubmit} className="mt-6">
              <div className="grid gap-4">
                <input
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="Cardholder name"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-luxury-primary outline-none placeholder:text-zinc-500"
                />
                <input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Card number"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-luxury-primary outline-none placeholder:text-zinc-500"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM / YY"
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-luxury-primary outline-none placeholder:text-zinc-500"
                  />
                  <input
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="CVC"
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-luxury-primary outline-none placeholder:text-zinc-500"
                  />
                </div>
                <input
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="Billing postcode"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-luxury-primary outline-none placeholder:text-zinc-500"
                />
              </div>

              {message && (
                <p className="mt-4 text-sm text-red-300">{message}</p>
              )}

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/signup-trial"
                  className="rounded-2xl border border-white/10 px-5 py-4 text-center text-base font-medium text-luxury-primary transition hover:bg-white/5"
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
              <h2 className="text-3xl font-semibold">10 Day Free Trial</h2>
              <p className="mt-3 text-zinc-300">
                Full platform access for 10 days. No charge today; cancel anytime
                before day 10.
              </p>

              <ul className="mt-6 space-y-2 text-sm text-zinc-300">
                <li>• Cancel anytime</li>
                <li>• Standard voices</li>
                <li>• Access to all services</li>
                <li>• No charge today</li>
              </ul>

              <div className="mt-8 flex items-end justify-between border-b border-white/10 pb-6">
                <span className="text-zinc-400">Trial</span>
                <span className="text-right text-2xl font-semibold sm:text-3xl">
                  Free for 10 days
                </span>
              </div>

              <div className="mt-6 space-y-3 text-sm text-zinc-300">
                <div className="flex justify-between">
                  <span>Today</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>After 10 days</span>
                  <span>$14.99 / month</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment processing</span>
                  <span>Test mode</span>
                </div>
                <div className="flex justify-between">
                  <span>Real charge</span>
                  <span>$0.00</span>
                </div>
              </div>
            </div>

            <p className="mt-6 text-sm leading-6 text-zinc-400">
              Fill in any fake details and click Complete signup to choose your
              guide and finish setup.
            </p>
          </div>

          <CouplesPartnerInvitePanel />
        </div>
      </section>
    </main>
  );
}
