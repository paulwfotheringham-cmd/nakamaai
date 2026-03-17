import Link from "next/link";

export default function DashboardPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f3f3",
        padding: "60px 40px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "40px",
          maxWidth: "1500px",
          margin: "0 auto",
        }}
      >
        <FeatureBox text="Choose fantasy Audio" />

        <Link href="/create-audio" style={{ textDecoration: "none" }}>
          <FeatureBox text="Customize your audio" clickable />
        </Link>

        <FeatureBox text="Profile" />
      </div>
    </div>
  );
}

function FeatureBox({
  text,
  clickable = false,
}: {
  text: string;
  clickable?: boolean;
}) {
  return (
    <div
      style={{
        width: "390px",
        height: "180px",
        background: "#8bd06f",
        border: "4px solid #0f2233",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "28px",
        fontWeight: 400,
        textAlign: "center",
        padding: "20px",
        boxSizing: "border-box",
        cursor: clickable ? "pointer" : "default",
      }}
    >
      {text}
    </div>
  );
}
