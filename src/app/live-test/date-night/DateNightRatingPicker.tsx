"use client";

type DateNightRatingPickerProps = {
  value: number | undefined;
  onChange: (value: number) => void;
  compact?: boolean;
};

const LABELS: Record<number, string> = { 1: "1", 5: "5", 10: "10" };

export default function DateNightRatingPicker({
  value,
  onChange,
  compact = false,
}: DateNightRatingPickerProps) {
  return (
    <div
      className={`dn-seg${compact ? " dn-seg-compact" : ""}`}
      role="group"
      aria-label="Rate this scenario"
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
        const isActive = value === n;
        const isFilled = value !== undefined && n < value;
        return (
          <button
            key={n}
            type="button"
            aria-pressed={isActive}
            aria-label={`Rate ${n}`}
            className={[
              "dn-seg-btn",
              isActive ? "dn-seg-btn-active" : "",
              isFilled ? "dn-seg-btn-filled" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onChange(n)}
          >
            <span className="dn-seg-btn-num">{n}</span>
          </button>
        );
      })}
    </div>
  );
}

export function RatingLegend() {
  return (
    <p className="dn-rating-inline">
      <span className="dn-rating-inline-strong">Rate tonight&apos;s possibilities</span>
      <span className="dn-rating-inline-sep" aria-hidden>·</span>
      <span className="dn-rating-inline-dim">1 = Not for me</span>
      <span className="dn-rating-inline-sep" aria-hidden>·</span>
      <span className="dn-rating-inline-dim">10 = I&apos;d love this</span>
    </p>
  );
}

/** @deprecated use RatingLegend */
export function RatingLegendCompact() {
  return <RatingLegend />;
}
