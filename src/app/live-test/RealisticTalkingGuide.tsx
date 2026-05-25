"use client";

import { Html, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { applyFacialAnimation } from "@/lib/avatar/facialAnimation";
import { useGuideGLTF } from "@/lib/avatar/useGuideGLTF";

/** World-space head height — smaller value = smaller face on screen. */
const HEAD_HEIGHT = 0.52;
const CAMERA_Z = 2.65;

function debugGuideScene(scene: THREE.Object3D) {
  if (scene.userData.guideDebugPass) return;
  scene.userData.guideDebugPass = true;

  const meshNames: string[] = [];

  console.group("[Guide GLB] DEBUG PASS — all meshes");

  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;

    meshNames.push(mesh.name || "(unnamed)");
    console.log("MESH:", mesh.name);

    const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    const std = mat as THREE.MeshStandardMaterial | undefined;

    console.log({
      visible: mesh.visible,
      material: mat?.name,
      transparent: std?.transparent,
      opacity: std?.opacity,
      alphaTest: std?.alphaTest,
      side: std?.side,
      map: !!std?.map,
      alphaMap: !!std?.alphaMap,
      skinned: (mesh as THREE.SkinnedMesh).isSkinnedMesh,
    });

    mesh.visible = true;
    mesh.frustumCulled = false;

    if (std) {
      std.transparent = true;
      std.opacity = 1;
      std.alphaTest = 0.05;
      std.depthWrite = true;
      std.side = THREE.DoubleSide;
      std.needsUpdate = true;
    }
  });

  console.log("[Guide GLB] ALL MESH NAMES:", meshNames);
  console.groupEnd();
}

type GuideHeadProps = {
  isSpeaking: boolean;
  audioLevelRef: RefObject<number>;
};

function PortraitCamera() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0.02, CAMERA_Z);
    camera.lookAt(0, 0, 0);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 30;
      camera.near = 0.1;
      camera.far = 20;
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  return null;
}

function GuideHead({ isSpeaking, audioLevelRef }: GuideHeadProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGuideGLTF();

  useEffect(() => {
    debugGuideScene(scene);

    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    if (!scene.userData.guideFramed) {
      scene.userData.guideFramed = true;
      scene.position.sub(center);
      scene.scale.setScalar(HEAD_HEIGHT / Math.max(size.y, 0.001));
      scene.position.y -= size.y * (HEAD_HEIGHT / Math.max(size.y, 0.001)) * 0.04;
    }

    scene.updateMatrixWorld(true);
  }, [scene]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    let audioLevel = audioLevelRef.current ?? 0;
    if (isSpeaking && audioLevel < 0.08) {
      audioLevel = 0.22 + Math.abs(Math.sin(t * 13)) * 0.18;
    }

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        applyFacialAnimation(child, {
          isSpeaking,
          timeSeconds: t,
          audioLevel: isSpeaking ? audioLevel : 0,
        });
      }
    });

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.28) * 0.04;
      groupRef.current.position.y = isSpeaking ? Math.sin(t * 2.4) * 0.006 : Math.sin(t * 0.7) * 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

function CanvasLoader() {
  return (
    <Html center>
      <p className="text-sm text-zinc-400">Loading 3D guide…</p>
    </Html>
  );
}

type RealisticTalkingGuideProps = {
  isSpeaking: boolean;
  audioLevelRef: RefObject<number>;
};

export default function RealisticTalkingGuide({ isSpeaking, audioLevelRef }: RealisticTalkingGuideProps) {
  return (
    <div className="flex h-[min(78vh,720px)] w-full items-center justify-center overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-[#1a1512] to-[#0a1218] shadow-[0_0_64px_rgba(16,185,129,0.12)]">
      <Canvas camera={{ position: [0, 0.02, CAMERA_Z], fov: 30, near: 0.1, far: 20 }} gl={{ antialias: true }}>
        <PortraitCamera />
        <ambientLight intensity={3} />
        <directionalLight position={[0, 2, 2]} intensity={4} />
        <Suspense fallback={<CanvasLoader />}>
          <GuideHead isSpeaking={isSpeaking} audioLevelRef={audioLevelRef} />
        </Suspense>
        <OrbitControls
          enableZoom
          minDistance={1.8}
          maxDistance={5}
          maxPolarAngle={Math.PI / 1.85}
          minPolarAngle={Math.PI / 3.2}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
