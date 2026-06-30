export function HowItWorks() {
  return (
    <section className="shell how" id="how">
      <span className="eyebrow">How it works</span>
      <ol className="steps">
        <li>
          <span className="step-n">1</span>
          <h3>Bring the copy</h3>
          <p>
            Connect Facebook or Instagram and pull a real post, upload a .txt / .md
            file, paste text, or fetch a public URL.
          </p>
        </li>
        <li>
          <span className="step-n">2</span>
          <h3>Run the check</h3>
          <p>
            Claude reads it against your voice profile and returns an alignment score
            plus every off-brand passage, each with a plain-language reason.
          </p>
        </li>
        <li>
          <span className="step-n">3</span>
          <h3>Fix &amp; repost</h3>
          <p>
            Apply rewrites in place, then post the corrected version back to a
            Facebook Page — or download / copy it for anywhere else.
          </p>
        </li>
      </ol>
    </section>
  );
}
