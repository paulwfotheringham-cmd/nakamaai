export function sanitizeEnvValue(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim().replace(/^["']|["']$/g, "").trim();
  return trimmed || null;
}

export function getSupabaseUrl(): string | null {
  return sanitizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function getSupabaseAnonKey(): string | null {
  return sanitizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseServiceRoleKey(): string | null {
  return sanitizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY);
}
