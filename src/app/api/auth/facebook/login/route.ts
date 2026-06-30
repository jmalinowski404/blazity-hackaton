import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { buildAuthUrl, metaConfigured, STATE_COOKIE } from "@/lib/meta";

export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  if (!metaConfigured()) {
    return NextResponse.redirect(`${origin}/?social=not_configured`);
  }

  const state = crypto.randomUUID();
  const jar = await cookies();
  jar.set(STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });

  return NextResponse.redirect(buildAuthUrl(origin, state));
}
