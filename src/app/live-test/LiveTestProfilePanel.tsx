"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_USER_NAME,
  readGuidePreferences,
} from "@/lib/guides/preferences";

const PLAN_LABELS: Record<string, string> = {
  free: "Free Trial",
  paid: "Premium",
  couples: "Couples",
  "couples-partner": "Couples Partner",
};

const SETTING_CARDS = [
  {
    id: "display-name",
    icon: "user",
    title: "Display Name",
    description: "How your name appears to your guide and across Nakama Nights.",
  },
  {
    id: "email",
    icon: "mail",
    title: "Email Address",
    description: "Used to sign in and receive important account updates.",
  },
  {
    id: "password",
    icon: "lock",
    title: "Password",
    description: "Update your password to keep your account secure.",
  },
  {
    id: "privacy",
    icon: "shield",
    title: "Privacy Controls",
    description: "Manage what we store, your history, and data preferences.",
  },
  {
    id: "notifications",
    icon: "bell",
    title: "Notifications",
    description: "Choose your email and in-app alert preferences.",
  },
  {
    id: "billing",
    icon: "card",
    title: "Billing",
    description: "View your plan, payment method, and invoices.",
  },
] as const;

function SettingIcon({ name }: { name: string }) {
  const cls = "h-5 w-5 shrink-0 text-amber-400/75";
  switch (name) {
    case "user":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 21a8 8 0 0 0-16 0" />
          <circle cx="12" cy="8" r="4" />
        </svg>
      );
    case "mail":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path strokeLinecap="round" d="m3 7 9 6 9-6" />
        </svg>
      );
    case "lock":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path strokeLinecap="round" d="M8 11V8a4 4 0 1 1 8 0v3" />
        </svg>
      );
    case "shield":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 19 6v6c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V6l7-3Z" />
        </svg>
      );
    case "bell":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17H9m10-2.5A6.5 6.5 0 0 0 7 8.5V7a5 5 0 0 1 10 0v1.5" />
          <path strokeLinecap="round" d="M10 17a2 2 0 0 0 4 0" />
        </svg>
      );
    case "card":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path strokeLinecap="round" d="M3 10h18" />
        </svg>
      );
    default:
      return null;
  }
}

function ProfileCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <button type="button" className="profile-card group">
      <div className="profile-card-top">
        <div className="profile-card-icon-wrap">
          <SettingIcon name={icon} />
        </div>
        <svg
          className="profile-card-chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
        </svg>
      </div>
      <div>
        <p className="profile-card-title">{title}</p>
        <p className="profile-card-desc">{description}</p>
      </div>
    </button>
  );
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "N";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function planLabel(plan: string | null): string {
  if (!plan) return "Member";
  return PLAN_LABELS[plan] ?? "Member";
}

function billingLabel(billing: string | null): string {
  if (billing === "yearly") return "Annual billing";
  if (billing === "monthly") return "Monthly billing";
  return "Monthly billing";
}

export default function LiveTestProfilePanel() {
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
        <div className="px-6 pb-10 sm:px-8">

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
                <p className="profile-membership-stat-value">
                  {billing === "yearly" ? "Annual" : "Monthly"}
                </p>
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

          {/* Settings card grid */}
          <div className="profile-card-grid">
            {SETTING_CARDS.map((card) => (
              <ProfileCard key={card.id} icon={card.icon} title={card.title} description={card.description} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
