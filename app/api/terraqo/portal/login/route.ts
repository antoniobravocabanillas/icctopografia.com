import { NextResponse } from "next/server";
import { portalSessionCookie } from "../../../../lib/portal-session";
import { terraqoUrl } from "../../../../lib/terraqo-api";

const workspacePath = "/api/public/workspaces/icc-topografia/portal/login";

export async function POST(request: Request) {
  try {
    const response = await fetch(terraqoUrl(workspacePath), {
      method: "POST",
      headers: { accept: "application/json", "content-type": "application/json" },
      body: JSON.stringify(await request.json()),
      cache: "no-store",
    });
    const payload = await response.json().catch(() => ({}));
    const token = payload?.data?.token;
    const result = NextResponse.json(
      token ? { data: { ...payload.data, token: undefined } } : payload,
      { status: response.status },
    );

    if (response.ok && token) {
      result.cookies.set(portalSessionCookie, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: Number(payload.data.expiresIn || 28800),
      });
    }
    return result;
  } catch {
    return NextResponse.json({ error: { message: "No pudimos conectar con Portal Terraqo." } }, { status: 502 });
  }
}
