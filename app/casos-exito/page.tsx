import ProjectCard from "../components/ProjectCard";
import { terraqoData } from "../lib/terraqo-data";
import { cleanText } from "../lib/text";

export default function CasesPage() {
  const projects = terraqoData.projects.map((project) => ({
    ...project,
    title: cleanText(project.title),
    sector: cleanText(project.sector),
    location: cleanText(project.location),
    summary: cleanText(project.summary),
    image: project.image.replace(/^\.\/public\//, "/"),
  }));
  const featured = projects[0];

  return (
    <>
      <section className="cases-hero">
        <div className="container cases-hero-grid">
          <div className="cases-hero-copy">
            <p className="eyebrow">Casos de exito</p>
            <h1>Obras donde la topografia ayudo a decidir con evidencia.</h1>
            <p>
              Proyectos reales con levantamientos, replanteos, control de obra, monitoreo y entregables tecnicos que
              reducen retrabajos y ordenan la toma de decisiones.
            </p>
            <div className="cases-hero-actions">
              <a className="button primary" href="#casos">
                Ver casos topograficos
              </a>
              <a className="button ghost" href="/contacto/">
                Cotizar un proyecto similar
              </a>
            </div>
          </div>
          {featured ? (
            <a className="cases-featured-panel reveal" href={`/casos-exito/${featured.slug}/`}>
              <img src={featured.image} alt={featured.title} />
              <div>
                <p className="eyebrow">Caso destacado</p>
                <h2>{featured.title}</h2>
                <span>{featured.sector}</span>
                <strong>Ver caso -&gt;</strong>
              </div>
            </a>
          ) : null}
        </div>
      </section>

      <section className="section cases-listing" id="casos">
        <div className="container">
          <div className="cases-listing-head">
            <div>
              <p className="eyebrow">Evidencia publicada</p>
              <h2>Casos para comparar alcance, contexto y resultado.</h2>
            </div>
            <div className="cases-proof">
              <span>{projects.length}</span>
              <p>casos migrados con trazabilidad visual y servicios aplicados</p>
            </div>
          </div>
          <div className="project-grid cases-project-grid">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
