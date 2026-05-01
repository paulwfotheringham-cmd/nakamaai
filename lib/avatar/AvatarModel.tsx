"use client";

import { useGLTF } from "@react-three/drei";

export type AvatarModelProps = {
  isSpeaking?: boolean;
};

export function AvatarModel({ isSpeaking: _isSpeaking }: AvatarModelProps) {
  const { scene } = useGLTF("/scenes/avatar.glb");
  console.log("AVATAR SCENE:", scene);

  return (
    <primitive
      object={scene}
      scale={3}
      position={[0, 0, 0]}
    />
  );
}

useGLTF.preload("/scenes/avatar.glb");
