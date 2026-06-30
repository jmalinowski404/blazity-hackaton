import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { listPosts, MetaError, TOKEN_COOKIE } from "@/lib/meta";

export async function GET(req: Request) {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "Not connected." }, { status: 401 });

  const target = new URL(req.url).searchParams.get("target");
  if (!target) return NextResponse.json({ error: "Missing target." }, { status: 400 });

  try {
    const posts = await listPosts(token, target);
    return NextResponse.json({ posts });
  } catch (e) {
    const status = e instanceof MetaError ? e.status : 502;
    const message = e instanceof MetaError ? e.message : "Couldn't load posts.";
    return NextResponse.json({ error: message }, { status });
  }
}
