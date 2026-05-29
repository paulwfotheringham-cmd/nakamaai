import type { LiveTestNavId } from "@/lib/nakama-universe-services";
import { getMockExperience } from "./mock-experiences";

export default function MockExperienceView({ activeId }: { activeId: LiveTestNavId | null }) {
  const exp = getMockExperience(activeId);

  return (
    <div className="nav-mockup-experience">
      <img
        src={exp.poster}
        alt=""
        className="nav-mockup-experience-bg"
        style={exp.posterPosition ? { objectPosition: exp.posterPosition } : undefined}
      />
      <div className="nav-mockup-experience-scrim" aria-hidden />
      <div className="nav-mockup-experience-glow" aria-hidden />

      <div className="nav-mockup-experience-content">
        <p className="nav-mockup-experience-eyebrow">{exp.eyebrow}</p>
        <h1 className="nav-mockup-experience-title">{exp.title}</h1>
        <p className="nav-mockup-experience-subtitle">{exp.subtitle}</p>

        <div className="nav-mockup-experience-actions">
          {exp.cta ? (
            <button type="button" className="nav-mockup-btn-primary">
              {exp.cta}
            </button>
          ) : null}
          <button type="button" className="nav-mockup-btn-ghost">
            Browse library
          </button>
        </div>

        {exp.meta ? <p className="nav-mockup-experience-meta">{exp.meta}</p> : null}
      </div>
    </div>
  );
}
