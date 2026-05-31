"use client";

import type { SharedDateNightStory } from "@/lib/date-night-prototype/types";

type DateNightSharedSidebarProps = {
  stories: SharedDateNightStory[];
  activeStoryId: string | null;
  onResume: (story: SharedDateNightStory) => void;
  onNewAdventure: () => void;
};

export default function DateNightSharedSidebar({
  stories,
  activeStoryId,
  onResume,
  onNewAdventure,
}: DateNightSharedSidebarProps) {
  return (
    <aside className="dn-sidebar">
      <div className="dn-sidebar-header">
        <p className="dn-sidebar-eyebrow">Library</p>
        <h2 className="dn-sidebar-title">Saved Stories</h2>
      </div>

      <button type="button" className="dn-sidebar-new" onClick={onNewAdventure}>
        Match tonight&apos;s adventure
      </button>

      {stories.length === 0 ? (
        <p className="dn-sidebar-empty">Saved adventures appear here after your first story.</p>
      ) : (
        <ul className="dn-sidebar-list">
          {stories.map((story) => (
            <li key={story.id}>
              <button
                type="button"
                className={`dn-sidebar-story${activeStoryId === story.id ? " dn-sidebar-story-active" : ""}`}
                onClick={() => onResume(story)}
              >
                <span className="dn-sidebar-story-name">{story.storyName}</span>
                <span className="dn-sidebar-story-meta">
                  {story.partnerName} · {story.progressPercent}% complete
                </span>
                <span className="dn-sidebar-story-date">
                  Last played {new Date(story.dateCreated).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
                <span className="dn-sidebar-resume">Resume →</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
