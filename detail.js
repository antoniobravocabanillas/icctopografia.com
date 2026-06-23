(function () {
  const data = window.TERRAQO_DATA || { services: [], projects: [] };
  const root = document.querySelector("[data-detail]");
  if (!root) return;

  const type = root.getAttribute("data-type");
  const slug = root.getAttribute("data-slug");
  const collection = type === "service" ? data.services : data.projects;
  const item = collection.find((entry) => entry.slug === slug);
  if (!item) return;

  const isService = type === "service";
  document.title = `${item.title} | ICC Topografia`;
  const gallery = item.gallery || [];
  const metrics = item.metrics || [["Control", item.metric || "Trazabilidad"], ["Ubicacion", item.location || "Por confirmar"], ["Estado", item.status || "Publicado"]];
  const progress = item.progress || [];
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const directoryDepth = Math.max(0, pathParts.length - (window.location.pathname.endsWith("/") ? 0 : 1));
  const basePath = "../".repeat(directoryDepth);
  const assetPath = (path) => path ? `${basePath}${path.replace(/^\.\//, "")}` : "";
  root.innerHTML = `
    <section class="detail-hero ${isService ? "service-detail-hero" : ""}">
      ${!isService ? `<img src="${assetPath(item.image)}" alt="${item.title}" />` : ""}
      <div class="detail-overlay"></div>
      <div class="container detail-content">
        <a class="back-link" href="${basePath}index.html">Volver a inicio</a>
        <div class="detail-hero-grid">
          <div>
            <div class="detail-badges">
              <span>${isService ? "Servicio ICC" : item.sector}</span>
              <span>${isService ? "Ficha publica" : item.status || "Publicado"}</span>
            </div>
            <p class="eyebrow">${isService ? "Servicio publicado desde Terraqo" : "Caso tecnico ICC"}</p>
            <h1>${item.title}</h1>
            <p>${item.summary}</p>
            <div class="detail-facts">
              ${metrics.map(([label, value]) => `<div><small>${label}</small><strong>${value}</strong></div>`).join("")}
            </div>
          </div>
          <aside class="result-panel">
            <p class="eyebrow">${isService ? "Alcance" : "Resultado operativo"}</p>
            <h2>${isService ? "Ficha tecnica para cotizacion" : "Logros tecnicos del servicio"}</h2>
            <div class="result-list">
              ${(isService ? item.deliverables : String(item.result || "").split(";")).map((entry) => `<div><span></span><p>${entry.trim()}</p></div>`).join("")}
            </div>
            <a class="button primary full" href="#cotizar">${isService ? "Cotizar servicio" : "Cotizar proyecto similar"}</a>
          </aside>
        </div>
      </div>
    </section>

    ${!isService ? `
      <section class="project-body">
        <div class="container project-detail-grid">
          <div class="project-main">
            <section class="evidence-section">
              <div class="section-heading compact">
                <p class="eyebrow">Evidencia de campo</p>
                <h2>Registro visual del proyecto</h2>
              </div>
              <div class="evidence-grid">
                ${[item.image, ...gallery].map((image, index) => `
                  <figure class="${index === 0 ? "wide" : ""}">
                    <img src="${assetPath(image)}" alt="${item.title} evidencia ${index + 1}" />
                  </figure>
                `).join("")}
              </div>
            </section>

            <section class="insight-grid">
              <article><p>Reto</p><h3>${item.challenge || "Condiciones de campo y coordinacion tecnica."}</h3></article>
              <article><p>Solucion</p><h3>${item.solution || "Metodologia de medicion, control y entrega."}</h3></article>
              <article><p>Resultado</p><h3>${item.result || "Entregables tecnicos para decisiones de obra."}</h3></article>
            </section>

            <section class="progress-panel">
              <p class="eyebrow">Avance documentado</p>
              <h2>Trazabilidad preparada para Terraqo</h2>
              <div class="progress-list">
                ${progress.map(([title, body], index) => `
                  <div>
                    <strong>${String(index + 1).padStart(2, "0")}</strong>
                    <span><b>${title}</b>${body}</span>
                  </div>
                `).join("") || `<div><strong>01</strong><span><b>Registro inicial</b>Este bloque sera alimentado desde avances publicados en Terraqo.</span></div>`}
              </div>
            </section>
          </div>

          <aside class="sticky-spec">
            <div class="spec-card">
              <p class="eyebrow">Ficha del proyecto</p>
              <h3>${item.status || "Publicado"}</h3>
              <dl>
                <div><dt>Rubro</dt><dd>${item.sector}</dd></div>
                <div><dt>Cliente</dt><dd>${item.clientName || "Cliente no publicado"}</dd></div>
                <div><dt>Ubicacion</dt><dd>${item.location || "Por confirmar"}</dd></div>
                <div><dt>Fuente</dt><dd>Panel ICC Topografia</dd></div>
              </dl>
            </div>
            <div class="spec-card">
              <p class="eyebrow">Servicios aplicados</p>
              <div class="tag-list">
                ${(item.services || []).map((service) => `<span>${service}</span>`).join("")}
              </div>
            </div>
          </aside>
        </div>
      </section>
    ` : `
    <section class="section">
      <div class="container split">
        <div>
          <p class="eyebrow">Proceso tecnico</p>
          <h2>Alcance preparado para compradores tecnicos</h2>
          <p>${item.caseStudy || "Esta ficha publica sera alimentada desde Terraqo Workspace con ejemplos, equipos, rango de error y entregables."}</p>
          <div class="progress-list service-process">
            ${(item.process || []).map((entry, index) => `
              <div>
                <strong>${String(index + 1).padStart(2, "0")}</strong>
                <span><b>${entry}</b>Control documentado para cotizacion y ejecucion.</span>
              </div>
            `).join("")}
          </div>
        </div>
        <div class="detail-panel">
          <h3>Equipos y precision</h3>
          <p>${item.errorRange || "Rango de precision definido segun alcance, metodologia y condiciones de campo."}</p>
          <ul>
            ${(item.equipment || []).map((entry) => `<li>${entry}</li>`).join("")}
          </ul>
        </div>
      </div>
    </section>
    `}
    <section class="quote-section">
      <div class="container quote-grid">
        <div>
          <p class="eyebrow">Cotizacion</p>
          <h2>Solicita una evaluacion para ${item.title.toLowerCase()}</h2>
          <p>La solicitud quedara lista para convertirse en oportunidad dentro de Terraqo Workspace.</p>
        </div>
        <form class="quote-form" action="mailto:contacto@icctopografia.com" method="post" enctype="text/plain">
          <input name="nombre" placeholder="Nombre y apellido" required />
          <input name="empresa" placeholder="Empresa" />
          <input name="telefono" placeholder="Telefono / WhatsApp" required />
          <input name="servicio" value="${item.title}" />
          <label class="checkbox-field"><input type="checkbox" name="interes_equipos" value="si" /> Tambien estoy interesado en arriendo o compra de equipos</label>
          <textarea name="alcance" placeholder="Ubicacion, area aproximada, fecha requerida y alcance" required></textarea>
          <button type="submit">Enviar solicitud</button>
        </form>
      </div>
    </section>
  `;
})();
