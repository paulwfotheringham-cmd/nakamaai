"use client";

import { Canvas } from "@react-three/fiber";
import { Bounds, Center, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

function Avatar() {
  const { scene } = useGLTF("/LeePerrySmith.glb");

  return (
    <Bounds fit clip observe margin={1.15}>
      <Center>
        <primitive object={scene} />
      </Center>
    </Bounds>
  );
}

export default function Page() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000" }}>
      <Canvas camera={{ position: [0, 0.2, 2.2], fov: 35 }}>
        <ambientLight intensity={0.95} />
        <directionalLight position={[2, 3, 2]} intensity={1.4} />
        <directionalLight position={[-2, 2, 1]} intensity={0.7} />
        <directionalLight position={[0, 1, -2]} intensity={0.45} />

        <Suspense fallback={null}>
          <Avatar />
        </Suspense>

        <OrbitControls enableZoom={true} minDistance={0.8} maxDistance={6} />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/LeePerrySmith.glb");
