"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "https://nakamaai.vercel.app/set-password",
        data: {
          full_name: name,
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setSubmitted(true);
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
            "radial-gradient(circle at top, rgba(120, 52, 120, 0.22), transparent 45%)",
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
          gap: "64px",
          padding: "64px 24px",
          flexWrap: "nowrap",
        }}
      >
        {/* LEFT SIDE */}
        <section style={{ flex: 1, maxWidth: "760px" }}>
          <p
            style={{
              marginBottom: "24px",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.35em",
              color: "#c9a96a",
            }}
          >
            Nakama
          </p>

          <div
            style={{
              display: "inline-flex",
              marginBottom: "32px",
              borderRadius: "999px",
              border: "1px solid rgba(111,87,49,0.5)",
              background: "rgba(42,29,23,0.6)",
              padding: "10px 20px",
              fontSize: "14px",
              color: "#e0c185",
            }}
          >
            Premium fantasy audio experiences
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(52px, 8vw, 96px)",
              fontWeight: 600,
              lineHeight: 1.02,
            }}
          >
            Create immersive
            <br />
            romantic audio
            <br />
            stories with
            <br />
            <span style={{ color: "#d4b26e" }}>Nakama</span>
          </h1>

          <p
            style={{
              marginTop: "40px",
              fontSize: "clamp(20px, 2.2vw, 28px)",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Choose the mood, shape the characters, customise the voices, and
            generate a private audio fantasy built around your taste.
          </p>

          {/* 🔥 FIXED 4-TILE ROW */}
          <div
            style={{
              marginTop: "40px",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
            }}
          >
            {[
              {
                title: "Guided story design",
                text: "Pick the setting, tone, pacing, and story type.",
              },
              {
                title: "Voice customization",
                text: "Assign different voices to different characters.",
              },
              {
                title: "Private audio scenes",
                text: "Generate scenes made for listening, not just reading.",
              },
              {
                title: "Fast iteration",
                text: "Adjust one detail and instantly create a new version.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  borderRadius: "20px",
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.04)",
                  padding: "20px",
                }}
              >
                <h3 style={{ marginBottom: "8px" }}>{item.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.6)" }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT SIDE */}
        <aside style={{ width: "520px" }}>
          <div
            style={{
              borderRadius: "32px",
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.05)",
              padding: "40px",
            }}
          >
            <p style={{ marginBottom: "20px", color: "#c9a96a" }}>
              GET STARTED
            </p>

            <h2 style={{ fontSize: "42px", marginBottom: "12px" }}>
              Join Nakama
            </h2>

            <p style={{ marginBottom: "24px", color: "#aaa" }}>
              Create your account to set up your password and start building your
              first audio experience.
            </p>

            {submitted ? (
              <div>Check your email for your magic link.</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    height: "50px",
                    marginBottom: "12px",
                    padding: "10px",
                    borderRadius: "12px",
                    background: "#111",
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
                    height: "50px",
                    marginBottom: "16px",
                    padding: "10px",
                    borderRadius: "12px",
                    background: "#111",
                    color: "white",
                  }}
                />

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    height: "50px",
                    borderRadius: "12px",
                    background: "#d4b26e",
                    color: "black",
                    fontWeight: 600,
                  }}
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </form>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
