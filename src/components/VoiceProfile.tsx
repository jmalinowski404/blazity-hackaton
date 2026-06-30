import { BRAND_PROFILE } from "@/lib/brand";

export function VoiceProfile() {
  return (
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
  );
}
