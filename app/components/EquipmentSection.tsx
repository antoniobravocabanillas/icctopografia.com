import type { CSSProperties } from "react";

export default function EquipmentSection() {
  return (
    <section id="tienda" className="section equipment equipment-showcase">
      <div className="equipment-glow" aria-hidden="true" />
      <div className="container equipment-layout">
        <div className="equipment-copy">
          <p className="eyebrow">Tienda tecnica</p>
          <h2>Equipos topograficos listos para cotizar con respaldo tecnico.</h2>
          <p>
            Encuentra equipos para levantamiento, control, replanteo y registro de campo con fichas claras,
            disponibilidad consultable y asesoria para elegir la configuracion adecuada.
          </p>
          <div className="equipment-actions">
            <a className="button primary" href="/tienda/">
              Ver tienda tecnica
            </a>
            <a className="button secondary ink" href="#cotizar">
              Solicitar asesoria
            </a>
          </div>
          <div className="equipment-tags" aria-label="Categorias visibles en tienda">
            <span>GNSS</span>
            <span>Estaciones totales</span>
            <span>LiDAR</span>
            <span>Drones</span>
          </div>
        </div>
        <div className="equipment-console" aria-label="Tienda tecnica con asesoria ICC">
          <div className="equipment-card-visual reveal">
            <img src="/images/equipo-topografico-store.jpg" alt="Equipo topografico disponible en tienda tecnica" />
            <div>
              <span>Equipo destacado</span>
              <strong>Catalogo tecnico ICC</strong>
              <small>Ficha, disponibilidad y cotizacion</small>
            </div>
          </div>
          <div className="equipment-flow reveal" style={{ "--reveal-delay": "120ms" } as CSSProperties}>
            <div>
              <span>01</span>
              <strong>Explora por uso</strong>
              <small>obra, control, GNSS, LiDAR o UAV</small>
            </div>
            <div>
              <span>02</span>
              <strong>Compara con ficha</strong>
              <small>marca, alcance, precision y accesorios</small>
            </div>
            <div>
              <span>03</span>
              <strong>Cotiza con asesoria</strong>
              <small>recomendacion tecnica antes de comprar</small>
            </div>
          </div>
          <div className="equipment-status reveal" style={{ "--reveal-delay": "210ms" } as CSSProperties}>
            <span>Soporte ICC</span>
            <strong>Compra tecnica con criterio de campo</strong>
            <p>Te ayudamos a elegir equipo, accesorios y configuracion segun el tipo de proyecto.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
