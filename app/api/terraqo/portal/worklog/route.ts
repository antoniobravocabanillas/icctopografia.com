import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { portalSessionCookie } from "../../../../lib/portal-session";
import { terraqoUrl } from "../../../../lib/terraqo-api";

const workspacePath = "/api/public/workspaces/icc-topografia/portal/worklog";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(portalSessionCookie)?.value;
  if (!token) return NextResponse.json({ error: { message: "Tu sesion ha vencido." } }, { status: 401 });

  try {
    const response = await fetch(terraqoUrl(workspacePath), {
      method: "POST",
      headers: { accept: "application/json", authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: await request.text(),
      cache: "no-store",
    });
    return NextResponse.json(await response.json().catch(() => ({})), { status: response.status });
  } catch {
    return NextResponse.json({ error: { message: "No pudimos registrar tu bitacora en Portal Terraqo." } }, { status: 502 });
  }
}
