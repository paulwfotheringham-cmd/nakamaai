import * as THREE from "three";

export type HeadMetrics = {
  headMesh: THREE.Mesh;
  leftEye: THREE.Vector3;
  rightEye: THREE.Vector3;
  headWidth: number;
  headHeight: number;
  headDepth: number;
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

  if (!headMesh) {
    const named = scene.getObjectByName("head");
    if (named instanceof THREE.Mesh) headMesh = named;
  }

  return headMesh;
}

function getObjectCenter(obj: THREE.Object3D): THREE.Vector3 {
  const box = new THREE.Box3().setFromObject(obj);
  return box.getCenter(new THREE.Vector3());
}

function toHeadLocal(headMesh: THREE.Mesh, world: THREE.Vector3): THREE.Vector3 {
  headMesh.updateMatrixWorld(true);
  return headMesh.worldToLocal(world.clone());
}

/** Eye + head dimensions in head-mesh local space (brows parent to the morph head). */
export function computeHeadMetrics(scene: THREE.Object3D): HeadMetrics | null {
  const headMesh = findHeadMesh(scene);
  if (!headMesh) return null;

  headMesh.updateMatrixWorld(true);
  scene.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(headMesh);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const minY = box.min.y;

  let leftEyeWorld = new THREE.Vector3(
    center.x - size.x * 0.11,
    minY + size.y * 0.58,
    box.max.z - size.z * 0.01,
  );
  let rightEyeWorld = new THREE.Vector3(
    center.x + size.x * 0.11,
    minY + size.y * 0.58,
    box.max.z - size.z * 0.01,
  );

  const eyeLeft = scene.getObjectByName("eyeLeft");
  const eyeRight = scene.getObjectByName("eyeRight");
  if (eyeLeft) leftEyeWorld = getObjectCenter(eyeLeft);
  if (eyeRight) rightEyeWorld = getObjectCenter(eyeRight);

  return {
    headMesh,
    leftEye: toHeadLocal(headMesh, leftEyeWorld),
    rightEye: toHeadLocal(headMesh, rightEyeWorld),
    headWidth: size.x,
    headHeight: size.y,
    headDepth: size.z,
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
