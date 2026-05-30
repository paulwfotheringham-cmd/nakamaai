"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getLiveTestCenterPanel,
  type LiveTestNavId,
} from "@/lib/nakama-universe-services";
import DateNightPrototypeFlow from "./date-night/DateNightPrototypeFlow";
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

export type { LiveTestNavId };

type CouplesCenterView = "menu" | "date-night" | "surprise";

export default function LiveTestShell() {
  const searchParams = useSearchParams();
  const [activeNav, setActiveNav] = useState<LiveTestNavId | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [guideRailHidden, setGuideRailHidden] = useState(false);
  const centerPanel = getLiveTestCenterPanel(activeNav);
  const [couplesView, setCouplesView] = useState<CouplesCenterView>("menu");

  const inCouplesExperience = centerPanel === "couples-program";
  const inDateNightFlow = inCouplesExperience && couplesView === "date-night";
  const hideGuideRail = inCouplesExperience && guideRailHidden;
  const showGuideRail = inCouplesExperience ? !guideRailHidden : centerPanel !== null;

  useEffect(() => {
    const nav = searchParams.get("nav");
    if (nav === "reignite-couples" || nav === "couples") {
      setActiveNav("reignite-couples");
    }
  }, [searchParams]);

  useEffect(() => {
    if (centerPanel !== "couples-program") {
      setCouplesView("menu");
      setGuideRailHidden(false);
    }
  }, [centerPanel]);

  useEffect(() => {
    if (inCouplesExperience) {
      setGuideRailHidden(true);
    }
  }, [inCouplesExperience, couplesView]);

  function toggleGuideRail() {
    setGuideRailHidden((hidden) => !hidden);
  }

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
              hideGuideRail ? " pro-main-body-guide-hidden" : ""
            }`}
          >
            <section className={`pro-content${inDateNightFlow ? " pro-content-dn" : ""}`}>
              {centerPanel === "fantasy-audio" && <LiveTestFantasyAudioFrame />}
              {centerPanel === "create-audio" && <LiveTestCreateAudioFrame />}
              {centerPanel === "couples-program" && (
                <>
                  {couplesView === "menu" && (
                    <LiveTestCouplesProgram
                      onStartDateNight={() => setCouplesView("date-night")}
                      onStartSurprise={() => setCouplesView("surprise")}
                    />
                  )}
                  {couplesView === "surprise" && (
                    <SurpriseModePage onBack={() => setCouplesView("menu")} />
                  )}
                  {couplesView === "date-night" && (
                    <DateNightPrototypeFlow onBack={() => setCouplesView("menu")} />
                  )}
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

            {showGuideRail ? (
              <aside className="pro-guide">
                <div className="pro-guide-inner">
                  <LiveTestGuideRail
                    onNavigate={setActiveNav}
                    onHide={inCouplesExperience ? toggleGuideRail : undefined}
                  />
                </div>
              </aside>
            ) : null}
          </div>
        </div>
      </div>

      {inCouplesExperience ? (
        <button
          type="button"
          className={`pro-guide-restore-fab${guideRailHidden ? "" : " pro-guide-restore-fab-active"}`}
          aria-label={guideRailHidden ? "Show companion" : "Hide companion"}
          aria-pressed={!guideRailHidden}
          onClick={toggleGuideRail}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
            {guideRailHidden ? (
              <path
                d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      ) : null}
    </div>
  );
}
