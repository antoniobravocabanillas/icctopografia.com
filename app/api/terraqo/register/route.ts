import { NextResponse } from "next/server";

const terraqoBaseUrl =
  process.env.TERRAQO_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_TERRAQO_API_URL ||
  "https://iridescent-fenglisu-d6595c.netlify.app";

function terraqoUrl(path: string) {
  return `${terraqoBaseUrl.replace(/\/$/, "")}${path}`;
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const response = await fetch(terraqoUrl("/api/auth/register"), {
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
    return NextResponse.json({ ok: false, error: "No se pudo conectar con Portal Terraqo." }, { status: 502 });
  }
}
