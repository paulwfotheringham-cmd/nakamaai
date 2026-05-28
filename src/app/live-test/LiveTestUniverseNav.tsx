"use client";

import { NakamaUniverseNavButton } from "@/components/NakamaUniverseNavButton";
import { LIVE_TEST_NAV_ITEMS, type LiveTestNavId } from "@/lib/nakama-universe-services";

type LiveTestUniverseNavProps = {
  activeId: LiveTestNavId | null;
  onSelect: (id: LiveTestNavId) => void;
};

export default function LiveTestUniverseNav({ activeId, onSelect }: LiveTestUniverseNavProps) {
  return (
    <nav
      className="flex shrink-0 flex-row gap-2 overflow-x-auto overscroll-x-contain pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] md:min-h-0 md:flex-1 md:flex-col md:gap-1 md:overflow-y-auto md:overflow-x-hidden md:pr-1 [&::-webkit-scrollbar]:hidden"
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
  );
}
