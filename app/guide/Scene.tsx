"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { AvatarModel } from "@/components/GuideAvatarModel";

const RENDERER_CLEAR = "#050508";

function SceneCanvas() {
  return (
    <main className="h-screen w-screen bg-black">
      <Canvas
        camera={{ position: [0, 1, 5], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(RENDERER_CLEAR, 1);
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[3, 3, 3]} intensity={1.5} />

        <Environment preset="studio" />
        <AvatarModel />

        <OrbitControls enableZoom enableDamping dampingFactor={0.06} />
      </Canvas>
    </main>
  );
}

export default function Scene() {
  return <SceneCanvas />;
}
