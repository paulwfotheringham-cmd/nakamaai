"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_USER_NAME,
  readGuidePreferences,
} from "@/lib/guides/preferences";

const PROFILE_SECTIONS = [
  {
    id: "account",
    title: "Account",
    items: [
      {
        id: "display-name",
        label: "Display Name",
        description:
          "How your name appears across Nakama Nights and to your guide.",
        icon: "user",
      },
      {
        id: "email",
        label: "Email address",
        description:
          "Used to sign in, recover your account, and receive important updates.",
        icon: "mail",
      },
      {
        id: "password",
        label: "Change password",
        description:
          "Update your password anytime to keep your account secure.",
        icon: "lock",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy & Security",
    items: [
      {
        id: "privacy",
        label: "Privacy controls",
        description:
          "Manage what we store, playback history, and how your activity is used.",
        icon: "shield",
      },
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    items: [
      {
        id: "notifications",
        label: "Notification options",
        description:
          "Choose email and in-app alerts for new stories, couples modes, and offers.",
        icon: "bell",
      },
    ],
  },
  {
    id: "membership",
    title: "Membership",
    items: [
      {
        id: "billing",
        label: "Billing",
        description:
          "View your plan, payment method, invoices, and membership status.",
        icon: "card",
      },
    ],
  },
] as const;

const PLAN_LABELS: Record<string, string> = {
  free: "Free Trial",
  paid: "Premium",
  couples: "Couples",
  "couples-partner": "Couples Partner",
};

function SettingIcon({ name }: { name: string }) {
  const className = "h-[18px] w-[18px] shrink-0 text-amber-400/75";

  switch (name) {
    case "user":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 21a8 8 0 0 0-16 0" />
          <circle cx="12" cy="8" r="4" />
        </svg>
      );
    case "mail":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path strokeLinecap="round" d="m3 7 9 6 9-6" />
        </svg>
      );
    case "lock":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path strokeLinecap="round" d="M8 11V8a4 4 0 1 1 8 0v3" />
        </svg>
      );
    case "shield":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 19 6v6c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V6l7-3Z" />
        </svg>
      );
    case "bell":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17H9m10-2.5A6.5 6.5 0 0 0 7 8.5V7a5 5 0 0 1 10 0v1.5" />
          <path strokeLinecap="round" d="M10 17a2 2 0 0 0 4 0" />
        </svg>
      );
    case "card":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path strokeLinecap="round" d="M3 10h18" />
        </svg>
      );
    default:
      return null;
  }
}

function ProfileSettingRow({
  label,
  description,
  icon,
}: {
  label: string;
  description: string;
  icon: string;
}) {
  return (
    <li>
      <button type="button" className="profile-settings-row group w-full text-left">
        <span className="profile-settings-row-icon" aria-hidden>
          <SettingIcon name={icon} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-stone-100 transition-colors group-hover:text-luxury-primary">
            {label}
          </span>
          <span className="mt-0.5 block text-xs leading-relaxed text-stone-400/90">
            {description}
          </span>
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-stone-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-amber-300/80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
        </svg>
      </button>
    </li>
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
  return "Billing cycle not set";
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
        <header className="profile-header shrink-0 px-6 pb-6 pt-7 sm:px-8 sm:pt-8">
          <p className="launcher-eyebrow">Profile</p>

          <div className="mt-5 flex min-w-0 items-start gap-4">
            <div className="profile-avatar" aria-hidden>
              {initials}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-card font-medium leading-snug tracking-tight text-luxury-primary sm:text-3xl">
                  {userName}
                </h1>
                <span className="profile-badge profile-badge-tier">{tier}</span>
                <span className="profile-badge profile-badge-active">Active</span>
              </div>
              <p className="mt-2 text-sm text-stone-400/90">Member · Nakama Nights</p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-300/85 sm:text-[15px]">
                Your account, preferences, and membership — everything you need in
                one private place.
              </p>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-8 px-6 pb-10 sm:px-8">
          <section className="profile-status-card" aria-label="Membership">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="type-micro text-amber-500/65">
                  Your membership
                </p>
                <p className="mt-2 font-display text-card font-medium text-luxury-primary">{tier}</p>
                <p className="mt-1 text-sm text-stone-400/90">{billingLabel(billing)}</p>
              </div>
              <div className="flex flex-wrap gap-6 sm:gap-8">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-micro text-stone-500">
                    Status
                  </p>
                  <p className="mt-1 text-sm font-medium text-emerald-300/90">Active</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-micro text-stone-500">
                    Renewal
                  </p>
                  <p className="mt-1 text-sm font-medium text-stone-200">
                    {billing === "yearly" ? "Renews annually" : "Renews monthly"}
                  </p>
                </div>
                {isTrial ? (
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-micro text-stone-500">
                      Trial
                    </p>
                    <p className="mt-1 text-sm font-medium text-amber-200/90">In progress</p>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          {PROFILE_SECTIONS.map((section) => (
            <section key={section.id} className="profile-settings-section">
              <h2 className="profile-section-title">{section.title}</h2>
              <ul className="profile-settings-list">
                {section.items.map((item) => (
                  <ProfileSettingRow
                    key={item.id}
                    label={item.label}
                    description={item.description}
                    icon={item.icon}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
