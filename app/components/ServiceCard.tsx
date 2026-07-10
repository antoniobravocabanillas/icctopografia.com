import Link from "next/link";
import type { CSSProperties } from "react";

const iconPaths = [
  <>
    <path d="M4 10 16 4l12 6-12 6L4 10Z" />
    <path d="M8 14l8 4 8-4" />
    <path d="M8 19l8 4 8-4" />
  </>,
  <>
    <path d="M5 9 16 4l11 5-11 5L5 9Z" />
    <path d="M9 12v7c4 3 10 3 14 0v-7" />
    <path d="M27 9v8" />
  </>,
  <>
    <path d="M9 5h11l5 5v17H9V5Z" />
    <path d="M20 5v6h6" />
    <path d="M13 17h8" />
    <path d="M13 22h6" />
  </>,
  <>
    <path d="M16 6v22" />
    <path d="M8 28h16" />
    <path d="M11 10h10l-2 8h-6l-2-8Z" />
    <path d="M16 2v4" />
    <path d="M12 2h8" />
  </>,
  <>
    <circle cx="16" cy="16" r="7" />
    <path d="M16 2v6" />
    <path d="M16 24v6" />
    <path d="M2 16h6" />
    <path d="M24 16h6" />
  </>,
  <>
    <path d="M8 8h16v10H8V8Z" />
    <path d="M16 18v8" />
    <path d="M10 26h12" />
    <path d="M5 12H2" />
    <path d="M30 12h-3" />
    <path d="M12 5V2" />
    <path d="M20 5V2" />
  </>,
];

type ServiceCardProps = {
  service: {
    slug: string;
    title: string;
    category: string;
    metric: string;
    summary: string;
  };
  index: number;
  featured?: boolean;
};

export default function ServiceCard({ service, index, featured = false }: ServiceCardProps) {
  return (
    <Link
      className={`service-card reveal${featured ? " featured-service-card" : ""}`}
      href={`/servicios/${service.slug}/`}
      style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
      aria-label={`Ver servicio ${service.title}`}
    >
      <svg
        className="service-icon"
        viewBox="0 0 32 32"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {iconPaths[index % iconPaths.length]}
      </svg>
      <span className="service-number">{String(index + 1).padStart(2, "0")}</span>
      <div className="card-meta">
        {service.category} / {service.metric}
      </div>
      <h3>{service.title}</h3>
      <i />
      <p>{service.summary}</p>
      <span className="service-card-link">Ver servicio</span>
    </Link>
  );
}
