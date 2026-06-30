import { BRAND_PROFILE } from "@/lib/brand";

export function Hero() {
  return (
    <section className="shell hero">
      <span className="eyebrow">Brand voice · consistency</span>
      <h1>
        Keep every word in <em>your</em> voice.
      </h1>
      <p className="lede">
        Connect a channel or paste copy, run the check, and Tono reads it against
        the voice you&rsquo;ve defined &mdash; marks every place it drifts off-brand,
        explains why, rewrites it back into tune, and posts the fix back.
      </p>
      <div className="hero-meta">
        <span className="chip">
          checks against <b>{BRAND_PROFILE.rules.length} rule groups</b>
        </span>
        <span className="chip">
          powered by <b>Claude</b>
        </span>
        <span className="chip">
          fix in place &middot; <b>repost corrected</b>
        </span>
      </div>
    </section>
  );
}
