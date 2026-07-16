import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { portalSessionCookie } from "../../../../../lib/portal-session";
import { terraqoUrl } from "../../../../../lib/terraqo-api";

type Context = { params: Promise<{ id: string }> };
async function token() { return (await cookies()).get(portalSessionCookie)?.value; }

export async function GET(request: Request, { params }: Context) {
  const value = await token(); if (!value) return NextResponse.json({ error: { message: "Tu sesion ha vencido." } }, { status: 401 });
  const { id } = await params; const inline = new URL(request.url).searchParams.get("inline") === "1";
  try {
    const response = await fetch(terraqoUrl(`/api/public/workspaces/icc-topografia/portal/files/${id}${inline ? "?inline=1" : ""}`), { headers: { authorization: `Bearer ${value}` }, cache: "no-store" });
    if (!response.ok) return NextResponse.json(await response.json().catch(() => ({})), { status: response.status });
    const result = new NextResponse(await response.arrayBuffer(), { status: 200 });
    ["content-type", "content-disposition", "cache-control", "x-content-type-options", "content-security-policy"].forEach((name) => { const header = response.headers.get(name); if (header) result.headers.set(name, header); });
    return result;
  } catch { return NextResponse.json({ error: { message: "No pudimos recuperar el archivo." } }, { status: 502 }); }
}

export async function DELETE(_: Request, { params }: Context) {
  const value = await token(); if (!value) return NextResponse.json({ error: { message: "Tu sesion ha vencido." } }, { status: 401 });
  const { id } = await params;
  try { const response = await fetch(terraqoUrl(`/api/public/workspaces/icc-topografia/portal/files/${id}`), { method: "DELETE", headers: { authorization: `Bearer ${value}` }, cache: "no-store" }); return NextResponse.json(await response.json().catch(() => ({})), { status: response.status }); }
  catch { return NextResponse.json({ error: { message: "No pudimos eliminar el archivo." } }, { status: 502 }); }
}
