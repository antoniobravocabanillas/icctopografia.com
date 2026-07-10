export default function ContactPage() {
  return (
    <section className="quote-section">
      <div className="container quote-grid">
        <div>
          <p className="eyebrow">Contacto</p>
          <h1>Solicita una cotizacion topografica</h1>
          <p>
            Indica ubicacion, area aproximada, fecha requerida y entregable esperado. Si tambien buscas equipos, marca
            esa opcion y el equipo comercial te orienta.
          </p>
          <p>
            <a className="button secondary" href="https://wa.me/51949844865">
              Cotizar por WhatsApp
            </a>
          </p>
        </div>
        <form className="quote-form" name="cotizacion" action="mailto:cotizaciones@icctopografia.com" method="post" encType="text/plain" data-account-redirect="/cuenta/">
          <input name="nombre" placeholder="Nombre y apellido" required />
          <input name="empresa" placeholder="Empresa" />
          <input name="telefono" placeholder="Telefono / WhatsApp" required />
          <input name="correo" type="email" placeholder="Correo corporativo" required />
          <select name="servicio" required defaultValue="">
            <option value="">Tipo de solicitud</option>
            <option>Servicio topografico</option>
            <option>Proyecto / caso similar</option>
            <option>Equipo topografico</option>
            <option>Alquiler, soporte o calibracion</option>
            <option>Otro requerimiento tecnico</option>
          </select>
          <label className="checkbox-field">
            <input type="checkbox" name="interes_equipos" value="si" /> Tambien estoy interesado en arriendo o compra de
            equipos
          </label>
          <textarea name="alcance" placeholder="Distrito, area aproximada, fecha requerida y alcance" required />
          <button type="submit">Enviar solicitud</button>
        </form>
      </div>
    </section>
  );
}
