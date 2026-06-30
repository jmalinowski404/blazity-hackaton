import type { SocialApi } from "@/hooks/useSocial";
import type { SocialPost } from "@/lib/types";

type Props = {
  social: SocialApi;
  onPickPost: (post: SocialPost) => void;
  selectedPostId: string | null;
};

export function SocialConnect({ social, onPickPost, selectedPostId }: Props) {
  const { auth, accounts, target, posts, busy, error } = social;

  return (
    <div className="social" id="connect">
      <div className="social-head">
        <div className="social-title">
          <span className="social-ic" aria-hidden>
            ⌁
          </span>
          <div>
            <h3>Channels</h3>
            <p className="social-sub">Pull a live post, fix it, and send the correction back.</p>
          </div>
        </div>
        {auth?.connected ? (
          <button className="mini" onClick={social.logout}>
            Disconnect
          </button>
        ) : null}
      </div>

      <div className="social-body">
        {auth === null ? (
          <p className="social-sub">Checking connection…</p>
        ) : !auth.configured ? (
          <div className="social-note">
            Connecting needs Meta app credentials. Add <code>META_APP_ID</code> and{" "}
            <code>META_APP_SECRET</code> to <code>.env.local</code> and restart the server.
            See <code>README.md</code> for the full setup (redirect URI, scopes, tester role).
          </div>
        ) : !auth.connected ? (
          <div className="social-connect">
            <button className="btn btn-primary" onClick={social.connect}>
              Connect Facebook / Instagram
            </button>
            <p className="social-sub">
              You&rsquo;ll authorize Tono to read and edit posts on Pages you manage.
            </p>
          </div>
        ) : (
          <>
            <p className="social-conn">
              Connected as <b>{auth.name}</b>
            </p>

            {busy === "accounts" ? (
              <p className="social-sub">Loading channels…</p>
            ) : accounts.length === 0 ? (
              <p className="social-sub">
                No Pages found on this account. Tono needs a Facebook Page (and, for
                Instagram, a linked Business account).
              </p>
            ) : (
              <>
                <div className="acct-tabs" role="tablist">
                  {accounts.map((a) => (
                    <button
                      key={a.target}
                      role="tab"
                      aria-selected={target === a.target}
                      className={`acct${target === a.target ? " is-on" : ""}`}
                      onClick={() => social.selectTarget(a.target)}
                    >
                      <span className={`acct-badge ${a.provider}`}>
                        {a.provider === "facebook" ? "FB" : "IG"}
                      </span>
                      {a.name}
                    </button>
                  ))}
                </div>

                {busy === "posts" ? (
                  <p className="social-sub">Loading posts…</p>
                ) : error ? (
                  <p className="empty-err">{error}</p>
                ) : posts.length === 0 ? (
                  <p className="social-sub">No text posts found on this channel.</p>
                ) : (
                  <ul className="post-list">
                    {posts.map((p) => (
                      <li key={p.id}>
                        <button
                          className={`post${selectedPostId === p.id ? " is-on" : ""}`}
                          onClick={() => onPickPost(p)}
                        >
                          <span className="post-text">
                            {p.text.slice(0, 150)}
                            {p.text.length > 150 ? "…" : ""}
                          </span>
                          <span className="post-meta mono">
                            {p.canEdit ? "editable" : "read-only"}
                            {p.timestamp ? ` · ${p.timestamp.slice(0, 10)}` : ""}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
