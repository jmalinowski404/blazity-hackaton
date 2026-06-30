import { BrandMark } from "@/components/BrandMark";

export function SiteFooter() {
  return (
    <footer className="foot">
      <div className="shell foot-in">
        <div className="brand">
          <BrandMark />
          Tono
        </div>
        <span className="mono">in tune since 2026 — placeholder, inc.</span>
        <span>© Placeholder content for design review</span>
      </div>
    </footer>
  );
}
