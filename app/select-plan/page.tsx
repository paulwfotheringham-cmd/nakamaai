import Link from "next/link";

export default function SelectPlanPage() {
  const plans = [
    {
      name: "The Tease",
      subtitle: "Perfect for the casual listener testing the waters",
      price: "$9.99 / month",
      features: ["Standard Voice", "Cancel anytime"],
      highlighted: false,
      cta: "Select plan",
      href: "/fake-checkout?plan=tease",
    },
    {
      name: "The Protagonist",
      subtitle: "Our most popular tier. Dive deep into your fantasies",
      price: "$14.99 / month",
      features: ["Premier Voice", "Cancel anytime"],
      highlighted: true,
      cta: "Select plan",
      href: "/fake-checkout?plan=protagonist",
    },
    {
      name: "Starter",
      subtitle: "Enjoy 7 days of the platform",
      price: "Free for 7 days",
      features: ["Standard Voice", "No charge today"],
      highlighted: false,
      cta: "Start free trial",
      href: "/dashboard",
    },
  ];

  return (
    <main className="relative min-h-screen bg-[#07040d] text-white">
      <a href="/" className="fixed left-6 top-5 z-50 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-semibold text-white/75 backdrop-blur-md">← Home</a>
      {/* LOGO (top-right corner) */}
      <img
        src="/Nakama-AI-July25-White.png"
        alt="Nakama logo"
        style={{
          position: "absolute",
          top: "24px",
          right: "32px",
          height: "63px",
          zIndex: 20,
        }}
      />

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium text-zinc-400">Choose your plan</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            Start your Nakama journey
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-300">
            Pick the tier that fits how deeply you want to immerse yourself.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex h-full flex-col rounded-3xl border p-6 transition-all ${
                plan.highlighted
                  ? "border-lime-300/40 bg-lime-300 text-black"
                  : "border-white/10 bg-white/5 text-white"
              }`}
            >
              {plan.highlighted && (
                <div className="mb-4 inline-flex w-fit rounded-full bg-black/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  Most popular
                </div>
              )}

              <div className="flex-1">
                <h2
                  className={`text-3xl font-semibold tracking-tight ${
                    plan.highlighted ? "text-black" : "text-white"
                  }`}
                >
                  {plan.name}
                </h2>

                <p
                  className={`mt-4 text-base leading-7 ${
                    plan.highlighted ? "text-black/80" : "text-zinc-300"
                  }`}
                >
                  {plan.subtitle}
                </p>

                <div className="mt-8">
                  <p
                    className={`text-3xl font-semibold ${
                      plan.highlighted ? "text-black" : "text-white"
                    }`}
                  >
                    {plan.price}
                  </p>
                </div>

                <div className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className={`rounded-2xl px-4 py-3 text-sm ${
                        plan.highlighted
                          ? "bg-black/5 text-black"
                          : "bg-white/5 text-zinc-200"
                      }`}
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={plan.href}
                className={`mt-8 rounded-2xl px-5 py-4 text-center text-base font-medium transition ${
                  plan.highlighted
                    ? "bg-black text-white hover:bg-zinc-900"
                    : "bg-white text-black hover:bg-zinc-200"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
