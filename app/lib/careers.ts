export const professionalCategories = [
  "Topografia y geodesia",
  "Ingenieria y construccion",
  "Arquitectura y diseno",
  "BIM, CAD y modelado digital",
  "GIS, cartografia y datos territoriales",
  "Drones, fotogrametria y teledeteccion",
  "Mineria, energia e industria",
  "Seguridad, calidad y medio ambiente",
  "Tecnologia, datos y software",
  "Operaciones y logistica",
  "Administracion, finanzas y legal",
  "Comercial, compras y atencion al cliente",
  "Comunicacion, marketing y contenidos",
  "Tecnicos, operadores y oficios especializados",
  "Practicas y primeros empleos",
  "Otra especialidad profesional",
] as const;

export type CareerJob = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  location: string | null;
  modality: string | null;
  requiredSkills: string[];
  requiredTools: string[];
  professionalCategories: string[];
  project: { title: string } | null;
};

export type ProfessionalTaxonomy = {
  category: string;
  equipment: string[];
  software: string[];
};

export type CareersResponse = {
  workspace: { id: string; slug: string; name: string; brandName: string | null };
  categories: string[];
  taxonomies: ProfessionalTaxonomy[];
  acceptsGeneralApplications: boolean;
  jobs: CareerJob[];
};
