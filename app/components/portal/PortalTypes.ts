import type { PortalRole } from "../../lib/portal-data";

export type PortalAccount = {
  id: string;
  role: PortalRole;
  status: "active" | "pending" | "authorized";
  name: string;
  company?: string;
  phone?: string;
  email: string;
  password: string;
  profile: Record<string, string>;
  quotes: Array<{ date?: string; service?: string; scope?: string; status?: string }>;
  createdAt: string;
};

export type PortalMode = "login" | "register";
