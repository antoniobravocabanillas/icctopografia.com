import type { CSSProperties } from "react";

export default function AboutPage() {
  return (
    <>
      <section className="section about-section about-page">
        <div className="about-field" aria-hidden="true" />
        <div className="container about-layout">
          <div className="about-copy">
            <p className="eyebrow">Sobre ICC Topografia</p>
            <h1>Topografia de precision para proyectos que necesitan control, evidencia y respuesta tecnica.</h1>
            <p>
              ICC Topografia es la unidad especializada del ecosistema ICC para topografia, geodesia y control tecnico
              en obra. La operacion topografica se concentra ahora en ICC Topografia. ICC GROUP atiende los servicios de
              ingenieria, construccion y consultoria que no son topografia, y Terraqo actua como proveedor tecnologico y
              workspace operativo para clientes, proyectos, datos y seguimiento.
            </p>
            <div className="about-proof-grid">
              <div>
                <span>Equipos</span>
                <strong>Tecnologia propia de alta precision</strong>
              </div>
              <div>
                <span>Equipo</span>
                <strong>Profesionales con alta capacidad de respuesta</strong>
              </div>
              <div>
                <span>Frentes</span>
                <strong>Decenas de obras atendidas en simultaneo</strong>
              </div>
            </div>
            <div className="about-actions">
              <a className="button primary" href="/contacto/">
                Solicitar cotizacion
              </a>
              <a className="button ink" href="/casos-exito/">
                Ver casos tecnicos
              </a>
            </div>
          </div>
          <div className="about-system" aria-label="Evolucion y enfoque tecnico de ICC Topografia">
            <div className="about-photo reveal">
              <img src="/images/ingenieria-campo.jpg" alt="Revision de planos y control tecnico topografico" />
              <div>
                <span>Control de proyecto</span>
                <strong>No solo medimos terrenos. Ayudamos a controlar proyectos.</strong>
              </div>
            </div>
            <div className="about-evolution reveal" style={{ "--reveal-delay": "120ms" } as CSSProperties}>
              <article>
                <span>01</span>
                <strong>ICC Topografia</strong>
                <small>Marca especializada que concentra la operacion topografica del ecosistema ICC.</small>
              </article>
              <article>
                <span>02</span>
                <strong>ICC GROUP</strong>
                <small>Ingenieria, construccion y consultoria dentro del ecosistema ICC.</small>
              </article>
              <article>
                <span>03</span>
                <strong>Terraqo</strong>
                <small>Proveedor tecnologico y workspace operativo para datos, clientes y proyectos.</small>
              </article>
            </div>
            <div className="about-contrast reveal" style={{ "--reveal-delay": "220ms" } as CSSProperties}>
              <div>
                <small>Topografia tradicional</small>
                <strong>Medicion aislada y entrega sin contexto</strong>
              </div>
              <div>
                <small>ICC Topografia</small>
                <strong>Informacion tecnica para decidir, ejecutar y corregir</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-capacity">
        <div className="container capacity-layout">
          <div className="capacity-copy">
            <p className="eyebrow">Capacidad operativa</p>
            <h2>Respuesta rapida para multiples frentes, con equipos propios y profesionales especializados.</h2>
            <p>
              Contamos con tecnologia topografica propia de alta precision y un equipo tecnico preparado para responder
              con agilidad en campo y gabinete. Esta combinacion nos permite atender obras en paralelo, coordinar
              distintos frentes de trabajo y sostener entregables confiables aun cuando el proyecto exige velocidad.
            </p>
          </div>
          <div className="capacity-board" aria-label="Capacidad operativa de ICC Topografia">
            {[
              ["01", "Equipos propios", "Instrumentacion topografica, tecnologia LiDAR, GNSS y herramientas de control para operar sin depender de terceros en cada frente critico."],
              ["02", "Profesionales de respuesta", "Equipo tecnico con experiencia en campo, lectura de obra y coordinacion directa con residentes, ingenieria, compras y gerencia."],
              ["03", "Obras simultaneas", "Actualmente atendemos decenas de obras en simultaneo, en distintos rubros, con especial fortaleza en construccion e inmobiliaria."],
            ].map(([number, title, text], index) => (
              <article className="reveal" style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties} key={number}>
                <span>{number}</span>
                <strong>{title}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-trust">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Por que confiar</p>
            <h2>Una unidad pensada para obra, ingenieria y decisiones de campo.</h2>
            <p>
              No vendemos solo levantamientos. Organizamos informacion metrica para que el cliente pueda avanzar con
              menos incertidumbre, menos retrabajo y mayor control tecnico.
            </p>
          </div>
          <div className="about-trust-grid">
            {[
              ["01", "Precision verificable", "Definimos metodologia, equipos, rango de error y entregables segun el alcance real del proyecto."],
              ["02", "Experiencia en campo", "Trabajamos con lectura operativa de obra: accesos, tiempos, seguridad, compatibilidad y coordinacion."],
              ["03", "Respuesta B2B", "Atendemos requerimientos tecnicos con comunicacion clara para equipos de obra, compras e ingenieria."],
              ["04", "Solucion integral", "Levantamiento, replanteo, control, LiDAR, monitoreo, cartografia y entregables digitales."],
              ["05", "Trazabilidad tecnica", "Ordenamos datos, evidencia y reportes para que cada decision tenga respaldo verificable."],
              ["06", "Respaldo ICC GROUP", "Operamos como unidad especializada dentro de un ecosistema preparado para escalar procesos."],
            ].map(([number, title, text], index) => (
              <article className="about-trust-card reveal" style={{ "--reveal-delay": `${index * 80}ms` } as CSSProperties} key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-sectors">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Sectores que atendemos</p>
            <h2>Topografia para proyectos donde el error cuesta tiempo, dinero y confianza.</h2>
            <p>Nos integramos a etapas de estudio, ejecucion, control, cierre y mantenimiento con entregables utiles para campo y gabinete.</p>
          </div>
          <div className="sector-rail" aria-label="Sectores atendidos por ICC Topografia">
            {["Constructoras", "Inmobiliarias", "Contratistas", "Infraestructura", "Ingenieria", "Mineria", "Energia", "Industria", "Catastro", "Desarrollo urbano"].map((sector) => (
              <span key={sector}>{sector}</span>
            ))}
          </div>
          <div className="about-metrics">
            <div className="about-metric">
              <span>Campo</span>
              <strong>Levantamiento y replanteo en obra</strong>
            </div>
            <div className="about-metric">
              <span>Control</span>
              <strong>Niveles, ejes y monitoreo tecnico</strong>
            </div>
            <div className="about-metric">
              <span>LiDAR</span>
              <strong>Nubes de puntos y evidencia digital</strong>
            </div>
            <div className="about-metric">
              <span>Entrega</span>
              <strong>Planos, reportes y trazabilidad</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-cta">
        <div className="container">
          <p className="eyebrow">Siguiente paso</p>
          <h2>Si tu proyecto necesita precision, cumplimiento y evidencia tecnica, conversemos con el alcance correcto.</h2>
          <p>
            Cuentanos ubicacion, area aproximada, etapa del proyecto y fecha requerida. Te ayudamos a definir el
            servicio, el metodo y el entregable adecuado.
          </p>
          <div className="about-actions">
            <a className="button primary" href="/contacto/">
              Solicitar evaluacion
            </a>
            <a className="button secondary" href="https://wa.me/51949844865" target="_blank" rel="noreferrer">
              Hablar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
