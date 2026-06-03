"use client";

import { useEffect, useState } from "react";

const PLAN_LABELS: Record<string, string> = {
  free: "Free Trial",
  paid: "Premium",
  couples: "Couples",
  "couples-partner": "Couples Partner",
};

const MOCK_INVOICES = [
  { id: "INV-2026-04", date: "1 Apr 2026", amount: "£9.99", status: "Paid" },
  { id: "INV-2026-03", date: "1 Mar 2026", amount: "£9.99", status: "Paid" },
  { id: "INV-2026-02", date: "1 Feb 2026", amount: "£9.99", status: "Paid" },
];

function StatusPill({ children, variant = "default" }: { children: React.ReactNode; variant?: "active" | "trial" | "default" }) {
  const cls = variant === "active" ? "stg-pill stg-pill-active"
    : variant === "trial" ? "stg-pill stg-pill-trial"
    : "stg-pill";
  return <span className={cls}>{children}</span>;
}

export default function SettingsBillingPanel({ onBack }: { onBack: () => void }) {
  const [plan, setPlan] = useState<string | null>(null);
  const [billing, setBilling] = useState<string | null>(null);
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    setPlan(localStorage.getItem("plan"));
    setBilling(localStorage.getItem("billing"));
  }, []);

  const tier = plan ? (PLAN_LABELS[plan] ?? "Member") : "Premium";
  const isTrial = plan === "free" || plan === "couples";
  const renewalInterval = billing === "yearly" ? "Annual" : "Monthly";
  const renewalDate = "1 Jul 2026";

  return (
    <div className="stg-panel animate-panel-in">
      <div className="stg-panel-inner">

        <header className="stg-header">
          <button type="button" onClick={onBack} className="stg-back-btn">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <path d="M19 12H5M9 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Profile
          </button>
          <p className="launcher-eyebrow mt-5">Settings</p>
          <h1 className="stg-page-title">Membership &amp; Billing</h1>
          <p className="stg-page-subtitle">Your plan, payment details, and billing history.</p>
        </header>

        {/* Current plan */}
        <section className="stg-section">
          <h2 className="stg-section-heading">Current Plan</h2>
          <div className="stg-membership-card">
            <div className="stg-membership-row">
              <div>
                <p className="stg-membership-plan-name">{tier}</p>
                <p className="stg-membership-plan-price">
                  {isTrial ? "Free trial" : billing === "yearly" ? "$149.99 / year" : "$14.99 / month"}
                </p>
              </div>
              <StatusPill variant={isTrial ? "trial" : "active"}>
                {isTrial ? "Trial" : "Active"}
              </StatusPill>
            </div>

            <div className="stg-list stg-list-inset">
              <div className="stg-row">
                <div className="stg-row-body">
                  <p className="stg-row-title">Membership Status</p>
                </div>
                <StatusPill variant="active">Active</StatusPill>
              </div>
              <div className="stg-row">
                <div className="stg-row-body">
                  <p className="stg-row-title">Renewal</p>
                </div>
                <span className="stg-row-value">{renewalInterval}</span>
              </div>
              <div className="stg-row">
                <div className="stg-row-body">
                  <p className="stg-row-title">Next Renewal Date</p>
                </div>
                <span className="stg-row-value">{renewalDate}</span>
              </div>
            </div>

            <div className="stg-membership-actions">
              <button type="button" className="prf-save-btn">
                Manage Subscription
              </button>
            </div>
          </div>
        </section>

        {/* Payment method */}
        <section className="stg-section">
          <h2 className="stg-section-heading">Payment Method</h2>
          <div className="stg-list">
            <div className="stg-row">
              <div className="stg-payment-card-icon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="6" width="18" height="12" rx="2" />
                  <path strokeLinecap="round" d="M3 10h18" />
                </svg>
              </div>
              <div className="stg-row-body">
                <p className="stg-row-title">Visa ending in 4242</p>
                <p className="stg-row-desc">Expires 08 / 2027</p>
              </div>
              <button type="button" className="stg-action-btn">Update</button>
            </div>
          </div>
        </section>

        {/* Billing history */}
        <section className="stg-section">
          <h2 className="stg-section-heading">Billing History</h2>
          <div className="stg-list">
            {MOCK_INVOICES.map((inv) => (
              <div key={inv.id} className="stg-row">
                <div className="stg-row-body">
                  <p className="stg-row-title">{inv.date}</p>
                  <p className="stg-row-desc">{inv.id}</p>
                </div>
                <span className="stg-row-value">{inv.amount}</span>
                <button type="button" className="stg-action-btn stg-action-btn-ghost">
                  <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m-4-4 4 4 4-4M5 20h14" />
                  </svg>
                  Invoice
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Cancel */}
        <section className="stg-section stg-section-danger">
          <h2 className="stg-section-heading stg-section-heading-danger">Cancel Membership</h2>
          <div className="stg-list">
            <div className="stg-row">
              <div className="stg-row-body">
                <p className="stg-row-title stg-row-title-danger">Cancel Membership</p>
                <p className="stg-row-desc">You will retain access until {renewalDate}. After that your account will revert to free tier.</p>
              </div>
              <button type="button" onClick={() => setShowCancel(p => !p)} className="stg-action-btn stg-action-btn-danger">
                Cancel
              </button>
            </div>
            {showCancel && (
              <div className="stg-confirm-inline stg-confirm-danger">
                <p className="stg-confirm-text">You will lose access to all premium features on {renewalDate}. Continue?</p>
                <div className="stg-confirm-btns">
                  <button type="button" onClick={() => setShowCancel(false)} className="stg-action-btn">Keep membership</button>
                  <button type="button" className="stg-action-btn stg-action-btn-danger">Yes, cancel</button>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
