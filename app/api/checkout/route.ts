import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload?.items?.length || !payload?.customer?.email || !payload?.customer?.phone) {
    return NextResponse.json({ message: "Pedido incompleto." }, { status: 400 });
  }

  const id = `ICC-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  return NextResponse.json({
    ok: true,
    id,
    workspaceSlug: payload.workspaceSlug || "icc-topografia",
    note: "Pedido consultivo recibido. Pendiente conectar persistencia directa a Terraqo Orders API por workspace.",
  });
}
