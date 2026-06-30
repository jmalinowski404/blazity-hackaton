import type { Finding } from "@/lib/types";

export type Match = { start: number; end: number; idx: number; n: number };

/* Locate each finding's verbatim quote in the working text and split the
   document into plain + flagged segments. Findings in `skip` (already applied)
   are not highlighted. Findings whose quote can't be located are simply not
   matched — they still appear in the margin list. */
export function annotate(text: string, findings: Finding[], skip: Set<number>) {
  const matches: Match[] = [];
  findings.forEach((f, idx) => {
    if (skip.has(idx) || !f.quote) return;
    let from = 0;
    while (from <= text.length) {
      const at = text.indexOf(f.quote, from);
      if (at === -1) break;
      const end = at + f.quote.length;
      const overlaps = matches.some((m) => at < m.end && end > m.start);
      if (!overlaps) {
        matches.push({ start: at, end, idx, n: 0 });
        break;
      }
      from = at + 1;
    }
  });
  matches.sort((a, b) => a.start - b.start);
  matches.forEach((m, i) => (m.n = i + 1));

  const segments: { text: string; match?: Match }[] = [];
  let cur = 0;
  for (const m of matches) {
    if (m.start > cur) segments.push({ text: text.slice(cur, m.start) });
    segments.push({ text: text.slice(m.start, m.end), match: m });
    cur = m.end;
  }
  if (cur < text.length) segments.push({ text: text.slice(cur) });

  const markerByFinding = new Map<number, number>();
  matches.forEach((m) => markerByFinding.set(m.idx, m.n));
  return { segments, markerByFinding };
}

export function correctedName(name: string): string {
  const dot = name.lastIndexOf(".");
  if (dot <= 0) return `${name}-corrected.txt`;
  return `${name.slice(0, dot)}-corrected${name.slice(dot)}`;
}
