import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { portalSessionCookie } from "../../../../../lib/portal-session";
import { terraqoUrl } from "../../../../../lib/terraqo-api";

type RouteContext = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: RouteContext) {
  const token = (await cookies()).get(portalSessionCookie)?.value;
  if (!token) return NextResponse.json({ error: { message: "No hay una sesion activa." } }, { status: 401 });

  const { id } = await params;
  const inline = new URL(request.url).searchParams.get("inline") === "1";
  try {
    const response = await fetch(terraqoUrl(`/api/public/workspaces/icc-topografia/portal/documents/${id}${inline ? "?inline=1" : ""}`), {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      return NextResponse.json(payload, { status: response.status });
    }

    const result = new NextResponse(await response.arrayBuffer(), { status: 200 });
    ["content-type", "content-disposition", "cache-control", "x-content-type-options", "content-security-policy"].forEach((name) => {
      const value = response.headers.get(name);
      if (value) result.headers.set(name, value);
    });
    return result;
  } catch {
    return NextResponse.json({ error: { message: "No pudimos recuperar el documento privado." } }, { status: 502 });
  }
}
