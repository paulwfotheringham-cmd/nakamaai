"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, OrbitControls, useGLTF } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { setSpeakingMorphTargets } from "../lib/avatar/lipsync";

type GuideHead3DProps = {
  imageSrc: string;
  isSpeaking: boolean;
  modelUrl?: string | null;
};

function FallbackHead({ imageSrc, isSpeaking }: { imageSrc: string; isSpeaking: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const jawRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, imageSrc);

  const headMaterial = useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.75,
      metalness: 0.08,
    });
  }, [texture]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.7) * 0.08;
      groupRef.current.rotation.x = Math.sin(t * 0.55) * 0.05;
      groupRef.current.position.y = 0.15 + Math.sin(t * 1.05) * 0.03;
    }

    if (jawRef.current) {
      const speakPulse = isSpeaking
        ? 0.58 + Math.abs(Math.sin(t * 18)) * 0.75
        : 0.35 + Math.abs(Math.sin(t * 4)) * 0.1;
      jawRef.current.scale.y = speakPulse;
      jawRef.current.position.y = -0.38 - speakPulse * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh material={headMaterial} castShadow receiveShadow>
        <sphereGeometry args={[1.0, 56, 56]} />
      </mesh>

      <mesh position={[0, -0.4, 0.95]} ref={jawRef}>
        <circleGeometry args={[0.23, 48]} />
        <meshStandardMaterial color="#120605" emissive="#250f0a" emissiveIntensity={isSpeaking ? 0.6 : 0.15} />
      </mesh>

      <mesh position={[0.0, -0.07, 0.98]}>
        <ringGeometry args={[0.13, 0.19, 36]} />
        <meshBasicMaterial color="#2f1611" opacity={0.65} transparent />
      </mesh>
    </group>
  );
}

function ModelHead({ modelUrl, isSpeaking }: { modelUrl: string; isSpeaking: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF(modelUrl);

  useMemo(() => {
    gltf.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [gltf.scene]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.6) * 0.1;
      groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.05;
      groupRef.current.position.y = 0.1 + Math.sin(t * 1.1) * 0.035;
    }

    gltf.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        setSpeakingMorphTargets(obj as THREE.Mesh, isSpeaking, t);
      }
    });
  });

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} scale={1.35} position={[0, -1.02, 0]} />
    </group>
  );
}

export default function GuideHead3D({ imageSrc, isSpeaking, modelUrl }: GuideHead3DProps) {
  const hasModel = typeof modelUrl === "string" && modelUrl.trim().length > 0;

  return (
    <div className="relative h-[420px] w-[280px] shrink-0 overflow-hidden rounded-[28px] border border-emerald-300/15 bg-[#081411]">
      {hasModel ? (
        <div className="absolute right-2 top-2 z-20 rounded-full bg-black/55 px-2 py-1 text-[10px] tracking-wide text-emerald-200">
          3D MODEL ACTIVE
        </div>
      ) : (
        <div className="absolute right-2 top-2 z-20 rounded-full bg-black/55 px-2 py-1 text-[10px] tracking-wide text-emerald-200">
          3D FALLBACK
        </div>
      )}

      <Canvas camera={{ position: [0, 0.1, 2.6], fov: 38 }} shadows dpr={[1, 2]}>
        <color attach="background" args={["#081411"]} />
        <hemisphereLight intensity={0.52} color="#d8fff2" groundColor="#0a0909" />
        <directionalLight position={[2, 3, 3]} intensity={1.2} color="#f7fff8" castShadow />
        <pointLight position={[-2.2, 0.9, 1.8]} intensity={0.85} color="#57ffcb" />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.35}>
          {hasModel ? <ModelHead modelUrl={modelUrl!} isSpeaking={isSpeaking} /> : <FallbackHead imageSrc={imageSrc} isSpeaking={isSpeaking} />}
        </Float>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.3, 0]} receiveShadow>
          <circleGeometry args={[1.3, 48]} />
          <shadowMaterial transparent opacity={0.28} />
        </mesh>

        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={1.25} maxPolarAngle={1.9} />
      </Canvas>
    </div>
  );
}
