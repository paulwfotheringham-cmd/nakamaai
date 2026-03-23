export default function MarketplacePage() {
  return (
    <main className="relative min-h-screen bg-[#07040d] text-white">
      <a
        href="/dashboard"
        className="fixed left-6 top-5 z-50 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-semibold text-white/75 backdrop-blur-md"
      >
        ← Dashboard
      </a>

      {/* Logo */}
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

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-medium text-zinc-400">Nakama AI</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Marketplace
          </h1>
          <div className="mt-6 max-w-3xl">
            <p className="text-base leading-7 text-zinc-300">
              Explore add-ons, upgrade your plan, buy and sell creator content, and more.
            </p>
          </div>
        </div>

        {/* Tiles */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <MarketplaceTile
            icon="⬆️"
            title="Buy Add-ons / Upgrade"
            description="Unlock more voices, higher quality audio, additional story generations, and premium plan features."
            badge="Coming soon"
          />
          <MarketplaceTile
            icon="🎨"
            title="Buy & Sell Creator Content"
            description="Purchase exclusive audio stories from our creators, or sell your own original fantasy audio content to the community."
            badge="Coming soon"
          />
          <MarketplaceTile
            icon="✦"
            title="Other"
            description="Discover more ways to enhance your Nakama experience — gifts, bundles, collaborations and more."
            badge="Coming soon"
          />
        </div>
      </section>
    </main>
  );
}

function MarketplaceTile({
  icon,
  title,
  description,
  badge,
}: {
  icon: string;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="group h-full rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-200 hover:border-white/20 hover:bg-white/10">
      {/* Icon */}
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
        <span aria-hidden="true">{icon}</span>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
        <p className="text-sm leading-6 text-zinc-300">{description}</p>
      </div>

      {/* Badge */}
      {badge && (
        <div className="mt-6">
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              borderRadius: "999px",
              border: "1px solid rgba(216,178,110,0.3)",
              background: "rgba(216,178,110,0.08)",
              padding: "4px 12px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#d8b26e",
              letterSpacing: "0.05em",
            }}
          >
            {badge}
          </span>
        </div>
      )}
    </div>
  );
}
