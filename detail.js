(function () {
  const data = window.TERRAQO_DATA || { services: [], projects: [], products: [] };
  const root = document.querySelector("[data-detail]");
  if (!root) return;

  const type = root.getAttribute("data-type");
  const slug = root.getAttribute("data-slug");
  const collection = type === "service" ? data.services : type === "product" ? data.products : data.projects;
  const item = collection.find((entry) => entry.slug === slug);
  if (!item) return;

  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const directoryDepth = Math.max(0, pathParts.length - (window.location.pathname.endsWith("/") ? 0 : 1));
  const basePath = "../".repeat(directoryDepth);
  const assetPath = (path) => {
    if (!path) return "";
    if (/^https?:\/\//.test(path)) return path;
    return `${basePath}${path.replace(/^\.\//, "")}`;
  };
  const siteHeader = () => `
    <header class="site-header">
      <a class="brand" href="${basePath}index.html"><img src="${basePath}public/brand/icc-topografia-logo.png" alt="ICC Topografia"></a>
      <nav>
        <a href="${basePath}servicios/">Servicios</a>
        <a href="${basePath}casos-exito/">Casos</a>
        <a href="${basePath}metodo-icc/">Metodo ICC</a>
        <a href="${basePath}nosotros/">Nosotros</a>
        <a href="${basePath}tienda/">Tienda tecnica</a>
        <a href="${basePath}contacto/">Contacto</a>
        <a class="account-link" href="${basePath}cuenta/" aria-label="Cuenta cliente">Cuenta</a>
        <a class="header-cta" href="${basePath}contacto/">Cotizar</a>
        <div class="language-switch">
          <button type="button" aria-label="Cambiar idioma">ES</button>
          <div class="language-menu" aria-label="Idiomas disponibles">
            <a href="?lang=en" lang="en">EN</a>
            <a href="?lang=pt" lang="pt">PT</a>
            <a href="?lang=de" lang="de">DE</a>
          </div>
        </div>
      </nav>
      <aside class="announcement-strip" aria-label="Novedades ICC Topografia">
        <span>Nuevo</span>
        <strong>Casos, servicios y tienda tecnica conectados al ecosistema Terraqo</strong>
        <a href="${basePath}contacto/">Cotizar alcance</a>
      </aside>
    </header>
  `;
  const siteFooter = () => `
    <footer class="footer">
      <div class="container footer-grid">
        <div>
          <img class="footer-logo" src="${basePath}public/brand/icc-topografia-logo.png" alt="ICC Topografia" />
          <p>ICC Topografia Group S.A.C. - precision metrica, tecnologia LiDAR y control tecnico para proyectos en Peru.</p>
        </div>
        <div>
          <h3>Contacto</h3>
          <a href="mailto:contacto@icctopografia.com">contacto@icctopografia.com</a>
          <a href="tel:+51949844865">+51 949 844 865</a>
          <a href="https://wa.me/51949844865" target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
        <div>
          <h3>Workspace</h3>
          <a href="${basePath}servicios/">Servicios</a>
          <a href="${basePath}casos-exito/">Casos de exito</a>
          <a href="${basePath}tienda/">Tienda tecnica</a>
          <a href="${basePath}contacto/">Solicitar cotizacion</a>
        </div>
      </div>
    </footer>
  `;

  const isService = type === "service";
  const isProduct = type === "product";
  const title = item.title || item.name;
  document.title = `${title} | ICC Topografia`;

  if (isProduct) {
    const specs = Object.entries(item.specs || {});
    const price = item.price ? `${item.currency || "USD"} ${Number(item.price).toLocaleString("en-US")}` : "Cotizacion especializada";
    root.innerHTML = `
      ${siteHeader()}
      <section class="detail-hero service-detail-hero">
        <div class="detail-overlay"></div>
        <div class="container detail-content">
          <a class="back-link" href="${basePath}tienda/">Volver a tienda</a>
          <div class="detail-hero-grid">
            <div>
              <div class="detail-badges"><span>${item.category}</span><span>${item.badge || item.availability}</span></div>
              <p class="eyebrow">Ficha tecnica de tienda</p>
              <h1>${item.name}</h1>
              <p>${item.summary}</p>
              <div class="detail-facts">
                <div><small>Marca</small><strong>${item.brand}</strong></div>
                <div><small>Modelo</small><strong>${item.model || "Consultar"}</strong></div>
                <div><small>Precio</small><strong>${price}</strong></div>
              </div>
            </div>
            <aside class="result-panel">
              <p class="eyebrow">Disponibilidad</p>
              <h2>${item.availability}</h2>
              <div class="result-list">
                <div><span></span><p>${item.requiresQuote ? "Requiere cotizacion con asesor tecnico." : "Producto con precio referencial publicado."}</p></div>
                <div><span></span><p>Modo comercial: ${item.commercialMode || "venta"}</p></div>
                <div><span></span><p>Stock referencial: ${item.stock ?? "consultar"}</p></div>
              </div>
              <a class="button primary full" href="#cotizar">Solicitar cotizacion</a>
            </aside>
          </div>
        </div>
      </section>
      <section class="project-body">
        <div class="container project-detail-grid">
          <div class="project-main">
            <section class="evidence-section">
              <div class="section-heading compact"><p class="eyebrow">Descripcion</p><h2>Uso tecnico recomendado</h2></div>
              <p>${item.description}</p>
            </section>
            <section class="insight-grid">
              ${specs.slice(0, 6).map(([key, value]) => `<article><p>${key}</p><h3>${value}</h3></article>`).join("")}
            </section>
          </div>
          <aside class="sticky-spec">
            <div class="spec-card">
              <p class="eyebrow">Ficha comercial</p>
              <h3>${item.category}</h3>
              <dl>
                <div><dt>Marca</dt><dd>${item.brand}</dd></div>
                <div><dt>Modelo</dt><dd>${item.model || "Consultar"}</dd></div>
                <div><dt>Disponibilidad</dt><dd>${item.availability}</dd></div>
                <div><dt>Fuente</dt><dd>Terraqo Workspace</dd></div>
              </dl>
            </div>
            <div class="spec-card"><p class="eyebrow">Etiquetas</p><div class="tag-list">${(item.tags || []).concat([item.category]).map((tag) => `<span>${tag}</span>`).join("")}</div></div>
          </aside>
        </div>
      </section>
      ${quoteSection(title)}
      ${siteFooter()}
    `;
    return;
  }

  const gallery = item.gallery || [];
  const metrics = item.metrics || [["Control", item.metric || "Trazabilidad"], ["Ubicacion", item.location || "Por confirmar"], ["Estado", item.status || "Publicado"]];
  const progress = item.progress || [];
  root.innerHTML = `
    ${siteHeader()}
    <section class="detail-hero ${isService ? "service-detail-hero" : ""}">
      ${!isService ? `<img src="${assetPath(item.image)}" alt="${title}" />` : ""}
      <div class="detail-overlay"></div>
      <div class="container detail-content">
        <a class="back-link" href="${basePath}index.html">Volver a inicio</a>
        <div class="detail-hero-grid">
          <div>
            <div class="detail-badges">
              <span>${isService ? item.category || "Servicio ICC" : item.sector}</span>
              <span>${isService ? "Ficha publica" : item.status || "Publicado"}</span>
            </div>
            <p class="eyebrow">${isService ? "Servicio migrado desde Terraqo" : "Caso tecnico ICC"}</p>
            <h1>${title}</h1>
            <p>${item.summary}</p>
            <div class="detail-facts">
              ${metrics.map(([label, value]) => `<div><small>${label}</small><strong>${value}</strong></div>`).join("")}
            </div>
          </div>
          <aside class="result-panel">
            <p class="eyebrow">${isService ? "Alcance" : "Resultado operativo"}</p>
            <h2>${isService ? "Ficha tecnica para cotizacion" : "Logros tecnicos del servicio"}</h2>
            <div class="result-list">
              ${(isService ? item.deliverables : String(item.result || "").split(";")).filter(Boolean).map((entry) => `<div><span></span><p>${String(entry).trim()}</p></div>`).join("")}
            </div>
            <a class="button primary full" href="#cotizar">${isService ? "Cotizar servicio" : "Cotizar proyecto similar"}</a>
          </aside>
        </div>
      </div>
    </section>
    ${isService ? serviceBody(item) : projectBody(item, gallery, progress)}
    ${quoteSection(title)}
    ${siteFooter()}
  `;

  function serviceBody(service) {
    return `
      <section class="section">
        <div class="container split">
          <div>
            <p class="eyebrow">Proceso tecnico</p>
            <h2>Alcance preparado para compradores tecnicos</h2>
            <p>${service.problem || service.caseStudy || service.summary}</p>
            <div class="progress-list service-process">
              ${(service.process || []).map((entry, index) => `<div><strong>${String(index + 1).padStart(2, "0")}</strong><span><b>${entry}</b>Control documentado para cotizacion y ejecucion.</span></div>`).join("")}
            </div>
          </div>
          <div class="detail-panel">
            <h3>Equipos y precision</h3>
            <p>${service.errorRange || "Rango de precision definido segun alcance, metodologia y condiciones de campo."}</p>
            <ul>${(service.equipment || []).map((entry) => `<li>${entry}</li>`).join("")}</ul>
          </div>
        </div>
      </section>
    `;
  }

  function projectBody(project, galleryImages, progressItems) {
    const images = [project.image, ...galleryImages].filter(Boolean);
    return `
      <section class="project-body">
        <div class="container project-detail-grid">
          <div class="project-main">
            <section class="evidence-section">
              <div class="section-heading compact"><p class="eyebrow">Evidencia de campo</p><h2>Registro visual del proyecto</h2></div>
              <div class="evidence-grid">
                ${images.map((image, index) => `<figure class="${index === 0 ? "wide" : ""}"><img src="${assetPath(image)}" alt="${project.title} evidencia ${index + 1}" /></figure>`).join("")}
              </div>
            </section>
            <section class="insight-grid">
              <article><p>Reto</p><h3>${project.challenge || "Condiciones de campo y coordinacion tecnica."}</h3></article>
              <article><p>Solucion</p><h3>${project.solution || "Metodologia de medicion, control y entrega."}</h3></article>
              <article><p>Resultado</p><h3>${project.result || "Entregables tecnicos para decisiones de obra."}</h3></article>
            </section>
            <section class="progress-panel">
              <p class="eyebrow">Avance documentado</p>
              <h2>Trazabilidad preparada para Terraqo</h2>
              <div class="progress-list">
                ${progressItems.map(([progressTitle, body], index) => `<div><strong>${String(index + 1).padStart(2, "0")}</strong><span><b>${progressTitle}</b>${body}</span></div>`).join("")}
              </div>
            </section>
          </div>
          <aside class="sticky-spec">
            <div class="spec-card">
              <p class="eyebrow">Ficha del proyecto</p>
              <h3>${project.status || "Publicado"}</h3>
              <dl>
                <div><dt>Rubro</dt><dd>${project.sector}</dd></div>
                <div><dt>Cliente</dt><dd>${project.clientName || "Cliente no publicado"}</dd></div>
                <div><dt>Ubicacion</dt><dd>${project.location || "Por confirmar"}</dd></div>
                <div><dt>Fuente</dt><dd>Terraqo Workspace</dd></div>
              </dl>
            </div>
            <div class="spec-card"><p class="eyebrow">Servicios aplicados</p><div class="tag-list">${(project.services || []).map((service) => `<span>${service}</span>`).join("")}</div></div>
          </aside>
        </div>
      </section>
    `;
  }

  function quoteSection(contextTitle) {
    return `
      <section id="cotizar" class="quote-section">
        <div class="container quote-grid">
          <div>
            <p class="eyebrow">Cotizacion</p>
            <h2>Solicita una evaluacion para ${contextTitle.toLowerCase()}</h2>
            <p>La solicitud quedara lista para convertirse en oportunidad dentro de Terraqo Workspace.</p>
          </div>
          <form class="quote-form" name="cotizacion" action="mailto:contacto@icctopografia.com" method="post" enctype="text/plain" data-account-redirect="${basePath}cuenta/">
            <input type="hidden" name="form-name" value="cotizacion" />
            <input name="nombre" placeholder="Nombre y apellido" required />
            <input name="empresa" placeholder="Empresa" />
            <input name="telefono" placeholder="Telefono / WhatsApp" required />
            <input name="correo" type="email" placeholder="Correo corporativo" required />
            <input name="servicio" value="${contextTitle}" />
            <label class="checkbox-field"><input type="checkbox" name="interes_equipos" value="si" /> Tambien estoy interesado en arriendo o compra de equipos</label>
            <textarea name="alcance" placeholder="Ubicacion, area aproximada, fecha requerida y alcance" required></textarea>
            <button type="submit">Enviar solicitud</button>
          </form>
        </div>
      </section>
    `;
  }
})();
