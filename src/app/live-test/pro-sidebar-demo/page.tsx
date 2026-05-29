import type { Metadata } from "next";
import ProSidebarExample from "../ProSidebarExample";

export const metadata: Metadata = {
  title: "Pro Sidebar Demo",
  description: "Reference Pro Sidebar layout demo.",
};

export default function ProSidebarDemoPage() {
  return (
    <div className="live-test-root h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] overflow-hidden bg-[#1a2035]">
      <ProSidebarExample />
    </div>
  );
}
