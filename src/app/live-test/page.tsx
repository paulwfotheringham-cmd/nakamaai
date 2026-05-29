import type { Metadata } from "next";
import { Suspense } from "react";
import LiveGuideStage from "./LiveGuideStage";

export const metadata: Metadata = {
  title: "Live Test",
  description: "Nakama Nights — your live concierge guide with voice and lip sync.",
};

export default function LiveTestPage() {
  return (
    <div className="live-test-root h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] overflow-hidden bg-[#0f1729]">
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center text-sm text-stone-500">
            Loading…
          </div>
        }
      >
        <LiveGuideStage />
      </Suspense>
    </div>
  );
}
