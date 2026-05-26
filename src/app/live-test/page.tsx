import type { Metadata } from "next";
import LiveGuideStage from "./LiveGuideStage";

export const metadata: Metadata = {
  title: "Live Test",
  description: "Nakama Nights — your live concierge guide with voice and lip sync.",
};

export default function LiveTestPage() {
  return <LiveGuideStage />;
}
