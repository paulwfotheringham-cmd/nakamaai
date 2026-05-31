import fs from "fs";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";

const buf = fs.readFileSync("public/models/heads/male-guide.glb");
const ktx2 = new KTX2Loader();
ktx2.setTranscoderPath("public/basis/");
const loader = new GLTFLoader();
loader.setKTX2Loader(ktx2);

await new Promise((resolve, reject) => {
  loader.parse(buf.buffer, "", (gltf) => {
    gltf.scene.traverse((c) => {
      if (!c.isMesh) return;
      const m = c.material;
      console.log(c.name, {
        color: m.color?.getHexString?.(),
        map: m.map?.image?.width,
        normal: !!m.normalMap,
        morphs: c.morphTargetDictionary ? Object.keys(c.morphTargetDictionary).length : 0,
      });
    });
    resolve();
  }, reject);
});
