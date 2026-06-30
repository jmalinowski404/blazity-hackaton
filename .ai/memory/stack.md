# Stack

Scaffolded with `create-next-app` (App Router). Versions current as of setup.

## Installed

- **Language:** TypeScript 5 (strict via `tsconfig.json`), `@/*` import alias.
- **Framework:** Next.js 16 (App Router, `src/` dir), React 19. Build uses
  Turbopack.
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`).
- **Lint:** ESLint 9 with `eslint-config-next`.
- **AI provider:** Claude via the Anthropic SDK (`@anthropic-ai/sdk`). Use the
  latest Claude models; do not answer model/pricing questions from memory.
- **Package manager:** npm (`package-lock.json`).

## Commands

- `npm run dev` — start the dev server.
- `npm run build` — production build (verified passing).
- `npm start` — serve the production build.
- `npm run lint` — ESLint.
- `npx --yes @blazity-atlas/core@latest doctor` — Atlas workspace health.

## Integrations & env vars

- **Claude:** `ANTHROPIC_API_KEY` (server-side, read in `/api/check`). Model
  `claude-opus-4-8` via forced tool use for structured findings.
- **Meta (Facebook/Instagram):** `META_APP_ID`, `META_APP_SECRET` (optional
  `META_REDIRECT_URI`, `META_GRAPH_VERSION` default `v21.0`). Facebook Login
  OAuth + Graph API for reading posts and editing Facebook Page posts. See
  `.env.example` and README for the Meta app setup (redirect URI, scopes,
  tester role).
- Secrets live in `.env.local` (gitignored); never commit keys.

## To confirm

- Whether a test runner is added (none configured yet).
- Production token storage (the Meta user token is currently an httpOnly cookie).
