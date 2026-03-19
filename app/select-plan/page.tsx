export default function SelectPlanPage() {
  const plans = [
    {
      name: "The Tease",
      subtitle: "Perfect for the casual listener testing the waters",
      price: "$9.99 a month",
      features: ["Standard Voice", "Cancel anytime"],
      highlighted: false,
    },
    {
      name: "The Protagonist",
      subtitle: "Our most popular tier. Dive deep into your fantasies",
      price: "$14.99 a month",
      features: ["Premier Voice", "Cancel anytime"],
      highlighted: true,
    },
    {
      name: "Starter",
      subtitle: "Enjoy 7 days of the Platform",
      price: "$0",
      features: ["Standard Voice"],
      highlighted: false,
    },
  ];

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-black">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className="flex flex-col gap-3">
              <div
                className={`border-2 border-black px-8 py-10 text-center ${
                  plan.highlighted ? "bg-[#8fd16f]" : "bg-[#135f82] text-white"
                }`}
              >
                <h2 className="text-4xl font-light">{plan.name}</h2>

                <p className="mx-auto mt-10 max-w-xs text-xl leading-8">
                  {plan.subtitle}
                </p>

                <p className="mt-10 text-2xl">{plan.price}</p>

                <div className="mt-10 space-y-2 text-xl">
                  {plan.features.map((feature) => (
                    <p key={feature}>{feature}</p>
                  ))}
                </div>
              </div>

              <button
                className={`border-2 border-black px-6 py-6 text-2xl ${
                  plan.highlighted ? "bg-[#8fd16f]" : "bg-[#135f82] text-white"
                }`}
              >
                Select plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
