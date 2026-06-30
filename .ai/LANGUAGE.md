# Project Vocabulary

Use this file to define canonical product and codebase terms for AI agents.

## Terms

| Term | Meaning | Avoid |
| --- | --- | --- |
| Brand voice | The defined personality and style a brand's copy should express (tone, word choices, do's/don'ts). The reference the tool checks against. | "branding", "vibe" |
| Style guide | The concrete, written rules that encode the brand voice (terminology, grammar, tone rules) supplied to the tool. | "guidelines" (when meaning the formal doc) |
| Copy | The user-submitted text being checked. | "content" (too broad — reserve for the challenge theme), "document" |
| Off-brand | Copy that violates the brand voice / style guide. | "wrong", "bad" |
| Flag | An identified off-brand passage the tool surfaces, with the rule it breaks. | "error", "warning" |
| Rewrite | An on-brand replacement the tool proposes for a flagged passage. | "fix", "correction" |
| Brand check | The end-to-end operation: copy + style guide → flags + rewrites. | "scan", "analysis" |

