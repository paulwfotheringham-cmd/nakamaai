export default function MockGuidePanel() {
  return (
    <div className="nav-mockup-guide">
      <div className="nav-mockup-guide-avatar-wrap">
        <div className="nav-mockup-guide-avatar" aria-hidden>
          <div className="nav-mockup-guide-avatar-glow" />
          <svg viewBox="0 0 24 24" fill="none" className="nav-mockup-guide-avatar-icon">
            <circle cx="12" cy="9" r="4" stroke="currentColor" strokeWidth="1.2" />
            <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
        <p className="nav-mockup-guide-name">Your Guide</p>
        <p className="nav-mockup-guide-status">Present · listening</p>
      </div>

      <div className="nav-mockup-guide-chat">
        <div className="nav-mockup-bubble nav-mockup-bubble-guide">
          What mood are we chasing tonight? I can take you somewhere slow, or somewhere bold.
        </div>
        <div className="nav-mockup-bubble nav-mockup-bubble-user">
          Something cinematic. Couples energy.
        </div>
        <div className="nav-mockup-bubble nav-mockup-bubble-guide">
          Date Night is perfect — match a scenario together and I&apos;ll stay with you both.
        </div>
      </div>

      <div className="nav-mockup-guide-input">
        <span className="nav-mockup-guide-input-placeholder">Ask your guide anything…</span>
        <span className="nav-mockup-guide-input-send" aria-hidden>
          ↑
        </span>
      </div>
    </div>
  );
}
