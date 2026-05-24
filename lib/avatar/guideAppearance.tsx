"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { HeadMetrics } from "./headMetrics";

export const HAIR_COLOR = 0x4a3728;
const BROW_COLOR = 0x3d2914;
const BROW_HIGHLIGHT = 0x5c4030;

const hairMaterial = new THREE.MeshStandardMaterial({
  color: HAIR_COLOR,
  roughness: 0.88,
  metalness: 0.02,
});

function makeBrowMaterial(color: number) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.94,
    metalness: 0,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
}

const browMaterial = makeBrowMaterial(BROW_COLOR);
const browHighlightMaterial = makeBrowMaterial(BROW_HIGHLIGHT);

/** Hair cap on the crown plus small temple patches (scene-local). */
export function GuideHair({ metrics }: { metrics: HeadMetrics }) {
  const radius = metrics.hairWidth * 0.30;
  const sink = metrics.hairHeight * 0.025;
  const sideR = radius * 0.22;
  const sideY = metrics.crown.y - metrics.hairHeight * 0.06;
  const sideZ = metrics.crown.z - metrics.hairDepth * 0.04;
  const sideX = metrics.hairWidth * 0.36;

  return (
    <group position={[metrics.crown.x, metrics.crown.y - sink, metrics.crown.z]}>
      <mesh castShadow receiveShadow material={hairMaterial} scale={[0.95, 0.55, 0.88]}>
        <sphereGeometry args={[radius, 36, 18, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
      </mesh>
      <mesh position={[-sideX, sideY - metrics.crown.y + sink, sideZ - metrics.crown.z]} scale={[0.9, 0.7, 0.85]} material={hairMaterial}>
        <sphereGeometry args={[sideR, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
      </mesh>
      <mesh position={[sideX, sideY - metrics.crown.y + sink, sideZ - metrics.crown.z]} scale={[0.9, 0.7, 0.85]} material={hairMaterial}>
        <sphereGeometry args={[sideR, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
      </mesh>
    </group>
  );
}

type BrowSideProps = {
  eye: THREE.Vector3;
  metrics: HeadMetrics;
  side: "left" | "right";
};

function ArchBrow({ eye, metrics, side }: BrowSideProps) {
  const sign = side === "left" ? -1 : 1;
  const segments = useMemo(() => {
    const items: Array<{
      x: number;
      y: number;
      z: number;
      w: number;
      h: number;
      d: number;
      rotZ: number;
      material: THREE.MeshStandardMaterial;
    }> = [];

    for (let i = 0; i < 7; i++) {
      const t = i / 6;
      const innerBoost = (1 - t) * metrics.hairHeight * 0.008;
      const arch = Math.sin(t * Math.PI) * metrics.hairHeight * 0.012;
      const x = eye.x + sign * (t - 0.32) * metrics.hairWidth * 0.095;
      const y = eye.y + metrics.hairHeight * 0.042 + arch + innerBoost;
      const z = metrics.faceFrontZ - metrics.hairDepth * 0.006 + Math.sin(t * Math.PI) * metrics.hairDepth * 0.004;
      const taper = 1 - t * 0.55;

      items.push({
        x,
        y,
        z,
        w: metrics.hairWidth * 0.028 * taper,
        h: metrics.hairHeight * 0.0065 * (0.85 + taper * 0.35),
        d: metrics.hairDepth * 0.005 * taper,
        rotZ: sign * (0.06 - t * 0.1),
        material: i < 2 ? browHighlightMaterial : browMaterial,
      });
    }

    return items;
  }, [eye, metrics, side, sign]);

  return (
    <group>
      {segments.map((seg, i) => (
        <mesh
          key={i}
          position={[seg.x, seg.y, seg.z]}
          rotation={[0.02, sign * 0.02, seg.rotZ]}
          castShadow
          material={seg.material}
        >
          <boxGeometry args={[seg.w, seg.h, seg.d]} />
        </mesh>
      ))}
    </group>
  );
}

/** Arched eyebrows on the forehead, above each eye (scene-local). */
export function GuideEyebrows({ metrics }: { metrics: HeadMetrics }) {
  return (
    <group>
      <ArchBrow eye={metrics.leftEye} metrics={metrics} side="left" />
      <ArchBrow eye={metrics.rightEye} metrics={metrics} side="right" />
    </group>
  );
}
