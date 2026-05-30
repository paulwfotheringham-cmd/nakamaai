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
    <div className={`dn-rating-picker${compact ? " dn-rating-picker-compact" : ""}`} role="group" aria-label="Rate scenario">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
        <button
          key={n}
          type="button"
          className={`dn-rating-pill${value === n ? " dn-rating-pill-active" : ""}`}
          aria-pressed={value === n}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
