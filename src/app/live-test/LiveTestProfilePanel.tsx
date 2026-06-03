"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_USER_NAME,
  readGuidePreferences,
} from "@/lib/guides/preferences";

/* ── Constants ─────────────────────────────────────────── */

const PLAN_LABELS: Record<string, string> = {
  free: "Free Trial",
  paid: "Premium",
  couples: "Couples",
  "couples-partner": "Couples Partner",
};

function planLabel(plan: string | null) {
  return plan ? (PLAN_LABELS[plan] ?? "Member") : "Member";
}
function billingLabel(billing: string | null) {
  if (billing === "yearly") return "Annual billing";
  if (billing === "monthly") return "Monthly billing";
  return "Monthly billing";
}
function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "N";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/* ── Icons ─────────────────────────────────────────────── */

function Icon({ name }: { name: string }) {
  const cls = "h-4 w-4 shrink-0";
  switch (name) {
    case "shield":
      return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M12 3 19 6v6c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V6l7-3Z" /></svg>;
    case "bell":
      return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M15 17H9m10-2.5A6.5 6.5 0 0 0 7 8.5V7a5 5 0 0 1 10 0v1.5" /><path strokeLinecap="round" d="M10 17a2 2 0 0 0 4 0" /></svg>;
    case "card":
      return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden><rect x="3" y="6" width="18" height="12" rx="2" /><path strokeLinecap="round" d="M3 10h18" /></svg>;
    case "chevron":
      return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" /></svg>;
    case "check":
      return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
    default:
      return null;
  }
}

/* ── Account Details section ───────────────────────────── */

