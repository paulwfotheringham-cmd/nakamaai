import { NextResponse } from "next/server";
import { validateUsername, normalizeUsername } from "@/lib/auth-username";
import { linkUsernameToEmail, registerLocalUser } from "@/lib/auth-local-store";
import { createSupabaseUser, signInSupabaseUser } from "@/lib/supabase-admin";

const SESSION_COOKIE = "nakama_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function sessionResponse(email: string, username: string, source: "supabase" | "local") {
  const ok = NextResponse.json({ ok: true, email, username });
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
  let body: { email?: string; password?: string; name?: string; username?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const name = (body.name ?? "").trim();
  const usernameRaw = body.username ?? "";

  const usernameError = validateUsername(usernameRaw);
  if (usernameError) {
    return NextResponse.json({ error: usernameError }, { status: 400 });
  }
  const username = normalizeUsername(usernameRaw);

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 },
    );
  }

  const supabaseResult = await createSupabaseUser(email, password, name, username);
  if (supabaseResult.ok) {
    const link = await linkUsernameToEmail(email, username);
    if (!link.ok) {
      return NextResponse.json({ error: link.error }, { status: 409 });
    }
    await signInSupabaseUser(email, password);
    return sessionResponse(email, username, "supabase");
  }

  if (!supabaseResult.retryable) {
    return NextResponse.json({ error: supabaseResult.error }, { status: 409 });
  }

  const localResult = await registerLocalUser(email, password, name, username);
  if (!localResult.ok) {
    return NextResponse.json({ error: localResult.error }, { status: 400 });
  }

  return sessionResponse(email, localResult.username, "local");
}
