"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";
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

    if (isSpeaking) {
      const turn = Math.sin(t * 4.2) * 0.035;
      const bob = Math.sin(t * 5.2) * 0.015;
      const mouthPulse = 1 + Math.sin(t * 12) * 0.02;

      groupRef.current.rotation.y = Math.PI + turn;
      groupRef.current.position.y = -0.15 + bob;
      groupRef.current.scale.set(1.4, 1.4 * mouthPulse, 1.4);
      return;
    }

    groupRef.current.rotation.y = Math.PI;
    groupRef.current.position.y = -0.15;
    groupRef.current.scale.set(1.4, 1.4, 1.4);
  });

  return (
    <group ref={groupRef} scale={1.4} position={[0, -0.15, 0]} rotation={[0, Math.PI, 0]}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

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

useGLTF.preload("/LeePerrySmith.glb");
