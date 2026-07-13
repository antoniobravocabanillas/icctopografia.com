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
            <p className="eyebrow">Tienda tecnica</p>
            <h1>Equipos topograficos para cotizar con respaldo tecnico.</h1>
            <p>
              Explora estaciones totales, GNSS, drones, LiDAR y accesorios. Si no sabes que equipo corresponde a tu
              obra, te orientamos segun uso, precision requerida y disponibilidad.
            </p>
            <div className="store-hero-actions">
              <a className="button primary" href="#catalogo-tienda">
                Ver catalogo
              </a>
              <a className="button ghost" href="/contacto/">
                Solicitar asesoria
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
              <strong>Ver ficha tecnica -&gt;</strong>
            </a>
          ) : null}
          <div className="store-hero-proof" aria-label="Ventajas de la tienda tecnica">
            {[
              ["Uso", "Asesoria segun obra"],
              ["Stock", "Disponibilidad visible"],
              ["Soporte", "Ficha y cotizacion"],
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
