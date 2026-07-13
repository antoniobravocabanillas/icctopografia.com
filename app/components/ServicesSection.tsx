import ServiceCard from "./ServiceCard";
import { featuredServices as fallbackFeaturedServices } from "../lib/home-data";

export default function ServicesSection({ featuredServices = fallbackFeaturedServices }: { featuredServices?: typeof fallbackFeaturedServices }) {
  return (
    <section id="servicios" className="section featured-services-section">
      <div className="container featured-services-layout">
        <div className="section-heading featured-services-heading">
          <p className="eyebrow">Servicios</p>
          <h2>Servicios topograficos para levantar, controlar y documentar tu obra</h2>
          <p>
            Mostramos los servicios mas solicitados. En cada ficha veras cuando usarlo, que recibes y como ayuda a
            reducir errores en campo.
          </p>
          <a className="services-all-link" href="/servicios/">
            Ver todos los servicios
          </a>
        </div>
        <div className="service-grid featured-service-grid">
          {featuredServices.map((service, index) => (
            <ServiceCard key={service.slug} service={service} index={index} featured />
          ))}
        </div>
      </div>
    </section>
  );
}
