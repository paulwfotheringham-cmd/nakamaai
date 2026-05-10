import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => <main className="h-screen w-screen bg-black" />,
});

export default function GuidePage() {
  return <Scene />;
}
