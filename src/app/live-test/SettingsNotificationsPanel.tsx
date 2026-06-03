"use client";

import { useState } from "react";

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <div className="stg-row stg-row-toggle">
      <div className="stg-row-body">
        <p className="stg-row-title">{label}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={`stg-toggle ${checked ? "stg-toggle-on" : ""}`}
      >
        <span className="stg-toggle-thumb" />
      </button>
    </div>
  );
}

export default function SettingsNotificationsPanel({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState({
    newContent:       true,
    recommendations:  true,
    membership:       true,
    announcements:    false,
  });
  const [inApp, setInApp] = useState({
    messages:         true,
    adventures:       true,
    reminders:        false,
  });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function toggleEmail(key: keyof typeof email) {
    setEmail(p => ({ ...p, [key]: !p[key] }));
  }
  function toggleInApp(key: keyof typeof inApp) {
    setInApp(p => ({ ...p, [key]: !p[key] }));
  }

  return (
    <div className="stg-panel animate-panel-in">
      <div className="stg-panel-inner">

        <header className="stg-header">
          <button type="button" onClick={onBack} className="stg-back-btn">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <path d="M19 12H5M9 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Profile
          </button>
          <p className="launcher-eyebrow mt-5">Settings</p>
          <h1 className="stg-page-title">Notifications</h1>
          <p className="stg-page-subtitle">Choose how and when Nakama Nights contacts you.</p>
        </header>

        {/* Email */}
        <section className="stg-section">
          <h2 className="stg-section-heading">Email Notifications</h2>
          <div className="stg-list">
            <Toggle label="New content releases"   checked={email.newContent}      onChange={() => toggleEmail("newContent")} />
            <Toggle label="Story recommendations"  checked={email.recommendations} onChange={() => toggleEmail("recommendations")} />
            <Toggle label="Membership updates"     checked={email.membership}      onChange={() => toggleEmail("membership")} />
            <Toggle label="Product announcements"  checked={email.announcements}   onChange={() => toggleEmail("announcements")} />
          </div>
        </section>

        {/* In-App */}
        <section className="stg-section">
          <h2 className="stg-section-heading">In-App Notifications</h2>
          <div className="stg-list">
            <Toggle label="New messages"            checked={inApp.messages}   onChange={() => toggleInApp("messages")} />
            <Toggle label="New adventures"          checked={inApp.adventures} onChange={() => toggleInApp("adventures")} />
            <Toggle label="Saved story reminders"   checked={inApp.reminders}  onChange={() => toggleInApp("reminders")} />
          </div>
        </section>

        <div className="stg-save-row">
          <button type="button" onClick={handleSave} className="prf-save-btn">
            {saved
              ? <><svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> Saved</>
              : "Save preferences"
            }
          </button>
        </div>

      </div>
    </div>
  );
}
