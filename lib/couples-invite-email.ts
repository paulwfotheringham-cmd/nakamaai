export function getSiteOrigin(request?: Request): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (request) {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    const proto = request.headers.get("x-forwarded-proto") ?? "https";
    if (host) return `${proto}://${host}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://nakamanights.com";
}

export function buildPartnerInviteEmailHtml(inviteLink: string): string {
  return `
    <div style="font-family: Georgia, serif; background:#07040d; color:#f7f2e8; padding:32px;">
      <p style="color:#c9a96a; font-size:12px; letter-spacing:0.2em; text-transform:uppercase;">Nakama Nights</p>
      <h1 style="font-size:24px; font-weight:600; margin:16px 0;">You're invited</h1>
      <p style="font-size:16px; line-height:1.6; color:#e9e1d6;">
        Your partner has requested you to join a shared couple session at Nakama Nights.
      </p>
      <p style="margin:28px 0;">
        <a href="${inviteLink}" style="display:inline-block; padding:14px 28px; border-radius:999px; background:linear-gradient(180deg,#f5e6b8,#d2b56f); color:#111; font-weight:700; text-decoration:none;">
          Join your partner
        </a>
      </p>
      <p style="font-size:13px; color:#a8a29e;">
        Or copy this link: <a href="${inviteLink}" style="color:#d2b56f;">${inviteLink}</a>
      </p>
    </div>
  `.trim();
}

export async function sendPartnerInviteEmail(
  to: string,
  inviteLink: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.EMAIL_FROM ?? "Nakama Nights <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("[couples-invite] RESEND_API_KEY not set; invite link:", inviteLink);
    return {
      ok: false,
      error:
        "Email is not configured on the server. Ask your administrator to set RESEND_API_KEY.",
    };
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
      subject: "Your partner invited you to Nakama Nights",
      html: buildPartnerInviteEmailHtml(inviteLink),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[couples-invite] Resend error:", res.status, body);
    return { ok: false, error: "Could not send the invitation email. Please try again." };
  }

  return { ok: true };
}
