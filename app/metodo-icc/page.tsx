import type { CSSProperties } from "react";

export default function MethodPage() {
  return (
    <>
      <section className="section method-section method-page">
        <div className="method-ambient" aria-hidden="true" />
        <div className="container method-layout">
          <div className="method-copy">
            <p className="eyebrow">Metodo ICC</p>
            <h1>Asi sabes que se hizo, con que precision y para que sirve.</h1>
            <p>
              Nuestro metodo ordena la solicitud desde el primer contacto hasta la entrega final. El cliente entiende el
              alcance, el equipo tecnico ejecuta con control y la obra recibe informacion lista para decidir.
            </p>
            <div className="method-signals" aria-label="Indicadores del metodo">
              <div>
                <span>01</span>
                <strong>Alcance entendible</strong>
              </div>
              <div>
                <span>OK</span>
                <strong>Campo verificado</strong>
              </div>
              <div>
                <span>PDF</span>
                <strong>Entrega accionable</strong>
              </div>
            </div>
            <a className="method-link" href="/contacto/">
              Solicitar evaluacion topografica -&gt;
            </a>
          </div>
          <div className="method-map" aria-label="Flujo operativo Metodo ICC">
            <article className="method-node method-node-1 reveal" style={{ "--reveal-delay": "0ms" } as CSSProperties}>
              <span>01</span>
              <small>Entendemos</small>
              <h3>Alcance y objetivo</h3>
              <p>Ubicacion, area, etapa del proyecto, tolerancia esperada, fecha requerida y entregable necesario.</p>
            </article>
            <article className="method-node method-node-2 reveal" style={{ "--reveal-delay": "90ms" } as CSSProperties}>
              <span>02</span>
              <small>Planificamos</small>
              <h3>Equipo y ruta de campo</h3>
              <p>Definimos instrumentos, cuadrilla, puntos de control, accesos y forma de validar la medicion.</p>
            </article>
            <div className="method-core reveal" style={{ "--reveal-delay": "160ms" } as CSSProperties}>
              <span>ICC</span>
              <strong>Control visible</strong>
              <p>Tu proyecto avanza con evidencia, responsables y entregables claros.</p>
            </div>
            <article className="method-node method-node-3 reveal" style={{ "--reveal-delay": "180ms" } as CSSProperties}>
              <span>03</span>
              <small>Ejecutamos</small>
              <h3>Medicion y revision</h3>
              <p>Levantamos, replanteamos o controlamos en campo y revisamos consistencia antes de entregar.</p>
            </article>
            <article className="method-node method-node-4 reveal" style={{ "--reveal-delay": "270ms" } as CSSProperties}>
              <span>04</span>
              <small>Entregamos</small>
              <h3>Informacion util</h3>
              <p>Planos, reportes, archivos digitales y recomendaciones listas para obra, revision o aprobacion.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section method-executive">
        <div className="container method-executive-grid">
          <div>
            <p className="eyebrow">Por que importa</p>
            <h2>La precision solo sirve si el equipo puede usarla sin dudas.</h2>
          </div>
          <div className="method-executive-cards">
            {[
              ["Menos retrabajo", "La informacion se entrega con criterio de uso, no solo como archivo suelto."],
              ["Mejor coordinacion", "Obra, supervision y oficina tecnica trabajan sobre el mismo dato."],
              ["Decisiones con respaldo", "Cada entrega puede revisarse, compartirse y sustentarse tecnicamente."],
            ].map(([title, body], index) => (
              <article className="reveal" style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties} key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
