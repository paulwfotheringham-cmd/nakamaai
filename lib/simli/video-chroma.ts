/** Sample background color from video corners (Simli feeds are usually uniform). */
export function sampleVideoBackground(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): [number, number, number] {
  const points: [number, number][] = [
    [2, 2],
    [width - 3, 2],
    [2, height - 3],
    [width - 3, height - 3],
  ];
  let r = 0;
  let g = 0;
  let b = 0;
  for (const [x, y] of points) {
    const i = (y * width + x) * 4;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  const n = points.length;
  return [r / n, g / n, b / n];
}

/** Make pixels near the sampled background (and very dark) transparent. */
export function keySimliBackground(
  data: Uint8ClampedArray,
  key: [number, number, number],
  tolerance = 48,
): void {
  const [keyR, keyG, keyB] = key;
  const soft = tolerance * 1.6;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const dr = r - keyR;
    const dg = g - keyG;
    const db = b - keyB;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    if (lum < 22 || dist < tolerance) {
      data[i + 3] = 0;
    } else if (dist < soft) {
      const t = (dist - tolerance) / (soft - tolerance);
      data[i + 3] = Math.round(Math.min(255, t * 255));
    }
  }
}
