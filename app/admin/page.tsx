"use client";

import { useMemo, useRef, useState, type CSSProperties } from "react";
import {
  FANTASY_AUDIO_CATEGORY_OPTIONS,
} from "../../lib/fantasy-audio-category-options";

export default function AdminPage() {
  const first = FANTASY_AUDIO_CATEGORY_OPTIONS[0];
  const initialValue = first ? `${first.categoryTitle}|||${first.items[0]}` : "";
  const [selection, setSelection] = useState(initialValue);
  const [adminKey, setAdminKey] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const { categoryTitle, itemName } = useMemo(() => {
    const [c, i] = selection.split("|||");
    return { categoryTitle: c ?? "", itemName: i ?? "" };
  }, [selection]);

  async function uploadFile(file: File) {
    if (!adminKey.trim()) {
      setStatus("err");
      setMessage("Enter the admin key (same as ADMIN_UPLOAD_SECRET on the server).");
      return;
    }

    setStatus("uploading");
    setMessage("");

    const fd = new FormData();
    fd.set("categoryTitle", categoryTitle);
    fd.set("itemName", itemName);
    fd.set("file", file);

    try {
      const res = await fetch("/api/admin/upload-wav", {
        method: "POST",
        headers: { Authorization: `Bearer ${adminKey.trim()}` },
        body: fd,
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        path?: string;
        ok?: boolean;
      };
      if (!res.ok) {
        setStatus("err");
        setMessage(data.error ?? `Upload failed (${res.status})`);
        return;
      }
      setStatus("ok");
      setMessage(`Saved to Supabase storage: ${data.path ?? "audio bucket"}`);
    } catch (e) {
      setStatus("err");
      setMessage(e instanceof Error ? e.message : "Network error");
    }
  }

  function onFileChosen() {
    const input = fileRef.current;
    const file = input?.files?.[0];
    if (!file) return;
    void uploadFile(file);
    input.value = "";
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(165deg, #0f0618 0%, #1a0f28 45%, #12091a 100%)",
        color: "#e8dcc4",
        padding: "32px 24px 64px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
            fontWeight: 700,
            marginBottom: 8,
            color: "#f0e6d2",
          }}
        >
          Admin
        </h1>
        <h2
          style={{
            fontSize: "clamp(1.25rem, 3vw, 1.6rem)",
            fontWeight: 600,
            marginBottom: 28,
            color: "#d8b26e",
          }}
        >
          Fantasy Audio Admin
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <label style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 280 }}>
            <span style={{ fontSize: 13, opacity: 0.85 }}>Fantasy Audio category &amp; track</span>
            <select
              value={selection}
              onChange={(e) => setSelection(e.target.value)}
              style={{ ...selectStyle, minWidth: 280 }}
            >
              {FANTASY_AUDIO_CATEGORY_OPTIONS.map((r) => (
                <optgroup key={r.categoryTitle} label={r.categoryTitle}>
                  {r.items.map((item) => (
                    <option key={`${r.categoryTitle}:${item}`} value={`${r.categoryTitle}|||${item}`}>
                      {item}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>

          <input
            ref={fileRef}
            type="file"
            accept=".wav,audio/wav"
            style={{ display: "none" }}
            onChange={onFileChosen}
            aria-hidden
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={status === "uploading"}
            style={btnPrimary}
          >
            {status === "uploading" ? "Uploading…" : "Upload wav audio"}
          </button>

          <button type="button" style={btnGhost} disabled>
            AI Clone wav
          </button>
        </div>

        <label style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 400 }}>
          <span style={{ fontSize: 13, opacity: 0.85 }}>Admin key (server ADMIN_UPLOAD_SECRET)</span>
          <input
            type="password"
            autoComplete="off"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Paste the secret from Vercel env"
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(0,0,0,0.35)",
              color: "#f0e6d2",
              fontSize: 15,
            }}
          />
        </label>

        {message ? (
          <p
            style={{
              marginTop: 20,
              fontSize: 14,
              color: status === "ok" ? "#8fd9a8" : status === "err" ? "#f0a8a8" : "#c9c9c9",
            }}
          >
            {message}
          </p>
        ) : null}

        <p style={{ marginTop: 24, fontSize: 12, opacity: 0.55, lineHeight: 1.5 }}>
          Files are stored in Supabase bucket <code style={{ opacity: 0.9 }}>audio</code> under{" "}
          <code style={{ opacity: 0.9 }}>admin-wav/&lt;category&gt;/&lt;item&gt;.wav</code> (same name as the
          selected item). <code>lib/</code> cannot receive uploads on Vercel; use storage or redeploy with
          static files instead.
        </p>
      </div>
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(0,0,0,0.35)",
  color: "#f0e6d2",
  fontSize: 15,
  minWidth: 200,
  cursor: "pointer",
};

const btnPrimary: CSSProperties = {
  padding: "12px 20px",
  borderRadius: 12,
  border: "1px solid rgba(216,178,110,0.45)",
  background: "linear-gradient(180deg, rgba(216,178,110,0.35), rgba(120,90,50,0.5))",
  color: "#fff8ea",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: 15,
};

const btnGhost: CSSProperties = {
  padding: "12px 20px",
  borderRadius: 12,
  border: "1px dashed rgba(255,255,255,0.22)",
  background: "transparent",
  color: "rgba(255,255,255,0.45)",
  fontWeight: 600,
  cursor: "not-allowed",
  fontSize: 15,
};
