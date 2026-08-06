export const portalSessionCookie = "icc_portal_session";

export type PortalAccountRole = "professional" | "client" | "admin";

export type PortalDocument = {
  id: string;
  type: "CV" | "DNI_FRONT" | "DNI_BACK" | "CERTIFICATE" | "PROFESSIONAL_LICENSE" | "CRIMINAL_RECORD" | "MEDICAL_EXAM" | "BANK_CERTIFICATE" | "OTHER";
  fileName: string;
  contentType: string;
  size: number;
  reviewStatus: string;
  reviewNote?: string | null;
  uploadedAt: string;
};

export type PortalSession = {
  workspace: { id: string; slug: string; name: string; brandName?: string | null };
  user: { id: string; name: string; email: string; role: string; title?: string | null };
  professional?: {
    id: string;
    headline?: string | null;
    bio?: string | null;
    city?: string | null;
    country?: string | null;
    yearsExperience: number;
    status: string;
    visibility: string;
    professionalCategories: string[];
    specialties: string[];
    equipment: string[];
    software: string[];
    liveCvEnabled: boolean;
    liveCvVisibility: string;
    identityVerificationStatus: string;
    identityVerificationNote?: string | null;
    documents: PortalDocument[];
    affiliations: Array<{
      id: string;
      companyName: string;
      roleTitle?: string | null;
      current: boolean;
      verificationStatus: string;
    }>;
    experiences: Array<{
      id: string;
      title: string;
      companyName?: string | null;
      role?: string | null;
      verifiedByTerraqo: boolean;
      project?: { title: string; slug: string } | null;
    }>;
    applications: Array<{
      id: string;
      status: string;
      professionalCategory: string;
      availabilityNote?: string | null;
      createdAt: string;
      jobPost?: { title: string; slug: string } | null;
    }>;
    worklogs?: Array<{
      id: string;
      title: string;
      summary: string;
      outcome?: string | null;
      type: string;
      evidenceStatus: string;
      visibility: string;
      skills: string[];
      evidenceUrls: string[];
      media: Array<{
        id: string;
        fileName: string;
        contentType: string;
        size: number;
        sortOrder: number;
        createdAt: string;
      }>;
      occurredAt: string;
      project?: { id: string; title: string; slug: string } | null;
      validations: Array<{
        id: string;
        status: string;
        requestedAt: string;
        resolvedAt?: string | null;
        validator: { id: string; name?: string | null; image?: string | null };
      }>;
      _count: { comments: number; reactions: number };
    }>;
  } | null;
  professionalNetwork?: {
    projects: Array<{ id: string; title: string; slug: string }>;
    opportunities: Array<{
      id: string;
      title: string;
      slug: string;
      summary: string;
      location?: string | null;
      modality?: string | null;
      requiredSkills: string[];
      requiredTools: string[];
    }>;
  } | null;
  client?: {
    status: string;
    client: {
      id: string;
      name: string;
      company?: string | null;
      phone?: string | null;
      quotes: Array<{ id: string; number: string; status: string; total: number; currency: string; createdAt: string }>;
      projects: Array<{ id: string; title: string; slug: string; status: string; location?: string | null; updatedAt: string }>;
      user?: {
        orders: Array<{
          id: string;
          status: string;
          total: number;
          currency: string;
          notes?: string | null;
          createdAt: string;
          items: Array<{
            quantity: number;
            unitPrice: number;
            subtotal: number;
            product: { name: string; slug: string; mainImage?: string | null };
          }>;
        }>;
      } | null;
    };
  } | null;
};

const adminRoles = new Set(["admin", "administrator", "owner", "workspace_admin", "super_admin"]);

/**
 * Resolves the portal surface without granting administrator access by default.
 * Profile data takes precedence because Terraqo can return enum roles in upper case.
 */
export function resolvePortalRole(session: PortalSession): PortalAccountRole | null {
  if (session.professional) return "professional";
  if (session.client) return "client";

  const role = String(session.user.role || "").trim().toLowerCase().replaceAll("-", "_");
  if (role === "professional") return "professional";
  if (role === "client") return "client";
  if (adminRoles.has(role)) return "admin";
  return null;
}
