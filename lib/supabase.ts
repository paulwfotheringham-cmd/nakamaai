import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const safeSupabaseUrl = supabaseUrl || "https://placeholder.supabase.co";
const safeSupabaseAnonKey = supabaseAnonKey || "placeholder-anon-key";

export const supabase = createClient(safeSupabaseUrl, safeSupabaseAnonKey);
