import type { Metadata } from "next";
import LiveGuideStage from "./LiveGuideStage";

export const metadata: Metadata = {
  title: "Live Test",
  description: "Nakama Nights — your live concierge guide with voice and lip sync.",
};

export default function LiveTestPage() {
  return (
    <div className="live-test-root h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] overflow-hidden bg-black">
      <LiveGuideStage />
    </div>
  );
}
