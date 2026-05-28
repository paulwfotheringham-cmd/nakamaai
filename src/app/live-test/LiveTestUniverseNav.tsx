"use client";

import { NakamaUniverseNavButton } from "@/components/NakamaUniverseNavButton";
import { LIVE_TEST_NAV_ITEMS, type LiveTestNavId } from "@/lib/nakama-universe-services";

type LiveTestUniverseNavProps = {
  activeId: LiveTestNavId | null;
  onSelect: (id: LiveTestNavId) => void;
};

export default function LiveTestUniverseNav({ activeId, onSelect }: LiveTestUniverseNavProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <p className="mb-3 hidden px-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-500/45 md:block">
        Explore
      </p>
      <nav
        className="flex shrink-0 flex-row gap-3 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:min-h-0 md:flex-1 md:flex-col md:gap-2.5 md:overflow-y-auto md:overflow-x-hidden md:pr-0.5 [&::-webkit-scrollbar]:hidden"
        aria-label="Nakama Nights Universe"
      >
        {LIVE_TEST_NAV_ITEMS.map((item) => (
          <NakamaUniverseNavButton
            key={item.id}
            id={item.id}
            label={item.overlayLabel}
            poster={item.poster}
            active={activeId === item.id}
            onClick={() => onSelect(item.id)}
          />
        ))}
      </nav>
    </div>
  );
}
