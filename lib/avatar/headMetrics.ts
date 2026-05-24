import * as THREE from "three";

export type HeadMetrics = {
  center: THREE.Vector3;
  width: number;
  height: number;
  depth: number;
  topY: number;
  eyeY: number;
  browY: number;
  frontZ: number;
  leftEye: THREE.Vector3;
  rightEye: THREE.Vector3;
  headMesh: THREE.Mesh;
};

export function findHeadMesh(scene: THREE.Object3D): THREE.Mesh | null {
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

function toHeadLocal(headMesh: THREE.Object3D, world: THREE.Vector3): THREE.Vector3 {
  headMesh.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(headMesh.matrixWorld).invert();
  return world.clone().applyMatrix4(inv);
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

function findEyeCentersLocal(
  scene: THREE.Object3D,
  headMesh: THREE.Mesh,
): { left: THREE.Vector3 | null; right: THREE.Vector3 | null } {
  let left: THREE.Vector3 | null = null;
  let right: THREE.Vector3 | null = null;

  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const side = getEyeSide(child);
    if (!side) return;

    const world = new THREE.Box3().setFromObject(child).getCenter(new THREE.Vector3());
    const local = toHeadLocal(headMesh, world);
    if (side === "left") left = local;
    else right = local;
  });

  return { left, right };
}

export function computeHeadMetrics(scene: THREE.Object3D): HeadMetrics | null {
  const headMesh = findHeadMesh(scene);
  if (!headMesh) return null;

  headMesh.geometry.computeBoundingBox();
  const box = headMesh.geometry.boundingBox!.clone();
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const minY = box.min.y;

  const { left, right } = findEyeCentersLocal(scene, headMesh);

  const fallbackEyeY = minY + size.y * 0.58;
  const fallbackX = size.x * 0.11;
  const fallbackZ = box.max.z - size.z * 0.01;

  const leftEye = left ?? new THREE.Vector3(center.x - fallbackX, fallbackEyeY, fallbackZ);
  const rightEye = right ?? new THREE.Vector3(center.x + fallbackX, fallbackEyeY, fallbackZ);
  const eyeY = (leftEye.y + rightEye.y) * 0.5;
  const browGap = size.y * 0.042;

  return {
    center,
    width: size.x,
    height: size.y,
    depth: size.z,
    topY: box.max.y,
    eyeY,
    browY: eyeY + browGap,
    frontZ: box.max.z,
    leftEye,
    rightEye,
    headMesh,
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
