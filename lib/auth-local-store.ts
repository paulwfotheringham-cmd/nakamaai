import { list, put } from "@vercel/blob";
import { hashPassword, verifyPassword } from "@/lib/auth-password";
import { normalizeUsername } from "@/lib/auth-username";

const USERS_PATH = "auth/users.json";
const USERNAME_MAP_PATH = "auth/username-map.json";

export type StoredUser = {
  email: string;
  passwordHash: string;
  name: string;
  username: string;
  createdAt: string;
};

type UsernameMap = {
  entries: { username: string; email: string }[];
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

async function readUsernameMap(): Promise<UsernameMap> {
  if (!blobConfigured()) return { entries: [] };

  try {
    const { blobs } = await list({ prefix: USERNAME_MAP_PATH, limit: 1 });
    const match = blobs.find((b) => b.pathname === USERNAME_MAP_PATH);
    if (!match?.url) return { entries: [] };

    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) return { entries: [] };
    return (await res.json()) as UsernameMap;
  } catch {
    return { entries: [] };
  }
}

async function writeUsernameMap(map: UsernameMap): Promise<void> {
  if (!blobConfigured()) {
    throw new Error("User storage is not configured.");
  }

  await put(USERNAME_MAP_PATH, JSON.stringify(map), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function findEmailByUsername(username: string): Promise<string | null> {
  const normalized = normalizeUsername(username);
  if (!normalized) return null;

  const map = await readUsernameMap();
  const fromMap = map.entries.find((e) => e.username === normalized);
  if (fromMap) return fromMap.email;

  const store = await readStore();
  const fromUser = store.users.find((u) => u.username === normalized);
  return fromUser?.email ?? null;
}

export async function linkUsernameToEmail(
  email: string,
  username: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!blobConfigured()) {
    return { ok: false, error: "User storage is not configured." };
  }

  const normalizedEmail = normalizeEmail(email);
  const normalizedUsername = normalizeUsername(username);
  if (!normalizedUsername) {
    return { ok: false, error: "Username is required." };
  }

  const map = await readUsernameMap();
  const taken = map.entries.find(
    (e) => e.username === normalizedUsername && e.email !== normalizedEmail,
  );
  if (taken) {
    return { ok: false, error: "That username is already taken." };
  }

  const store = await readStore();
  const userTaken = store.users.find(
    (u) => u.username === normalizedUsername && u.email !== normalizedEmail,
  );
  if (userTaken) {
    return { ok: false, error: "That username is already taken." };
  }

  const withoutEmail = map.entries.filter((e) => e.email !== normalizedEmail);
  withoutEmail.push({ username: normalizedUsername, email: normalizedEmail });
  await writeUsernameMap({ entries: withoutEmail });

  const user = store.users.find((u) => u.email === normalizedEmail);
  if (user) {
    user.username = normalizedUsername;
    await writeStore(store);
  }

  return { ok: true };
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
  username: string,
): Promise<{ ok: true; username: string } | { ok: false; error: string }> {
  if (!blobConfigured()) {
    return { ok: false, error: "Registration is not available right now. Please try again later." };
  }

  const normalized = normalizeEmail(email);
  const normalizedUsername = normalizeUsername(username);
  const store = await readStore();

  if (store.users.some((u) => u.email === normalized)) {
    return { ok: false, error: "An account with this email already exists. Please log in." };
  }

  const link = await linkUsernameToEmail(normalized, normalizedUsername);
  if (!link.ok) return link;

  store.users.push({
    email: normalized,
    passwordHash: await hashPassword(password),
    name: name.trim(),
    username: normalizedUsername,
    createdAt: new Date().toISOString(),
  });

  await writeStore(store);
  return { ok: true, username: normalizedUsername };
}

export async function verifyLocalUser(
  email: string,
  password: string,
): Promise<{ ok: true; name: string; username: string } | { ok: false }> {
  if (!blobConfigured()) return { ok: false };

  const normalized = normalizeEmail(email);
  const store = await readStore();
  const user = store.users.find((u) => u.email === normalized);
  if (!user) return { ok: false };

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { ok: false };
  return { ok: true, name: user.name, username: user.username || "" };
}

export function isLocalAuthAvailable(): boolean {
  return blobConfigured();
}
