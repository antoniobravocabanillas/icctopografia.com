import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { portalSessionCookie } from "../../../../lib/portal-session";
import { terraqoUrl } from "../../../../lib/terraqo-api";

const path = "/api/public/workspaces/icc-topografia/portal/files";
async function token() { return (await cookies()).get(portalSessionCookie)?.value; }

export async function GET() {
  const value = await token(); if (!value) return NextResponse.json({ error: { message: "Tu sesion ha vencido." } }, { status: 401 });
  try { const response = await fetch(terraqoUrl(path), { headers: { authorization: `Bearer ${value}` }, cache: "no-store" }); return NextResponse.json(await response.json().catch(() => ({})), { status: response.status }); }
  catch { return NextResponse.json({ error: { message: "No pudimos cargar tus archivos." } }, { status: 502 }); }
}

export async function POST(request: Request) {
  const value = await token(); if (!value) return NextResponse.json({ error: { message: "Tu sesion ha vencido." } }, { status: 401 });
  try { const response = await fetch(terraqoUrl(path), { method: "POST", headers: { authorization: `Bearer ${value}` }, body: await request.formData(), cache: "no-store" }); return NextResponse.json(await response.json().catch(() => ({})), { status: response.status }); }
  catch { return NextResponse.json({ error: { message: "No pudimos cargar el archivo." } }, { status: 502 }); }
}
