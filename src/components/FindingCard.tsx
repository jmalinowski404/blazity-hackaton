import type { Finding, Severity } from "@/lib/types";

const SEVERITY_HELP: Record<Severity, string> = {
  low: "Minor — a small polish to sound more on-brand.",
  medium: "Worth fixing — noticeably off the brand voice.",
  high: "Fix this — clearly breaks the brand voice.",
};

type Props = {
  finding: Finding;
  marker?: number;
  isApplied: boolean;
  isActive: boolean;
  onHover: (active: boolean) => void;
  onApply: () => void;
  delay: number;
};

export function FindingCard({ finding, marker, isApplied, isActive, onHover, onApply, delay }: Props) {
  return (
    <div
      className={`note${isActive ? " is-active" : ""}${isApplied ? " is-applied" : ""}`}
      style={{ animationDelay: `${delay}s` }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div className="note-top">
        <span className={`note-marker sev-${finding.severity}`} title={`Severity: ${finding.severity}`}>
          {isApplied ? "✓" : (marker ?? "–")}
        </span>
        <span className="note-rule" title="Brand rule this breaks">
          {finding.rule}
        </span>
        <span className="note-title">{finding.title}</span>
        <span className={`note-sev sev-text-${finding.severity}`} title={SEVERITY_HELP[finding.severity]}>
          {finding.severity}
        </span>
      </div>
      <p className="note-explain">{finding.explanation}</p>
      <div className="note-rewrite">
        <span className="arrow" aria-hidden>
          →
        </span>
        <span>{finding.rewrite}</span>
      </div>
      <div className="note-actions">
        {isApplied ? (
          <span className="applied-tag">✓ Applied in text</span>
        ) : (
          <button
            className="mini mini-apply"
            onClick={onApply}
            title="Replace this passage with the on-brand rewrite"
          >
            Apply rewrite
          </button>
        )}
      </div>
    </div>
  );
}
