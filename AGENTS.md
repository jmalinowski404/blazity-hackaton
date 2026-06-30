# Project AI Instructions

## What this repo is

`blazity-hackaton` — a hackathon project for the Blazity "AI for Content"
challenge. The product is a **brand/tone consistency** web app: it checks copy
against a brand voice / style guide and flags or rewrites off-brand text. The
stack is a Next.js 16 (App Router) + TypeScript web app using the Claude
(Anthropic) API and Tailwind CSS v4. The app is scaffolded
(`create-next-app`); product feature code is not built yet. See `.ai/memory/`
for stable context.

## Structure

- `.ai/` — Atlas AI workspace. `.ai/config.json` is the source of truth for
  artifact locations (memory, vocabulary, plans, research, decisions, results).
- `AGENTS.md` / `CLAUDE.md` — agent instructions; `CLAUDE.md` imports this file.
- `.agents/`, `.claude/`, `.cursor/` — generated agent surfaces.

## Working rules

- Stack is Next.js 16 (App Router, `src/`) + TypeScript + Tailwind v4, npm.
  Safe commands: `npm run dev`, `npm run build`, `npm start`, `npm run lint`.
- When working with the Claude API, use the latest Claude models and the
  Anthropic SDK (`@anthropic-ai/sdk`); do not answer model/pricing questions
  from memory.
- Keep the Anthropic API key server-side only (route handlers / server
  actions) — it must never reach the client bundle.
- Atlas workspace health: `npx --yes @blazity-atlas/core@latest doctor`.
- Do not edit the `<!-- BEGIN/END ATLAS -->` managed block below by hand.
- Keep durable docs depersonalized (see Atlas Documentation Rules below).

<!-- BEGIN ATLAS: artifact-paths -->
## Atlas Artifact Paths

`.ai/config.json` is the source of truth for AI artifact locations in this repository.
Before writing plans, research, decisions, ADRs, results, memory, vocabulary, or skill outputs, resolve the destination through `artifactRoot`, `paths`, and `pathAliases`.
If an imported skill, template, or instruction mentions a different path, map it through `.ai/config.json` before reading or writing files.
Do not create new documentation roots unless `.ai/config.json` explicitly allows them.

## Atlas Documentation Rules

Durable documentation records needs, decisions, and reasons — never individuals or internal process.
Write "memory was needed to persist context across runs", not "<name> wanted memory".
Keep personal names, private schedules, internal-only references, and absolute local paths out of workspace artifacts.
<!-- END ATLAS: artifact-paths -->
