import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { portalSessionCookie } from "../../../../lib/portal-session";
import { terraqoUrl } from "../../../../lib/terraqo-api";

const workspacePath = "/api/public/workspaces/icc-topografia/portal/field-verification";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(portalSessionCookie)?.value;
  if (!token) return NextResponse.json({ error: { message: "No hay una sesion activa." } }, { status: 401 });

  try {
    const response = await fetch(terraqoUrl(workspacePath), {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        "x-terraqo-portal-origin": new URL(request.url).origin,
      },
      body: await request.text(),
      cache: "no-store",
    });
    return NextResponse.json(await response.json().catch(() => ({})), { status: response.status });
  } catch {
    return NextResponse.json({ error: { message: "No pudimos conectar con la validacion segura de Portal Terraqo." } }, { status: 502 });
  }
}
