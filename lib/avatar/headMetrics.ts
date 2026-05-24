import * as THREE from "three";

export type HeadMetrics = {
  center: THREE.Vector3;
  width: number;
  height: number;
  depth: number;
  topY: number;
  /** Scalp crown in scene-local space — use for hair portaled into the GLB scene. */
  crown: THREE.Vector3;
  /** Head mesh geometry width/height for hair sizing in scene-local units. */
  hairWidth: number;
  hairHeight: number;
  eyeY: number;
  browY: number;
  frontZ: number;
  leftEye: THREE.Vector3;
  rightEye: THREE.Vector3;
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

function headLocalToSceneLocal(
  scene: THREE.Object3D,
  headMesh: THREE.Mesh,
  point: THREE.Vector3,
): THREE.Vector3 {
  scene.updateMatrixWorld(true);
  headMesh.updateMatrixWorld(true);
  const sceneInv = new THREE.Matrix4().copy(scene.matrixWorld).invert();
  return point.clone().applyMatrix4(headMesh.matrixWorld).applyMatrix4(sceneInv);
}

/** Highest scalp vertex on the morph head mesh (head geometry local space). */
function computeCrownHeadLocal(headMesh: THREE.Mesh): THREE.Vector3 {
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

  return best;
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
  const eyeY = (leftEye.y + rightEye.y) * 0.5;
  const browGap = size.y * 0.042;

  let crown = new THREE.Vector3(center.x, box.max.y, center.z);
  let hairWidth = size.x;
  let hairHeight = size.y;

  if (headMesh) {
    headMesh.geometry.computeBoundingBox();
    const geoBox = headMesh.geometry.boundingBox!;
    const geoSize = geoBox.getSize(new THREE.Vector3());
    hairWidth = geoSize.x;
    hairHeight = geoSize.y;
    crown = headLocalToSceneLocal(scene, headMesh, computeCrownHeadLocal(headMesh));
  }

  return {
    center,
    width: size.x,
    height: size.y,
    depth: size.z,
    topY: box.max.y,
    crown,
    hairWidth,
    hairHeight,
    eyeY,
    browY: eyeY + browGap,
    frontZ: box.max.z,
    leftEye,
    rightEye,
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
