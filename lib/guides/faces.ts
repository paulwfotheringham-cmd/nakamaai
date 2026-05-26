import { DEFAULT_SIMLI_FACE_ID } from "@/lib/simli/config";

/** Verified Simli preset faces (compose/token HTTP 200). Client-safe — no env vars. */
export const GUIDE_FACE_IDS = {
  frank: DEFAULT_SIMLI_FACE_ID,
  marcus: "6ebf0aa7-6fed-443d-a4c6-fd1e3080b215",
  clint: "101bef0d-b62d-4fbe-a6b4-89bc3fc66ec6",
  sienna: "4145d354-fd78-4c29-b6b1-0663a04e8d7b",
} as const;

export type GuideFaceKey = keyof typeof GUIDE_FACE_IDS;
