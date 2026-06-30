export function VoiceMeter({ score, runId }: { score: number | null; runId: number }) {
  return (
    <div
      className="meter"
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={score ?? 0}
      aria-label="Voice alignment"
      title="How closely this copy matches your brand voice, from 0 to 100."
    >
      <span className="meter-label">Voice alignment</span>
      <span className="meter-track">
        <span
          key={runId}
          className="meter-fill"
          style={{ "--score": `${score ?? 0}%` } as React.CSSProperties}
        />
      </span>
      <span className="meter-score">
        {score ?? "—"}
        <small>{score === null ? "" : "%"}</small>
      </span>
    </div>
  );
}
