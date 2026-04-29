"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center } from "@react-three/drei";
import { Suspense } from "react";

function Avatar() {
  const { scene } = useGLTF("/LeePerrySmith.glb");

  return (
    <Center>
      <primitive object={scene} scale={1.5} />
    </Center>
  );
}

export default function Page() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000" }}>
      <Canvas camera={{ position: [0, 1.5, 2.5], fov: 30 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 2, 2]} intensity={2} />
        <directionalLight position={[-2, 2, -2]} intensity={1} />

        <Suspense fallback={null}>
          <Avatar />
        </Suspense>

        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
}
