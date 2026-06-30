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

## To confirm

- Env var name for the Anthropic API key and how secrets are handled.
- Whether a test runner is added (none configured yet).
