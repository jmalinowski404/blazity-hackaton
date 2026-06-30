import type { Match } from "@/lib/annotate";

type Segment = { text: string; match?: Match };

type Props = {
  segments: Segment[];
  total: number;
  appliedCount: number;
  active: number | null;
  onActive: (idx: number | null) => void;
  runId: number;
};

export function AnnotatedDoc({ segments, total, appliedCount, active, onActive, runId }: Props) {
  return (
    <>
      <p className="doc" key={runId}>
        <span className="doc-kicker">
          {total > 0
            ? `${total} issue${total === 1 ? "" : "s"} found${appliedCount ? ` · ${appliedCount} fixed` : ""}`
            : "On-brand — no issues found"}
        </span>
        {segments.map((seg, i) =>
          seg.match ? (
            <span
              key={i}
              className={`flag${active === seg.match.idx ? " is-active" : ""}`}
              onMouseEnter={() => onActive(seg.match!.idx)}
              onMouseLeave={() => onActive(null)}
            >
              {seg.text}
              <sup>{seg.match.n}</sup>
            </span>
          ) : (
            <span key={i}>{seg.text}</span>
          ),
        )}
      </p>
      <span className="scan" key={`scan-${runId}`} aria-hidden />
    </>
  );
}
