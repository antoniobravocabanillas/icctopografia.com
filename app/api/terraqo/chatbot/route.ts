import { NextResponse } from "next/server";
import { terraqoUrl } from "../../../lib/terraqo-api";

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const response = await fetch(terraqoUrl("/api/chatbot"), {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: { message: "No pudimos conectar con el asistente Terraqo." } },
      { status: 502 },
    );
  }
}
