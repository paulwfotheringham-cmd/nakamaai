"use client";

const PROFILE_SETTINGS = [
  {
    id: "display-name",
    label: "Display Name",
    description: "How your name appears across Nakama Nights and to your guide.",
  },
  {
    id: "email",
    label: "Email address",
    description: "Used to sign in, recover your account, and receive important updates.",
  },
  {
    id: "password",
    label: "Change password",
    description: "Update your password anytime to keep your account secure.",
  },
  {
    id: "privacy",
    label: "Privacy controls",
    description: "Manage what we store, playback history, and how your activity is used.",
  },
  {
    id: "notifications",
    label: "Notification options",
    description: "Choose email and in-app alerts for new stories, couples modes, and offers.",
  },
  {
    id: "billing",
    label: "Billing",
    description: "View your plan, payment method, invoices, and membership status.",
  },
] as const;

export default function LiveTestProfilePanel() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-amber-900/25 bg-gradient-to-b from-zinc-950/95 to-[#061a1a] shadow-[inset_0_0_60px_rgba(0,0,0,0.25)]">
      <header className="relative z-10 shrink-0 border-b border-stone-800/50 px-3 py-2 sm:px-4 sm:py-2.5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-amber-600/85">
          Profile
        </p>
        <h1 className="mt-0.5 font-serif text-base font-semibold leading-tight text-white sm:text-lg">
          Jane
        </h1>
        <p className="mt-1 text-[10px] leading-snug text-stone-400 sm:text-[11px]">
          Your account, preferences, and membership.
        </p>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <img
          src="/profile/profile-panel.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-black/30"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/75 via-black/55 to-[#061a1a]/90"
          aria-hidden
        />

        <ul className="relative z-10 flex min-h-0 flex-1 flex-col justify-center gap-2 overflow-y-auto px-3 py-3 sm:gap-2.5 sm:px-4 sm:py-4">
          {PROFILE_SETTINGS.map((item) => (
            <li
              key={item.id}
              className="grid min-h-0 grid-cols-[minmax(6.75rem,8.5rem)_1fr] items-center gap-2.5 sm:grid-cols-[minmax(7.5rem,9.5rem)_1fr] sm:gap-3"
            >
              <button
                type="button"
                className="w-full rounded-full border border-amber-400/50 bg-gradient-to-b from-amber-200/95 to-amber-600 px-2 py-2 text-center text-[10px] font-bold leading-tight text-zinc-950 shadow-[0_2px_10px_rgba(0,0,0,0.4)] transition hover:from-amber-100 hover:to-amber-500 sm:px-2.5 sm:py-2.5 sm:text-[11px]"
              >
                {item.label}
              </button>
              <p className="text-[10px] font-medium leading-snug text-stone-100 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] sm:text-[11px]">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
