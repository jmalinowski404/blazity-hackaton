# Architecture

A Next.js (App Router) app is scaffolded; product feature code is not built yet.

## Current layout

- `src/app/` — Next.js App Router entry (`layout.tsx`, `page.tsx`,
  `globals.css`). Add route handlers / server actions here for the brand check.
- `public/` — static assets.
- Config: `next.config.ts`, `tsconfig.json` (`@/*` → `src/*`),
  `eslint.config.mjs`, `postcss.config.mjs` (Tailwind v4).
- `.ai/` — Atlas AI workspace (config, memory, vocabulary, plans, research,
  decisions, results, skills). `.ai/config.json` is the source of truth for
  artifact locations.
- `AGENTS.md` / `CLAUDE.md` — agent instructions. `CLAUDE.md` imports `AGENTS.md`.
- `.agents/`, `.claude/`, `.cursor/` — generated agent surfaces.

## Intended shape

- Next.js + TypeScript web app. Brand-check logic runs **server-side** (route
  handlers / server actions) so the Anthropic API key is never exposed to the
  browser.
- Core flow: client submits copy + brand rules → server calls the Claude API →
  returns flagged off-brand passages and rewrite suggestions → client renders
  them for review/accept.

## Invariants

- The Anthropic API key stays server-side only; it must never reach the client
  bundle.

## Unknowns (fill once code lands)

- Deployment target and runtime
- Module/route boundaries and state handling
- How brand rules are stored/passed (request payload vs. persisted)
