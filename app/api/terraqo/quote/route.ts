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
    const formData = new FormData();
    const message = [payload.location ? `Ubicacion: ${payload.location}` : "", payload.scope || ""]
      .filter(Boolean)
      .join("\n\n");

    formData.set("name", payload.name || payload.company || "Cliente ICC Topografia");
    formData.set("email", payload.email || "");
    formData.set("phone", payload.phone || "");
    formData.set("company", payload.company || "");
    formData.set("subject", payload.service || "Solicitud topografica");
    formData.set("message", message || "Solicitud registrada desde Portal Terraqo.");
    formData.set("intent", "portal_cliente");
    formData.set("context", "icctopografia.com/cuenta");

    const response = await fetch(terraqoUrl("/api/quote"), {
      method: "POST",
      body: formData,
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ ok: false, error: "No se pudo registrar la solicitud en Terraqo." }, { status: 502 });
  }
}
