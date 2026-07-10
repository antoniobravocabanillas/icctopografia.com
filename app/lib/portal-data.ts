export type PortalRole = "client" | "professional" | "admin";

export type PortalField = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "password" | "textarea" | "select" | "file";
  required?: boolean;
  options?: string[];
};

export type PortalProfile = {
  role: PortalRole;
  eyebrow: string;
  title: string;
  summary: string;
  actions: string[];
  button: string;
  locked?: boolean;
};

export const portalProfiles: PortalProfile[] = [
  {
    role: "client",
    eyebrow: "Cliente",
    title: "Empresas y equipos que necesitan cotizar o seguir proyectos",
    summary:
      "Para constructoras, inmobiliarias, contratistas y profesionales que desean solicitar servicios, revisar cotizaciones o dar seguimiento a proyectos activos.",
    actions: [
      "Solicitar cotizaciones",
      "Registrar nuevos requerimientos",
      "Revisar el estado de solicitudes",
      "Consultar proyectos, reportes y entregables disponibles",
    ],
    button: "Crear cuenta como cliente",
  },
  {
    role: "professional",
    eyebrow: "Topografo / Profesional tecnico",
    title: "Especialistas que participan en proyectos tecnicos",
    summary:
      "Para topografos, auxiliares, ingenieros, operadores de drone, dibujantes CAD, especialistas BIM/GIS y personal tecnico vinculado a proyectos.",
    actions: [
      "Registrar informacion profesional",
      "Actualizar datos tecnicos",
      "Participar en proyectos asignados",
      "Cargar evidencias o informacion de campo segun rol",
    ],
    button: "Crear cuenta profesional",
  },
  {
    role: "admin",
    eyebrow: "Administrador",
    title: "Acceso interno autorizado para el equipo ICC Topografia",
    summary:
      "Desde este panel el equipo interno podra gestionar cotizaciones, contactos, solicitudes entrantes, clientes, proyectos, profesionales tecnicos y reportes operativos.",
    actions: ["Cotizaciones", "Contactos y clientes", "Proyectos", "Reportes y seguimiento operativo"],
    button: "Acceder como administrador",
    locked: true,
  },
];

export const clientFields: PortalField[] = [
  { name: "name", label: "Nombre completo", required: true },
  { name: "company", label: "Empresa", required: true },
  { name: "ruc", label: "RUC" },
  { name: "position", label: "Cargo" },
  { name: "email", label: "Correo electronico", type: "email", required: true },
  { name: "phone", label: "Telefono", type: "tel", required: true },
  {
    name: "serviceType",
    label: "Tipo de servicio requerido",
    type: "select",
    required: true,
    options: [
      "Levantamiento topografico",
      "Replanteo y control de obra",
      "Escaneo 3D / LiDAR",
      "Monitoreo y control",
      "Catastro y saneamiento",
      "Otro servicio topografico",
    ],
  },
  { name: "message", label: "Mensaje o descripcion del proyecto", type: "textarea" },
  { name: "password", label: "Contrasena", type: "password", required: true },
  { name: "confirmPassword", label: "Confirmar contrasena", type: "password", required: true },
];

export const professionalFields: PortalField[] = [
  { name: "name", label: "Nombre completo", required: true },
  { name: "email", label: "Correo electronico", type: "email", required: true },
  { name: "phone", label: "Telefono", type: "tel", required: true },
  {
    name: "specialty",
    label: "Especialidad tecnica",
    type: "select",
    required: true,
    options: ["Topografia", "GNSS / Geodesia", "Drone / Fotogrametria", "LiDAR", "CAD", "BIM/GIS", "Control de obra"],
  },
  { name: "experience", label: "Anos de experiencia" },
  { name: "city", label: "Ciudad" },
  { name: "equipment", label: "Equipos que maneja", type: "textarea" },
  { name: "software", label: "Software que utiliza", type: "textarea" },
  { name: "portfolio", label: "CV o portafolio", type: "file" },
  { name: "password", label: "Contrasena", type: "password", required: true },
  { name: "confirmPassword", label: "Confirmar contrasena", type: "password", required: true },
];

export const adminFields: PortalField[] = [
  { name: "email", label: "Correo corporativo", type: "email", required: true },
  { name: "password", label: "Contrasena", type: "password", required: true },
];

export const portalTrustMessages = [
  "Tus datos se usaran solo para gestionar solicitudes, cotizaciones, proyectos y comunicaciones relacionadas con ICC Topografia.",
  "El Portal Terraqo centraliza la comunicacion entre clientes, profesionales y equipo administrativo para ordenar el seguimiento tecnico.",
];
