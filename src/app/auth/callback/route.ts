import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {

  const { searchParams, origin } = new URL(request.url)

  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type")

  if (!token_hash || !type) {
    return NextResponse.redirect(`${origin}/signup`)
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase.auth.verifyOtp({
    token_hash,
    type: type as "magiclink"
  })

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/signup`)
  }

  await supabase.from("profiles").upsert({
    id: data.user.id,
    email: data.user.email
  })

  return NextResponse.redirect(`${origin}/`)
}
