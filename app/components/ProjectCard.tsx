import Link from "next/link";

type ProjectCardProps = {
  project: {
    slug: string;
    title: string;
    sector: string;
    location: string;
    image: string;
    summary: string;
  };
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="project-card reveal">
      <Link href={`/casos-exito/${project.slug}/`}>
        <img src={project.image} alt={project.title} />
        <div>
          <span className="card-meta">
            {project.sector} / {project.location}
          </span>
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
          <span className="text-link">Ver caso de exito</span>
        </div>
      </Link>
    </article>
  );
}
