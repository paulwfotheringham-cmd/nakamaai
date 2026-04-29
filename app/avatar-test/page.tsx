"use client";

import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

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

export default function AvatarTestPage() {
  return (
    <main className="min-h-screen bg-[#07040d]">
      <div className="h-screen w-full">
        <Canvas camera={{ position: [0, 0.15, 0.6], fov: 35 }}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[1, 1, 1]} intensity={1.2} />
          <Suspense fallback={null}>
            <AvatarModel />
          </Suspense>
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>
    </main>
  );
}

useGLTF.preload("/LeePerrySmith.glb");
