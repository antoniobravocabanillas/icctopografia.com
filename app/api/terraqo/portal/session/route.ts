import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { portalSessionCookie } from "../../../../lib/portal-session";
import { terraqoUrl } from "../../../../lib/terraqo-api";

const workspacePath = "/api/public/workspaces/icc-topografia/portal/session";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(portalSessionCookie)?.value;
  if (!token) return NextResponse.json({ error: { message: "No hay una sesion activa." } }, { status: 401 });

  try {
    const response = await fetch(terraqoUrl(workspacePath), {
      headers: { accept: "application/json", authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const payload = await response.json().catch(() => ({}));
    const result = NextResponse.json(payload, { status: response.status });
    if (response.status === 401) result.cookies.delete(portalSessionCookie);
    return result;
  } catch {
    return NextResponse.json({ error: { message: "No pudimos consultar tu perfil en Portal Terraqo." } }, { status: 502 });
  }
}
