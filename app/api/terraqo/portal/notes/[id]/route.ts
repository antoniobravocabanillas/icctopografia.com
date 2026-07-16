import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { portalSessionCookie } from "../../../../../lib/portal-session";
import { terraqoUrl } from "../../../../../lib/terraqo-api";

type Context = { params: Promise<{ id: string }> };
async function token() { return (await cookies()).get(portalSessionCookie)?.value; }

export async function PATCH(request: Request, { params }: Context) {
  const value = await token(); if (!value) return NextResponse.json({ error: { message: "Tu sesion ha vencido." } }, { status: 401 });
  const { id } = await params;
  try { const response = await fetch(terraqoUrl(`/api/public/workspaces/icc-topografia/portal/notes/${id}`), { method: "PATCH", headers: { authorization: `Bearer ${value}`, "content-type": "application/json" }, body: await request.text(), cache: "no-store" }); return NextResponse.json(await response.json().catch(() => ({})), { status: response.status }); }
  catch { return NextResponse.json({ error: { message: "No pudimos actualizar la nota." } }, { status: 502 }); }
}

export async function DELETE(_: Request, { params }: Context) {
  const value = await token(); if (!value) return NextResponse.json({ error: { message: "Tu sesion ha vencido." } }, { status: 401 });
  const { id } = await params;
  try { const response = await fetch(terraqoUrl(`/api/public/workspaces/icc-topografia/portal/notes/${id}`), { method: "DELETE", headers: { authorization: `Bearer ${value}` }, cache: "no-store" }); return NextResponse.json(await response.json().catch(() => ({})), { status: response.status }); }
  catch { return NextResponse.json({ error: { message: "No pudimos eliminar la nota." } }, { status: 502 }); }
}
