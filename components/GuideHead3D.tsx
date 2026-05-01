"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { AvatarModel } from "@/lib/avatar/AvatarModel";

type GuideHead3DProps = {
  isSpeaking: boolean;
};

export default function GuideHead3D({ isSpeaking }: GuideHead3DProps) {
  return (
    <div className="h-[300px] w-[190px] overflow-hidden rounded-[24px] border border-emerald-300/15">
      <Canvas camera={{ position: [0, 0.15, 0.6], fov: 35 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[1, 1, 1]} intensity={1.2} />
        <directionalLight position={[-1, 1, 1]} intensity={0.5} />
        <Suspense fallback={null}>
          <AvatarModel isSpeaking={isSpeaking} />
        </Suspense>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
