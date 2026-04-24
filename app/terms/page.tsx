import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-stone-300">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm text-stone-500 transition hover:text-stone-300"
        >
          ← Home
        </Link>
        <h1 className="mt-8 font-serif text-3xl text-stone-100">
          Terms and conditions
        </h1>
        <p className="mt-4 text-sm text-stone-500">
          <span className="font-semibold text-stone-300">Last Updated:</span>{" "}
          April 24, 2026
        </p>
        <p className="mt-6 text-sm leading-relaxed text-stone-400">
          Welcome to Nakama Nights ("we", "our", "us"). By accessing or using
          our website and audio services, you agree to the following Terms &
          Conditions.
        </p>

        <section className="mt-10 space-y-8 text-sm leading-relaxed text-stone-300">
          <div>
            <h2 className="font-semibold text-stone-100">1. Use of Our Service</h2>
            <p className="mt-2">
              Our platform provides audio content designed for women, including
              storytelling, guided experiences, and educational material.
            </p>
            <p className="mt-2">You agree to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-stone-400">
              <li>Use the service only for lawful purposes</li>
              <li>Be at least 18 years old (or legal age in your jurisdiction)</li>
              <li>
                Not reproduce, distribute, or exploit content without permission
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-stone-100">2. Account Responsibility</h2>
            <p className="mt-2">If you create an account:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-stone-400">
              <li>
                You are responsible for maintaining confidentiality of your login
                details
              </li>
              <li>You agree to provide accurate information</li>
              <li>You are responsible for all activity under your account</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-stone-100">3. Subscription & Payments</h2>
            <p className="mt-2">Some features may require payment.</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-stone-400">
              <li>Fees are clearly displayed before purchase</li>
              <li>Subscriptions may renew automatically unless cancelled</li>
              <li>Refund policies: To be confirmed at checkout and billing pages</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-stone-100">4. Intellectual Property</h2>
            <p className="mt-2">
              All audio, branding, and content on this platform are owned by
              Nakama Nights.
            </p>
            <p className="mt-2">You may not:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-stone-400">
              <li>Copy, redistribute, or resell content</li>
              <li>Use content for commercial purposes without permission</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-stone-100">
              5. Content Nature Disclaimer
            </h2>
            <p className="mt-2">
              Our content may explore themes of intimacy, empowerment, and
              relationships. It is intended for <strong>personal enjoyment and
              education</strong>, not as professional advice.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-stone-100">6. User Conduct</h2>
            <p className="mt-2">You agree not to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-stone-400">
              <li>Misuse the platform</li>
              <li>Attempt to hack or disrupt services</li>
              <li>Upload harmful or offensive content</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-stone-100">7. Termination</h2>
            <p className="mt-2">
              We reserve the right to suspend or terminate accounts that violate
              these terms.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-stone-100">8. Limitation of Liability</h2>
            <p className="mt-2">We are not liable for:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-stone-400">
              <li>Interruptions in service</li>
              <li>Personal interpretations of content</li>
              <li>Any indirect or consequential damages</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-stone-100">9. Changes to Terms</h2>
            <p className="mt-2">
              We may update these Terms at any time. Continued use means you
              accept the updated terms.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-stone-100">10. Contact Us</h2>
            <p className="mt-2">
              For questions, contact:{" "}
              <a
                href="mailto:info@nakamanights.com"
                className="text-amber-200 transition hover:text-amber-100"
              >
                info@nakamanights.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
