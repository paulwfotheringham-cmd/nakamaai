"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { NavConceptLayout } from "./nav-concepts/NavConceptRenderer";
import { NAV_CONCEPTS, parseNavConcept, type NavConceptId } from "./nav-concepts/nav-destinations";
import type { DateNightScenario } from "./date-night-scenarios";

export type { LiveTestNavId };

type CouplesCenterView =
  | "menu"
  | "date-night-invite"
  | "date-night-matching"
  | "date-night-reveal"
  | "date-night-experience"
  | "surprise";

function ConceptSwitcher({
  active,
  onChange,
}: {
  active: NavConceptId;
  onChange: (id: NavConceptId) => void;
}) {
  return (
    <div className="nav-concept-switcher">
      <Link href="/live-test/nav-concepts" className="nav-concept-switcher-link">
        All concepts
      </Link>
      <div className="nav-concept-switcher-pills" role="tablist" aria-label="Navigation concept">
        {NAV_CONCEPTS.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={active === c.id}
            onClick={() => onChange(c.id)}
            className={`nav-concept-switcher-pill${active === c.id ? " is-active" : ""}`}
          >
            {c.id.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function LiveTestShell() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<LiveTestNavId | null>(null);
  const [concept, setConcept] = useState<NavConceptId>("b");
  const centerPanel = getLiveTestCenterPanel(activeNav);
  const [couplesView, setCouplesView] = useState<CouplesCenterView>("menu");
  const [dateNightPartner, setDateNightPartner] = useState<string>("");
  const [dateNightMatch, setDateNightMatch] = useState<DateNightScenario | null>(null);
  const onDateNightExperience =
    centerPanel === "couples-program" && couplesView === "date-night-experience";
  const showConceptSwitcher = searchParams.get("concepts") === "1";

  useEffect(() => {
    setConcept(parseNavConcept(searchParams.get("concept")));
  }, [searchParams]);

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

  function setConceptAndUrl(next: NavConceptId) {
    setConcept(next);
    const params = new URLSearchParams(searchParams.toString());
    params.set("concept", next);
    router.replace(`/live-test?${params.toString()}`, { scroll: false });
  }

  const experienceContent = (
    <>
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
    </>
  );

  const showExperience =
    concept !== "a" || activeNav !== null;

  return (
    <div className="relative flex h-full min-h-0 w-full max-w-full flex-col overflow-hidden bg-[#050505] text-stone-200">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-12%,rgba(180,130,50,0.14),transparent_60%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_50%,rgba(120,80,30,0.06),transparent_55%)]" aria-hidden />

      {showConceptSwitcher ? (
        <ConceptSwitcher active={concept} onChange={setConceptAndUrl} />
      ) : null}

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <NavConceptLayout
          concept={concept}
          activeId={activeNav}
          onHome={() => setActiveNav(null)}
          onSelect={setActiveNav}
          hiddenNav={onDateNightExperience}
          guide={
            <div className="flex h-full min-h-0 flex-col overflow-hidden p-3 sm:p-4">
              <LiveTestGuideRail onNavigate={setActiveNav} />
            </div>
          }
        >
          {showExperience ? (
            <div className="flex h-full min-h-0 flex-col overflow-hidden p-3 sm:p-4 md:p-6 lg:p-8">
              {experienceContent}
            </div>
          ) : null}
        </NavConceptLayout>
      </div>
    </div>
  );
}
