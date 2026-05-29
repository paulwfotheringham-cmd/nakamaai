"use client";

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
import LiveTestProSidebar from "./LiveTestProSidebar";
import LiveTestProfilePanel from "./LiveTestProfilePanel";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const centerPanel = getLiveTestCenterPanel(activeNav);
  const [couplesView, setCouplesView] = useState<CouplesCenterView>("menu");
  const [dateNightPartner, setDateNightPartner] = useState<string>("");
  const [dateNightMatch, setDateNightMatch] = useState<DateNightScenario | null>(null);
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
    <div className="pro-shell">
      <div className="pro-shell-atmosphere" aria-hidden />

      <LiveTestProSidebar
        activeId={activeNav}
        onSelect={setActiveNav}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <div className="pro-main-wrap">
        <div className="pro-main-card">
          <header className="pro-main-header">
            <button
              type="button"
              className="pro-main-menu-btn"
              aria-label="Open navigation"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div
            className={`pro-main-body${
              onDateNightExperience ? " pro-main-body-immersive" : ""
            }`}
          >
            <section className="pro-content">
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
                  body="Build Adventure lets you craft custom audio stories step by step — choose characters, mood, pacing, and how far you want to go. Save drafts, revisit scenes, and publish when you're ready."
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

            {!onDateNightExperience ? (
              <aside className="pro-guide">
                <div className="pro-guide-inner">
                  <LiveTestGuideRail onNavigate={setActiveNav} />
                </div>
              </aside>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
