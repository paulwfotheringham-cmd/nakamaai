"use client";

import { NakamaUniverseCard } from "@/components/NakamaUniverseCard";
import { LIVE_TEST_NAV_ITEMS, type LiveTestNavId } from "@/lib/nakama-universe-services";

type LiveTestUniverseNavProps = {
  activeId: LiveTestNavId | null;
  onSelect: (id: LiveTestNavId) => void;
};

export default function LiveTestUniverseNav({ activeId, onSelect }: LiveTestUniverseNavProps) {
  return (
    <nav
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden pr-0.5"
      aria-label="Nakama Nights Universe"
    >
      {LIVE_TEST_NAV_ITEMS.map((item) => (
        <NakamaUniverseCard
          key={item.id}
          title={item.title}
          description={item.description}
          poster={item.poster}
          active={activeId === item.id}
          onClick={() => onSelect(item.id)}
        />
      ))}
    </nav>
  );
}