function AccountDetails({ userName }: { userName: string }) {
  const [displayName, setDisplayName] = useState(userName);
  const [username, setUsername] = useState("@" + userName.toLowerCase().replace(/\s+/g, ""));
  const [emailAddr, setEmailAddr] = useState("member@nakamanights.com");
  const [saved, setSaved] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaved, setPwSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handlePwUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPw || !newPw || newPw !== confirmPw) return;
    setPwSaved(true);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setTimeout(() => { setPwSaved(false); setShowPw(false); }, 2500);
  }

  return (
    <section className="prf-section">
      <h2 className="prf-section-title">Account Details</h2>

      <form onSubmit={handleSave} className="prf-form">
        {/* Display Name */}
        <div className="prf-field">
          <label htmlFor="prf-display-name" className="prf-label">Display Name</label>
          <input
            id="prf-display-name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="prf-input"
            placeholder="Your name"
          />
        </div>

        {/* Username */}
        <div className="prf-field">
          <label htmlFor="prf-username" className="prf-label">Username</label>
          <input
            id="prf-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="prf-input"
            placeholder="@username"
          />
        </div>

        {/* Email */}
        <div className="prf-field">
          <label htmlFor="prf-email" className="prf-label">Email Address</label>
          <input
            id="prf-email"
            type="email"
            value={emailAddr}
            onChange={(e) => setEmailAddr(e.target.value)}
            className="prf-input"
            placeholder="your@email.com"
          />
        </div>

        {/* Password row */}
        <div className="prf-field">
          <label className="prf-label">Password</label>
          <div className="prf-pw-row">
            <input
              type="password"
              value="••••••••••"
              readOnly
              className="prf-input prf-input-pw-display"
              aria-label="Current password placeholder"
            />
            <button
              type="button"
              onClick={() => setShowPw((p) => !p)}
              className="prf-change-pw-btn"
            >
              {showPw ? "Cancel" : "Change Password"}
            </button>
          </div>

          {/* Inline password change */}
          {showPw && (
            <form onSubmit={handlePwUpdate} className="prf-pw-expand">
              <input
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="Current password"
                required
                className="prf-input"
              />
              <input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="New password"
                required
                className="prf-input"
              />
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Confirm new password"
                required
                className="prf-input"
              />
              {newPw && confirmPw && newPw !== confirmPw && (
                <p className="prf-field-error">Passwords do not match.</p>
              )}
              <button
                type="submit"
                disabled={!currentPw || !newPw || newPw !== confirmPw}
                className="prf-save-btn"
              >
                {pwSaved ? <><Icon name="check" /> Password updated</> : "Update Password"}
              </button>
            </form>
          )}
        </div>

        {/* Save */}
        <div className="prf-form-footer">
          <button type="submit" className="prf-save-btn">
            {saved ? <><Icon name="check" /> Changes saved</> : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}

/* ── Secondary setting cards ───────────────────────────── */

const SECONDARY_CARDS: { id: ProfileSubView; icon: string; title: string; desc: string }[] = [
  { id: "privacy",       icon: "shield", title: "Privacy Controls", desc: "Manage what we store, your history, and data preferences." },
  { id: "notifications", icon: "bell",   title: "Notifications",    desc: "Choose your email and in-app alert preferences." },
  { id: "billing",       icon: "card",   title: "Billing",           desc: "View your plan, payment method, and invoices." },
];

function SettingCard({ icon, title, desc, onClick }: { icon: string; title: string; desc: string; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="prf-setting-card group">
      <div className="prf-setting-card-icon">
        <Icon name={icon} />
      </div>
      <div className="prf-setting-card-body">
        <p className="prf-setting-card-title">{title}</p>
        <p className="prf-setting-card-desc">{desc}</p>
      </div>
      <div className="prf-setting-card-arrow">
        <Icon name="chevron" />
      </div>
    </button>
  );
}

/* ── Main component ────────────────────────────────────── */

type ProfileSubView = "main" | "privacy" | "notifications" | "billing";

export default function LiveTestProfilePanel({ onNavigate }: { onNavigate?: (view: ProfileSubView) => void }) {
  const [userName, setUserName] = useState(DEFAULT_USER_NAME);
  const [plan, setPlan] = useState<string | null>(null);
  const [billing, setBilling] = useState<string | null>(null);

  useEffect(() => {
    setUserName(readGuidePreferences().userName || DEFAULT_USER_NAME);
    setPlan(localStorage.getItem("plan"));
    setBilling(localStorage.getItem("billing"));
  }, []);

  const initials = useMemo(() => initialsFromName(userName), [userName]);
  const tier = planLabel(plan);
  const isTrial = plan === "free" || plan === "couples";

  return (
    <div className="profile-panel animate-panel-in relative flex h-full min-h-0 flex-col overflow-hidden">

      {/* Backdrop */}
      <div className="profile-panel-backdrop pointer-events-none absolute inset-0" aria-hidden>
        <img
          src="/profile/profile-panel.jpg"
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-[0.18] blur-[2px]"
        />
        <div className="profile-panel-atmosphere absolute inset-0" />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto">

        {/* Header */}
        <header className="shrink-0 px-6 pb-5 pt-7 sm:px-8 sm:pt-8">
          <p className="launcher-eyebrow">Profile</p>
          <div className="mt-5 flex min-w-0 items-center gap-4">
            <div className="profile-avatar" aria-hidden>{initials}</div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="type-card-title leading-snug tracking-tight text-luxury-primary sm:text-2xl">
                  {userName}
                </h1>
                <span className="profile-badge profile-badge-tier">{tier}</span>
                <span className="profile-badge profile-badge-active">Active</span>
              </div>
              <p className="mt-1.5 text-sm text-stone-400/80">Member · Nakama Nights</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 pb-12 sm:px-8">

          {/* Membership card */}
          <div className="profile-membership-card">
            <div>
              <p className="profile-membership-label">Premium Membership</p>
              <p className="profile-membership-tier">{tier}</p>
              <p className="profile-membership-billing">{billingLabel(billing)}</p>
            </div>
            <div className="profile-membership-stats">
              <div>
                <p className="profile-membership-stat-label">Status</p>
                <p className="profile-membership-stat-value profile-membership-stat-active">Active</p>
              </div>
              <div>
                <p className="profile-membership-stat-label">Renewal</p>
                <p className="profile-membership-stat-value">{billing === "yearly" ? "Annual" : "Monthly"}</p>
              </div>
              {isTrial && (
                <div>
                  <p className="profile-membership-stat-label">Trial</p>
                  <p className="profile-membership-stat-value profile-membership-stat-trial">In progress</p>
                </div>
              )}
            </div>
            <button type="button" className="profile-membership-manage">
              Manage Membership
            </button>
          </div>

          {/* Account Details */}
          <AccountDetails userName={userName} />

          {/* Secondary cards */}
          <section className="prf-section mt-8">
            <h2 className="prf-section-title">Settings</h2>
            <div className="prf-settings-list">
              {SECONDARY_CARDS.map((c) => (
                <SettingCard
                  key={c.id}
                  icon={c.icon}
                  title={c.title}
                  desc={c.desc}
                  onClick={() => onNavigate?.(c.id)}
                />
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
