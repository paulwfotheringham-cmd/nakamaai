import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { getSiteUrl } from "@/lib/site-url";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase-env";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    const url = getSupabaseUrl();
    const anonKey = getSupabaseAnonKey();
    if (!url || !anonKey) {
      return NextResponse.json(
        { error: "Password reset is temporarily unavailable. Please contact support." },
        { status: 503 },
      );
    }

    const supabase = createClient(url, anonKey);
    const redirectTo = `${getSiteUrl()}/resetpassword`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    if (error) {
      console.error("[auth/forgot-password]", error.message);
    }

    // Generic success — avoids revealing whether the email exists.
    return NextResponse.json({
      ok: true,
      message:
        "If an account exists for that email, we sent a password reset link. Check your inbox and spam folder.",
    });
  } catch (error) {
    console.error("[auth/forgot-password]", error);
    return NextResponse.json({ error: "Could not send reset email. Please try again." }, { status: 500 });
  }
}
