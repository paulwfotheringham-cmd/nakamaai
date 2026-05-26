"use client";

/** Sidebar nav tile — image with centered overlay label (live-test). */
export function NakamaUniverseNavButton({
  label,
  poster,
  active = false,
  onClick,
}: {
  label: string;
  poster: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-[7.25rem] shrink-0 overflow-hidden rounded-xl text-left shadow-lg transition lg:w-full lg:shrink lg:min-w-0 ${
        active
          ? "border-2 border-white ring-1 ring-white/20"
          : "border border-stone-800 hover:border-stone-600"
      }`}
    >
      <img
        src={poster}
        alt=""
        className="h-[3.25rem] w-full object-cover lg:h-[5.25rem]"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/35"
        aria-hidden
      />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center px-1.5 text-center font-serif text-[10px] font-medium leading-snug tracking-wide text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] lg:px-2 lg:text-sm">
        {label}
      </span>
    </button>
  );
}
