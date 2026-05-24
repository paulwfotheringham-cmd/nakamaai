"use client";

import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { KTX2Loader } from "three-stdlib";

export const GUIDE_MODEL_PATH = "/models/heads/male-guide.glb";

const KTX2_TRANSCODER = "/basis/";

export function useGuideGLTF() {
  const gl = useThree((state) => state.gl);

  const extendLoader = useMemo(() => {
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath(KTX2_TRANSCODER);
    ktx2Loader.detectSupport(gl);

    return (loader: Parameters<NonNullable<Parameters<typeof useGLTF>[3]>>[0]) => {
      loader.setKTX2Loader(ktx2Loader);
    };
  }, [gl]);

  return useGLTF(GUIDE_MODEL_PATH, undefined, undefined, extendLoader);
}
