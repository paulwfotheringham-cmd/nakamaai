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

/**
 * Hair cap — hemisphere with equator at the scalp crown.
 * Rendered as a sibling of the GLB scene (not portaled into it).
 */
export function GuideHair({ metrics }: { metrics: HeadMetrics }) {
  const radius = metrics.headWidth * 0.30;
  const capY = metrics.crown.y - metrics.headHeight * 0.012;

  return (
    <group position={[metrics.crown.x, capY, metrics.crown.z]}>
      <mesh castShadow receiveShadow material={hairMaterial} scale={[0.95, 0.55, 0.88]}>
        <sphereGeometry args={[radius, 36, 18, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
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
      const innerBoost = (1 - t) * metrics.headHeight * 0.008;
      const arch = Math.sin(t * Math.PI) * metrics.headHeight * 0.012;
      const x = eye.x + sign * (t - 0.32) * metrics.headWidth * 0.095;
      const y = eye.y + metrics.headHeight * 0.042 + arch + innerBoost;
      const z = metrics.faceFrontZ - metrics.headDepth * 0.006 + Math.sin(t * Math.PI) * metrics.headDepth * 0.004;
      const taper = 1 - t * 0.55;

      items.push({
        x,
        y,
        z,
        w: metrics.headWidth * 0.028 * taper,
        h: metrics.headHeight * 0.0065 * (0.85 + taper * 0.35),
        d: metrics.headDepth * 0.005 * taper,
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

export function GuideEyebrows({ metrics }: { metrics: HeadMetrics }) {
  return (
    <group>
      <ArchBrow eye={metrics.leftEye} metrics={metrics} side="left" />
      <ArchBrow eye={metrics.rightEye} metrics={metrics} side="right" />
    </group>
  );
}
