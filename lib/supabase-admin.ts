import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
} from "@/lib/supabase-env";

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const serviceKey = getSupabaseServiceRoleKey();
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function isSupabaseNetworkError(message: string): boolean {
  const m = message.toLowerCase();
  return m.includes("fetch failed") || m.includes("enotfound") || m.includes("network");
}

export async function createSupabaseUser(
  email: string,
  password: string,
  name: string,
): Promise<{ ok: true } | { ok: false; error: string; retryable: boolean }> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return { ok: false, error: "Supabase admin is not configured.", retryable: true };
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name, name: name || undefined },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
      return {
        ok: false,
        error: "An account with this email already exists. Please log in.",
        retryable: false,
      };
    }
    return {
      ok: false,
      error: error.message,
      retryable: isSupabaseNetworkError(error.message),
    };
  }

  if (!data.user) {
    return { ok: false, error: "Account creation failed.", retryable: true };
  }

  return { ok: true };
}

export async function signInSupabaseUser(
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; retryable: boolean }> {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  if (!url || !anonKey) return { ok: false, retryable: true };

  try {
    const client = createClient(url, anonKey);
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      return { ok: false, retryable: isSupabaseNetworkError(error?.message ?? "") };
    }
    return { ok: true };
  } catch {
    return { ok: false, retryable: true };
  }
}
