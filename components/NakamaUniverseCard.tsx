"use client";

/** Matches homepage “Nakama Nights Universe” tile cards (nakamanights.com). */
export function NakamaUniverseCard({
  title,
  description,
  poster,
  active = false,
  onClick,
}: {
  title: string;
  description: string;
  poster: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const className = `group relative w-full min-w-0 overflow-hidden rounded-xl border bg-black text-left shadow-lg transition ${
    active
      ? "border-amber-400/55 ring-1 ring-amber-400/25"
      : "border-stone-800 hover:border-stone-700"
  }`;

  const body = (
    <>
      <img src={poster} alt="" className="h-36 w-full object-cover sm:h-40" />
      <div className="px-3 pb-4 pt-7">
        <h3 className="min-h-[2.2rem] type-card-title leading-snug text-luxury-primary">
          {title}
        </h3>
        <p className="mt-2 min-h-[3.6rem] text-small leading-relaxed text-luxury-secondary">
          {description}
        </p>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {body}
      </button>
    );
  }

  return <div className={className}>{body}</div>;
}
