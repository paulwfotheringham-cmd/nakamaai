"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { supabase } from "@/lib/supabase-browser";

type Mode = "request" | "update";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<Mode>("request");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    async function bootstrapRecoverySession() {
      const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;
      const hashParams = new URLSearchParams(hash);
      const hashType = hashParams.get("type");
      const code = searchParams.get("code");
      const queryType = searchParams.get("type");

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (!active) return;
        if (exchangeError) {
          setError("This reset link is invalid or has expired. Request a new one below.");
          setReady(true);
          return;
        }
        setMode("update");
        setMessage("Choose a new password for your account.");
        setReady(true);
        return;
      }

      if (hashType === "recovery" || queryType === "recovery") {
        const { data } = await supabase.auth.getSession();
        if (!active) return;
        if (data.session) {
          setMode("update");
          setMessage("Choose a new password for your account.");
        } else {
          setError("This reset link is invalid or has expired. Request a new one below.");
        }
        setReady(true);
        return;
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          setMode("update");
          setMessage("Choose a new password for your account.");
          setError("");
        }
      });

      unsubscribe = () => subscription.unsubscribe();
      setReady(true);
    }

    void bootstrapRecoverySession();

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [searchParams]);

  async function handleRequestReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = (await res.json().catch(() => ({}))) as { message?: string; error?: string };

      if (!res.ok) {
        setError(data.error ?? "Could not send reset email.");
        return;
      }

      setMessage(
        data.message ??
          "If an account exists for that email, we sent a password reset link. Check your inbox and spam folder.",
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      await supabase.auth.signOut();
      setMessage("Password updated. Redirecting to login…");
      window.setTimeout(() => router.replace("/login"), 1500);
    } catch {
      setError("Could not update password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={pageStyle}>
      <Link href="/login" style={backBtnStyle}>
        ← Login
      </Link>
      <Link href="/" style={{ display: "block", marginBottom: "28px", flexShrink: 0 }}>
        <img
          src="/Nakama-AI-July25-White.png"
          alt="Nakama Nights"
          style={{
            display: "block",
            height: "52px",
            width: "auto",
            maxWidth: "min(100%, 280px)",
            objectFit: "contain",
          }}
        />
      </Link>

      <div style={cardStyle}>
        <h1 style={{ fontSize: "40px", fontWeight: 700, margin: "0 0 10px 0" }}>
          {mode === "update" ? "Set new password" : "Reset password"}
        </h1>

        <p style={subtitleStyle}>
          {mode === "update"
            ? message || "Enter your new password below."
            : "Enter your email and we will send you a reset link."}
        </p>

        {!ready && mode === "request" ? (
          <p style={{ color: "rgba(255,255,255,0.55)" }}>Loading…</p>
        ) : null}

        {error ? <p style={errorStyle}>{error}</p> : null}
        {message && mode === "request" ? <p style={successStyle}>{message}</p> : null}
        {message && mode === "update" && !error ? <p style={successStyle}>{message}</p> : null}

        {mode === "update" ? (
          <form onSubmit={handleUpdatePassword} style={{ display: "grid", gap: "16px" }}>
            <input
              type="password"
              placeholder="New password (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              autoComplete="new-password"
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              required
              autoComplete="new-password"
              style={inputStyle}
            />
            <button type="submit" disabled={loading} style={buttonStyle(loading)}>
              {loading ? "Saving…" : "Update password"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRequestReset} style={{ display: "grid", gap: "16px" }}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={inputStyle}
            />
            <button type="submit" disabled={loading} style={buttonStyle(loading)}>
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        <p style={{ marginTop: "20px", fontSize: "14px", color: "rgba(255,255,255,0.55)" }}>
          Remember your password?{" "}
          <Link href="/login" style={{ color: "#d8b26e", textDecoration: "none" }}>
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "radial-gradient(circle at top, #3a1d2e 0%, #160f18 35%, #09080b 100%)",
  color: "white",
  padding: "24px",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "520px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "24px",
  padding: "32px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  backdropFilter: "blur(12px)",
};

const subtitleStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.7)",
  marginBottom: "24px",
  lineHeight: 1.6,
};

const errorStyle: React.CSSProperties = {
  color: "#fca5a5",
  marginBottom: "16px",
  lineHeight: 1.5,
  fontSize: "14px",
};

const successStyle: React.CSSProperties = {
  color: "#86efac",
  marginBottom: "16px",
  lineHeight: 1.5,
  fontSize: "14px",
};

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

function buttonStyle(loading: boolean): React.CSSProperties {
  return {
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
  };
}
