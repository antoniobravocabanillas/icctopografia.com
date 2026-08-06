import StoreClient from "../components/StoreClient";
import { getPublicContent } from "../lib/public-content";
import { cleanArray, cleanText } from "../lib/text";

export const revalidate = 300;

export default async function StorePage() {
  const content = await getPublicContent();
  const products = content.products.map((product) => ({
    ...product,
    name: cleanText(product.name),
    title: cleanText(product.title),
    category: cleanText(product.category),
    brand: cleanText(product.brand),
    model: cleanText(product.model),
    summary: cleanText(product.summary),
    availability: cleanText(product.availability),
    tags: cleanArray(product.tags),
    specs: Object.fromEntries(Object.entries((product as any).specs || (product as any).specifications || {}).map(([key, value]) => [cleanText(key), cleanText(value)])),
  }));
  const categories = content.categories.map((category) => ({
    ...category,
    name: cleanText(category.name),
  }));
  const featured = products[0];

  return (
    <>
      <section className="section store-hero store-hero-premium">
        <div className="container store-hero-grid">
          <div className="store-hero-copy">
            <p className="eyebrow">Soluciones técnicas ICC</p>
            <h1>Tecnología, equipos y servicios especializados para proyectos de ingeniería.</h1>
            <p>
              El catálogo vendible se administra desde el ecosistema Terraqo, pero aquí se presenta como una experiencia
              comercial de ICC: selección técnica, cotización y acompañamiento para construcción, minería,
              infraestructura, energía, catastro y geomática.
            </p>
            <div className="store-hero-actions">
              <a className="button primary" href="#catalogo-tienda">
                Explorar soluciones
              </a>
              <a className="button secondary ink" href="/contacto/">
                Hablar con un asesor técnico
              </a>
            </div>
          </div>
          {featured ? (
            <a className="store-featured-device reveal" href={`/tienda/${featured.slug}/`}>
              <img src={(featured.mainImage || "/images/equipo-topografico.jpg").replace(/^\.\/public\//, "/")} alt={featured.name} />
              <div>
                <p className="eyebrow">Equipo destacado</p>
                <h2>{featured.name}</h2>
                <span>{featured.category}</span>
              </div>
              <strong>Ver ficha técnica -&gt;</strong>
            </a>
          ) : null}
          <div className="store-hero-proof" aria-label="Ventajas de la tienda técnica ICC">
            {[
              ["Uso", "Asesoría según obra"],
              ["Stock", "Disponibilidad visible"],
              ["Soporte", "Ficha y cotización"],
            ].map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div id="catalogo-tienda" />
      <StoreClient products={products} categories={categories} />
    </>
  );
}
