import type { ChangeEvent } from "react";

type Props = {
  text: string;
  onTextChange: (value: string) => void;
  url: string;
  onUrlChange: (value: string) => void;
  onFetch: () => void;
  fetchBusy: boolean;
  fetchError: string | null;
};

export function EditorPane({
  text,
  onTextChange,
  url,
  onUrlChange,
  onFetch,
  fetchBusy,
  fetchError,
}: Props) {
  return (
    <div className="edit-pane">
      <div className="source-bar">
        <input
          className="url-input"
          type="url"
          inputMode="url"
          placeholder="Paste a link to a public post or article…"
          value={url}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onUrlChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onFetch()}
        />
        <button className="btn btn-ghost url-fetch" onClick={onFetch} disabled={fetchBusy}>
          {fetchBusy ? (
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
        {fetchError ? (
          <span className="hint-err">{fetchError}</span>
        ) : (
          <>
            Use the connected channel above for live posts, or paste any public URL.
            Logged-in feeds can&rsquo;t be read by a plain fetch.
          </>
        )}
      </p>
      <textarea
        className="editor"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Paste your copy here, upload a file, fetch a URL, or pull a post from a channel…"
        spellCheck={false}
      />
    </div>
  );
}
