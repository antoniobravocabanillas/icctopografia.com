import type { CSSProperties } from "react";

export default function MethodSection() {
  return (
    <section id="metodo-icc" className="section method-section">
      <div className="method-ambient" aria-hidden="true" />
      <div className="container method-layout">
        <div className="method-copy">
          <p className="eyebrow">Metodo ICC</p>
          <h2>Sabes que se midio, con que precision y para que sirve.</h2>
          <p>
            Organizamos cada solicitud en pasos simples: definimos el alcance, salimos a campo, verificamos los datos y
            entregamos planos, reportes o evidencia listos para obra, supervision o gerencia.
          </p>
          <div className="method-signals" aria-label="Indicadores del metodo">
            <div>
              <span>01</span>
              <strong>Alcance cerrado</strong>
            </div>
            <div>
              <span>OK</span>
              <strong>Datos revisados</strong>
            </div>
            <div>
              <span>PDF</span>
              <strong>Entrega clara</strong>
            </div>
          </div>
          <a className="method-link" href="/metodo-icc/">
            Ver metodo completo -&gt;
          </a>
        </div>
        <div className="method-map" aria-label="Flujo operativo Metodo ICC">
          <article className="method-node method-node-1 reveal" style={{ "--reveal-delay": "0ms" } as CSSProperties}>
            <span>01</span>
            <small>Entrada</small>
            <h3>Diagnostico</h3>
            <p>Ubicacion, accesos, tolerancias, sistema de coordenadas y objetivo tecnico.</p>
          </article>
          <article className="method-node method-node-2 reveal" style={{ "--reveal-delay": "90ms" } as CSSProperties}>
            <span>02</span>
            <small>Campo</small>
            <h3>Plan operativo</h3>
            <p>Cuadrilla, equipo, metodologia, ventanas de trabajo y puntos de control.</p>
          </article>
          <div className="method-core reveal" style={{ "--reveal-delay": "160ms" } as CSSProperties}>
            <span>ICC</span>
            <strong>Bitacora del trabajo</strong>
            <p>Evidencia, avances y archivos conectados para revisar lo ejecutado.</p>
          </div>
          <article className="method-node method-node-3 reveal" style={{ "--reveal-delay": "180ms" } as CSSProperties}>
            <span>03</span>
            <small>Control</small>
            <h3>Revision de datos</h3>
            <p>Medicion, gabinete, contraste de datos y registro de evidencia en campo.</p>
          </article>
          <article className="method-node method-node-4 reveal" style={{ "--reveal-delay": "270ms" } as CSSProperties}>
            <span>04</span>
            <small>Salida</small>
            <h3>Entrega util</h3>
            <p>Planos, reportes, archivos tecnicos y soporte para obra o supervision.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
