import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { portalSessionCookie } from "../../../../../../lib/portal-session";
import { terraqoUrl } from "../../../../../../lib/terraqo-api";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: RouteContext) {
  const cookieStore = await cookies();
  const token = cookieStore.get(portalSessionCookie)?.value;
  if (!token) return NextResponse.json({ error: { message: "Tu sesion ha vencido." } }, { status: 401 });

  try {
    const { id } = await params;
    const response = await fetch(terraqoUrl(`/api/public/workspaces/icc-topografia/portal/worklog/${id}/evidence`), {
      method: "POST",
      headers: { accept: "application/json", authorization: `Bearer ${token}` },
      body: await request.formData(),
      cache: "no-store",
    });
    return NextResponse.json(await response.json().catch(() => ({})), { status: response.status });
  } catch {
    return NextResponse.json({ error: { message: "No pudimos cargar las fotos en Portal Terraqo." } }, { status: 502 });
  }
}
