"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

const NIGHTS_MONTHLY = 14.99;
const NIGHTS_YEARLY = Math.round(NIGHTS_MONTHLY * 12 * 0.9 * 100) / 100;
const NIGHTS_YEARLY_PER_MONTH = Math.round((NIGHTS_YEARLY / 12) * 100) / 100;

const COUPLES_MONTHLY = 22.5;
const COUPLES_YEARLY = 243;
const COUPLES_YEARLY_PER_MONTH = Math.round((COUPLES_YEARLY / 12) * 100) / 100;

type BillingInterval = "monthly" | "yearly";

type SelectPlanPageProps = {
  searchParams?: {
    name?: string | string[];
    email?: string | string[];
  };
};

const billingToggleSlot = "mt-2 min-h-[2.35rem] shrink-0";

function BillingToggle({
  billing,
  onChange,
  showYearlyDiscount,
}: {
  billing: BillingInterval;
  onChange: (b: BillingInterval) => void;
  showYearlyDiscount?: boolean;
}) {
  return (
    <div className={`${billingToggleSlot} flex w-full justify-center gap-2`}>
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-wide transition sm:px-4 sm:py-2 sm:text-xs ${
          billing === "monthly"
            ? "border-amber-400/55 bg-gradient-to-b from-amber-200/90 to-amber-600 text-zinc-950"
            : "border-stone-700/80 bg-black/40 text-stone-400 hover:border-amber-800/40 hover:text-stone-200"
        }`}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange("yearly")}
        className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-wide transition sm:px-4 sm:py-2 sm:text-xs ${
          billing === "yearly"
            ? "border-amber-400/55 bg-gradient-to-b from-amber-200/90 to-amber-600 text-zinc-950"
            : "border-stone-700/80 bg-black/40 text-stone-400 hover:border-amber-800/40 hover:text-stone-200"
        }`}
      >
        Yearly
        {showYearlyDiscount ? (
          <span
            className={
              billing === "yearly" ? " text-zinc-800/80" : " text-amber-400/90"
            }
          >
            {" "}
            · Save 10%
          </span>
        ) : null}
      </button>
    </div>
  );
}

