import type { LiveTestNavId } from "@/lib/nakama-universe-services";
import { NAV_DESTINATIONS } from "./nav-destinations";

export default function MockExperienceContent({
  label,
  activeId,
}: {
  label: string;
  activeId?: LiveTestNavId | null;
}) {
  const poster =
    activeId === null || activeId === undefined
      ? "/tiles/tile1.jpg"
      : NAV_DESTINATIONS.find((d) => d.target === activeId)?.poster ?? "/tiles/tile1.jpg";

  return (
    <div
      className="nav-preview-content"
      style={{ backgroundImage: `url(${poster})` }}
    >
      <div className="nav-preview-content-scrim" aria-hidden />
      <div className="nav-preview-content-inner">
        <p className="nav-preview-content-eyebrow">Active destination</p>
        <h2 className="nav-preview-content-title">{label}</h2>
        <p className="nav-preview-content-body">
          Full cinematic experience fills this space.
        </p>
      </div>
    </div>
  );
}
