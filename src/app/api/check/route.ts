import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

/* The house voice Tono enforces. This is the "custom prompt with brand
   guidelines" the check runs against. Edit this block to retune the brand. */
const SYSTEM = `You are the brand-voice editor for a company whose house voice is defined below.
You review submitted copy and report every place it drifts off-brand.

# House voice — the brand guidelines you enforce
- Tone: warm, plain-spoken, and confident. Sound like a knowledgeable person, not a press release. No hype, no hard sell.
- Vocabulary: plain verbs over corporate ones. Avoid jargon and buzzwords such as "leverage", "synergy", "utilize", "best-in-class", "empower", "ideate", "stakeholder", "revolutionary", "cutting-edge", "seamless", "game-changing".
- Claims: be specific and concrete. No vague superlatives ("the best", "world-class") and no unverifiable hype.
- Mechanics: sentence case for headings and buttons (not Title Case). One terminal punctuation mark — never "!!!". Use contractions. Prefer short sentences.
- Audience: people doing real content work who value clarity over polish.

# Your task
Given the user's copy, call the report_brand_check tool. For each off-brand passage provide:
- quote: the EXACT, VERBATIM substring copied from the text, character-for-character, so it can be located and highlighted. Keep it short — just the offending phrase.
- rule: a short rule code you assign, e.g. HYPE-02, JARGON-01, CASE-03, WORD-07, VOICE-01.
- title: a 2-4 word label for the issue.
- severity: low, medium, or high.
- rewrite: an on-brand replacement for just that passage.
Also provide:
- score: an integer 0-100 for how well the whole text fits the house voice (100 = perfectly on-brand).
- summary: one short sentence on the overall fit.
Report findings in the order they appear in the text. If the copy is already on-brand, return an empty findings array and a high score.`;

const INPUT_SCHEMA: Anthropic.Tool.InputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: {
      type: "integer",
      description: "0-100, how well the whole text fits the house voice (100 = perfect).",
    },
    summary: { type: "string", description: "One short sentence on the overall fit." },
    findings: {
      type: "array",
      description: "Off-brand passages, in the order they appear in the text.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          quote: {
            type: "string",
            description: "Exact verbatim substring copied from the submitted text.",
          },
          rule: { type: "string", description: "Short rule code, e.g. HYPE-02." },
          title: { type: "string", description: "2-4 word label for the issue." },
          severity: { type: "string", enum: ["low", "medium", "high"] },
          rewrite: { type: "string", description: "On-brand replacement for the quoted passage." },
        },
        required: ["quote", "rule", "title", "severity", "rewrite"],
      },
    },
  },
  required: ["score", "summary", "findings"],
};

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Server is missing ANTHROPIC_API_KEY. Add it to .env.local and restart." },
      { status: 500 },
    );
  }

  let text: unknown;
  try {
    ({ text } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json({ error: "Provide some text to check." }, { status: 400 });
  }
  if (text.length > 50_000) {
    return NextResponse.json(
      { error: "That text is too long to check in one pass (50,000 character limit)." },
      { status: 413 },
    );
  }

  const client = new Anthropic();

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 4096,
      system: SYSTEM,
      tools: [
        {
          name: "report_brand_check",
          description: "Report the brand-voice check: an alignment score plus the off-brand findings.",
          input_schema: INPUT_SCHEMA,
        },
      ],
      tool_choice: { type: "tool", name: "report_brand_check" },
      messages: [{ role: "user", content: text }],
    });

    const block = message.content.find((b) => b.type === "tool_use");
    if (!block || block.type !== "tool_use") {
      return NextResponse.json({ error: "The model did not return a result." }, { status: 502 });
    }

    return NextResponse.json(block.input);
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Claude API error (${err.status ?? "?"}): ${err.message}` },
        { status: 502 },
      );
    }
    return NextResponse.json({ error: "Unexpected error running the check." }, { status: 500 });
  }
}