function PlanFooter({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="mt-auto shrink-0 pt-4">{children}</div>;
}

function AgeConfirm({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex min-h-[2.75rem] cursor-pointer items-center gap-2.5 text-left"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-stone-600 bg-black/50 accent-amber-500"
      />
      <span className="text-xs leading-snug text-stone-400 sm:text-[13px]">
        I confirm I am 18 years or older
      </span>
    </label>
  );
}

export default function SelectPlanPage(_props: SelectPlanPageProps) {
  const router = useRouter();
  const [nightsBilling, setNightsBilling] = useState<BillingInterval>("monthly");
  const [couplesBilling, setCouplesBilling] = useState<BillingInterval>("monthly");
  const [ageNights, setAgeNights] = useState(false);
  const [ageCouples, setAgeCouples] = useState(false);
  const [ageTeaser, setAgeTeaser] = useState(false);

  const featuresNights = [
    "Cancel anytime",
    "Full History",
    "50 voices",
    "All services",
  ];
  const featuresCouples = [
    "Primary: full Nakama Nights access",
    "Partner: Couples section access",
    "Full access for two users — Couples section",
    "Date Night & shared experiences",
    "Cancel anytime",
  ];
  const featuresTeaser = [
    "Standard Voices",
    "Access to all services",
    "No charge today",
    "Cancel before day 10",
  ];

  const topBlock =
    "flex min-h-[10.5rem] flex-col items-center justify-start text-center sm:min-h-[10rem]";
  const eyebrow =
    "h-5 shrink-0 type-label";
  const tierTitle =
    "mt-2 max-w-[18ch] text-2xl font-medium leading-tight tracking-tight sm:text-[1.85rem] lg:text-[2rem] lg:leading-[1.1]";
  const tagline =
    "mx-auto mt-3 max-w-[17rem] flex-1 text-sm leading-relaxed sm:text-[14px]";
  const priceBox =
    "flex h-[6.5rem] shrink-0 flex-col items-center justify-center text-center";
  const priceMain =
    "text-xl font-semibold tabular-nums tracking-tight sm:text-2xl lg:text-[1.65rem]";
  const featureList = "mt-0 flex flex-1 flex-col gap-2";
  const featurePill =
    "flex min-h-[2.5rem] items-center justify-center rounded-full px-2.5 text-center text-[12px] font-medium leading-snug tracking-wide sm:min-h-[2.65rem] sm:px-3 sm:text-[13px]";

  const selectBtnPrimary =
    "mt-4 inline-flex w-full shrink-0 items-center justify-center rounded-full border border-amber-400/40 bg-gradient-to-b from-amber-200 to-amber-600 px-5 py-3 text-center type-section-heading text-zinc-950 shadow-md transition hover:from-amber-100 hover:to-amber-500 disabled:cursor-not-allowed disabled:opacity-45 sm:py-3.5";
  const selectBtnOutline =
    "mt-4 inline-flex w-full shrink-0 items-center justify-center rounded-full border border-amber-800/50 bg-transparent px-5 py-3 text-center type-section-heading text-amber-100/95 transition hover:border-amber-600/60 hover:bg-amber-950/30 disabled:cursor-not-allowed disabled:opacity-45 sm:py-3.5";

  return (
    <main className="relative min-h-screen bg-black text-luxury-primary antialiased">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_50%_at_50%_-10%,rgba(180,130,50,0.12),transparent_55%)]"
        aria-hidden
      />

      <Link
        href="/"
        className="fixed left-6 top-5 z-50 inline-flex items-center gap-1.5 rounded-full border border-amber-900/40 bg-zinc-950/90 px-4 py-2.5 text-sm font-medium text-amber-100/90 shadow-sm backdrop-blur-sm transition hover:border-amber-700/50 hover:bg-zinc-900"
      >
        ← Home
      </Link>

      <img
        src="/Nakama-AI-July25-White.png"
        alt="Nakama AI"
        className="pointer-events-none absolute right-8 top-6 z-20 h-[52px] w-auto sm:h-[63px]"
      />

      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-24 pt-24 sm:px-8 sm:pt-28">
        <header className="mx-auto max-w-2xl text-center">
          <p className="type-label text-amber-600/85">
            Choose your plan
          </p>
          <h1 className="mt-4 type-section font-display font-medium text-luxury-primary sm:text-4xl md:text-[2.65rem] md:leading-[1.12]">
            Start your{" "}
            <span className="text-luxury-primary">
              Nakama
            </span>{" "}
            journey
          </h1>
          <p className="mt-4 text-base leading-relaxed text-stone-400 sm:text-[17px]">
            Pick the tier that fits how deeply you want to immerse yourself.
          </p>
        </header>

        <div className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-3 lg:items-stretch lg:gap-6">
          {/* Nakama Nights */}
          <article className="flex min-h-full flex-col rounded-2xl bg-gradient-to-b from-zinc-900/95 to-black px-5 py-7 sm:px-7 sm:py-9">
            <div className={topBlock}>
              <p className={`${eyebrow} text-amber-500/70`}>Full access</p>
              <h2 className={`${tierTitle} text-luxury-primary`}>Nakama Nights</h2>
              <p className={`${tagline} text-stone-400`}>
                Dive deep into your fantasies
              </p>
            </div>

            <BillingToggle
              billing={nightsBilling}
              onChange={setNightsBilling}
              showYearlyDiscount
            />

            <div className={priceBox}>
              {nightsBilling === "monthly" ? (
                <p className={`${priceMain} text-amber-100`}>
                  ${NIGHTS_MONTHLY.toFixed(2)}
                  <span className="text-sm font-medium text-stone-500 sm:text-base">
                    {" "}
                    / month
                  </span>
                </p>
              ) : (
                <div className="text-center">
                  <p className={`${priceMain} text-amber-100`}>
                    ${NIGHTS_YEARLY.toFixed(2)}
                    <span className="text-sm font-medium text-stone-500 sm:text-base">
                      {" "}
                      / year
                    </span>
                  </p>
                  <p className="mt-1 text-xs font-medium text-stone-500 sm:text-sm">
                    ${NIGHTS_YEARLY_PER_MONTH.toFixed(2)}/mo billed annually
                  </p>
                </div>
              )}
            </div>

            <ul className={featureList}>
              {featuresNights.map((label) => (
                <li
                  key={label}
                  className={`${featurePill} border border-amber-900/35 bg-black/50 text-stone-300`}
                >
                  {label}
                </li>
              ))}
            </ul>

            <PlanFooter>
              <AgeConfirm
                id="age-nights"
                checked={ageNights}
                onChange={setAgeNights}
              />

              <button
                type="button"
                disabled={!ageNights}
                onClick={() => {
                  localStorage.setItem("plan", "paid");
                  localStorage.setItem("billing", nightsBilling);
                  router.push("/signup");
                }}
                className={selectBtnPrimary}
              >
                Select plan
              </button>
            </PlanFooter>
          </article>

          {/* Couples */}
          <article className="flex min-h-full flex-col rounded-2xl border border-teal-900/30 bg-gradient-to-b from-[#061a1a]/90 to-black px-5 py-7 shadow-[0_0_40px_rgba(0,0,0,0.35)] sm:px-7 sm:py-9 lg:scale-[1.02] lg:border-amber-700/25">
            <div className={topBlock}>
              <p className={`${eyebrow} text-teal-400/80`}>For two</p>
              <h2 className={`${tierTitle} text-luxury-primary`}>Couples</h2>
              <p className={`${tagline} text-stone-400`}>
                One full account. One couples account. Reconnect together.
              </p>
            </div>

            <BillingToggle
              billing={couplesBilling}
              onChange={setCouplesBilling}
              showYearlyDiscount
            />

            <div className={priceBox}>
              {couplesBilling === "monthly" ? (
                <p className={`${priceMain} text-amber-100`}>
                  ${COUPLES_MONTHLY.toFixed(2)}
                  <span className="text-sm font-medium text-stone-500 sm:text-base">
                    {" "}
                    / month
                  </span>
                </p>
              ) : (
                <div className="text-center">
                  <p className={`${priceMain} text-amber-100`}>
                    ${COUPLES_YEARLY.toFixed(0)}
                    <span className="text-sm font-medium text-stone-500 sm:text-base">
                      {" "}
                      / year
                    </span>
                  </p>
                  <p className="mt-1 text-xs font-medium text-stone-500 sm:text-sm">
                    ${COUPLES_YEARLY_PER_MONTH.toFixed(2)}/mo billed annually
                  </p>
                </div>
              )}
            </div>

            <ul className={featureList}>
              {featuresCouples.map((label) => (
                <li
                  key={label}
                  className={`${featurePill} border border-teal-900/40 bg-black/50 text-stone-300`}
                >
                  {label}
                </li>
              ))}
            </ul>

            <PlanFooter>
              <AgeConfirm
                id="age-couples"
                checked={ageCouples}
                onChange={setAgeCouples}
              />

              <button
                type="button"
                disabled={!ageCouples}
                onClick={() => {
                  localStorage.setItem("plan", "couples");
                  localStorage.setItem("billing", couplesBilling);
                  router.push("/signup");
                }}
                className={selectBtnPrimary}
              >
                Select plan
              </button>
            </PlanFooter>
          </article>

          {/* The Teaser */}
          <article className="flex min-h-full flex-col rounded-2xl bg-zinc-950/80 px-5 py-7 sm:px-7 sm:py-9">
            <div className={topBlock}>
              <p className={`${eyebrow} text-stone-500`}>Try first</p>
              <h2 className={`${tierTitle} text-stone-100`}>The Teaser</h2>
              <p className={`${tagline} text-stone-500`}>
                Enjoy 10 days free use of the Platform
              </p>
            </div>

            <div className={billingToggleSlot} aria-hidden />

            <div className={priceBox}>
              <div className={`${priceMain} leading-tight text-stone-100`}>
                <span className="block text-base font-medium text-stone-500 sm:text-lg">
                  Free for
                </span>
                <span className="mt-1 block bg-gradient-to-r from-amber-200/90 to-amber-400/80 bg-clip-text text-transparent">
                  10 days
                </span>
              </div>
            </div>

            <ul className={featureList}>
              {featuresTeaser.map((label) => (
                <li
                  key={label}
                  className={`${featurePill} border border-stone-800 bg-black/30 text-stone-400`}
                >
                  {label}
                </li>
              ))}
            </ul>

            <PlanFooter>
              <p className="mb-3 text-center text-xs leading-relaxed text-stone-500 sm:text-[13px]">
                You will be charged $14.99 a month if you do not cancel after the 10
                day trial period.
              </p>

              <AgeConfirm
                id="age-teaser"
                checked={ageTeaser}
                onChange={setAgeTeaser}
              />

              <button
                type="button"
                disabled={!ageTeaser}
                onClick={() => {
                  localStorage.setItem("plan", "free");
                  router.push("/signup-trial");
                }}
                className={selectBtnOutline}
              >
                Select plan
              </button>
            </PlanFooter>
          </article>
        </div>
      </section>
    </main>
  );
}
