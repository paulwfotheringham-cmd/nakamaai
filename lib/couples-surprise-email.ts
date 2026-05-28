export function buildSurpriseReadyEmailHtml(
  username: string,
  scenarioTitle: string,
  inviteLink: string,
): string {
  const greeting = username ? `Hi ${username},` : "Hi there,";
  return `
    <div style="font-family: Georgia, serif; background:#07040d; color:#f7f2e8; padding:32px;">
      <p style="color:#c9a96a; font-size:12px; letter-spacing:0.2em; text-transform:uppercase;">Nakama Nights · Surprise Mode</p>
      <h1 style="font-size:24px; font-weight:600; margin:16px 0;">Your surprise is ready</h1>
      <p style="font-size:16px; line-height:1.6; color:#e9e1d6;">
        ${greeting}
      </p>
      <p style="font-size:16px; line-height:1.6; color:#e9e1d6;">
        You chose <strong style="color:#f5e6b8;">${scenarioTitle}</strong> for your partner.
        Share the link below so they can join your couple session.
      </p>
      <p style="margin:28px 0;">
        <a href="${inviteLink}" style="display:inline-block; padding:14px 28px; border-radius:999px; background:linear-gradient(180deg,#f5e6b8,#d2b56f); color:#111; font-weight:700; text-decoration:none;">
          Invite your partner
        </a>
      </p>
      <p style="font-size:13px; color:#a8a29e;">
        Or copy this link: <a href="${inviteLink}" style="color:#d2b56f;">${inviteLink}</a>
      </p>
    </div>
  `.trim();
}

export async function sendSurpriseReadyEmail(
  to: string,
  username: string,
  scenarioTitle: string,
  inviteLink: string,
): Promise<{ ok: true; emailSent: boolean } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.EMAIL_FROM ?? "Nakama Nights <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("[surprise-mode] RESEND_API_KEY not set; share link manually:", inviteLink);
    return { ok: true, emailSent: false };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Your Surprise Mode fantasy: ${scenarioTitle}`,
      html: buildSurpriseReadyEmailHtml(username, scenarioTitle, inviteLink),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[surprise-mode] Resend error:", res.status, body);
    return { ok: false, error: "Could not send your confirmation email. Please try again." };
  }

  return { ok: true, emailSent: true };
}
