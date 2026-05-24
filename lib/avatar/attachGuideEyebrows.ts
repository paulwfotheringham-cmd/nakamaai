import * as THREE from "three";
import type { HeadMetrics } from "./headMetrics";

const BROW_COLOR = 0x4a3728;
const BROW_HIGHLIGHT = 0x5c4030;

function createBrowMesh(
  eye: THREE.Vector3,
  metrics: HeadMetrics,
  side: "left" | "right",
  layer: "main" | "hair",
): THREE.Mesh {
  const sign = side === "left" ? -1 : 1;
  const points: THREE.Vector3[] = [];

  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    const innerLift = (1 - t) * metrics.headHeight * 0.006;
    const arch = Math.sin(t * Math.PI) * metrics.headHeight * 0.011;
    const xSpread = layer === "main" ? 0.088 : 0.082;
    const yLift = layer === "main" ? 0.04 : 0.042;
    const zPush = layer === "main" ? 0.008 : 0.014;

    points.push(
      new THREE.Vector3(
        eye.x + sign * (t - 0.32) * metrics.headWidth * xSpread,
        eye.y + metrics.headHeight * yLift + arch + innerLift,
        eye.z + metrics.headDepth * zPush,
      ),
    );
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const radius = metrics.headWidth * (layer === "main" ? 0.0036 : 0.0018);
  const geometry = new THREE.TubeGeometry(curve, 14, radius, 5, false);
  const material = new THREE.MeshStandardMaterial({
    color: layer === "main" ? BROW_COLOR : BROW_HIGHLIGHT,
    roughness: 0.93,
    metalness: 0,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
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

/** Attach brown eyebrow tubes to the GLB scene — moves with the head, not floating in world space. */
export function attachGuideEyebrows(scene: THREE.Object3D, metrics: HeadMetrics): () => void {
  const existing = scene.getObjectByName("guideEyebrows");
  if (existing) {
    scene.remove(existing);
    disposeGroup(existing as THREE.Group);
  }

  const group = new THREE.Group();
  group.name = "guideEyebrows";

  for (const side of ["left", "right"] as const) {
    const eye = side === "left" ? metrics.leftEye : metrics.rightEye;
    group.add(createBrowMesh(eye, metrics, side, "main"));
    group.add(createBrowMesh(eye, metrics, side, "hair"));
  }

  scene.add(group);

  return () => {
    scene.remove(group);
    disposeGroup(group);
  };
}
