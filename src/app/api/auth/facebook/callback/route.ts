import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCode, getLongLivedToken, MetaError, STATE_COOKIE, TOKEN_COOKIE } from "@/lib/meta";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const err = url.searchParams.get("error");

  const jar = await cookies();
  const expectedState = jar.get(STATE_COOKIE)?.value;
  jar.delete(STATE_COOKIE);

  if (err) {
    // user denied or Meta returned an error
    return NextResponse.redirect(`${origin}/?social=denied`);
  }
  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(`${origin}/?social=bad_state`);
  }

  try {
    const shortToken = await exchangeCode(origin, code);
    const longToken = await getLongLivedToken(shortToken).catch(() => shortToken);
    jar.set(TOKEN_COOKIE, longToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 24 * 60 * 60, // ~60 days
    });
    return NextResponse.redirect(`${origin}/?social=connected#proof`);
  } catch (e) {
    const msg = e instanceof MetaError ? e.message : "auth_failed";
    return NextResponse.redirect(`${origin}/?social=error&reason=${encodeURIComponent(msg)}`);
  }
}
