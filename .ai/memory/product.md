# Product

Hackathon project for the Blazity "AI for Content" challenge: ship a web app
that uses AI to solve a real content-management pain, judged on clear thinking
over breadth ("does one thing well, demoable, explainable").

## The problem

Teams that produce a lot of copy struggle to keep it **on-brand**: tone, voice,
and style drift across authors and channels, and manual style-guide review is
slow and inconsistent.

## What it does

A **brand/tone consistency** tool. Given a brand voice / style guide and a piece
of copy, the AI checks the copy against the guide, flags off-brand passages, and
proposes on-brand rewrites. The demo focus is doing this one job well — accurate
flagging plus useful rewrites the user can review and accept.

## Direction

- Web app, AI-assisted, single tightly-scoped flow (input copy + brand rules →
  flagged issues + rewrite suggestions).
- Value comes from the quality of the check and rewrite, and from showing the
  AI's reasoning so the user can trust and verify it.

## Unknowns (confirm as the build progresses)

- Specific target users (e.g. solo creators vs. marketing teams vs. agencies)
- How the brand voice is supplied (uploaded guide, example texts, a form, etc.)
- Success criteria for the demo beyond "flags + rewrites work"
- Deploy/runtime target for the demo
