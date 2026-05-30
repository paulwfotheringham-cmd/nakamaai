"use client";

import Link from "next/link";
import { useState } from "react";
import PartnerInviteResult from "@/components/PartnerInviteResult";

export default function CouplesPartnerInvitePanel({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [showForm, setShowForm] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [invitedEmail, setInvitedEmail] = useState("");

  async function sendInvite() {
    const email = partnerEmail.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      return;
    }

    setStatus("sending");
    setMessage("");

    try {
      const res = await fetch("/api/couples/invite-partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerEmail: email }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
        inviteLink?: string;
        emailSent?: boolean;
      };

      const link =
        data.inviteLink ?? `${window.location.origin}/couples-trial-partner`;

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Could not send invitation.");
        setInviteLink(link);
        return;
      }

      setStatus("sent");
      setMessage(data.message ?? "Invitation ready for your partner.");
      setInviteLink(link);
      setEmailSent(Boolean(data.emailSent));
      setInvitedEmail(email);
      localStorage.setItem("partnerInviteEmail", email);
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div
      className={`rounded-3xl border border-teal-900/35 bg-gradient-to-b from-[#061a1a]/80 to-black/40 ${
        compact ? "p-5" : "p-6"
      }`}
    >
      <p className="type-label text-teal-400/85">
        Couples
      </p>
      <h2 className="mt-2 type-card-title text-luxury-primary sm:text-2xl">
        Reignite together
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-300">
        Your trial includes access to the Couples section. Invite your partner so
        they can join your shared session.
      </p>

      <ul className="mt-4 space-y-2 text-sm text-zinc-300">
        <li>• You: full platform during trial</li>
        <li>• Partner: Couples section access</li>
        <li>• Date Night & shared experiences</li>
      </ul>

      <Link
        href="/live-test?nav=reignite-couples"
        className="mt-5 flex w-full items-center justify-center rounded-2xl border border-amber-400/40 bg-gradient-to-b from-amber-200/90 to-amber-600 px-4 py-3 text-center type-section-heading text-zinc-950 transition hover:from-amber-100 hover:to-amber-500"
      >
        Open Couples
      </Link>

      <div className="mt-5 border-t border-white/10 pt-5">
        {!showForm ? (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex w-full items-center justify-center rounded-2xl border border-amber-800/50 bg-black/30 px-4 py-3 type-section-heading text-amber-100/95 transition hover:border-amber-600/60 hover:bg-amber-950/30"
          >
            Add your partner
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-medium text-stone-400">
              We&apos;ll email them a link to join your couple session.
            </p>
            <input
              type="email"
              value={partnerEmail}
              onChange={(e) => setPartnerEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-luxury-primary outline-none placeholder:text-zinc-500 focus:border-amber-500/40"
            />
            <button
              type="button"
              onClick={() => void sendInvite()}
              disabled={status === "sending"}
              className="flex w-full items-center justify-center rounded-2xl border border-amber-400/45 bg-gradient-to-b from-amber-200/90 to-amber-600 px-4 py-3 type-section-heading text-zinc-950 transition hover:from-amber-100 hover:to-amber-500 disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Submit"}
            </button>
          </div>
        )}

        {status === "error" && message ? (
          <p className="mt-3 text-xs leading-relaxed text-rose-300/90">
            {message}
            {inviteLink ? (
              <>
                {" "}
                <a href={inviteLink} className="underline text-amber-200/90">
                  Open invite link
                </a>
              </>
            ) : null}
          </p>
        ) : null}

        {status === "sent" && inviteLink ? (
          <PartnerInviteResult
            inviteLink={inviteLink}
            partnerEmail={invitedEmail}
            emailSent={emailSent}
            message={message}
          />
        ) : null}
      </div>
    </div>
  );
}
