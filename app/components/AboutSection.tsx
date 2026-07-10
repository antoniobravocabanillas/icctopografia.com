import type { CSSProperties } from "react";

export default function AboutSection() {
  return (
    <section id="nosotros" className="section about-section">
      <div className="about-field" aria-hidden="true" />
      <div className="container about-layout">
        <div className="about-copy">
          <p className="eyebrow">Sobre ICC Topografia</p>
          <h2>No solo medimos terrenos. Ayudamos a controlar proyectos.</h2>
          <p>
            ICC Topografia es la unidad especializada del ecosistema ICC para topografia, geodesia y control tecnico en
            obra. La operacion topografica se concentra ahora en esta marca, ICC GROUP atiende los servicios de
            ingenieria, construccion y consultoria que no son topografia, y Terraqo funciona como proveedor tecnologico y
            workspace operativo para conectar datos, clientes, proyectos y seguimiento.
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
          <a className="method-link" href="/nosotros/">
            Conocer la unidad -&gt;
          </a>
        </div>
        <div className="about-system" aria-label="Evolucion y diferenciadores de ICC Topografia">
          <div className="about-photo reveal">
            <img src="/images/ingenieria-campo.jpg" alt="Revision tecnica de planos y entregables topograficos" />
            <div>
              <span>Control tecnico</span>
              <strong>Datos de campo convertidos en informacion util.</strong>
            </div>
          </div>
          <div className="about-evolution reveal" style={{ "--reveal-delay": "120ms" } as CSSProperties}>
            <article>
              <span>01</span>
              <strong>ICC Topografia</strong>
              <small>La marca especializada que concentra la operacion topografica del ecosistema ICC.</small>
            </article>
            <article>
              <span>02</span>
              <strong>ICC GROUP</strong>
              <small>Servicios de ingenieria, construccion y consultoria dentro del ecosistema.</small>
            </article>
            <article>
              <span>03</span>
              <strong>Terraqo</strong>
              <small>Workspace y proveedor tecnologico para gestionar datos, proyectos y clientes.</small>
            </article>
          </div>
          <div className="about-contrast reveal" style={{ "--reveal-delay": "220ms" } as CSSProperties}>
            <div>
              <small>Topografia tradicional</small>
              <strong>Medicion aislada</strong>
            </div>
            <div>
              <small>ICC Topografia</small>
              <strong>Control tecnico del proyecto</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
