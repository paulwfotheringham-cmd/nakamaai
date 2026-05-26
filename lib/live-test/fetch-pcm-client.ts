/** Browser-side PCM fetch for Simli (16 kHz PCM16). */
export async function fetchLiveTestPcm16(text: string): Promise<Uint8Array> {
  const res = await fetch("/api/live-test/simli-audio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || "Failed to generate speech audio");
  }

  const pcm = new Uint8Array(await res.arrayBuffer());
  if (pcm.length < 2) {
    throw new Error("No audio data returned for speech");
  }
  return pcm;
}
