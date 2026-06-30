# Blazity Hackathon: AI for Content

**Ship an AI tool that solves a content problem people actually have.**

📅 Tuesday, 30th June · 🧭 Organised by Blazity

---

## The Challenge

People who work with words, images, or video drown in busywork: reformatting, off brand checking, asset hunting, keeping tone consistent. Exactly the work AI is now good at.

**Build a web app that uses AI to solve a real content management pain.**

"Content" is broad: posts, copy, docs, social, newsletters, subtitles, asset libraries. Pick a pain you understand and make it faster, clearer, or less error prone.

**What we're judging:** how you think, not how much you ship. A small tool that does one thing well and that you can explain and demo beats a sprawl nobody understands. Show that you aimed the AI at the right problem, checked its output, and chose what to build and what to skip.

---

## Getting Started

1. **Fork** this repository to your own GitHub account.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/blazity-hackaton.git
   cd blazity-hackaton
   ```
3. This repo is **already initialised with Atlas**. The `.ai/` workspace, `AGENTS.md`, and `CLAUDE.md` are in place. You don't need to set anything up to start.
4. **Your first task:** point your AI coding agent at the workspace so it adapts to _your_ idea. In Claude Code, run:
   ```
   /atlas:atlas-review
   ```
   Or tell any agent: _"Read `.ai/skills/atlas-setup/SKILL.md` and adapt this workspace to our project."_
5. **Build** with the stack of your choice: any language, any framework. Pick what lets you move fastest.

---

## Using Atlas

Atlas keeps the AI's work understandable and yours: the rules, decisions, and project context live in the repo (in `.ai/`), not buried in a chat history. As you work, your plans, decisions, and lessons accumulate where your agent can find them.

If anything looks off with the workspace, run:

```bash
npx --yes @blazity-atlas/core@latest doctor        # check workspace health
npx --yes @blazity-atlas/core@latest doctor --fix  # apply safe repairs
```

---

## Tono — the app in this repo

Tono is a brand-voice consistency checker. Paste copy, upload a file, fetch a
URL, or pull a live post from a connected social channel; Claude checks it
against a voice profile, flags every off-brand passage with a plain-language
reason and a rewrite, and you apply the fixes in place, then download, copy, or
post the corrected version back.

### Run it

```bash
cp .env.example .env.local   # then fill in ANTHROPIC_API_KEY (and Meta keys for social)
npm install
npm run dev                  # http://localhost:3000
```

`ANTHROPIC_API_KEY` alone enables the full check / fix / download flow. The
"Channels" social connect needs Meta credentials (below).

### Social connect (Facebook & Instagram) setup

1. Create an app at [developers.facebook.com](https://developers.facebook.com/) and add the **Facebook Login** product.
2. Add the OAuth redirect URI `http://localhost:3000/api/auth/facebook/callback` to the app's Valid OAuth Redirect URIs.
3. Put `META_APP_ID` and `META_APP_SECRET` in `.env.local`.
4. While the app is in development, add yourself as a **Tester** or **Admin** so the scopes work without full App Review.
5. The flow requests: `public_profile, pages_show_list, pages_read_engagement, pages_manage_posts, instagram_basic, instagram_content_publish`.

**What works per platform:** Facebook **Page posts** support the full loop —
read → check → fix → **repost the corrected text in place**. Instagram supports
**read + check**, but its API has no endpoint to edit a published caption, so
the corrected caption is offered to **copy** (or publish as a new post) rather
than edited in place. Instagram requires a Business account linked to a Page.

> Tokens are exchanged server-side and stored in an httpOnly cookie; they never
> reach the browser. This is a hackathon demo — use a server session store for
> production.

---

_Good luck, and build something real._
