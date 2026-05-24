"use client";

import * as THREE from "three";
import type { HeadMetrics } from "./headMetrics";

export const HAIR_COLOR = 0x4a3728;
const BROW_COLOR = 0x3d2914;
const EYE_BLUE = 0x2563eb;
const EYE_EMISSIVE = 0x1e3a8a;

const hairMaterial = new THREE.MeshStandardMaterial({
  color: HAIR_COLOR,
  roughness: 0.88,
  metalness: 0.02,
});

const browMaterial = new THREE.MeshStandardMaterial({
  color: BROW_COLOR,
  roughness: 0.92,
  metalness: 0,
});

const eyeMaterial = new THREE.MeshStandardMaterial({
  color: EYE_BLUE,
  roughness: 0.22,
  metalness: 0.08,
  emissive: new THREE.Color(EYE_EMISSIVE),
  emissiveIntensity: 0.25,
});

/** Short hair cap fitted to the crown — sits on the scalp, not above it. */
export function GuideHair({ metrics }: { metrics: HeadMetrics }) {
  const radius = metrics.width * 0.28;

  return (
    <group position={[metrics.center.x, metrics.topY, metrics.center.z]}>
      <mesh castShadow receiveShadow material={hairMaterial} scale={[0.92, 0.72, 0.9]}>
        <sphereGeometry args={[radius, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
      </mesh>
    </group>
  );
}

/** Eyebrows above the eyes on the forehead. */
export function GuideEyebrows({ metrics }: { metrics: HeadMetrics }) {
  const w = metrics.width * 0.11;
  const h = metrics.height * 0.018;
  const d = metrics.depth * 0.035;
  const z = metrics.frontZ - metrics.depth * 0.05;
  const y = metrics.browY;
  const xOff = metrics.width * 0.11;

  return (
    <group>
      <mesh
        position={[metrics.center.x - xOff, y, z]}
        rotation={[0.08, 0.06, 0.05]}
        castShadow
        renderOrder={5}
        material={browMaterial}
      >
        <boxGeometry args={[w, h, d]} />
      </mesh>
      <mesh
        position={[metrics.center.x + xOff, y, z]}
        rotation={[0.08, -0.06, -0.05]}
        castShadow
        renderOrder={5}
        material={browMaterial}
      >
        <boxGeometry args={[w, h, d]} />
      </mesh>
    </group>
  );
}

/** Blue irises placed on the face surface. */
export function GuideFaceEyes({ metrics }: { metrics: HeadMetrics }) {
  const radius = metrics.width * 0.038;
  const y = metrics.eyeY;
  const z = metrics.frontZ - metrics.depth * 0.02;
  const xOff = metrics.width * 0.11;

  return (
    <group>
      <mesh position={[metrics.center.x - xOff, y, z]} renderOrder={3} material={eyeMaterial}>
        <sphereGeometry args={[radius, 20, 20]} />
      </mesh>
      <mesh position={[metrics.center.x + xOff, y, z]} renderOrder={3} material={eyeMaterial}>
        <sphereGeometry args={[radius, 20, 20]} />
      </mesh>
      <mesh position={[metrics.center.x - xOff, y, z + radius * 0.35]} renderOrder={4}>
        <sphereGeometry args={[radius * 0.38, 16, 16]} />
        <meshStandardMaterial color={0x0a0a0a} roughness={0.4} />
      </mesh>
      <mesh position={[metrics.center.x + xOff, y, z + radius * 0.35]} renderOrder={4}>
        <sphereGeometry args={[radius * 0.38, 16, 16]} />
        <meshStandardMaterial color={0x0a0a0a} roughness={0.4} />
      </mesh>
    </group>
  );
}
