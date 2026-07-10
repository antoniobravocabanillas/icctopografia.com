import ProjectCard from "./ProjectCard";
import { featuredProjects } from "../lib/home-data";

export default function ProjectsSection() {
  return (
    <section id="casos-exito" className="section">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Casos de exito</p>
          <h2>Obras y bases tecnicas con componente topografico medible</h2>
        </div>
        <div className="project-grid">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
