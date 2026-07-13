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
  quotes: Array<{ id?: string; date?: string; service?: string; scope?: string; location?: string; status?: string }>;
  createdAt: string;
};

export type PortalMode = "login" | "register";
