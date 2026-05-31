import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const glbPath = path.join(__dirname, "../public/models/heads/male-guide.glb");

const buf = fs.readFileSync(glbPath);
const loader = new GLTFLoader();
loader.parse(buf.buffer, "", (gltf) => {
  const scene = gltf.scene;
  const box = new THREE.Box3().setFromObject(scene);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  console.log("center", center.toArray().map((n) => n.toFixed(4)));
  console.log("size", size.toArray().map((n) => n.toFixed(4)));
  scene.traverse((c) => {
    if (c instanceof THREE.Mesh && c.morphTargetDictionary) {
      console.log("morph mesh", c.name, Object.keys(c.morphTargetDictionary).length);
    }
  });
});
