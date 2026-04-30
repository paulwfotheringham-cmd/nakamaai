"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";

function AvatarModel() {
  const { scene } = useGLTF("/avatar.glb");
  const speakingMeshRef = useRef<any>(null);

  useEffect(() => {
    let found: any = null;

    scene.traverse((child: any) => {
      if (found) return;
      if (child?.isMesh && Array.isArray(child.morphTargetInfluences)) {
        found = child;
      }
    });

    speakingMeshRef.current = found;

    if (found) {
      console.log("Morph mesh:", found.name);
      console.log("Morph dictionary:", found.morphTargetDictionary);
    } else {
      console.log("Morph mesh: none found");
    }
  }, [scene]);

  useFrame(({ clock }) => {
    const mesh = speakingMeshRef.current;
    if (!mesh || !Array.isArray(mesh.morphTargetInfluences)) return;

    const t = clock.getElapsedTime();
    const v = (Math.sin(t * 8) + 1) / 2;

    for (let i = 0; i < mesh.morphTargetInfluences.length; i += 1) {
      mesh.morphTargetInfluences[i] = v;
    }
  });

  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

export default function GuidePage() {
  return (
    <main className="h-screen w-screen bg-black">
      <Canvas camera={{ position: [0, 0.2, 2.2], fov: 35 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[1, 1, 1]} intensity={1.2} />
        <Suspense fallback={null}>
          <AvatarModel />
        </Suspense>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </main>
  );
}
