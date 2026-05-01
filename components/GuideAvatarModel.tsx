"use client";

import { useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export type AvatarModelProps = {
  isSpeaking?: boolean;
};

/** Same 3D head as dashboard (`GuideHead3D`): Lee Perry Smith GLB + optional speaking motion. */
export function AvatarModel({ isSpeaking = false }: AvatarModelProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const { scene } = useGLTF("/LeePerrySmith.glb");

  useEffect(() => {
    console.log("[AvatarModel] shared GuideAvatarModel — scene:", scene);
  }, [scene]);

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

useGLTF.preload("/LeePerrySmith.glb");
