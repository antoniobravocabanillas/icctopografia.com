import Link from "next/link";
import ServicesCatalog from "../components/ServicesCatalog";
import { getPublicContent } from "../lib/public-content";
import { categoryOrder, serviceCategoryBySlug, topographyServiceSlugs } from "../lib/service-taxonomy";
import { cleanArray, cleanText } from "../lib/text";

export const revalidate = 300;

export default async function ServicesPage() {
  const content = await getPublicContent();
  const services = content.services
    .filter((service) => topographyServiceSlugs.has(service.slug))
    .map((service) => ({
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
    }));
  const featured = services.find((service) => service.featured) || services[0];
  const categories = categoryOrder.filter((category) => services.some((service) => service.category === category));
  const featuredTitleWords = featured.title.split(" ");
  const featuredHighlight = featuredTitleWords.length > 1 ? featuredTitleWords.pop() : "";
  const featuredMainTitle = featuredTitleWords.join(" ");

  return (
    <>
      <section className="services-page-hero">
        <div className="container services-hero-grid">
          <div className="services-hero-copy">
            <p className="eyebrow">Servicio destacado</p>
            <h1>
              {featuredMainTitle} <span>{featuredHighlight}</span>
            </h1>
            <p>{featured.summary}</p>
            <div className="featured-service-metrics" aria-label="Indicadores del servicio destacado">
              <div>
                <span>CM</span>
                <small>Precision</small>
                <strong>+/- 2 cm</strong>
              </div>
              <div>
                <span>24</span>
                <small>Entrega</small>
                <strong>5 - 10 dias</strong>
              </div>
              <div>
                <span>OK</span>
                <small>Control</small>
                <strong>100%</strong>
              </div>
            </div>
            <div className="services-hero-actions">
              <Link className="button primary" href={`/servicios/${featured.slug}/`}>
                Ver detalle del servicio
              </Link>
              <Link className="button ghost" href="/contacto/">
                Solicitar cotizacion
              </Link>
            </div>
          </div>

          <div className="featured-service-visual reveal">
            <Link className="featured-service-image" href={`/servicios/${featured.slug}/`}>
              <img src="/images/obra-construccion.jpg" alt={featured.title} />
              <span className="featured-layer-icon">3D</span>
              <span className="featured-coordinates">
                E 286850.125
                <br />N 8664241.875
                <br />Z 142.670
              </span>
              <b>-&gt;</b>
            </Link>
            <div className="featured-service-proof">
              <div>
                <span>GN</span>
                <p>Levantamientos con drones y GNSS</p>
              </div>
              <div>
                <span>3D</span>
                <p>Modelado 3D y ortofotos</p>
              </div>
              <div>
                <span>CV</span>
                <p>Curvas de nivel y secciones</p>
              </div>
              <div>
                <span>DWG</span>
                <p>Reportes tecnicos y planos DWG</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServicesCatalog services={services} categories={categories} />
    </>
  );
}
