"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { AvatarModel } from "@/lib/avatar/AvatarModel";

function SceneCanvas() {
  return (
    <main className="h-screen w-screen bg-black">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 30 }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[3, 3, 3]} intensity={1.5} />
        <Environment preset="studio" />
        <AvatarModel />
        <axesHelper args={[5]} />
        <OrbitControls />
      </Canvas>
    </main>
  );
}

export default function Scene() {
  return <SceneCanvas />;
}
