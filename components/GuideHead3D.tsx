"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { setSpeakingMorphTargets } from "../lib/avatar/lipsync";

type GuideHead3DProps = {
  imageSrc: string;
  isSpeaking: boolean;
  modelUrl?: string | null;
};

function FallbackHead2D({ imageSrc }: { imageSrc: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <img src={imageSrc} alt="Guide" className="absolute inset-0 h-full w-full object-cover object-top" />
      <div className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-[#081411] to-transparent" />
    </div>
  );
}

function HeadModel({ modelUrl, isSpeaking }: { modelUrl: string; isSpeaking: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { gl } = useThree();

  const gltf = useLoader(
    GLTFLoader,
    modelUrl,
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
      loader.setDRACOLoader(dracoLoader);

      const ktx2Loader = new KTX2Loader();
      ktx2Loader.setTranscoderPath("/basis/");
      ktx2Loader.detectSupport(gl);
      loader.setKTX2Loader(ktx2Loader);

      loader.setMeshoptDecoder(MeshoptDecoder);
    },
  );

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
      groupRef.current.rotation.y = Math.sin(t * 0.55) * 0.06;
      groupRef.current.rotation.x = Math.sin(t * 0.45) * 0.03;
      groupRef.current.position.y = 0.05 + Math.sin(t * 1.05) * 0.02;
    }

    gltf.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        setSpeakingMorphTargets(obj as THREE.Mesh, isSpeaking, t);
      }
      if ((obj as THREE.Bone).isBone) {
        const bone = obj as THREE.Bone;
        const name = bone.name.toLowerCase();
        if (name.includes("jaw") || name.includes("mouth")) {
          const jawTarget = isSpeaking ? 0.12 + Math.abs(Math.sin(t * 18)) * 0.22 : 0.02;
          bone.rotation.x = THREE.MathUtils.lerp(bone.rotation.x, jawTarget, isSpeaking ? 0.45 : 0.2);
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} scale={1.05} position={[0, -0.05, 0]} />
    </group>
  );
}

function HeadScene({ modelUrl, isSpeaking }: { modelUrl: string; isSpeaking: boolean }) {
  return <HeadModel modelUrl={modelUrl} isSpeaking={isSpeaking} />;
}

export default function GuideHead3D({ imageSrc, isSpeaking, modelUrl }: GuideHead3DProps) {
  const resolvedModelUrl =
    typeof modelUrl === "string" && modelUrl.trim().length > 0 ? modelUrl : "/models/heads/male-guide.glb";

  return (
    <div className="relative h-[300px] w-[190px] shrink-0 overflow-hidden rounded-[24px] border border-emerald-300/15 bg-[#081411]">
      <div className="absolute right-2 top-2 z-20 rounded-full bg-black/55 px-2 py-1 text-[10px] tracking-wide text-emerald-200">
        3D MODEL ACTIVE
      </div>

      <Canvas camera={{ position: [0, 0.05, 3.35], fov: 30 }} shadows dpr={[1, 2]}>
        <color attach="background" args={["#081411"]} />
        <ambientLight intensity={0.85} />
        <hemisphereLight intensity={0.75} color="#ffffff" groundColor="#1f1f1f" />
        <directionalLight position={[2, 3, 3]} intensity={1.15} color="#ffffff" castShadow />
        <pointLight position={[-2.2, 1.1, 2.2]} intensity={0.75} color="#7ffff0" />

        <Suspense fallback={<FallbackHead2D imageSrc={imageSrc} />}>
          <HeadScene modelUrl={resolvedModelUrl} isSpeaking={isSpeaking} />
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={1.25} maxPolarAngle={1.75} />
      </Canvas>
    </div>
  );
}
