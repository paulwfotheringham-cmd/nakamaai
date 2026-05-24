import * as THREE from "three";

export type HeadMetrics = {
  /** Scalp crown in the same space as the avatar group (world-aligned). */
  crown: THREE.Vector3;
  headWidth: number;
  headHeight: number;
  headDepth: number;
  leftEye: THREE.Vector3;
  rightEye: THREE.Vector3;
  faceFrontZ: number;
};

function findHeadMesh(scene: THREE.Object3D): THREE.Mesh | null {
  let headMesh: THREE.Mesh | null = null;

  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const morphCount = child.morphTargetDictionary
      ? Object.keys(child.morphTargetDictionary).length
      : 0;
    if (morphCount > 20) headMesh = child;
  });

  return headMesh;
}

function headLocalToWorld(headMesh: THREE.Mesh, point: THREE.Vector3): THREE.Vector3 {
  headMesh.updateMatrixWorld(true);
  return point.clone().applyMatrix4(headMesh.matrixWorld);
}

/** Highest scalp vertex transformed to world / group space. */
function computeCrownWorld(headMesh: THREE.Mesh): THREE.Vector3 {
  headMesh.geometry.computeBoundingBox();

  const pos = headMesh.geometry.attributes.position as THREE.BufferAttribute;
  const localBox = headMesh.geometry.boundingBox!;
  const centerX = (localBox.min.x + localBox.max.x) / 2;
  const xSpan = localBox.max.x - localBox.min.x;
  const zSpan = localBox.max.z - localBox.min.z;

  const v = new THREE.Vector3();
  let best = new THREE.Vector3(centerX, localBox.max.y, localBox.max.z);

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    if (Math.abs(v.x - centerX) > xSpan * 0.34) continue;
    if (v.z < localBox.max.z - zSpan * 0.5) continue;
    if (v.y > best.y) best.set(v.x, v.y, v.z);
  }

  return headLocalToWorld(headMesh, best);
}

function getEyeSide(mesh: THREE.Mesh): "left" | "right" | null {
  let obj: THREE.Object3D | null = mesh;
  while (obj) {
    const n = (obj.name || "").toLowerCase();
    if (n.includes("eye") && n.includes("left")) return "left";
    if (n.includes("eye") && n.includes("right")) return "right";
    obj = obj.parent;
  }

  const verts = mesh.geometry.attributes.position?.count ?? 0;
  if (verts > 0 && verts < 900) {
    const x = new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3()).x;
    return x < 0 ? "left" : "right";
  }

  return null;
}

function findEyeCenters(scene: THREE.Object3D): { left: THREE.Vector3 | null; right: THREE.Vector3 | null } {
  let left: THREE.Vector3 | null = null;
  let right: THREE.Vector3 | null = null;

  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const side = getEyeSide(child);
    if (!side) return;

    const center = new THREE.Box3().setFromObject(child).getCenter(new THREE.Vector3());
    if (side === "left") left = center;
    else right = center;
  });

  return { left, right };
}

export function computeHeadMetrics(scene: THREE.Object3D): HeadMetrics {
  const headMesh = findHeadMesh(scene);
  const target = headMesh ?? scene;

  scene.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(target);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const minY = box.min.y;

  const { left, right } = findEyeCenters(scene);

  const fallbackEyeY = minY + size.y * 0.58;
  const fallbackX = size.x * 0.11;
  const fallbackZ = box.max.z - size.z * 0.02;

  const leftEye = left ?? new THREE.Vector3(center.x - fallbackX, fallbackEyeY, fallbackZ);
  const rightEye = right ?? new THREE.Vector3(center.x + fallbackX, fallbackEyeY, fallbackZ);

  let crown = new THREE.Vector3(center.x, box.max.y, center.z);
  let faceFrontZ = box.max.z - size.z * 0.012;

  if (headMesh) {
    crown = computeCrownWorld(headMesh);
    headMesh.geometry.computeBoundingBox();
    const geoBox = headMesh.geometry.boundingBox!;
    const geoSize = geoBox.getSize(new THREE.Vector3());
    faceFrontZ = headLocalToWorld(
      headMesh,
      new THREE.Vector3(0, geoBox.min.y + geoSize.y * 0.66, geoBox.max.z - geoSize.z * 0.012),
    ).z;
  }

  return {
    crown,
    headWidth: size.x,
    headHeight: size.y,
    headDepth: size.z,
    leftEye,
    rightEye,
    faceFrontZ,
  };
}

export function getMeshRole(mesh: THREE.Mesh): "eye" | "teeth" | "head" {
  let obj: THREE.Object3D | null = mesh;
  while (obj) {
    const n = (obj.name || "").toLowerCase();
    if (n.includes("eye")) return "eye";
    if (n.includes("teeth")) return "teeth";
    if (n === "head" || n.includes("head")) return "head";
    obj = obj.parent;
  }

  const morphCount = mesh.morphTargetDictionary
    ? Object.keys(mesh.morphTargetDictionary).length
    : 0;
  if (morphCount > 20) return "head";

  const verts = mesh.geometry.attributes.position?.count ?? 0;
  if (verts > 0 && verts < 900) return "eye";
  if (verts >= 900 && verts < 2000) return "teeth";
  return "head";
}
