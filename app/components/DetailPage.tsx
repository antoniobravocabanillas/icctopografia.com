import { notFound } from "next/navigation";

type DetailKind = "service" | "project" | "product";

const assetPath = (path?: string) => (path || "").replace(/^\.\/public\//, "/").replace(/^\.\/+/, "/");
const titleOf = (item: any) => item.title || item.name;
const priceOf = (product: any) =>
  product.price ? `${product.currency || "USD"} ${Number(product.price).toLocaleString("en-US")}` : "Cotizacion especializada";

function QuoteSection({ title }: { title: string }) {
  return (
    <section id="cotizar" className="quote-section">
      <div className="container quote-grid">
        <div>
          <p className="eyebrow">Cotizacion</p>
          <h2>Solicita una evaluacion para {title.toLowerCase()}</h2>
          <p>Cuentanos la ubicacion, el plazo y el alcance esperado. Te responderemos con una ruta clara de atencion.</p>
        </div>
        <form className="quote-form" name="cotizacion" action="mailto:contacto@icctopografia.com" method="post" encType="text/plain" data-account-redirect="/cuenta/">
          <input type="hidden" name="form-name" value="cotizacion" />
          <input name="nombre" placeholder="Nombre y apellido" required />
          <input name="empresa" placeholder="Empresa" />
          <input name="telefono" placeholder="Telefono / WhatsApp" required />
          <input name="correo" type="email" placeholder="Correo corporativo" required />
          <input name="servicio" defaultValue={title} />
          <label className="checkbox-field">
            <input type="checkbox" name="interes_equipos" value="si" /> Tambien estoy interesado en arriendo o compra
            de equipos
          </label>
          <textarea name="alcance" placeholder="Ubicacion, area aproximada, fecha requerida y alcance" required />
          <button type="submit">Enviar solicitud</button>
        </form>
      </div>
    </section>
  );
}

function ProductDetail({ product }: { product: any }) {
  const specs = Object.entries(product.specs || {}).slice(0, 6);
  const title = titleOf(product);

  return (
    <>
      <section className="detail-hero service-detail-hero">
        <div className="detail-overlay" />
        <div className="container detail-content">
          <a className="back-link" href="/tienda/">
            Volver a tienda
          </a>
          <div className="detail-hero-grid">
            <div>
              <div className="detail-badges">
                <span>{product.category}</span>
                <span>{product.badge || product.availability}</span>
              </div>
              <p className="eyebrow">Ficha tecnica de tienda</p>
              <h1>{product.name}</h1>
              <p>{product.summary}</p>
              <div className="detail-facts">
                <div>
                  <small>Marca</small>
                  <strong>{product.brand}</strong>
                </div>
                <div>
                  <small>Modelo</small>
                  <strong>{product.model || "Consultar"}</strong>
                </div>
                <div>
                  <small>Precio</small>
                  <strong>{priceOf(product)}</strong>
                </div>
              </div>
            </div>
            <aside className="result-panel">
              <p className="eyebrow">Disponibilidad</p>
              <h2>{product.availability}</h2>
              <div className="result-list">
                <div>
                  <span />
                  <p>{product.requiresQuote ? "Requiere cotizacion con asesor tecnico." : "Producto con precio referencial publicado."}</p>
                </div>
                <div>
                  <span />
                  <p>Modo comercial: {product.commercialMode || "venta"}</p>
                </div>
                <div>
                  <span />
                  <p>Stock referencial: {product.stock ?? "consultar"}</p>
                </div>
              </div>
              <a className="button primary full" href="#cotizar">
                Solicitar cotizacion
              </a>
            </aside>
          </div>
        </div>
      </section>
      <section className="project-body">
        <div className="container project-detail-grid">
          <div className="project-main">
            <section className="evidence-section">
              <div className="section-heading compact">
                <p className="eyebrow">Descripcion</p>
                <h2>Uso tecnico recomendado</h2>
              </div>
              <p>{product.description}</p>
            </section>
            <section className="insight-grid">
              {specs.map(([key, value]) => (
                <article key={key}>
                  <p>{key}</p>
                  <h3>{String(value)}</h3>
                </article>
              ))}
            </section>
          </div>
          <aside className="sticky-spec">
            <div className="spec-card">
              <p className="eyebrow">Ficha comercial</p>
              <h3>{product.category}</h3>
              <dl>
                <div>
                  <dt>Marca</dt>
                  <dd>{product.brand}</dd>
                </div>
                <div>
                  <dt>Modelo</dt>
                  <dd>{product.model || "Consultar"}</dd>
                </div>
                <div>
                  <dt>Disponibilidad</dt>
                  <dd>{product.availability}</dd>
                </div>
                <div>
                  <dt>Fuente</dt>
                  <dd>Terraqo Workspace</dd>
                </div>
              </dl>
            </div>
            <div className="spec-card">
              <p className="eyebrow">Etiquetas</p>
              <div className="tag-list">
                {[...(product.tags || []), product.category].map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
      <QuoteSection title={title} />
    </>
  );
}

function ServiceBody({ service }: { service: any }) {
  const benefits = service.benefits || [];
  const deliverables = service.deliverables || [];
  const process = service.process || [];
  const equipment = service.equipment || [];

  return (
    <>
      <section className="section service-executive-section">
        <div className="container service-executive-layout">
          <div className="service-executive-copy">
            <p className="eyebrow">Por que tomar este servicio</p>
            <h2>Reduce incertidumbre en campo antes de que se convierta en costo.</h2>
            <p>
              {service.problem || service.caseStudy || service.summary} Nuestro equipo convierte la medicion en
              informacion util para aprobar, construir, corregir o sustentar decisiones con evidencia.
            </p>
            <div className="service-executive-actions">
              <a className="button primary" href="#cotizar">
                Solicitar cotizacion
              </a>
              <a className="button ghost" href="/casos-exito/">
                Ver casos de exito
              </a>
            </div>
          </div>

          <aside className="service-executive-panel">
            <p className="eyebrow">Resultado esperado</p>
            <h3>Datos claros para decidir sin improvisar.</h3>
            <div className="service-executive-stats">
              <div>
                <span>01</span>
                <strong>Alcance definido</strong>
                <p>Entendemos que se necesita medir, validar o replantear.</p>
              </div>
              <div>
                <span>02</span>
                <strong>Ejecucion trazable</strong>
                <p>El trabajo de campo queda documentado con control tecnico.</p>
              </div>
              <div>
                <span>03</span>
                <strong>Entrega util</strong>
                <p>Recibes archivos y reportes preparados para tu equipo.</p>
              </div>
            </div>
          </aside>
        </div>

        <div className="container service-premium-grid">
          <article className="service-premium-card service-premium-card-main">
            <p className="eyebrow">Lo que ganas</p>
            <h3>Menos retrabajo, mejor coordinacion y decisiones con respaldo tecnico.</h3>
            <div className="service-benefit-grid">
              {benefits.slice(0, 3).map((entry: string) => (
                <article key={entry}>
                  <span />
                  <h4>{entry}</h4>
                </article>
              ))}
            </div>
          </article>

          <article className="service-premium-card service-technology-card">
            <p className="eyebrow">Tecnologia aplicada</p>
            <h3>Equipos seleccionados segun el objetivo del servicio.</h3>
            <p>{service.errorRange || "La precision se define segun el alcance, el metodo, el equipo y las condiciones de campo."}</p>
            <div className="service-equipment-tags">
              {equipment.map((entry: string) => (
                <span key={entry}>{entry}</span>
              ))}
            </div>
          </article>

          <article className="service-premium-card service-process-card">
            <p className="eyebrow">Como lo ejecutamos</p>
            <h3>Un proceso simple para que sepas que se hizo y para que sirve.</h3>
            <div className="service-process-steps">
              {process.map((entry: string, index: number) => (
                <div key={entry}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{entry}</strong>
                  <p>Planificamos, medimos, revisamos y entregamos evidencia lista para decision.</p>
                </div>
              ))}
            </div>
          </article>

          <article className="service-premium-card service-deliverables-card-new">
            <p className="eyebrow">Entregables</p>
            <h3>Recibes informacion lista para usar.</h3>
            <p>La entrega se adapta al alcance contratado y se prepara para obra, aprobacion, revision o archivo tecnico.</p>
            <div className="service-deliverable-list">
              {deliverables.map((entry: string) => (
                <span key={entry}>{entry}</span>
              ))}
            </div>
          </article>
        </div>

        <div className="container">
          <div className="service-executive-cta">
            <div>
              <p className="eyebrow">Siguiente paso</p>
              <h2>Cuentanos tu obra y te indicamos el alcance topografico adecuado.</h2>
            </div>
            <a className="button primary" href="#cotizar">
              Cotizar este servicio
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function ProjectBody({ project }: { project: any }) {
  const images = [project.image, ...(project.gallery || [])].filter(Boolean);
  const progressItems = project.progress || [];

  return (
    <section className="project-body">
      <div className="container project-detail-grid">
        <div className="project-main">
          <section className="evidence-section">
            <div className="section-heading compact">
              <p className="eyebrow">Evidencia de campo</p>
              <h2>Registro visual del proyecto</h2>
            </div>
            <div className="evidence-grid">
              {images.map((image: string, index: number) => (
                <figure className={index === 0 ? "wide" : ""} key={`${image}-${index}`}>
                  <img src={assetPath(image)} alt={`${project.title} evidencia ${index + 1}`} />
                </figure>
              ))}
            </div>
          </section>
          <section className="insight-grid">
            <article>
              <p>Reto</p>
              <h3>{project.challenge || "Condiciones de campo y coordinacion tecnica."}</h3>
            </article>
            <article>
              <p>Solucion</p>
              <h3>{project.solution || "Metodologia de medicion, control y entrega."}</h3>
            </article>
            <article>
              <p>Resultado</p>
              <h3>{project.result || "Entregables tecnicos para decisiones de obra."}</h3>
            </article>
          </section>
          <section className="progress-panel">
            <p className="eyebrow">Avance documentado</p>
            <h2>Trazabilidad preparada para Terraqo</h2>
            <div className="progress-list">
              {progressItems.map(([progressTitle, body]: [string, string], index: number) => (
                <div key={progressTitle}>
                  <strong>{String(index + 1).padStart(2, "0")}</strong>
                  <span>
                    <b>{progressTitle}</b>
                    {body}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
        <aside className="sticky-spec">
          <div className="spec-card">
            <p className="eyebrow">Ficha del proyecto</p>
            <h3>{project.status || "Publicado"}</h3>
            <dl>
              <div>
                <dt>Rubro</dt>
                <dd>{project.sector}</dd>
              </div>
              <div>
                <dt>Cliente</dt>
                <dd>{project.clientName || "Cliente no publicado"}</dd>
              </div>
              <div>
                <dt>Ubicacion</dt>
                <dd>{project.location || "Por confirmar"}</dd>
              </div>
              <div>
                <dt>Fuente</dt>
                <dd>Terraqo Workspace</dd>
              </div>
            </dl>
          </div>
          <div className="spec-card">
            <p className="eyebrow">Servicios aplicados</p>
            <div className="tag-list">{(project.services || []).map((service: string) => <span key={service}>{service}</span>)}</div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default function DetailPage({ item, type }: { item: any; type: DetailKind }) {
  if (!item) notFound();
  if (type === "product") return <ProductDetail product={item} />;

  const isService = type === "service";
  const title = titleOf(item);
  const metrics =
    item.metrics ||
    (isService
      ? [
          ["Uso", item.metric || "Topografia"],
          ["Entrega", (item.deliverables || [])[0] || "Informe tecnico"],
          ["Control", (item.equipment || [])[0] || "Equipo ICC"],
        ]
      : [
          ["Control", item.metric || "Trazabilidad"],
          ["Ubicacion", item.location || "Por confirmar"],
          ["Estado", item.status || "Publicado"],
        ]);
  const resultItems = (isService ? item.deliverables : String(item.result || "").split(";")).filter(Boolean);

  return (
    <>
      <section className={`detail-hero ${isService ? "service-detail-hero" : ""}`}>
        {!isService ? <img src={assetPath(item.image)} alt={title} /> : null}
        <div className="detail-overlay" />
        <div className="container detail-content">
          <a className="back-link" href={isService ? "/servicios/" : "/"}>
            {isService ? "Volver a servicios" : "Volver a inicio"}
          </a>
          <div className="detail-hero-grid">
            <div>
              <div className="detail-badges">
                <span>{isService ? item.category || "Servicio ICC" : item.sector}</span>
                <span>{isService ? "Cotizacion guiada" : item.status || "Publicado"}</span>
              </div>
              <p className="eyebrow">{isService ? "Servicio topografico ICC" : "Caso tecnico ICC"}</p>
              <h1>{title}</h1>
              <p>{item.summary}</p>
              <div className="detail-facts">
                {metrics.map(([label, value]: [string, string]) => (
                  <div key={label}>
                    <small>{label}</small>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
            <aside className="result-panel">
              <p className="eyebrow">{isService ? "Que recibes" : "Resultado operativo"}</p>
              <h2>{isService ? "Una propuesta con alcance, plazo y entregables claros" : "Logros tecnicos del servicio"}</h2>
              <div className="result-list">
                {resultItems.map((entry: string) => (
                  <div key={String(entry).slice(0, 80)}>
                    <span />
                    <p>{String(entry).trim()}</p>
                  </div>
                ))}
              </div>
              <a className="button primary full" href="#cotizar">
                {isService ? "Solicitar cotizacion" : "Cotizar proyecto similar"}
              </a>
            </aside>
          </div>
        </div>
      </section>
      {isService ? <ServiceBody service={item} /> : <ProjectBody project={item} />}
      <QuoteSection title={title} />
    </>
  );
}
