export default function ContactForm() {
  return (
    <section id="cotizar" className="quote-section">
      <div className="container quote-grid">
        <div>
          <p className="eyebrow">Cotizacion</p>
          <h2>Cuentanos el alcance topografico y te ayudamos a dimensionarlo</h2>
          <p>
            Cuentanos ubicacion, fecha, area aproximada y entregable esperado. Con eso te orientamos el alcance y
            preparamos una cotizacion.
          </p>
        </div>
        <form
          className="quote-form"
          name="cotizacion"
          action="mailto:cotizaciones@icctopografia.com"
          method="post"
          encType="text/plain"
          data-account-redirect="/cuenta/"
        >
          <input name="nombre" placeholder="Nombre y apellido" required />
          <input name="empresa" placeholder="Empresa" />
          <input name="telefono" placeholder="Telefono / WhatsApp" required />
          <input name="correo" type="email" placeholder="Correo corporativo" required />
          <select name="servicio" required defaultValue="">
            <option value="">Tipo de servicio</option>
            <option>Levantamiento topografico clasico</option>
            <option>Escaneo LiDAR terrestre o UAV</option>
            <option>Replanteo y control de obra</option>
            <option>Monitoreo de deformaciones</option>
            <option>Cartografia y SIG basico</option>
            <option>Otro servicio topografico</option>
          </select>
          <label className="checkbox-field">
            <input type="checkbox" name="interes_equipos" value="si" /> Tambien estoy interesado en arriendo o compra
            de equipos
          </label>
          <textarea name="alcance" placeholder="Distrito, area aproximada, fecha requerida y alcance" required />
          <button type="submit">Enviar solicitud</button>
        </form>
      </div>
    </section>
  );
}
