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
      className={`couples-concierge${guideHidden ? "" : " couples-concierge-open"} ${className}`.trim()}
      aria-label={guideHidden ? "Open AI guide" : "Close AI guide"}
      aria-pressed={!guideHidden}
      onClick={onToggle}
    >
      <span className="couples-concierge-glow" aria-hidden />
      <span className="couples-concierge-icon" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          {guideHidden ? (
            <path
              d="M12 3c-2.2 0-4.2.9-5.7 2.3-.9.9-1.6 2-2 3.2-.4 1.2-.5 2.5-.3 3.8.3 2.1 1.5 4 3.2 5.3 1.2.9 2.6 1.4 4.1 1.4h.7c.4 0 .8-.3.8-.8v-1.2c0-.3-.2-.6-.5-.7-1.1-.4-2-1.1-2.7-2-.8-.9-1.2-2.1-1.2-3.3 0-2.8 2.2-5 5-5s5 2.2 5 5c0 .8-.2 1.6-.5 2.3-.3.7-.8 1.3-1.4 1.8-.2.2-.3.5-.3.8v1.2c0 .4.4.8.8.8h.4c1.8 0 3.5-.7 4.8-2 1.5-1.4 2.4-3.4 2.4-5.5 0-1.3-.3-2.5-.9-3.6-.6-1.1-1.4-2.1-2.5-2.8C16.2 3.9 14.2 3 12 3Z"
              fill="currentColor"
              opacity="0.85"
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
      </span>
      <span className="couples-concierge-copy">
        <span className="couples-concierge-label">AI Guide</span>
        <span className="couples-concierge-sub">
          {guideHidden ? "Your concierge" : "Close"}
        </span>
      </span>
    </button>
  );
}
