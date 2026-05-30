"use client";

import { MOCK_FEMALE_VOICES, MOCK_MALE_VOICES, STORY_DURATION_SEC } from "@/lib/date-night-prototype/constants";
import { getScenarioImage } from "@/lib/date-night-prototype/scenario-images";
import type { DateNightSession } from "@/lib/date-night-prototype/types";

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type DateNightPlayerProps = {
  session: DateNightSession;
  partnerName: string;
  onUpdate: (patch: Partial<DateNightSession>) => void;
  onSave?: () => void;
  compact?: boolean;
  showSave?: boolean;
};

export default function DateNightPlayer({
  session,
  partnerName,
  onUpdate,
  onSave,
  compact = false,
  showSave = true,
}: DateNightPlayerProps) {
  const title = session.friendlyName || session.matchedScenario?.title || "Tonight's adventure";
  const scenario = session.matchedScenario?.title ?? "";
  const image = session.matchedScenario ? getScenarioImage(session.matchedScenario.title) : "/tiles/tile2.jpg";
  const progress =
    ((STORY_DURATION_SEC - session.playback.timeRemainingSec) / STORY_DURATION_SEC) * 100;

  return (
    <div className={`dn-player${compact ? " dn-player-compact" : ""}`}>
      <div className="dn-player-art-wrap">
        <img src={image} alt="" className="dn-player-art" />
        <div className="dn-player-art-glow" aria-hidden />
      </div>

      <div className="dn-player-body">
        <p className="dn-player-eyebrow">{scenario}</p>
        <h3 className="dn-player-title">{title}</h3>
        <p className="dn-player-partner">With {partnerName}</p>

        <div className="dn-waveform" aria-hidden>
          {Array.from({ length: compact ? 24 : 40 }).map((_, i) => (
            <span
              key={i}
              className={`dn-waveform-bar${session.playback.playing ? " dn-waveform-bar-live" : ""}`}
              style={{ animationDelay: `${(i % 8) * 0.08}s`, height: `${28 + (i % 5) * 10}%` }}
            />
          ))}
        </div>

        <div className="dn-player-time-row">
          <span className="dn-player-time">{formatTime(STORY_DURATION_SEC - session.playback.timeRemainingSec)}</span>
          <div className="dn-player-progress">
            <div className="dn-player-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="dn-player-time">{formatTime(session.playback.timeRemainingSec)} remaining</span>
        </div>

        <div className="dn-player-controls">
          {!session.playback.playing ? (
            <button
              type="button"
              className="dn-player-btn dn-player-btn-primary"
              onClick={() => onUpdate({ playback: { ...session.playback, playing: true } })}
            >
              {session.playback.timeRemainingSec < STORY_DURATION_SEC ? "Resume" : "Play"}
            </button>
          ) : (
            <button
              type="button"
              className="dn-player-btn dn-player-btn-primary"
              onClick={() => onUpdate({ playback: { ...session.playback, playing: false } })}
            >
              Pause
            </button>
          )}
          <button
            type="button"
            className="dn-player-btn"
            onClick={() =>
              onUpdate({
                playback: { playing: false, timeRemainingSec: STORY_DURATION_SEC },
              })
            }
          >
            Stop
          </button>
          {showSave && onSave ? (
            <button type="button" className="dn-player-btn dn-player-btn-save" onClick={onSave}>
              Save
            </button>
          ) : null}
        </div>

        {!compact ? (
          <div className="dn-player-voices">
            <label className="dn-lux-field">
              <span>Male voice</span>
              <select
                className="dn-lux-select"
                value={session.maleVoice}
                onChange={(e) => onUpdate({ maleVoice: e.target.value })}
              >
                {MOCK_MALE_VOICES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <label className="dn-lux-field">
              <span>Female voice</span>
              <select
                className="dn-lux-select"
                value={session.femaleVoice}
                onChange={(e) => onUpdate({ femaleVoice: e.target.value })}
              >
                {MOCK_FEMALE_VOICES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}
      </div>
    </div>
  );
}
