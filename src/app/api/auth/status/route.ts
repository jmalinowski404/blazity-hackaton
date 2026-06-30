import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getMe, metaConfigured, TOKEN_COOKIE } from "@/lib/meta";
import type { AuthStatus } from "@/lib/types";

export async function GET() {
  const configured = metaConfigured();
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;

  if (!configured || !token) {
    return NextResponse.json<AuthStatus>({ configured, connected: false });
  }

  try {
    const me = await getMe(token);
    return NextResponse.json<AuthStatus>({ configured, connected: true, name: me.name });
  } catch {
    // token expired or revoked
    return NextResponse.json<AuthStatus>({ configured, connected: false });
  }
}
