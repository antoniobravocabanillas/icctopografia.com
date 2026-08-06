import { redirect } from "next/navigation";

const portalUrl = process.env.NEXT_PUBLIC_TERRAQO_PORTAL_URL || "https://portal.terraqoglobal.com";

export default function AccountPage() {
  redirect(`${portalUrl.replace(/\/$/, "")}/cuenta?workspace=icc-topografia`);
}
