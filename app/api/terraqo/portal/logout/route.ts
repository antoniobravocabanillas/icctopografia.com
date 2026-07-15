import { NextResponse } from "next/server";
import { portalSessionCookie } from "../../../../lib/portal-session";

export async function POST() {
  const response = NextResponse.json({ data: { loggedOut: true } });
  response.cookies.delete(portalSessionCookie);
  return response;
}
