import "./global.css";

export const metadata = {
  title: "Nakama AI",
  description: "Nakama AI",
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
