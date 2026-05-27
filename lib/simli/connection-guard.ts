/** One Simli WebRTC session at a time across the app (avoids Simli rate limits). */

const TEARDOWN_MS = 1500;

let activeStop: (() => Promise<void>) | null = null;
let lastRelease = 0;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Ends any other avatar connection, waits, then reserves this instance. */
export async function registerSimliTeardown(stop: () => Promise<void>) {
  if (activeStop && activeStop !== stop) {
    try {
      await activeStop();
    } catch {
      /* ignore */
    }
    const elapsed = Date.now() - lastRelease;
    if (elapsed < TEARDOWN_MS) {
      await sleep(TEARDOWN_MS - elapsed);
    }
  }
  activeStop = stop;
}

/** Clears the global slot after this instance has stopped its client. */
export function releaseSimliSlot(stop: () => Promise<void>) {
  if (activeStop === stop) {
    activeStop = null;
    lastRelease = Date.now();
  }
}

export function isSimliRateLimitError(message: string): boolean {
  return /rate\s*limit/i.test(message);
}
