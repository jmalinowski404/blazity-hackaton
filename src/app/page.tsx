import { Topbar } from "@/components/Topbar";
import { Hero } from "@/components/Hero";
import { BrandCheckApp } from "@/components/BrandCheckApp";
import { HowItWorks } from "@/components/HowItWorks";
import { VoiceProfile } from "@/components/VoiceProfile";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  return (
    <>
      <Topbar />
      <main>
<<<<<<< HEAD
        {/* ---------------- hero ---------------- */}
        <section className="shell hero">
          <span className="eyebrow">Brand voice · consistency</span>
          <h1>
            Keep every word in <em>your</em> voice.
          </h1>
          <p className="lede">
            Paste copy, upload a file, or pull in a post by URL. Tono reads it
            against the voice you&rsquo;ve defined &mdash; marks every place it
            drifts off-brand, explains why, and rewrites it back into tune.
          </p>
          <div className="hero-meta">
            <span className="chip">
              checks against <b>{BRAND_PROFILE.rules.length} rule groups</b>
            </span>
            <span className="chip">
              powered by <b>Claude</b>
            </span>
            <span className="chip">
              fix in place &middot; <b>download corrected</b>
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
                    {mode === "result"
                      ? `checked against “${BRAND_PROFILE.name}”`
                      : "draft · not yet checked"}
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

              <div className="head-actions">
                <label className="btn btn-ghost" title="Upload a .txt or .md file">
                  Upload
                  <input
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
                <button
                  className="btn btn-primary"
                  onClick={runCheck}
                  disabled={status === "loading"}
                >
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
                  <div className="edit-pane">
                    <div className="source-bar">
                      <input
                        className="url-input"
                        type="url"
                        inputMode="url"
                        placeholder="Paste a link to a post or article…"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && fetchUrl()}
                      />
                      <button
                        className="btn btn-ghost url-fetch"
                        onClick={fetchUrl}
                        disabled={fetchStatus === "loading"}
                      >
                        {fetchStatus === "loading" ? (
                          <span className="loading">
                            <span className="spinner dark" aria-hidden />
                            Fetching…
                          </span>
                        ) : (
                          "Fetch text"
                        )}
                      </button>
                    </div>
                    <p className="source-hint">
                      {fetchStatus === "error" ? (
                        <span className="hint-err">{fetchError}</span>
                      ) : (
                        <>
                          Works for public posts and articles. Live logged-in feeds
                          and posting the fix back need the platform&rsquo;s account
                          connection (OAuth).
                        </>
                      )}
                    </p>
                    <textarea
                      className="editor"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Paste your copy here, upload a file, or fetch a URL above…"
                      spellCheck={false}
                    />
                  </div>
                ) : (
                  <>
                    <p className="doc" key={runId}>
                      <span className="doc-kicker">
                        {total > 0
                          ? `${total} issue${total === 1 ? "" : "s"} found${appliedCount ? ` · ${appliedCount} fixed` : ""}`
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
                    {mode === "result" ? `${appliedCount}/${total} fixed` : "—"}
                  </span>
                </div>

                {mode !== "result" ? (
                  <div className="empty">
                    {status === "error" ? (
                      <p className="empty-err">{error}</p>
                    ) : (
                      <p>
                        Run the check to see where your copy drifts off-brand. Each
                        finding explains the issue and offers a one-click fix.
                      </p>
                    )}
                  </div>
                ) : total === 0 ? (
                  <div className="empty">
                    <p>{result?.summary || "This copy already reads on-brand. Nothing to flag."}</p>
                  </div>
                ) : (
                  <>
                    {result?.summary ? <p className="notes-summary">{result.summary}</p> : null}

                    <div className="notes-actions">
                      <button className="mini mini-apply" onClick={applyAll} disabled={allApplied}>
                        {allApplied ? "All fixes applied" : "Apply all fixes"}
                      </button>
                      <button className="mini" onClick={download} title="Save the corrected text as a file">
                        Download
                      </button>
                      <button className="mini" onClick={copyText} title="Copy the corrected text">
                        Copy
                      </button>
                    </div>
                    {appliedCount > 0 && !allApplied ? (
                      <p className="restale">Fixes applied — re-run the check to refresh the score.</p>
                    ) : null}
                    <ul className="note-list">
                      {result?.findings.map((f, idx) => {
                        const marker = markerByFinding.get(idx);
                        const isApplied = applied.has(idx);
                        return (
                            <div
                                key={`${idx}-${runId}`}
                                className={`note${active === idx ? " is-active" : ""}${isApplied ? " is-applied" : ""}`}
                                style={{ animationDelay: `${0.05 * idx}s` }}
                                onMouseEnter={() => setActive(idx)}
                                onMouseLeave={() => setActive(null)}
                            >
                              <div className="note-top">
                            <span
                                className={`note-marker sev-${f.severity}`}
                                title={`Severity: ${f.severity}`}
                            >
                              {isApplied ? "✓" : (marker ?? "–")}
                            </span>
                                <span className="note-rule" title="Brand rule this breaks">
                              {f.rule}
                            </span>
                                <span className="note-title">{f.title}</span>
                                <span className={`note-sev sev-text-${f.severity}`} title={SEVERITY_HELP[f.severity]}>
                              {f.severity}
                            </span>
                              </div>
                              <p className="note-explain">{f.explanation}</p>
                              <div className="note-rewrite">
                            <span className="arrow" aria-hidden>
                              →
                            </span>
                                <span>{f.rewrite}</span>
                              </div>
                              <div className="note-actions">
                                {isApplied ? (
                                    <span className="applied-tag">✓ Applied in text</span>
                                ) : (
                                    <button
                                        className="mini mini-apply"
                                        onClick={() => applyFinding(idx)}
                                        title="Replace this passage with the on-brand rewrite"
                                    >
                                      Apply rewrite
                                    </button>
                                )}
                              </div>
                            </div>
                        );
                      })}
                    </ul>

                  </>
                )}
              </aside>
            </div>
          </div>
        </section>

        {/* ---------------- how it works ---------------- */}
        <section className="shell how" id="how">
          <span className="eyebrow">How it works</span>
          <ol className="steps">
            <li>
              <span className="step-n">1</span>
              <h3>Bring the copy</h3>
              <p>Type or paste it, upload a .txt / .md file, or fetch a public post or article by URL.</p>
            </li>
            <li>
              <span className="step-n">2</span>
              <h3>Run the check</h3>
              <p>
                Claude reads it against your voice profile and returns an alignment
                score plus every off-brand passage, each with a plain-language reason.
              </p>
            </li>
            <li>
              <span className="step-n">3</span>
              <h3>Fix &amp; ship</h3>
              <p>Apply rewrites in place one at a time or all at once, then download or copy the corrected copy.</p>
            </li>
          </ol>
        </section>

        {/* ---------------- voice definition (the actual rules) ---------------- */}
        <section className="shell voice" id="voice">
          <div className="section-head">
            <div>
              <span className="eyebrow">The voice profile</span>
              <h2>
                These are the rules Tono <em>checks against</em>.
              </h2>
            </div>
            <p>
              One profile you control &mdash; <b>{BRAND_PROFILE.name}</b>. Every finding
              traces back to one of these rules, so nothing the checker flags is a mystery.
            </p>
          </div>
          <div className="voice-grid">
            {BRAND_PROFILE.rules.map((r) => (
              <div className="vcard" key={r.code}>
                <span className="vnum">{r.code}</span>
                <h3>{r.name}</h3>
                <p>{r.summary}</p>
                <div className="vrules">
                  {r.prefer.map((g) => (
                    <span className="vrule good" key={g} title="Prefer this">
                      {g}
                    </span>
                  ))}
                  {r.avoid.map((b) => (
                    <span className="vrule bad" key={b} title="Avoid this">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="legend">
            <span className="legend-item">
              <span className="legend-dot sev-high" /> high &mdash; clearly breaks the voice
            </span>
            <span className="legend-item">
              <span className="legend-dot sev-medium" /> medium &mdash; noticeably off
            </span>
            <span className="legend-item">
              <span className="legend-dot sev-low" /> low &mdash; minor polish
            </span>
          </div>
        </section>
=======
        <Hero />
        <BrandCheckApp />
        <HowItWorks />
        <VoiceProfile />
>>>>>>> f7654f0 (Added Meta API func)
      </main>
      <SiteFooter />
    </>
  );
}
