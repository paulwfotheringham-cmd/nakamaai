import Link from "next/link";

export default function PrivacyPage() {
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
          Privacy policy
        </h1>
        <p className="mt-4 text-sm text-stone-500">
          <span className="font-semibold text-stone-300">Last Updated:</span>{" "}
          April 24, 2026
        </p>
        <p className="mt-6 text-sm leading-relaxed text-stone-400">
          At Nakama Nights, your privacy is important to us. This policy
          explains how we collect, use, and protect your information.
        </p>

        <section className="mt-10 space-y-8 text-sm leading-relaxed text-stone-300">
          <div>
            <h2 className="font-semibold text-stone-100">
              1. Information We Collect
            </h2>
            <p className="mt-2">We may collect:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-stone-400">
              <li>
                <strong>Personal Information:</strong> Name, email, account
                details
              </li>
              <li>
                <strong>Usage Data:</strong> Pages visited, audio played, time
                spent
              </li>
              <li>
                <strong>Device Information:</strong> Browser type, IP address
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-stone-100">
              2. How We Use Your Information
            </h2>
            <p className="mt-2">We use your data to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-stone-400">
              <li>Provide and improve our services</li>
              <li>Personalize your experience</li>
              <li>Process payments</li>
              <li>
                Send updates or marketing (you can opt out anytime)
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-stone-100">
              3. Sharing Your Information
            </h2>
            <p className="mt-2">
              We do <strong>not sell your personal data</strong>.
            </p>
            <p className="mt-2">We may share data with:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-stone-400">
              <li>Payment processors</li>
              <li>Analytics providers</li>
              <li>Legal authorities if required</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-stone-100">4. Cookies & Tracking</h2>
            <p className="mt-2">We use cookies to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-stone-400">
              <li>Improve functionality</li>
              <li>Understand user behavior</li>
              <li>Enhance user experience</li>
            </ul>
            <p className="mt-2">You can disable cookies in your browser settings.</p>
          </div>

          <div>
            <h2 className="font-semibold text-stone-100">5. Data Security</h2>
            <p className="mt-2">
              We implement reasonable security measures to protect your data, but
              no system is 100% secure.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-stone-100">6. Your Rights</h2>
            <p className="mt-2">
              Depending on your location, you may have the right to:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-stone-400">
              <li>Access your data</li>
              <li>Request correction or deletion</li>
              <li>Withdraw consent</li>
            </ul>
            <p className="mt-2">Contact us to exercise these rights.</p>
          </div>

          <div>
            <h2 className="font-semibold text-stone-100">7. Data Retention</h2>
            <p className="mt-2">
              We retain your information only as long as necessary to provide
              services or comply with legal obligations.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-stone-100">8. Third-Party Links</h2>
            <p className="mt-2">
              Our site may contain links to third-party websites. We are not
              responsible for their privacy practices.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-stone-100">
              9. Updates to This Policy
            </h2>
            <p className="mt-2">
              We may update this Privacy Policy periodically. Changes will be
              posted here.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-stone-100">10. Contact Us</h2>
            <p className="mt-2">
              <a
                href="mailto:info@nakamanights.com"
                className="text-amber-200 transition hover:text-amber-100"
              >
                info@nakamanights.com
              </a>
            </p>
            <p className="mt-1">
              <a
                href="https://nakamanights.com"
                className="text-amber-200 transition hover:text-amber-100"
              >
                https://nakamanights.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
