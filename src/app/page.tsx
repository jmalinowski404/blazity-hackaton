"use client";

import { useMemo, useRef, useState } from "react";

/* ---- types (mirror the /api/check response) ---------------------------- */
type Severity = "low" | "medium" | "high";
type Finding = {
  quote: string;
  rule: string;
  title: string;
  severity: Severity;
  rewrite: string;
};
type CheckResult = { score: number; summary: string; findings: Finding[] };

/* A sample off-brand draft so the demo works on the first click. */
const SAMPLE = `We're thrilled to announce a revolutionary new platform that will utilize cutting-edge AI to leverage synergies across your entire content stack. Our best-in-class solution empowers stakeholders to ideate at scale. Click Here To Learn More!!!`;

const VOICE_CARDS = [
  {
    num: "01",
    name: "Tone",
    blurb: "Warm and plain-spoken. We sound like a person who knows the work, not a press release.",
    good: ["clear", "direct", "human"],
    bad: ["thrilled", "revolutionary"],
  },
  {
    num: "02",
    name: "Vocabulary",
    blurb: "Plain verbs over corporate ones. If a word only shows up in meetings, it doesn't ship.",
    good: ["use", "build"],
    bad: ["utilize", "leverage", "synergy"],
  },
  {
    num: "03",
    name: "Mechanics",
    blurb: "Sentence case for everything. One terminal mark. Numerals where they earn their place.",
    good: ["Sentence case"],
    bad: ["Title Case", "!!!"],
  },
];

/* Locate each finding's verbatim quote in the text and turn the document
   into a sequence of plain + flagged segments. Findings whose quote can't
   be located still appear in the margin (without a marker). */
type Match = { start: number; end: number; idx: number; n: number };
function annotate(text: string, findings: Finding[]) {
  const matches: Match[] = [];
  findings.forEach((f, idx) => {
    if (!f.quote) return;
    let from = 0;
    while (from <= text.length) {
      const at = text.indexOf(f.quote, from);
      if (at === -1) break;
      const end = at + f.quote.length;
      const overlaps = matches.some((m) => at < m.end && end > m.start);
      if (!overlaps) {
        matches.push({ start: at, end, idx, n: 0 });
        break;
      }
      from = at + 1;
    }
  });
  matches.sort((a, b) => a.start - b.start);
  matches.forEach((m, i) => (m.n = i + 1));

  const segs: { text: string; match?: Match }[] = [];
  let cur = 0;
  for (const m of matches) {
    if (m.start > cur) segs.push({ text: text.slice(cur, m.start) });
    segs.push({ text: text.slice(m.start, m.end), match: m });
    cur = m.end;
  }
  if (cur < text.length) segs.push({ text: text.slice(cur) });

  const markerByFinding = new Map<number, number>();
  matches.forEach((m) => markerByFinding.set(m.idx, m.n));
  return { segs, markerByFinding };
}

