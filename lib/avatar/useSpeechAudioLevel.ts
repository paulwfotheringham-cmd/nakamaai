"use client";

import { type RefObject, useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Tracks live speech energy from an HTMLMediaElement for lip-sync driving.
 * Returns a ref updated every animation frame (safe to read inside R3F useFrame).
 */
export function useSpeechAudioLevel(
  mediaRef: RefObject<HTMLMediaElement | null>,
  isActive: boolean,
): RefObject<number> {
  const levelRef = useRef(0);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const connectedElRef = useRef<HTMLMediaElement | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!isActive) {
      levelRef.current = 0;
      return;
    }

    const el = mediaRef.current;
    if (!el) return;

    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;
    void ctx.resume();

    if (connectedElRef.current !== el) {
      sourceRef.current?.disconnect();
      analyserRef.current?.disconnect();
      sourceRef.current = null;
      analyserRef.current = null;
      connectedElRef.current = el;
    }

    if (!sourceRef.current) {
      try {
        const source = ctx.createMediaElementSource(el);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.55;
        source.connect(analyser);
        analyser.connect(ctx.destination);
        sourceRef.current = source;
        analyserRef.current = analyser;
      } catch {
        // Element may already be wired to another context — analyser loop still runs at 0.
      }
    }

    const analyser = analyserRef.current;
    const bins = new Uint8Array(analyser?.frequencyBinCount ?? 256);

    const tick = () => {
      if (analyser) {
        analyser.getByteFrequencyData(bins);
        let sum = 0;
        const start = 1;
        const end = 32;
        for (let i = start; i < end; i += 1) sum += bins[i];
        const raw = sum / (end - start) / 255;
        const normalized = THREE.MathUtils.clamp((raw - 0.02) / 0.55, 0, 0.75);
        levelRef.current = THREE.MathUtils.lerp(levelRef.current, normalized, 0.45);
      } else if (isActive) {
        levelRef.current = 0.22 + Math.abs(Math.sin(performance.now() * 0.012)) * 0.18;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      levelRef.current = 0;
    };
  }, [isActive, mediaRef]);

  return levelRef;
}
