"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    // 👉 instead of sending email, go to password page
    router.push(
      `/set-password?email=${encodeURIComponent(
        email
      )}&name=${encodeURIComponent(name)}`
    );
  }

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#07040d",
        color: "white",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top center, rgba(120, 52, 120, 0.22), transparent 45%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1280px",
          margin: "0 auto",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "96px",
          padding: "56px 32px",
          flexWrap: "wrap",
        }}
      >
        {/* LEFT SIDE (unchanged) */}
        <section
          style={{
            flex: 1,
            maxWidth: "700px",
            minWidth: "320px",
          }}
        >
          <p
            style={{
              margin: "0 0 24px 0",
              fontSize: "13px",
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              color: "#c9a96a",
            }}
          >
            Nakama
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(64px, 7vw, 98px)",
              lineHeight: 0.98,
              fontWeight: 700,
              letterSpacing: "-0.04em",
            }}
          >
            Ready to turn
            <br />
            up the heat?
          </h1>

          <p style={{ marginTop: 32, fontSize: 20, opacity: 0.8 }}>
            Join Nakama and transform your reading time into an unforgettable
            audio experience.
          </p>
        </section>

        {/* RIGHT SIDE FORM */}
        <aside style={{ width: "100%", maxWidth: "520px" }}>
          <div
            style={{
              borderRadius: "34px",
              border: "1px solid rgba(255,255,255,0.09)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.035))",
              padding: "38px",
              boxShadow: "0 22px 80px rgba(0,0,0,0.35)",
              backdropFilter: "blur(12px)",
            }}
          >
            <h2 style={{ fontSize: 48, marginBottom: 16 }}>
              Join Nakama
            </h2>

            <p style={{ marginBottom: 24, opacity: 0.7 }}>
              Create your account to continue
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: "100%",
                  height: "58px",
                  marginBottom: "14px",
                  borderRadius: "18px",
                  background: "rgba(255,255,255,0.04)",
                  padding: "0 18px",
                  color: "white",
                }}
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  height: "58px",
                  marginBottom: "18px",
                  borderRadius: "18px",
                  background: "rgba(255,255,255,0.04)",
                  padding: "0 18px",
                  color: "white",
                }}
              />

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  height: "60px",
                  borderRadius: "18px",
                  background: "#d2b56f",
                  color: "#111",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                Continue
              </button>
            </form>
          </div>
        </aside>
      </div>
    </main>
  );
}