export default function Home() {
  const [text, setText] = useState(SAMPLE);
  const [fileName, setFileName] = useState("untitled.txt");
  const [mode, setMode] = useState<"edit" | "result">("edit");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [runId, setRunId] = useState(0);
  const fileInput = useRef<HTMLInputElement>(null);

  const { segs, markerByFinding } = useMemo(
    () => annotate(text, result?.findings ?? []),
    [text, result],
  );

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const content = await file.text();
    setText(content);
    setFileName(file.name);
    setMode("edit");
    setResult(null);
    setStatus("idle");
    setError(null);
  }

  async function runCheck() {
    if (!text.trim() || status === "loading") return;
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Check failed.");
      setResult(data as CheckResult);
      setMode("result");
      setStatus("idle");
      setActive(null);
      setRunId((n) => n + 1);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const score = result?.score ?? null;

  return (
    <>
      {/* ---------------- top bar ---------------- */}
      <header className="topbar">
        <div className="shell topbar-in">
          <div className="brand">
            <span className="brand-mark" aria-hidden>
              <span />
              <span />
              <span />
            </span>
            Tono
          </div>
          <nav className="topnav" aria-label="Primary">
            <a href="#proof">The proof</a>
            <a href="#voice">Your voice</a>
            <a href="#">Pricing</a>
            <a href="#">Docs</a>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span className="status">
              <span className="dot" aria-hidden />
              <span className="mono">voice synced</span>
            </span>
            <button
              className="btn btn-primary"
              onClick={() => {
                setMode("edit");
                setResult(null);
              }}
            >
              New check
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ---------------- hero ---------------- */}
        <section className="shell hero">
          <span className="eyebrow">Brand voice · consistency</span>
          <h1>
            Keep every word in <em>your</em> voice.
          </h1>
          <p className="lede">
            Drop in your copy, run the check, and Tono reads it against the voice
            you&rsquo;ve defined &mdash; marking every place it drifts off-brand and
            rewriting it back into tune.
          </p>
          <div className="hero-meta">
            <span className="chip">
              checks against <b>1 voice profile</b>
            </span>
            <span className="chip">
              powered by <b>Claude</b>
            </span>
            <span className="chip">
              upload <b>.txt / .md</b>
            </span>
          </div>
        </section>

        {/* ---------------- the signature: instrument panel ---------------- */}
        <section className="shell" id="proof">
          <div className="panel">
            <div className="panel-head">
              <div className="panel-file">
                <span className="doticon" aria-hidden />
                <div style={{ minWidth: 0 }}>
                  <div className="name">{fileName}</div>
                  <div className="sub">
                    {mode === "result" ? "checked against “House voice”" : "draft · not yet checked"}
                  </div>
                </div>
              </div>

              {/* voice meter */}
              <div
                className="meter"
                role="meter"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={score ?? 0}
                aria-label="Voice alignment"
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

              <div className="head-actions">
                <label className="btn btn-ghost">
                  Upload file
                  <input
                    ref={fileInput}
                    type="file"
                    accept=".txt,.md,text/plain,text/markdown"
                    onChange={onUpload}
                    hidden
                  />
                </label>
                {mode === "result" ? (
                  <button className="btn btn-ghost" onClick={() => setMode("edit")}>
                    Edit text
                  </button>
                ) : null}
                <button className="btn btn-primary" onClick={runCheck} disabled={status === "loading"}>
                  {status === "loading" ? (
                    <span className="loading">
                      <span className="spinner" aria-hidden />
                      Checking…
                    </span>
                  ) : mode === "result" ? (
                    "↻ Re-run check"
                  ) : (
                    "Run brand check"
                  )}
                </button>
              </div>
            </div>

            <div className="panel-body">
              {/* document / editor */}
              <div className="doc-wrap">
                {mode === "edit" ? (
                  <textarea
                    className="editor"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your copy here, or upload a .txt / .md file…"
                    spellCheck={false}
                  />
                ) : (
                  <>
                    <p className="doc" key={runId}>
                      <span className="doc-kicker">
                        {result && result.findings.length > 0
                          ? `${result.findings.length} issue${result.findings.length === 1 ? "" : "s"} found`
                          : "On-brand — no issues found"}
                      </span>
                      {segs.map((seg, i) =>
                        seg.match ? (
                          <span
                            key={i}
                            className={`flag${active === seg.match.idx ? " is-active" : ""}`}
                            onMouseEnter={() => setActive(seg.match!.idx)}
                            onMouseLeave={() => setActive(null)}
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
                )}
              </div>

              {/* margin notes */}
              <aside className="notes" aria-label="Findings">
                <div className="notes-head">
                  <span className="t">Off-brand findings</span>
                  <span className="c mono">
                    {mode === "result" && result ? `${result.findings.length} flagged` : "—"}
                  </span>
                </div>

                {mode !== "result" ? (
                  <div className="empty">
                    {status === "error" ? (
                      <p className="empty-err">{error}</p>
                    ) : (
                      <p>
                        Run the check to see where your copy drifts off-brand,
                        each finding tied to the passage it flags.
                      </p>
                    )}
                  </div>
                ) : result && result.findings.length === 0 ? (
                  <div className="empty">
                    <p>{result.summary || "This copy already reads on-brand. Nothing to flag."}</p>
                  </div>
                ) : (
                  <>
                    {result?.summary ? <p className="notes-summary">{result.summary}</p> : null}
                    {result?.findings.map((f, idx) => {
                      const marker = markerByFinding.get(idx);
                      return (
                        <div
                          key={`${idx}-${runId}`}
                          className={`note${active === idx ? " is-active" : ""}`}
                          style={{ animationDelay: `${0.06 * idx}s` }}
                          onMouseEnter={() => setActive(idx)}
                          onMouseLeave={() => setActive(null)}
                        >
                          <div className="note-top">
                            <span className={`note-marker sev-${f.severity}`}>
                              {marker ?? "–"}
                            </span>
                            <span className="note-rule">{f.rule}</span>
                            <span className="note-title">{f.title}</span>
                          </div>
                          <div className="note-rewrite">
                            <span className="arrow" aria-hidden>
                              →
                            </span>
                            <span>{f.rewrite}</span>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </aside>
            </div>
          </div>
        </section>

        {/* ---------------- voice definition ---------------- */}
        <section className="shell voice" id="voice">
          <div className="section-head">
            <div>
              <span className="eyebrow">The voice profile</span>
              <h2>
                You define the voice <em>once</em>.
              </h2>
            </div>
            <p>
              Every rule Tono checks comes from a profile you control. Here&rsquo;s the
              sample House voice this demo checks against.
            </p>
          </div>
          <div className="voice-grid">
            {VOICE_CARDS.map((c) => (
              <div className="vcard" key={c.num}>
                <span className="vnum">{c.num}</span>
                <h3>{c.name}</h3>
                <p>{c.blurb}</p>
                <div className="vrules">
                  {c.good.map((g) => (
                    <span className="vrule good" key={g}>
                      {g}
                    </span>
                  ))}
                  {c.bad.map((b) => (
                    <span className="vrule bad" key={b}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ---------------- footer ---------------- */}
      <footer className="foot">
        <div className="shell foot-in">
          <div className="brand">
            <span className="brand-mark" aria-hidden>
              <span />
              <span />
              <span />
            </span>
            Tono
          </div>
          <span className="mono">in tune since 2026 — placeholder, inc.</span>
          <span>© Placeholder content for design review</span>
        </div>
      </footer>
    </>
  );
}
