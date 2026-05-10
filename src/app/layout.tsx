import { DM_Sans, Playfair_Display } from "next/font/google";
import "./global.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://nakamanights.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Soul of Samui | Fine Art Gallery",
  description:
    "Original paintings inspired by life, culture and beauty — Koh Samui.",
  openGraph: {
    title: "Soul of Samui | Fine Art Gallery",
    description:
      "Original paintings inspired by life, culture and beauty — Koh Samui.",
    url: siteUrl,
    siteName: "Soul of Samui",
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
      <body
        className={`${playfair.variable} ${dmSans.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
