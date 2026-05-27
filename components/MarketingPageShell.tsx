import Link from "next/link";
import type { ReactNode } from "react";

type MarketingPageShellProps = {
  children: ReactNode;
  showBackLink?: boolean;
};

export default function MarketingPageShell({
  children,
  showBackLink = false,
}: MarketingPageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-black text-stone-200">
      <header className="border-b border-stone-800 bg-black/90">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="shrink-0">
            <img
              src="/Nakama-AI-July25-White.png"
              alt="Nakama Nights"
              className="block h-[5.1rem] w-auto object-contain object-left sm:h-[6.1rem] md:h-[6.8rem]"
            />
          </Link>

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/signup-trial"
              className="inline-flex rounded-full border border-amber-200/50 bg-amber-100/90 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 shadow-[0_10px_28px_rgba(0,0,0,0.25)] transition hover:bg-amber-100"
            >
              10 Day Free Trial
            </Link>
            <Link
              href="/login"
              className="inline-flex rounded-full border border-amber-200/50 bg-amber-100/90 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 shadow-[0_10px_28px_rgba(0,0,0,0.25)] transition hover:bg-amber-100"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {showBackLink ? (
          <div className="mx-auto max-w-2xl px-6 pt-6 sm:px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-semibold text-stone-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              ← Back
            </Link>
          </div>
        ) : null}
        {children}
      </main>

      <footer className="mt-auto border-t border-stone-800 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="shrink-0">
            <Link href="/">
              <img
                src="/Nakama-AI-July25-White.png"
                alt="Nakama Nights"
                className="block h-11 w-auto object-contain sm:h-[52px]"
              />
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-stone-400">
            <Link href="/terms" className="transition hover:text-stone-100">
              T&amp;Cs
            </Link>
            <Link href="/privacy" className="transition hover:text-stone-100">
              Privacy
            </Link>
            <Link href="/contact" className="transition hover:text-stone-100">
              Contact
            </Link>
            <Link href="/faq-support" className="transition hover:text-stone-100">
              FAQ &amp; Support
            </Link>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-stone-100"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5Zm8.9 1.2a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Z" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-stone-100"
              aria-label="TikTok"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M14.5 3h2.1c.2 1.6 1.1 3 2.6 3.8 1 .6 2.1.9 3.3.9v2.2a8.1 8.1 0 0 1-3.2-.7v6.2a6.4 6.4 0 1 1-5.5-6.3v2.2a4.2 4.2 0 1 0 3.3 4.1V3h-2.6Z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
