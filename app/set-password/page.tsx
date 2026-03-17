"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Create your password");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Password created successfully.");
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
        }}
      >
        <h1 style={{ fontSize: "40px", marginBottom: "16px" }}>
          Create Password
        </h1>

        <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: "20px" }}>
          {message}
        </p>

        {ready ? (
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                color: "white",
                fontSize: "16px",
                outline: "none",
              }}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "14px",
                border: "none",
                background: "#d8b26e",
                color: "black",
                fontWeight: 700,
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Save Password
            </button>
          </form>
        ) : (
          <p style={{ color: "rgba(255,255,255,0.7)" }}>
            Waiting for a valid email session...
          </p>
        )}
      </div>
    </div>
  );
}
