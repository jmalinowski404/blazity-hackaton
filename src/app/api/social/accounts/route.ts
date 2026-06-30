import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { listAccounts, MetaError, TOKEN_COOKIE } from "@/lib/meta";

export async function GET() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "Not connected." }, { status: 401 });

  try {
    const accounts = await listAccounts(token);
    return NextResponse.json({ accounts });
  } catch (e) {
    const status = e instanceof MetaError ? e.status : 502;
    const message = e instanceof MetaError ? e.message : "Couldn't load accounts.";
    return NextResponse.json({ error: message }, { status });
  }
}
