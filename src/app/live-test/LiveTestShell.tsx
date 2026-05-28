"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getLiveTestCenterPanel,
  type LiveTestNavId,
} from "@/lib/nakama-universe-services";
import DateNightInvitePage from "./DateNightInvitePage";
import DateNightMatchingPage from "./DateNightMatchingPage";
import DateNightMatchRevealPage from "./DateNightMatchRevealPage";
import DateNightExperiencePage from "./DateNightExperiencePage";
import SurpriseModePage from "./SurpriseModePage";
import LiveTestCouplesProgram from "./LiveTestCouplesProgram";
import LiveTestDashboardHome from "./LiveTestDashboardHome";
import LiveTestCreateAudioFrame from "./LiveTestCreateAudioFrame";
import LiveTestFantasyAudioFrame from "./LiveTestFantasyAudioFrame";
import LiveTestForbiddenChat from "./LiveTestForbiddenChat";
import LiveTestGuideRail from "./LiveTestGuideRail";
import LiveTestInfoPanel from "./LiveTestInfoPanel";
import LiveTestProfilePanel from "./LiveTestProfilePanel";
import LiveTestUniverseNav from "./LiveTestUniverseNav";
import type { DateNightScenario } from "./date-night-scenarios";

export type { LiveTestNavId };

type CouplesCenterView =
  | "menu"
  | "date-night-invite"
  | "date-night-matching"
  | "date-night-reveal"
  | "date-night-experience"
  | "surprise";

