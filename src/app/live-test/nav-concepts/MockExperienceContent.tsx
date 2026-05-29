export default function MockExperienceContent({ label }: { label: string }) {
  return (
    <div className="nav-preview-content">
      <p className="nav-preview-content-eyebrow">Active destination</p>
      <h2 className="nav-preview-content-title">{label}</h2>
      <p className="nav-preview-content-body">
        Cinematic experience area — full width content lives here.
      </p>
    </div>
  );
}
