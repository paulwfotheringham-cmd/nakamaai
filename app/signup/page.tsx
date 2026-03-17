"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, #3a1d2e 0%, #160f18 35%, #09080b 100%)",
        color: "white",
        padding: "24px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#d8b26e",
            marginBottom: "12px",
          }}
        >
          Nakama
        </div>

        <h1
          style={{
            fontSize: "40px",
            fontWeight: 700,
            margin: "0 0 10px 0",
          }}
        >
          Join Nakama
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            marginBottom: "24px",
            lineHeight: 1.6,
          }}
        >
          Enter your name and email to get your password setup link.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />

            <input
              placeholder="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "14px",
                border: "none",
                background: "#d8b26e",
                color: "black",
                fontWeight: 700,
                fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Sending..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <div
            style={{
              padding: "16px",
              borderRadius: "14px",
              background: "rgba(72, 187, 120, 0.12)",
              border: "1px solid rgba(72, 187, 120, 0.35)",
              color: "#86efac",
              lineHeight: 1.6,
            }}
          >
            Check your email for your password setup link.
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  fontSize: "16px",
  outline: "none",
};
