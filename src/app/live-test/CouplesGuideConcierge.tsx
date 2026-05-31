"use client";

type CouplesGuideConciergeProps = {
  guideHidden: boolean;
  onToggle: () => void;
  className?: string;
};

export default function CouplesGuideConcierge({
  guideHidden,
  onToggle,
  className = "",
}: CouplesGuideConciergeProps) {
  return (
    <button
      type="button"
      className={`couples-concierge${guideHidden ? "" : " couples-concierge-active"} ${className}`.trim()}
      aria-label="AI guide concierge"
      aria-pressed={!guideHidden}
      onClick={onToggle}
    >
      <span className="couples-concierge-glow" aria-hidden />
      <span className="couples-concierge-icon" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path
            d="M12 2a7 7 0 0 0-4.9 11.95v2.55a1.5 1.5 0 0 0 1.5 1.5h1.1a1.5 1.5 0 0 0 1.5-1.5v-.55h2.8a1.5 1.5 0 0 0 1.5-1.5v-1.55A7 7 0 0 0 12 2Z"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 19.5h5"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="couples-concierge-copy">
        <span className="couples-concierge-label">AI Guide</span>
        <span className="couples-concierge-sub">Your concierge</span>
      </span>
    </button>
  );
}
