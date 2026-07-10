import DetailPage from "../../components/DetailPage";
import { serviceCategoryBySlug, topographyServiceSlugs } from "../../lib/service-taxonomy";
import { terraqoData } from "../../lib/terraqo-data";
import { cleanArray, cleanText } from "../../lib/text";

export function generateStaticParams() {
  return terraqoData.services.filter((service) => topographyServiceSlugs.has(service.slug)).map((service) => ({ slug: service.slug }));
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = topographyServiceSlugs.has(slug) ? terraqoData.services.find((item) => item.slug === slug) : undefined;
  const cleanService = service
    ? {
        ...service,
        title: cleanText(service.title),
        category: serviceCategoryBySlug[service.slug] || cleanText(service.category),
        metric: cleanText(service.metric),
        metricLabel: cleanText(service.metricLabel),
        summary: cleanText(service.summary),
        problem: cleanText(service.problem),
        errorRange: cleanText(service.errorRange),
        caseStudy: cleanText(service.caseStudy),
        applications: cleanArray(service.applications),
        benefits: cleanArray(service.benefits),
        technologies: cleanArray(service.technologies),
        equipment: cleanArray(service.equipment),
        deliverables: cleanArray(service.deliverables),
        process: cleanArray(service.process),
      }
    : service;
  return <DetailPage item={cleanService} type="service" />;
}
