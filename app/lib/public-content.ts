import { clients, featuredProjects, featuredServices } from "./home-data";
import { terraqoData } from "./terraqo-data";
import { terraqoBaseUrl } from "./terraqo-api";

type PublicContent = typeof terraqoData & {
  clients?: typeof clients;
};

const contentUrl =
  process.env.TERRAQO_PUBLIC_CONTENT_URL ||
  `${terraqoBaseUrl.replace(/\/$/, "")}/api/public/icc-topografia/content`;

const fallbackContent: PublicContent = {
  ...terraqoData,
  clients,
};

function usableContent(value: unknown): value is PublicContent {
  const content = value as PublicContent;
  return Boolean(content && Array.isArray(content.services) && Array.isArray(content.projects) && Array.isArray(content.products));
}

export async function getPublicContent(): Promise<PublicContent> {
  try {
    const response = await fetch(contentUrl, {
      next: { revalidate: 300 },
      headers: { accept: "application/json" },
    });

    if (!response.ok) return fallbackContent;

    const payload = await response.json();
    const content = payload?.data;
    return usableContent(content) ? { ...fallbackContent, ...content } : fallbackContent;
  } catch {
    return fallbackContent;
  }
}

export async function getHomeContent() {
  const content = await getPublicContent();
  return {
    clients: content.clients?.length ? content.clients : clients,
    featuredServices: content.services.filter((service: any) => service.featured).slice(0, 4).length
      ? content.services.filter((service: any) => service.featured).slice(0, 4)
      : featuredServices,
    featuredProjects: content.projects.filter((project: any) => project.featured).slice(0, 6).length
      ? content.projects.filter((project: any) => project.featured).slice(0, 6)
      : featuredProjects,
    products: content.products,
    categories: content.categories,
  };
}