export default function LiveTestShell() {
  const searchParams = useSearchParams();
  const [activeNav, setActiveNav] = useState<LiveTestNavId | null>(null);
  const centerPanel = getLiveTestCenterPanel(activeNav);
  const onDashboard = activeNav === null;
  const [couplesView, setCouplesView] = useState<CouplesCenterView>("menu");
  const [dateNightPartner, setDateNightPartner] = useState<string>("");
  const [dateNightMatch, setDateNightMatch] = useState<DateNightScenario | null>(
    null,
  );
  const onDateNightExperience =
    centerPanel === "couples-program" && couplesView === "date-night-experience";

  useEffect(() => {
    const nav = searchParams.get("nav");
    if (nav === "reignite-couples" || nav === "couples") {
      setActiveNav("reignite-couples");
    }
  }, [searchParams]);

  useEffect(() => {
    if (centerPanel !== "couples-program") {
      setCouplesView("menu");
      setDateNightPartner("");
      setDateNightMatch(null);
    }
  }, [centerPanel]);

  return (
    <div className="relative grid h-full min-h-0 w-full max-w-full overflow-hidden bg-[#050505] text-stone-200 grid-rows-[auto_minmax(0,1fr)_minmax(18rem,44dvh)] md:grid-cols-[minmax(13rem,15.25rem)_minmax(0,1fr)_minmax(16rem,22rem)] md:grid-rows-1">
      {/* Ambient atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-12%,rgba(180,130,50,0.14),transparent_60%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_50%,rgba(120,80,30,0.06),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_0%_80%,rgba(80,50,20,0.05),transparent_50%)]"
        aria-hidden
      />

      {/* Left nav */}
      <aside
        className={`launcher-sidebar relative z-10 flex shrink-0 flex-col transition md:col-start-1 md:row-start-1 md:h-full md:min-h-0 ${
          onDateNightExperience ? "opacity-60" : "opacity-100"
        }`}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0c0a08]/98 via-[#060606]/96 to-black/98"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_0%_0%,rgba(180,130,50,0.1),transparent_58%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-amber-900/15 to-transparent"
          aria-hidden
        />

        <div className="relative shrink-0 px-4 pb-5 pt-7 md:px-4 md:pb-6 md:pt-9">
          <Link href="/" className="flex w-full justify-center transition-opacity hover:opacity-100">
            <Image
              src="/Nakama-AI-July25-White.png"
              alt="Nakama Nights"
              width={280}
              height={76}
              className="h-[3.25rem] w-auto max-w-full object-contain opacity-90 md:h-[3.75rem]"
              priority
            />
          </Link>

          <div
            className="mx-auto mt-6 h-px max-w-[85%] bg-gradient-to-r from-transparent via-amber-900/25 to-transparent"
            aria-hidden
          />

          <button
            type="button"
            onClick={() => setActiveNav(null)}
            className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold tracking-wide transition-all duration-300 ${
              onDashboard
                ? "bg-gradient-to-b from-amber-200 to-amber-600 text-zinc-950 shadow-[0_4px_24px_rgba(198,164,106,0.35),inset_0_1px_0_rgba(255,255,255,0.25)]"
                : "border border-white/[0.06] bg-white/[0.03] text-stone-400 hover:-translate-y-px hover:border-amber-900/25 hover:bg-white/[0.05] hover:text-stone-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0" aria-hidden>
              <path
                d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5Z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinejoin="round"
              />
            </svg>
            Dashboard
          </button>
        </div>

        <div className="relative min-h-0 flex-1 px-3 pb-7 md:px-3 md:pb-8">
          <LiveTestUniverseNav activeId={activeNav} onSelect={setActiveNav} />
        </div>
      </aside>

      {/* Center content */}
      <section className="relative z-10 flex min-h-0 min-w-0 flex-col overflow-hidden p-4 sm:p-6 md:col-start-2 md:row-start-1 md:p-8">
        {centerPanel === "fantasy-audio" && <LiveTestFantasyAudioFrame />}
        {centerPanel === "create-audio" && <LiveTestCreateAudioFrame />}
        {centerPanel === "couples-program" && (
          <>
            {couplesView === "menu" && (
              <LiveTestCouplesProgram
                onStartDateNight={() => setCouplesView("date-night-invite")}
                onStartSurprise={() => setCouplesView("surprise")}
              />
            )}

            {couplesView === "surprise" && (
              <SurpriseModePage onBack={() => setCouplesView("menu")} />
            )}

            {couplesView === "date-night-invite" && (
              <DateNightInvitePage
                onBeginMatching={(partnerUsername) => {
                  setDateNightPartner(partnerUsername);
                  setCouplesView("date-night-matching");
                }}
              />
            )}

            {couplesView === "date-night-matching" && (
              <DateNightMatchingPage
                partnerUsername={dateNightPartner}
                onReveal={(match) => {
                  setDateNightMatch(match);
                  setCouplesView("date-night-reveal");
                }}
              />
            )}

            {couplesView === "date-night-reveal" && dateNightMatch ? (
              <DateNightMatchRevealPage
                match={dateNightMatch}
                onBeginExperience={() => setCouplesView("date-night-experience")}
              />
            ) : null}

            {couplesView === "date-night-experience" && dateNightMatch ? (
              <DateNightExperiencePage match={dateNightMatch} />
            ) : null}
          </>
        )}
        {centerPanel === "build-adventure" && (
          <LiveTestInfoPanel
            eyebrow="Build adventure"
            title="Create your fantasy"
            description="Shape tone, setting, and heat on your terms."
            poster="/tiles/tile2.jpg"
            body="Build Adventure lets you craft custom audio stories step by step — choose characters, mood, pacing, and how far you want to go. Save drafts, revisit scenes, and publish when you’re ready."
          />
        )}
        {centerPanel === "character-voices" && (
          <LiveTestInfoPanel
            eyebrow="Characters & voices"
            title="Your cast, your sound"
            description="Create a character that stays with you across experiences."
            poster="/tiles/tile6.jpg"
            body="Pick or clone the voice you want, define personality and boundaries, and reuse your character in adventures, audiobooks, and chat. Voices and personas travel with you across Nakama Nights."
          />
        )}
        {centerPanel === "forbidden-chat" && <LiveTestForbiddenChat />}
        {centerPanel === "profile" && <LiveTestProfilePanel />}
        {centerPanel === "dashboard" && <LiveTestDashboardHome />}
      </section>

      {/* Guide — avatar + chat */}
      <aside
        className={`relative z-20 flex min-h-[18rem] shrink-0 flex-col overflow-hidden bg-black/50 p-4 backdrop-blur-xl transition sm:min-h-[20rem] sm:p-5 md:col-start-3 md:row-start-1 md:h-full md:min-h-0 md:border-l md:border-white/[0.04] ${
          onDateNightExperience ? "opacity-85" : ""
        }`}
      >
        <LiveTestGuideRail onNavigate={setActiveNav} />
      </aside>
    </div>
  );
}
