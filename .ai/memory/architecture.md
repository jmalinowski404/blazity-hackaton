# Architecture

"Tono" — a Next.js (App Router) brand-voice checker. The check, file/URL
ingestion, and social connect (Facebook/Instagram) flows are built.

## Layout

- `src/app/` — App Router. `page.tsx` is a thin server component composing
  presentational sections + the client island. `layout.tsx`, `globals.css`.
- `src/app/api/` — route handlers (all server-side):
  - `check/` — POST copy → Claude (forced tool use) → `{score, summary, findings[]}`.
  - `fetch/` — POST a public URL → extracted readable text (SSRF-guarded).
  - `auth/facebook/login` + `callback`, `auth/status`, `auth/logout` — Meta OAuth.
  - `social/accounts`, `social/posts`, `social/repost` — Graph API read/edit.
- `src/components/` — UI split into focused components (Topbar, Hero,
  VoiceMeter, EditorPane, AnnotatedDoc, FindingCard, FindingsPanel,
  SocialConnect, HowItWorks, VoiceProfile, SiteFooter, Toast, BrandCheckApp).
  `BrandCheckApp` is the single client orchestrator.
- `src/hooks/` — `useBrandCheck` (text/check/apply/download state),
  `useSocial` (auth/accounts/posts/repost).
- `src/lib/` — `brand.ts` (the voice profile + system-prompt builder, the single
  source of truth shared by the API and the UI), `types.ts`, `annotate.ts`
  (quote→highlight matching), `meta.ts` (server-only Graph API helpers).
- `.ai/` Atlas workspace; `AGENTS.md`/`CLAUDE.md`; `.agents/`,`.claude/`,`.cursor/`.

## Core flow

Client (BrandCheckApp) sends copy to `/api/check`; Claude returns findings with
verbatim quotes; the UI locates each quote in the text and renders inline
highlights tied to margin notes; the user applies rewrites in place, then
downloads/copies, or — for a connected Facebook Page post — reposts the
corrected text via `/api/social/repost`.

## Invariants

- The Anthropic API key and Meta tokens stay **server-side only**. The Meta user
  token lives in an httpOnly cookie; per-page tokens are re-resolved server-side
  on each request and never sent to the client.
- The brand profile in `src/lib/brand.ts` is the one source of truth — the
  system prompt and the on-screen guidelines are both built from it.

## Platform constraint

- Facebook Page posts are editable via Graph API (full repost loop). Instagram
  has no caption-edit endpoint — corrected IG captions are copy/new-post only.

## Unknowns

- Deployment target/runtime; production token storage (currently cookie-only).
- Whether brand profiles become user-editable / multi-profile.
