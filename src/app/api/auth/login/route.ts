import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyDemoLogin } from "@/lib/auth-login-server";
import { resolveLoginEmail } from "@/lib/auth-login";

const SESSION_COOKIE = "nakama_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const identifier = (body.email ?? "").trim();
  const password = body.password ?? "";
  if (!identifier || !password) {
    return NextResponse.json(
      { error: "Email or username and password are required." },
      { status: 400 },
    );
  }

  const email = resolveLoginEmail(identifier);
  const ok = NextResponse.json({ ok: true });

  if (verifyDemoLogin(identifier, password)) {
    ok.cookies.set(SESSION_COOKIE, "demo", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });
    return ok;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Invalid login credentials." }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return NextResponse.json(
      { error: error?.message ?? "Invalid login credentials." },
      { status: 401 },
    );
  }

  ok.cookies.set(SESSION_COOKIE, "supabase", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return ok;
}
