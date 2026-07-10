import Image from "next/image";
import Link from "next/link";

const heroOrbitItems = [
  {
    href: "/servicios/control-geometrico-de-obras/",
    icon: "CM",
    title: "Mediciones precisas",
    detail: "para evitar retrabajos",
  },
  {
    href: "/servicios/escaneo-laser-3d-lidar-terrestre/",
    icon: "3D",
    title: "Escaneo 3D y drones",
    detail: "para terrenos y avances",
  },
  {
    href: "/metodo-icc/",
    icon: "OK",
    title: "Control de obra",
    detail: "ejes, niveles y avances",
  },
  {
    href: "/servicios/entrega-y-productos-digitales/",
    icon: "PDF",
    title: "Reportes claros",
    detail: "planos y evidencia para decidir",
  },
];

const heroMetrics = [
  {
    icon: "+",
    title: "Precision",
    detail: "Equipos calibrados y procesos certificados.",
  },
  {
    icon: "::",
    title: "Escaneo 3D",
    detail: "Registro digital del terreno y avance de obra.",
  },
  {
    icon: "OK",
    title: "Entrega clara",
    detail: "Planos, reportes y evidencia listos para usar.",
  },
  {
    icon: "24",
    title: "Cumplimos plazos",
    detail: "Planificacion rigurosa y logistica para cada proyecto.",
  },
];

export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <Image
        className="hero-image"
        src="/images/hero-topografia.jpg"
        alt="Trabajo topografico en obra"
        fill
        priority
        sizes="100vw"
      />
      <div className="hero-overlay" />
      <div className="container hero-content">
        <p className="eyebrow">Topografia de precision para obras e infraestructura</p>
        <h1>Datos metricos confiables para decidir en campo sin retrabajos</h1>
        <p className="hero-copy">
          Levantamiento topografico, escaneo 3D, control de obra, monitoreo y cartografia con entregables claros,
          precision verificable y trazabilidad tecnica para proyectos en Peru.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#cotizar">
            Cotizar servicio topografico
          </a>
          <a className="button secondary" href="/servicios/">
            Ver servicios topograficos
          </a>
        </div>

        <div className="hero-orbit" aria-label="Capacidades topograficas principales">
          {heroOrbitItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span className="hero-orbit-icon">{item.icon}</span>
              <strong>{item.title}</strong>
              <small>{item.detail}</small>
              <b>-&gt;</b>
            </Link>
          ))}
        </div>
      </div>

      <div className="hero-metrics" aria-label="Diferenciales ICC Topografia">
        {heroMetrics.map((item) => (
          <div key={item.title}>
            <span>{item.icon}</span>
            <strong>{item.title}</strong>
            <small>{item.detail}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
