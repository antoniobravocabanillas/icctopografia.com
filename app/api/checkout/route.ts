import { NextResponse } from "next/server";
import { terraqoUrl } from "../../lib/terraqo-api";

const workspacePath = "/api/public/workspaces/icc-topografia/checkout";

export async function POST(request: Request) {
  try {
    const response = await fetch(terraqoUrl(workspacePath), {
      method: "POST",
      headers: { accept: "application/json", "content-type": "application/json" },
      body: JSON.stringify(await request.json()),
      cache: "no-store",
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json(
        { message: payload?.error?.message || "No pudimos registrar el pedido en Terraqo." },
        { status: response.status >= 500 ? 502 : response.status },
      );
    }

    return NextResponse.json(payload?.data || payload, { status: response.status });
  } catch {
    return NextResponse.json({ message: "No pudimos conectar con Terraqo para crear el pedido." }, { status: 502 });
  }
}
