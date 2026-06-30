import { BrandMark } from "@/components/BrandMark";
import { NewCheckButton } from "@/components/NewCheckButton";

export function Topbar() {
  return (
    <header className="topbar">
      <div className="shell topbar-in">
        <div className="brand">
          <BrandMark />
          Tono
        </div>
        <nav className="topnav" aria-label="Primary">
          <a href="#connect">Channels</a>
          <a href="#proof">The proof</a>
          <a href="#voice">Your voice</a>
          <a href="#how">How it works</a>
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span className="status">
            <span className="dot" aria-hidden />
            <span className="mono">voice synced</span>
          </span>
          <NewCheckButton />
        </div>
      </div>
    </header>
  );
}
