import { NextResponse } from "next/server";
import { getSiteOrigin, sendPartnerInviteEmail } from "@/lib/couples-invite-email";

export async function POST(req: Request) {
  let body: { partnerEmail?: string; inviterEmail?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const partnerEmail = (body.partnerEmail ?? "").trim().toLowerCase();
  if (!partnerEmail || !partnerEmail.includes("@")) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  const origin = getSiteOrigin(req);
  const inviteLink = `${origin}/couples-trial-partner`;

  const sent = await sendPartnerInviteEmail(partnerEmail, inviteLink);
  if (!sent.ok) {
    return NextResponse.json(
      { error: sent.error, inviteLink },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    emailSent: sent.emailSent,
    inviteLink,
    message: sent.emailSent
      ? "Invitation email sent to your partner."
      : "Share this link with your partner to invite them.",
  });
}
