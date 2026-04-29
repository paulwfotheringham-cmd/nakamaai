"use client";

import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

type GuideHead3DProps = {
  isSpeaking?: boolean;
};

function AvatarModel() {
  const { scene } = useGLTF("/LeePerrySmith.glb");

  return (
    <group scale={1.4} position={[0, -0.15, 0]} rotation={[0, Math.PI, 0]}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

export default function GuideHead3D({}: GuideHead3DProps) {
  return (
    <div className="h-[300px] w-[190px] overflow-hidden rounded-[24px] border border-emerald-300/15">
      <Canvas camera={{ position: [0, 0.15, 0.6], fov: 35 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[1, 1, 1]} intensity={1.2} />
        <directionalLight position={[-1, 1, 1]} intensity={0.5} />
        <Suspense fallback={null}>
          <AvatarModel />
        </Suspense>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/LeePerrySmith.glb");
