import { NextResponse } from "next/server";
import { verifyDemoLogin } from "@/lib/auth-login-server";
import { resolveLoginEmail } from "@/lib/auth-login";
import { verifyLocalUser } from "@/lib/auth-local-store";
import { signInSupabaseUser } from "@/lib/supabase-admin";

const SESSION_COOKIE = "nakama_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function sessionResponse(source: "demo" | "supabase" | "local") {
  const ok = NextResponse.json({ ok: true });
  ok.cookies.set(SESSION_COOKIE, source, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return ok;
}

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

  if (verifyDemoLogin(identifier, password)) {
    return sessionResponse("demo");
  }

  const supabaseResult = await signInSupabaseUser(email, password);
  if (supabaseResult.ok) {
    return sessionResponse("supabase");
  }

  const localResult = await verifyLocalUser(email, password);
  if (localResult.ok) {
    return sessionResponse("local");
  }

  return NextResponse.json({ error: "Invalid login credentials." }, { status: 401 });
}
