import Link from "next/link";

export default function DashboardPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #3a1d2e 0%, #160f18 35%, #09080b 100%)",
        color: "white",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "32px 24px",
        }}
      >
        <div
          style={{
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.4em",
                color: "#d8b26e",
              }}
            >
              Nakama
            </div>
            <div
              style={{
                marginTop: "8px",
                fontSize: "32px",
                fontWeight: 700,
              }}
            >
              Nakama AI
            </div>
          </div>

          <div
            style={{
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              padding: "10px 16px",
              fontSize: "14px",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Welcome to your dashboard
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "inline-flex",
              width: "fit-content",
              borderRadius: "999px",
              border: "1px solid rgba(216,178,110,0.3)",
              background: "rgba(216,178,110,0.1)",
              padding: "8px 16px",
              fontSize: "14px",
              color: "#f1d7a1",
              marginBottom: "16px",
            }}
          >
            Your creative hub
          </div>

          <h1
            style={{
              margin: 0,
              maxWidth: "900px",
              fontSize: "64px",
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            Pick what you want to do in
            <span style={{ color: "#d8b26e" }}> Nakama</span>
          </h1>

          <p
            style={{
              marginTop: "24px",
              maxWidth: "780px",
              fontSize: "22px",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Choose fantasy audio, create your own fantasy audio, explore the
            marketplace, or manage your profile.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: "28px",
            marginTop: "24px",
          }}
        >
          <DashboardCard
            title="Choose fantasy Audio"
            href="/create-audio"
            description="Browse and begin your next immersive audio experience."
          />

          <DashboardCard
            title="Create your own fantasy audio"
            href="/create-audio"
            description="Adjust mood, voices, characters, and generate your scene."
          />

          <DashboardCard
            title="Marketplace"
            href="#"
            description="Explore and discover fantasy audio experiences from the community."
          />

          <DashboardCard
            title="Profile"
            href="/profile"
            description="Manage your details, preferences, and account settings."
          />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  href,
  description,
}: {
  title: string;
  href: string;
  description: string;
}) {
  const isPlaceholder = href === "#";

  const card = (
    <div
      style={{
        minHeight: "220px",
        borderRadius: "28px",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.06)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
        backdropFilter: "blur(12px)",
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: isPlaceholder ? "default" : "pointer",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          width: "fit-content",
          borderRadius: "999px",
          border: "1px solid rgba(216,178,110,0.25)",
          background: "rgba(216,178,110,0.08)",
          padding: "6px 12px",
          fontSize: "12px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#d8b26e",
        }}
      >
        Nakama
      </div>

      <div>
        <div
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "white",
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: "12px",
            fontSize: "15px",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.65)",
          }}
        >
          {description}
        </div>
      </div>

      <div
        style={{
          marginTop: "20px",
          color: "#d8b26e",
          fontSize: "15px",
          fontWeight: 700,
        }}
      >
        {isPlaceholder ? "Coming soon" : "Open →"}
      </div>
    </div>
  );

  if (isPlaceholder) {
    return <div style={{ textDecoration: "none" }}>{card}</div>;
  }

  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      {card}
    </Link>
  );
}
