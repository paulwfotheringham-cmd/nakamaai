import { NextResponse } from "next/server";
import { getSiteOrigin, sendPartnerInviteEmail } from "@/lib/couples-invite-email";
import { sendSurpriseReadyEmail } from "@/lib/couples-surprise-email";

export async function POST(req: Request) {
  let body: {
    userEmail?: string;
    partnerEmail?: string;
    scenarioTitle?: string;
    username?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const userEmail = (body.userEmail ?? "").trim().toLowerCase();
  const partnerEmail = (body.partnerEmail ?? "").trim().toLowerCase();
  const scenarioTitle = (body.scenarioTitle ?? "").trim() || "your chosen fantasy";
  const username = (body.username ?? "").trim();

  if (!userEmail || !userEmail.includes("@")) {
    return NextResponse.json(
      { error: "A valid email address is required for your account." },
      { status: 400 },
    );
  }

  if (partnerEmail && !partnerEmail.includes("@")) {
    return NextResponse.json(
      { error: "Enter a valid partner email or leave it blank." },
      { status: 400 },
    );
  }

  const origin = getSiteOrigin(req);
  const inviteLink = `${origin}/couples-trial-partner`;

  const userSent = await sendSurpriseReadyEmail(
    userEmail,
    username,
    scenarioTitle,
    inviteLink,
  );
  if (!userSent.ok) {
    return NextResponse.json(
      { error: userSent.error, inviteLink },
      { status: 500 },
    );
  }

  let partnerEmailSent = false;
  if (partnerEmail) {
    const partnerSent = await sendPartnerInviteEmail(partnerEmail, inviteLink);
    if (!partnerSent.ok) {
      return NextResponse.json(
        {
          error: partnerSent.error,
          inviteLink,
          emailSent: userSent.emailSent,
          partnerEmailSent: false,
        },
        { status: 500 },
      );
    }
    partnerEmailSent = partnerSent.emailSent;
  }

  const anyEmailSent = userSent.emailSent || partnerEmailSent;

  return NextResponse.json({
    ok: true,
    inviteLink,
    emailSent: userSent.emailSent,
    partnerEmailSent,
    message: anyEmailSent
      ? partnerEmail
        ? "We emailed you a summary and sent your partner an invitation."
        : "We emailed you a summary with your invite link."
      : "Share the invite link with your partner to get started.",
  });
}
