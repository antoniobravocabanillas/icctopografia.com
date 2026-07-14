import { NextResponse } from "next/server";
import { terraqoUrl } from "../../../lib/terraqo-api";

const careersPath = "/api/public/workspaces/icc-topografia/careers";

async function relay(response: Response) {
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}

export async function GET() {
  try {
    const response = await fetch(terraqoUrl(careersPath), {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    return relay(response);
  } catch {
    return NextResponse.json(
      { error: { message: "No pudimos consultar las convocatorias de Portal Terraqo." } },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    const isMultipart = contentType.includes("multipart/form-data");
    const payload = isMultipart ? await request.formData() : JSON.stringify(await request.json());
    const response = await fetch(terraqoUrl(careersPath), {
      method: "POST",
      headers: {
        accept: "application/json",
        ...(isMultipart ? {} : { "content-type": "application/json" }),
      },
      body: payload,
      cache: "no-store",
    });
    return relay(response);
  } catch {
    return NextResponse.json(
      { error: { message: "No pudimos registrar tu postulacion en Portal Terraqo." } },
      { status: 502 },
    );
  }
}
