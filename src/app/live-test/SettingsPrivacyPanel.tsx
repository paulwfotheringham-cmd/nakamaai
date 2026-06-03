"use client";

import { useState } from "react";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`stg-toggle ${checked ? "stg-toggle-on" : ""}`}
    >
      <span className="stg-toggle-thumb" />
    </button>
  );
}

export default function SettingsPrivacyPanel({ onBack }: { onBack: () => void }) {
  const [playbackHistory, setPlaybackHistory] = useState(true);
  const [showClearListen, setShowClearListen] = useState(false);
  const [showClearAdventure, setShowClearAdventure] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  return (
    <div className="stg-panel animate-panel-in">
      <div className="stg-panel-inner">

        {/* Header */}
        <header className="stg-header">
          <button type="button" onClick={onBack} className="stg-back-btn">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <path d="M19 12H5M9 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Profile
          </button>
          <p className="launcher-eyebrow mt-5">Settings</p>
          <h1 className="stg-page-title">Privacy &amp; Security</h1>
          <p className="stg-page-subtitle">Control what Nakama Nights stores and how your data is used.</p>
        </header>

        {/* Playback History */}
        <section className="stg-section">
          <h2 className="stg-section-heading">History</h2>
          <div className="stg-list">
            <div className="stg-row stg-row-toggle">
              <div className="stg-row-body">
                <p className="stg-row-title">Playback History</p>
                <p className="stg-row-desc">Allow Nakama Nights to remember your listening and adventure history to improve recommendations.</p>
              </div>
              <Toggle checked={playbackHistory} onChange={() => setPlaybackHistory(p => !p)} />
            </div>

            <div className="stg-row">
              <div className="stg-row-body">
                <p className="stg-row-title">Clear Listening History</p>
                <p className="stg-row-desc">Remove all saved audiobook and story playback data.</p>
              </div>
              <button type="button" onClick={() => setShowClearListen(true)} className="stg-action-btn stg-action-btn-danger">
                Clear
              </button>
              {showClearListen && (
                <div className="stg-confirm-inline">
                  <p className="stg-confirm-text">This will permanently delete your listening history. Are you sure?</p>
                  <div className="stg-confirm-btns">
                    <button type="button" onClick={() => setShowClearListen(false)} className="stg-action-btn">Cancel</button>
                    <button type="button" onClick={() => setShowClearListen(false)} className="stg-action-btn stg-action-btn-danger">Yes, clear it</button>
                  </div>
                </div>
              )}
            </div>

            <div className="stg-row">
              <div className="stg-row-body">
                <p className="stg-row-title">Clear Adventure History</p>
                <p className="stg-row-desc">Remove all saved interactive and build-adventure session data.</p>
              </div>
              <button type="button" onClick={() => setShowClearAdventure(true)} className="stg-action-btn stg-action-btn-danger">
                Clear
              </button>
              {showClearAdventure && (
                <div className="stg-confirm-inline">
                  <p className="stg-confirm-text">This will permanently delete your adventure history. Are you sure?</p>
                  <div className="stg-confirm-btns">
                    <button type="button" onClick={() => setShowClearAdventure(false)} className="stg-action-btn">Cancel</button>
                    <button type="button" onClick={() => setShowClearAdventure(false)} className="stg-action-btn stg-action-btn-danger">Yes, clear it</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Data */}
        <section className="stg-section">
          <h2 className="stg-section-heading">Your Data</h2>
          <div className="stg-list">
            <div className="stg-row">
              <div className="stg-row-body">
                <p className="stg-row-title">Download My Data</p>
                <p className="stg-row-desc">Request an export of all data Nakama Nights holds about you. Delivered within 48 hours.</p>
              </div>
              <button type="button" className="stg-action-btn">
                Request export
              </button>
            </div>

            <div className="stg-row stg-row-info">
              <div className="stg-row-body">
                <p className="stg-row-title">Data Retention</p>
                <p className="stg-row-desc">
                  Nakama Nights retains account data for 30 days after cancellation. Conversation data is never sold or shared with third parties. Story preferences and usage data are stored solely to improve your experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Danger zone */}
        <section className="stg-section stg-section-danger">
          <h2 className="stg-section-heading stg-section-heading-danger">Danger Zone</h2>
          <div className="stg-list">
            <div className="stg-row">
              <div className="stg-row-body">
                <p className="stg-row-title stg-row-title-danger">Delete Account</p>
                <p className="stg-row-desc">Permanently delete your Nakama Nights account and all associated data. This cannot be undone.</p>
              </div>
              <button type="button" onClick={() => setShowDeleteAccount(p => !p)} className="stg-action-btn stg-action-btn-danger">
                Delete account
              </button>
            </div>
            {showDeleteAccount && (
              <div className="stg-confirm-inline stg-confirm-danger">
                <p className="stg-confirm-text">Type <strong>DELETE</strong> to confirm permanent account deletion.</p>
                <input
                  type="text"
                  value={deleteConfirm}
                  onChange={e => setDeleteConfirm(e.target.value)}
                  placeholder="Type DELETE"
                  className="prf-input stg-confirm-input"
                />
                <div className="stg-confirm-btns">
                  <button type="button" onClick={() => { setShowDeleteAccount(false); setDeleteConfirm(""); }} className="stg-action-btn">Cancel</button>
                  <button
                    type="button"
                    disabled={deleteConfirm !== "DELETE"}
                    className="stg-action-btn stg-action-btn-danger"
                  >
                    Permanently delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
