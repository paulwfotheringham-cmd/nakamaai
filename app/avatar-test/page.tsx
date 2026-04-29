"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center } from "@react-three/drei";
import { Suspense } from "react";

function Model() {
  const { scene } = useGLTF("/LeePerrySmith.glb");
  scene.scale.set(10, 10, 10);
  scene.position.set(0, -10, 0);
  scene.rotation.set(0, Math.PI, 0);
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

export default function Page() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      <Canvas camera={{ position: [0, 0, 50], fov: 30 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[1, 1, 1]} intensity={1.2} />
        <directionalLight position={[-1, 1, 1]} intensity={0.5} />

        <Suspense fallback={null}>
          <Model />
        </Suspense>

        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
