"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import PartnerInviteResult from "@/components/PartnerInviteResult";
import { readAccountEmail, persistAccountEmail } from "@/lib/account-email";
import { readAccountUsername } from "@/lib/account-username";
import {
  DEFAULT_USER_NAME,
  readGuidePreferences,
} from "@/lib/guides/preferences";
import {
  DATE_NIGHT_SCENARIOS,
  type DateNightScenario,
} from "./date-night-scenarios";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export default function SurpriseModePage({
  onBack,
}: {
  onBack?: () => void;
}) {
  const username = useMemo(() => {
    return (
      readAccountUsername() ||
      readGuidePreferences().userName?.trim() ||
      DEFAULT_USER_NAME
    );
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showScenarios, setShowScenarios] = useState(false);
  const [selected, setSelected] = useState<DateNightScenario | null>(null);
  const [showInvite, setShowInvite] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<"idle" | "sent" | "error">(
    "idle",
  );
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const stored = readAccountEmail();
    if (stored) setUserEmail(stored);
    const partner = localStorage.getItem("partnerInviteEmail");
    if (partner) setPartnerEmail(partner);
  }, []);

  useEffect(() => {
    const intro: ChatMessage[] = [
      {
        id: "intro-1",
        role: "assistant",
        text: `Welcome to Surprise Mode, ${username}. You're crafting a secret fantasy adventure for your partner — they'll discover it when they join.`,
      },
    ];
    setMessages(intro);

    const t1 = window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: "intro-2",
          role: "assistant",
          text: "I've prepared 20 scenarios for tonight. Choose the one you want to surprise them with — tap a card below when you're ready.",
        },
      ]);
      setShowScenarios(true);
    }, 900);

    return () => window.clearTimeout(t1);
  }, [username]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, showScenarios, showInvite, inviteStatus]);

  function pickScenario(scenario: DateNightScenario) {
    if (selected) return;
    setSelected(scenario);
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${scenario.id}`,
        role: "user",
        text: `I'll surprise them with: ${scenario.title}`,
      },
      {
        id: "confirm",
        role: "assistant",
        text: `Excellent choice — "${scenario.title}" will set the perfect tone. When your partner joins, they'll step into your story.`,
      },
    ]);
    window.setTimeout(() => setShowInvite(true), 600);
  }

  async function handleInviteSubmit(e: FormEvent) {
    e.preventDefault();
    const email = userEmail.trim().toLowerCase();
    const partner = partnerEmail.trim().toLowerCase();

    if (!email || !email.includes("@")) {
      setInviteStatus("error");
      setInviteMessage("Enter your email so we can send your surprise summary.");
      return;
    }

    persistAccountEmail(email);
    setSubmitting(true);
    setInviteStatus("idle");
    setInviteMessage("");

    try {
      const res = await fetch("/api/couples/surprise-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: email,
          partnerEmail: partner || undefined,
          scenarioTitle: selected?.title ?? "Surprise Mode",
          username,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
        inviteLink?: string;
        emailSent?: boolean;
        partnerEmailSent?: boolean;
      };

      const link =
        data.inviteLink ?? `${window.location.origin}/couples-trial-partner`;

      if (!res.ok) {
        setInviteStatus("error");
        setInviteMessage(data.error ?? "Could not send invitations.");
        setInviteLink(link);
        setSubmitting(false);
        return;
      }

      if (partner) localStorage.setItem("partnerInviteEmail", partner);
      setInviteStatus("sent");
      setInviteMessage(data.message ?? "You're all set.");
      setInviteLink(link);
      setEmailSent(Boolean(data.emailSent || data.partnerEmailSent));
      setShowInvite(false);
    } catch {
      setInviteStatus("error");
      setInviteMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-amber-900/25 bg-gradient-to-b from-zinc-950/95 to-[#061a1a] shadow-[inset_0_0_60px_rgba(0,0,0,0.25)]">
      <header className="shrink-0 border-b border-stone-800/50 px-3 py-2 sm:px-4 sm:py-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="type-micro text-amber-600/85">
              Surprise Mode
            </p>
            <h1 className="mt-0.5 font-serif text-base font-semibold leading-tight text-luxury-primary sm:text-lg">
              Plan their fantasy
            </h1>
            <p className="mt-1 text-[10px] leading-snug text-stone-400 sm:text-[11px]">
              AI-guided — pick a scenario, then invite your partner.
            </p>
          </div>
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="shrink-0 rounded-full border border-stone-700/80 px-3 py-1 text-[10px] font-semibold text-stone-300 transition hover:border-amber-700/40 hover:text-amber-100 sm:text-xs"
            >
              Back
            </button>
          ) : null}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col p-2 sm:p-3">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-amber-900/30 bg-gradient-to-b from-zinc-900/90 to-black shadow-[0_0_0_1px_rgba(245,158,11,0.06)]">
          <div
            ref={scrollRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[92%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-sm border border-amber-500/25 bg-amber-950/50 text-amber-50"
                      : "rounded-bl-sm border border-stone-700/80 bg-black/50 text-stone-200"
                  }`}
                >
                  <span className="mb-1 block type-micro text-amber-500/70">
                    {msg.role === "user" ? "You" : "Nakama AI"}
                  </span>
                  {msg.text}
                </div>
              </div>
            ))}

            {showScenarios && !selected ? (
              <div className="space-y-2 pt-1">
                <p className="type-micro text-amber-400/80">
                  20 scenarios — choose one
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {DATE_NIGHT_SCENARIOS.map((scenario) => (
                    <button
                      key={scenario.id}
                      type="button"
                      onClick={() => pickScenario(scenario)}
                      className="group relative overflow-hidden rounded-xl border border-stone-800/80 bg-zinc-950 text-left transition hover:border-amber-500/40 hover:shadow-[0_8px_28px_rgba(0,0,0,0.45)]"
                    >
                      <img
                        src={scenario.image}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover:opacity-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
                      <div className="relative z-10 p-3">
                        <h3 className="font-serif text-sm font-semibold text-luxury-primary sm:text-base">
                          {scenario.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-stone-200/90">
                          {scenario.teaser}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {inviteStatus === "sent" && inviteLink ? (
              <PartnerInviteResult
                inviteLink={inviteLink}
                partnerEmail={partnerEmail || userEmail}
                emailSent={emailSent}
                message={inviteMessage}
              />
            ) : null}

            {inviteStatus === "error" && inviteMessage ? (
              <p className="text-xs text-rose-300/90">
                {inviteMessage}
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
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showInvite && selected ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/65 p-3 backdrop-blur-sm sm:p-4"
            role="dialog"
            aria-modal
            aria-labelledby="surprise-invite-title"
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-b from-zinc-950 to-[#061a1a] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.65)]"
            >
              <p className="type-micro text-amber-500/85">
                Surprise Mode
              </p>
              <h2
                id="surprise-invite-title"
                className="mt-1 font-display text-card font-medium text-luxury-primary sm:text-2xl"
              >
                Invite your partner to join
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-stone-300">
                You chose{" "}
                <span className="font-semibold text-amber-200/95">
                  {selected.title}
                </span>
                . We&apos;ll email you a summary
                {username ? (
                  <>
                    {" "}
                    at <span className="text-amber-200/90">@{username}</span>
                  </>
                ) : null}{" "}
                and can invite your partner too.
              </p>

              <form onSubmit={(e) => void handleInviteSubmit(e)} className="mt-4 space-y-3">
                <label className="block">
                  <span className="text-[11px] font-medium text-stone-400">
                    Your email
                  </span>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-luxury-primary outline-none placeholder:text-zinc-500 focus:border-amber-500/40"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-medium text-stone-400">
                    Partner&apos;s email (optional)
                  </span>
                  <input
                    type="email"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    placeholder="partner@example.com"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-luxury-primary outline-none placeholder:text-zinc-500 focus:border-amber-500/40"
                  />
                </label>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowInvite(false)}
                    className="flex-1 rounded-full border border-stone-700/80 py-2.5 text-sm font-semibold text-stone-300 transition hover:border-stone-600"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-full border border-amber-400/55 bg-gradient-to-b from-amber-200/95 to-amber-600 py-2.5 text-sm font-bold text-zinc-950 transition hover:from-amber-100 hover:to-amber-500 disabled:opacity-60"
                  >
                    {submitting ? "Sending…" : "Send invites"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
