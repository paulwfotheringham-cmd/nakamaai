export default function Home() {
  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#0a0710",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <img
        src="/images/sleeping-girl.png"
        alt=""
        style={{
          position: "absolute",
          right: "-80px",
          top: "-40px",
          width: "420px",
          opacity: 0.2,
          filter: "blur(6px)",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(to right, rgba(10,7,16,1), rgba(10,7,16,0.85), rgba(10,7,16,0))",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1200px",
          minHeight: "100vh",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          padding: "96px 24px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: "640px" }}>
          <p
            style={{
              marginBottom: "16px",
              fontSize: "14px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#a3a3a3",
            }}
          >
            Nakama AI
          </p>

          <h1
            style={{
              marginBottom: "24px",
              fontSize: "64px",
              lineHeight: 1.05,
              fontWeight: 700,
            }}
          >
            Build your circle.
          </h1>

          <p
            style={{
              marginBottom: "32px",
              fontSize: "20px",
              lineHeight: 1.6,
              color: "#d4d4d8",
            }}
          >
            Nakama helps people connect, collaborate, and feel at home online.
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <a
              href="/signup"
              style={{
                display: "inline-block",
                padding: "14px 24px",
                borderRadius: "16px",
                background: "white",
                color: "black",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Get started
            </a>

            <a
              href="#"
              style={{
                display: "inline-block",
                padding: "14px 24px",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
