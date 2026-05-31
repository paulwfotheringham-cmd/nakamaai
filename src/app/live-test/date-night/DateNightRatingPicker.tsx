"use client";

type DateNightRatingPickerProps = {
  value: number | undefined;
  onChange: (value: number) => void;
  compact?: boolean;
};

export default function DateNightRatingPicker({
  value,
  onChange,
  compact = false,
}: DateNightRatingPickerProps) {
  return (
    <div
      className={`dn-rating-scale${compact ? " dn-rating-scale-compact" : ""}`}
      role="group"
      aria-label="Rate scenario from 1 to 10"
    >
      <div className="dn-rating-scale-track">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <button
            key={n}
            type="button"
            className={`dn-rating-scale-btn${value === n ? " dn-rating-scale-btn-active" : ""}${
              value !== undefined && n <= value ? " dn-rating-scale-btn-filled" : ""
            }`}
            aria-pressed={value === n}
            aria-label={`Rate ${n}`}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export function RatingLegendCompact() {
  return (
    <p className="dn-rating-inline">
      <span className="dn-rating-inline-strong">Rate tonight&apos;s possibilities</span>
      <span className="dn-rating-inline-sep" aria-hidden>
        •
      </span>
      <span>10 = I&apos;d love this</span>
      <span className="dn-rating-inline-sep" aria-hidden>
        •
      </span>
      <span>1 = Not for me</span>
    </p>
  );
}
