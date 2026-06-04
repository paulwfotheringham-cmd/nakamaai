"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getLiveTestCenterPanel,
  LIVE_TEST_NAV_ITEMS,
  type LiveTestNavId,
} from "@/lib/nakama-universe-services";

const LIVE_TEST_NAV_IDS = new Set(LIVE_TEST_NAV_ITEMS.map((item) => item.id));
import DateNightPrototypeFlow from "./date-night/DateNightPrototypeFlow";
import SurpriseModePage from "./SurpriseModePage";
import LiveTestCouplesProgram from "./LiveTestCouplesProgram";
import LiveTestDashboardHome from "./LiveTestDashboardHome";
import LiveTestCreateAudioFrame from "./LiveTestCreateAudioFrame";
import LiveTestFantasyAudioFrame from "./LiveTestFantasyAudioFrame";
import LiveTestForbiddenChat from "./LiveTestForbiddenChat";
import LiveTestGuideRail from "./LiveTestGuideRail";
import LiveTestInfoPanel from "./LiveTestInfoPanel";
import LiveTestBuildAdventureFrame from "./LiveTestBuildAdventureFrame";
import LiveTestCharactersVoicesFrame from "./LiveTestCharactersVoicesFrame";
import LiveTestProSidebar from "./LiveTestProSidebar";
import LiveTestProfilePanel from "./LiveTestProfilePanel";
import SettingsPrivacyPanel from "./SettingsPrivacyPanel";
import SettingsNotificationsPanel from "./SettingsNotificationsPanel";
import SettingsBillingPanel from "./SettingsBillingPanel";

export type { LiveTestNavId };

type CouplesCenterView = "menu" | "date-night" | "surprise";
type ProfileSubView = "main" | "privacy" | "notifications" | "billing";

export default function LiveTestShell() {
  const searchParams = useSearchParams();
  const [activeNav, setActiveNav] = useState<LiveTestNavId | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [guideRailHidden, setGuideRailHidden] = useState(false); // visible by default on dashboard
  const centerPanel = getLiveTestCenterPanel(activeNav);
  const [couplesView, setCouplesView] = useState<CouplesCenterView>("menu");
  const [profileSubView, setProfileSubView] = useState<ProfileSubView>("main");

  const inCouplesExperience = centerPanel === "couples-program";
  const inDateNightFlow = inCouplesExperience && couplesView === "date-night";
  const showGuideRail = centerPanel !== null && !guideRailHidden;

  useEffect(() => {
    const nav = searchParams.get("nav");
    if (nav === "reignite-couples" || nav === "couples") {
      setActiveNav("reignite-couples");
      return;
    }
    if (nav === "home" || nav === "dashboard") {
      setActiveNav(null);
      return;
    }
    if (nav && LIVE_TEST_NAV_IDS.has(nav as LiveTestNavId)) {
      setActiveNav(nav as LiveTestNavId);
    }
  }, [searchParams]);

  useEffect(() => {
    if (centerPanel !== "couples-program") {
      setCouplesView("menu");
    }
  }, [centerPanel]);

  useEffect(() => {
    if (centerPanel !== "profile") {
      setProfileSubView("main");
    }
  }, [centerPanel]);

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

            {centerPanel !== null && (
              <button
                type="button"
                className={`pro-companion-toggle${guideRailHidden ? "" : " is-open"}`}
                aria-label={guideRailHidden ? "Show companion" : "Hide companion"}
                onClick={toggleGuideRail}
              >
                <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0" aria-hidden>
                  <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.25" />
                  <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                </svg>
                <span>{guideRailHidden ? "Companion" : "Hide"}</span>
              </button>
            )}
          </header>

          <div
            className={`pro-main-body${
              guideRailHidden ? " pro-main-body-guide-hidden" : ""
            }${
              centerPanel === "build-adventure" ? " pro-main-body--ba" : ""
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
                    <div className="couples-subflow-wrap">
                      <SurpriseModePage onBack={() => setCouplesView("menu")} />
                    </div>
                  )}
                  {couplesView === "date-night" && (
                    <div className="couples-subflow-wrap couples-subflow-wrap--flush">
                      <DateNightPrototypeFlow
                        onBack={() => setCouplesView("menu")}
                      />
                    </div>
                  )}
                </>
              )}
              {centerPanel === "build-adventure" && <LiveTestBuildAdventureFrame />}
              {centerPanel === "character-voices" && <LiveTestCharactersVoicesFrame />}
              {centerPanel === "forbidden-chat" && <LiveTestForbiddenChat />}
              {centerPanel === "profile" && (
                <>
                  {profileSubView === "main" && (
                    <LiveTestProfilePanel onNavigate={setProfileSubView} />
                  )}
                  {profileSubView === "privacy" && (
                    <SettingsPrivacyPanel onBack={() => setProfileSubView("main")} />
                  )}
                  {profileSubView === "notifications" && (
                    <SettingsNotificationsPanel onBack={() => setProfileSubView("main")} />
                  )}
                  {profileSubView === "billing" && (
                    <SettingsBillingPanel onBack={() => setProfileSubView("main")} />
                  )}
                </>
              )}
              {centerPanel === "dashboard" && <LiveTestDashboardHome />}
            </section>

            {showGuideRail ? (
              <aside className="pro-guide">
                <div className="pro-guide-inner">
                  <LiveTestGuideRail
                    onNavigate={setActiveNav}
                    onHide={toggleGuideRail}
                  />
                </div>
              </aside>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
