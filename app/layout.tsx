import "./global.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://nakamanights.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Nakama Nights",
  description: "Premium audio adult experiences — Nakama Nights.",
  openGraph: {
    title: "Nakama Nights",
    description: "Premium audio adult experiences — Nakama Nights.",
    url: siteUrl,
    siteName: "Nakama Nights",
    locale: "en",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
