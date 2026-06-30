import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { MetaError, repost, TOKEN_COOKIE } from "@/lib/meta";

export async function POST(req: Request) {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "Not connected." }, { status: 401 });

  let body: { target?: string; postId?: string; text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { target, postId, text } = body;
  if (!target || !postId || typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "Missing target, postId, or text." }, { status: 400 });
  }

  try {
    await repost(token, target, postId, text);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const status = e instanceof MetaError ? e.status : 502;
    const message = e instanceof MetaError ? e.message : "Couldn't update the post.";
    return NextResponse.json({ error: message }, { status });
  }
}
