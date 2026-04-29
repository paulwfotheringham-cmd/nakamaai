"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

type GuideHead3DProps = {
  isSpeaking: boolean;
};

function AvatarModel({ isSpeaking }: { isSpeaking: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/avatar.glb");

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const bob = isSpeaking ? Math.sin(t * 8) * 0.03 : Math.sin(t * 1.2) * 0.01;
    const turn = isSpeaking ? Math.sin(t * 6) * 0.06 : Math.sin(t * 0.8) * 0.02;

    groupRef.current.position.y = bob - 1.0;
    groupRef.current.rotation.y = turn;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1.1} />
    </group>
  );
}

export default function GuideHead3D({ isSpeaking }: GuideHead3DProps) {
  return (
    <div className="h-[300px] w-[190px] overflow-hidden rounded-[24px] border border-emerald-300/15 bg-[#081411]">
      <Canvas camera={{ position: [0, 0.8, 3.2], fov: 35 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 3, 2]} intensity={1.1} />
        <Suspense fallback={null}>
          <AvatarModel isSpeaking={isSpeaking} />
        </Suspense>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/avatar.glb");
