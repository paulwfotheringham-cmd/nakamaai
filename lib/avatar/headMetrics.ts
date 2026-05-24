import * as THREE from "three";

export type HeadMetrics = {
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

  return headMesh;
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

function toSceneLocal(scene: THREE.Object3D, world: THREE.Vector3): THREE.Vector3 {
  scene.updateMatrixWorld(true);
  return scene.worldToLocal(world.clone());
}

/** Metrics in scene-local space for attaching brows as children of the GLB scene. */
export function computeHeadMetrics(scene: THREE.Object3D): HeadMetrics {
  scene.updateMatrixWorld(true);

  const headMesh = findHeadMesh(scene);
  const target = headMesh ?? scene;
  const box = new THREE.Box3().setFromObject(target);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const minY = box.min.y;

  let leftEyeWorld = new THREE.Vector3(center.x - size.x * 0.11, minY + size.y * 0.58, box.max.z - size.z * 0.02);
  let rightEyeWorld = new THREE.Vector3(center.x + size.x * 0.11, minY + size.y * 0.58, box.max.z - size.z * 0.02);

  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const side = getEyeSide(child);
    if (!side) return;
    const c = new THREE.Box3().setFromObject(child).getCenter(new THREE.Vector3());
    if (side === "left") leftEyeWorld = c;
    else rightEyeWorld = c;
  });

  return {
    leftEye: toSceneLocal(scene, leftEyeWorld),
    rightEye: toSceneLocal(scene, rightEyeWorld),
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
