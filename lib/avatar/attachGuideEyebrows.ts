import * as THREE from "three";
import type { HeadMetrics } from "./headMetrics";

const BROW_COLOR = 0x4a3728;
const BROW_HIGHLIGHT = 0x6b4c35;

function browMaterial(color: number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.88,
    metalness: 0,
    depthTest: true,
    depthWrite: true,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
}

function createBrowStrip(
  eye: THREE.Vector3,
  metrics: HeadMetrics,
  side: "left" | "right",
  layer: "main" | "strand",
): THREE.Mesh {
  const sign = side === "left" ? -1 : 1;
  const points: THREE.Vector3[] = [];
  const spread = layer === "main" ? 0.11 : 0.095;
  const yBase = layer === "main" ? 0.07 : 0.075;
  const zOut = layer === "main" ? 0.055 : 0.062;

  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const arch = Math.sin(t * Math.PI) * metrics.headHeight * 0.018;
    const innerLift = (1 - t) * metrics.headHeight * 0.012;

    points.push(
      new THREE.Vector3(
        eye.x + sign * (t - 0.34) * metrics.headWidth * spread,
        eye.y + metrics.headHeight * yBase + arch + innerLift,
        eye.z + metrics.headDepth * zOut,
      ),
    );
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const radius = metrics.headWidth * (layer === "main" ? 0.013 : 0.006);
  const geometry = new THREE.TubeGeometry(curve, 16, radius, 6, false);
  const mesh = new THREE.Mesh(
    geometry,
    browMaterial(layer === "main" ? BROW_COLOR : BROW_HIGHLIGHT),
  );
  mesh.renderOrder = 2;
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  return mesh;
}

function disposeGroup(group: THREE.Group) {
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();
      if (child.material instanceof THREE.Material) child.material.dispose();
    }
  });
}

/** Brown eyebrow tubes parented to the morph head mesh — visible size, flush on the face. */
export function attachGuideEyebrows(metrics: HeadMetrics): () => void {
  const { headMesh } = metrics;

  const existing = headMesh.getObjectByName("guideEyebrows");
  if (existing) {
    headMesh.remove(existing);
    disposeGroup(existing as THREE.Group);
  }

  const group = new THREE.Group();
  group.name = "guideEyebrows";
  group.renderOrder = 2;

  for (const side of ["left", "right"] as const) {
    const eye = side === "left" ? metrics.leftEye : metrics.rightEye;
    group.add(createBrowStrip(eye, metrics, side, "main"));
    group.add(createBrowStrip(eye, metrics, side, "strand"));
  }

  headMesh.add(group);

  return () => {
    headMesh.remove(group);
    disposeGroup(group);
  };
}
