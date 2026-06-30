"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useBrandCheck } from "@/hooks/useBrandCheck";
import { useSocial } from "@/hooks/useSocial";
import { BRAND_PROFILE } from "@/lib/brand";
import type { SocialPost, SocialProvider } from "@/lib/types";
import { VoiceMeter } from "@/components/VoiceMeter";
import { EditorPane } from "@/components/EditorPane";
import { AnnotatedDoc } from "@/components/AnnotatedDoc";
import { FindingsPanel, type RepostCtx } from "@/components/FindingsPanel";
import { SocialConnect } from "@/components/SocialConnect";
import { Toast } from "@/components/Toast";

type Selected = {
  provider: SocialProvider;
  target: string;
  postId: string;
  permalink?: string;
  canEdit: boolean;
};

export function BrandCheckApp() {
  const bc = useBrandCheck();
  const social = useSocial();

  const [url, setUrl] = useState("");
  const [fetchBusy, setFetchBusy] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Selected | null>(null);
  const [repostBusy, setRepostBusy] = useState(false);
  const [repostDone, setRepostDone] = useState(false);

  useEffect(() => {
    void social.refreshStatus();
    const s = new URLSearchParams(window.location.search).get("social");
    if (s) {
      const msg =
        s === "connected"
          ? "Connected"
          : s === "denied"
            ? "Connection cancelled"
            : s === "not_configured"
              ? "Add Meta credentials in .env.local to connect"
              : "Connection failed";
      bc.flash(msg);
      window.history.replaceState({}, "", window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchUrl() {
    if (!url.trim() || fetchBusy) return;
    setFetchBusy(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/fetch", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Couldn't fetch that URL.");
      bc.loadText(data.text as string, (data.source as string) || "fetched.txt");
      setSelected(null);
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : "Couldn't fetch that URL.");
    } finally {
      setFetchBusy(false);
    }
  }

  function onUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      file.text().then((t) => {
        bc.loadText(t, file.name);
        setSelected(null);
      });
    }
    e.target.value = "";
  }

  function pickPost(post: SocialPost) {
    bc.loadText(post.text, `${post.provider}-${post.id}.txt`);
    if (social.target) {
      setSelected({
        provider: post.provider,
        target: social.target,
        postId: post.id,
        permalink: post.permalink,
        canEdit: post.canEdit,
      });
    }
    setRepostDone(false);
    document.getElementById("proof")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function doRepost() {
    if (!selected) return;
    setRepostBusy(true);
    try {
      await social.repost(selected.target, selected.postId, bc.text);
      setRepostDone(true);
      bc.flash("Reposted corrected version");
    } catch (e) {
      bc.flash(e instanceof Error ? e.message : "Repost failed");
    } finally {
      setRepostBusy(false);
    }
  }

  const score = bc.result?.score ?? null;
  const repost: RepostCtx = selected
    ? {
        canEdit: selected.canEdit,
        providerLabel: selected.provider === "facebook" ? "Facebook" : "Instagram",
        permalink: selected.permalink,
        busy: repostBusy,
        done: repostDone,
        onRepost: doRepost,
      }
    : null;

  return (
    <>
      <section className="shell social-section">
        <SocialConnect social={social} onPickPost={pickPost} selectedPostId={selected?.postId ?? null} />
      </section>

      <section className="shell" id="proof">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-file">
              <span className="doticon" aria-hidden />
              <div style={{ minWidth: 0 }}>
                <div className="name">{bc.fileName}</div>
                <div className="sub">
                  {bc.mode === "result"
                    ? `checked against “${BRAND_PROFILE.name}”`
                    : "draft · not yet checked"}
                </div>
              </div>
            </div>

            <VoiceMeter score={score} runId={bc.runId} />

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
              {bc.mode === "result" ? (
                <button className="btn btn-ghost" onClick={() => bc.setMode("edit")}>
                  Edit text
                </button>
              ) : null}
              <button className="btn btn-primary" onClick={bc.runCheck} disabled={bc.status === "loading"}>
                {bc.status === "loading" ? (
                  <span className="loading">
                    <span className="spinner" aria-hidden />
                    Checking…
                  </span>
                ) : bc.mode === "result" ? (
                  "↻ Re-run check"
                ) : (
                  "Run brand check"
                )}
              </button>
            </div>
          </div>

          <div className="panel-body">
            <div className="doc-wrap">
              {bc.mode === "edit" ? (
                <EditorPane
                  text={bc.text}
                  onTextChange={bc.setText}
                  url={url}
                  onUrlChange={setUrl}
                  onFetch={fetchUrl}
                  fetchBusy={fetchBusy}
                  fetchError={fetchError}
                />
              ) : (
                <AnnotatedDoc
                  segments={bc.annotation.segments}
                  total={bc.result?.findings.length ?? 0}
                  appliedCount={bc.applied.size}
                  active={bc.active}
                  onActive={bc.setActive}
                  runId={bc.runId}
                />
              )}
            </div>

            <FindingsPanel
              mode={bc.mode}
              status={bc.status}
              error={bc.error}
              result={bc.result}
              applied={bc.applied}
              markerByFinding={bc.annotation.markerByFinding}
              active={bc.active}
              onActive={bc.setActive}
              onApply={bc.applyFinding}
              onApplyAll={bc.applyAll}
              onDownload={bc.download}
              onCopy={bc.copyText}
              repost={repost}
            />
          </div>
        </div>
      </section>

      <Toast message={bc.toast} />
    </>
  );
}
