import * as THREE from "three";
import type { HeadMetrics } from "./headMetrics";

const HAIR_COLOR = 0x4a3728;
const HAIR_HIGHLIGHT = 0x5c4030;

function hairMaterial(color: number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.94,
    metalness: 0,
    depthTest: true,
    depthWrite: true,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
}

function disposeGroup(group: THREE.Group) {
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();
      if (child.material instanceof THREE.Material) child.material.dispose();
    }
  });
}

/** Short brown hair cap parented to the morph head — sits on the scalp, not floating. */
export function attachGuideHair(metrics: HeadMetrics): () => void {
  const { headMesh, crown, headWidth, headHeight, headDepth } = metrics;

  const existing = headMesh.getObjectByName("guideHair");
  if (existing) {
    headMesh.remove(existing);
    disposeGroup(existing as THREE.Group);
  }

  const group = new THREE.Group();
  group.name = "guideHair";
  group.renderOrder = 1;

  const phiLength = Math.PI * 0.41;
  const capGeo = new THREE.SphereGeometry(1, 40, 28, 0, Math.PI * 2, 0, phiLength);
  const cap = new THREE.Mesh(capGeo, hairMaterial(HAIR_COLOR));
  cap.renderOrder = 1;

  const sx = headWidth * 0.508;
  const sy = headHeight * 0.265;
  const sz = headDepth * 0.5;
  cap.scale.set(sx, sy, sz);

  const rimY = sy * Math.cos(phiLength);
  cap.position.set(
    crown.x,
    crown.y - rimY * 0.9,
    crown.z - headDepth * 0.035,
  );

  group.add(cap);

  // Temple coverage so the cap blends into the sides of the head.
  for (const side of [-1, 1] as const) {
    const patchGeo = new THREE.SphereGeometry(1, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.38);
    const patch = new THREE.Mesh(patchGeo, hairMaterial(HAIR_HIGHLIGHT));
    patch.renderOrder = 1;
    const patchScale = headWidth * 0.11;
    patch.scale.set(patchScale, headHeight * 0.13, headDepth * 0.11);
    patch.position.set(
      crown.x + side * headWidth * 0.36,
      crown.y - headHeight * 0.19,
      crown.z - headDepth * 0.06,
    );
    group.add(patch);
  }

  // Subtle front hairline strip above the forehead.
  const fringeGeo = new THREE.BoxGeometry(1, 1, 1);
  const fringe = new THREE.Mesh(fringeGeo, hairMaterial(HAIR_COLOR));
  fringe.renderOrder = 1;
  fringe.scale.set(headWidth * 0.42, headHeight * 0.035, headDepth * 0.08);
  fringe.position.set(
    crown.x,
    crown.y - headHeight * 0.28,
    crown.z + headDepth * 0.38,
  );
  group.add(fringe);

  headMesh.add(group);

  return () => {
    headMesh.remove(group);
    disposeGroup(group);
  };
}
