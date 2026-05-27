"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "58px",
  marginBottom: "14px",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  padding: "0 18px",
  color: "white",
  boxSizing: "border-box",
  fontSize: "16px",
  outline: "none",
};

export default function SignupTrialPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== passwordRepeat) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        credentials: "same-origin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          name: name.trim(),
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Could not create account. Please try again.");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      params.set("email", email.trim());
      if (name.trim()) params.set("name", name.trim());
      router.push(`/ccard-trial?${params.toString()}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#07040d",
        color: "white",
      }}
    >
      <a href="/" style={backBtnStyle}>
        ← Back
      </a>
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
          width: "100%",
          maxWidth: "520px",
          borderRadius: "34px",
          border: "1px solid rgba(255,255,255,0.09)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.035))",
          padding: "38px",
          boxShadow: "0 22px 80px rgba(0,0,0,0.35)",
          backdropFilter: "blur(12px)",
        }}
      >
        <p
          style={{
            margin: "0 0 22px 0",
            fontSize: "13px",
            letterSpacing: "0.34em",
            textTransform: "uppercase",
            color: "#c9a96a",
          }}
        >
          Get started
        </p>

        <h1
          style={{
            margin: "0 0 18px 0",
            fontSize: "clamp(42px, 8vw, 58px)",
            lineHeight: 0.98,
            letterSpacing: "-0.035em",
            fontWeight: 700,
            color: "#f7f5f2",
          }}
        >
          Join Nakama
        </h1>

        <p
          style={{
            margin: "0 0 28px 0",
            fontSize: "19px",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.68)",
          }}
        >
          Create your account and sign up for a FREE 10 day trial.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Set password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Re-enter password"
            value={passwordRepeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            style={{ ...inputStyle, marginBottom: "18px" }}
          />

          {error && (
            <p
              style={{
                margin: "0 0 14px 0",
                fontSize: "14px",
                lineHeight: 1.5,
                color: "#f0a8a8",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: "60px",
              border: "none",
              borderRadius: "18px",
              background: "#d2b56f",
              color: "#111111",
              fontSize: "18px",
              fontWeight: 700,
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  );
}

const backBtnStyle: React.CSSProperties = {
  position: "fixed",
  top: "20px",
  left: "24px",
  zIndex: 50,
  color: "rgba(255,255,255,0.75)",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 600,
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  padding: "8px 14px",
  borderRadius: "12px",
  backdropFilter: "blur(10px)",
};
