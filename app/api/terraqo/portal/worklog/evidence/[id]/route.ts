import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { portalSessionCookie } from "../../../../../../lib/portal-session";
import { terraqoUrl } from "../../../../../../lib/terraqo-api";

type RouteContext = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request: Request, { params }: RouteContext) {
  const cookieStore = await cookies();
  const token = cookieStore.get(portalSessionCookie)?.value;
  if (!token) return NextResponse.json({ error: { message: "Tu sesion ha vencido." } }, { status: 401 });

  try {
    const { id } = await params;
    const response = await fetch(terraqoUrl(`/api/public/workspaces/icc-topografia/portal/worklog/evidence/${id}`), {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const contentType = response.headers.get("content-type") || "application/octet-stream";
    return new NextResponse(await response.arrayBuffer(), {
      status: response.status,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: { message: "No pudimos cargar esta evidencia." } }, { status: 502 });
  }
}
