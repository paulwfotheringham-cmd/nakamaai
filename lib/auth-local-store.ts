import { list, put } from "@vercel/blob";
import { hashPassword, verifyPassword } from "@/lib/auth-password";

const USERS_PATH = "auth/users.json";

export type StoredUser = {
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
};

type UserStore = {
  users: StoredUser[];
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

async function readStore(): Promise<UserStore> {
  if (!blobConfigured()) {
    return { users: [] };
  }

  try {
    const { blobs } = await list({ prefix: USERS_PATH, limit: 1 });
    const match = blobs.find((b) => b.pathname === USERS_PATH);
    if (!match?.url) return { users: [] };

    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) return { users: [] };
    return (await res.json()) as UserStore;
  } catch {
    return { users: [] };
  }
}

async function writeStore(store: UserStore): Promise<void> {
  if (!blobConfigured()) {
    throw new Error("User storage is not configured.");
  }

  await put(USERS_PATH, JSON.stringify(store), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function registerLocalUser(
  email: string,
  password: string,
  name: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!blobConfigured()) {
    return { ok: false, error: "Registration is not available right now. Please try again later." };
  }

  const normalized = normalizeEmail(email);
  const store = await readStore();

  if (store.users.some((u) => u.email === normalized)) {
    return { ok: false, error: "An account with this email already exists. Please log in." };
  }

  store.users.push({
    email: normalized,
    passwordHash: await hashPassword(password),
    name: name.trim(),
    createdAt: new Date().toISOString(),
  });

  await writeStore(store);
  return { ok: true };
}

export async function verifyLocalUser(
  email: string,
  password: string,
): Promise<{ ok: true; name: string } | { ok: false }> {
  if (!blobConfigured()) return { ok: false };

  const normalized = normalizeEmail(email);
  const store = await readStore();
  const user = store.users.find((u) => u.email === normalized);
  if (!user) return { ok: false };

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { ok: false };
  return { ok: true, name: user.name };
}

export function isLocalAuthAvailable(): boolean {
  return blobConfigured();
}
