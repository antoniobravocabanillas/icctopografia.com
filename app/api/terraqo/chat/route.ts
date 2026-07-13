import { NextResponse } from "next/server";
import { terraqoUrl } from "../../../lib/terraqo-api";

async function relayJson(response: Response) {
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId") || "";
    const response = await fetch(terraqoUrl(`/api/chat?conversationId=${encodeURIComponent(conversationId)}`), {
      headers: { accept: "application/json" },
      cache: "no-store",
    });

    return relayJson(response);
  } catch {
    return NextResponse.json(
      { error: { message: "No pudimos conectar con Portal Terraqo en este momento." } },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const response = await fetch(terraqoUrl("/api/chat"), {
      method: "POST",
      body: formData,
      headers: { accept: "application/json" },
      cache: "no-store",
    });

    return relayJson(response);
  } catch {
    return NextResponse.json(
      { error: { message: "No pudimos iniciar el chat con Terraqo. Intentalo nuevamente." } },
      { status: 502 },
    );
  }
}
