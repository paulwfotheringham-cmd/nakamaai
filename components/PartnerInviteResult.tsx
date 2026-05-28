"use client";

import { useState } from "react";

const INVITE_BODY =
  "Your partner has requested you to join a shared couple session at Nakama Nights.";

export default function PartnerInviteResult({
  inviteLink,
  partnerEmail,
  emailSent,
  message,
  compact = false,
}: {
  inviteLink: string;
  partnerEmail: string;
  emailSent: boolean;
  message: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const mailto = `mailto:${encodeURIComponent(partnerEmail)}?subject=${encodeURIComponent("Join me on Nakama Nights")}&body=${encodeURIComponent(`${INVITE_BODY}\n\n${inviteLink}`)}`;

  return (
    <div
      className={`rounded-xl border border-amber-900/35 bg-black/40 ${
        compact ? "mt-2 p-2.5" : "mt-3 p-3"
      }`}
    >
      <p
        className={`leading-snug text-amber-200/90 ${
          compact ? "text-[10px] sm:text-[11px]" : "text-xs sm:text-sm"
        }`}
      >
        {message}
      </p>
      {!emailSent ? (
        <p
          className={`mt-1 text-stone-400 ${
            compact ? "text-[10px]" : "text-[11px]"
          }`}
        >
          Automatic email is not enabled yet — copy the link or open your email app.
        </p>
      ) : null}
      <p
        className={`mt-2 break-all font-mono text-stone-300/90 ${
          compact ? "text-[10px]" : "text-xs"
        }`}
      >
        {inviteLink}
      </p>
      <div className={`mt-2 flex flex-wrap gap-2 ${compact ? "" : "sm:gap-2.5"}`}>
        <button
          type="button"
          onClick={() => void copyLink()}
          className="rounded-full border border-amber-400/45 bg-amber-950/30 px-3 py-1 text-[10px] font-semibold text-amber-100 transition hover:bg-amber-900/40 sm:text-xs"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
        <a
          href={mailto}
          className="rounded-full border border-stone-700/80 bg-black/50 px-3 py-1 text-[10px] font-semibold text-stone-200 transition hover:border-amber-700/40 sm:text-xs"
        >
          Open in email
        </a>
      </div>
    </div>
  );
}
