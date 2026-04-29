"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { Suspense, useRef } from "react";

type GuideHead3DProps = {
  isSpeaking: boolean;
};

function AvatarModel({ isSpeaking }: { isSpeaking: boolean }) {
  const groupRef = useRef<any>(null);
  const { scene } = useGLTF("/LeePerrySmith.glb");

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const turn = isSpeaking ? Math.sin(t * 4) * 0.08 : Math.sin(t * 0.8) * 0.02;
    groupRef.current.rotation.y = turn;
    groupRef.current.rotation.x = -0.08;
  });

  return (
    <group ref={groupRef} position={[0, -1.35, 0]} scale={[2.45, 2.45, 2.45]}>
      <primitive object={scene} />
    </group>
  );
}

export default function GuideHead3D({ isSpeaking }: GuideHead3DProps) {
  return (
    <div className="h-[300px] w-[190px] overflow-hidden rounded-[24px] border border-emerald-300/15 bg-[#081411]">
      <Canvas camera={{ position: [0, 0.72, 1.7], fov: 28 }}>
        <ambientLight intensity={1.25} />
        <directionalLight position={[1.5, 2, 2]} intensity={1.35} />
        <directionalLight position={[-1.2, 1.2, 1.6]} intensity={0.65} />
        <Suspense fallback={null}>
          <AvatarModel isSpeaking={isSpeaking} />
        </Suspense>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/LeePerrySmith.glb");
