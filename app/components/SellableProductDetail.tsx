import Link from "next/link";
import { assetPath, formatPrice, productSpecs, SellableProduct } from "../lib/sellable-store";
import { AddToCartAction } from "./SellableStoreActions";
import ProductCard from "./ProductCard";

export default function SellableProductDetail({ product, related }: { product: SellableProduct; related: SellableProduct[] }) {
  const images = [product.mainImage, ...(product.images || [])].filter(Boolean) as string[];
  const uniqueImages = Array.from(new Set(images.length ? images : ["/images/equipo-topografico-store.jpg"]));
  const specs = Object.entries(productSpecs(product));
  const quoteOnly = Boolean(product.requiresQuote || !product.price);

  return (
    <>
      <section className="product-detail-shell">
        <div className="container product-detail-grid">
          <div className="product-gallery-panel">
            <div className="breadcrumb">Inicio / Tienda técnica / {product.category} / {product.brand}</div>
            <div className="main-product-image">
              <span>{product.badge || (Number(product.stock) > 0 ? "En stock" : "Cotizar")}</span>
              <img src={assetPath(uniqueImages[0])} alt={product.name} />
            </div>
            <div className="thumb-row">
              {uniqueImages.slice(0, 5).map((image) => (
                <img src={assetPath(image)} alt={`${product.name} vista`} key={image} />
              ))}
            </div>
            <div className="product-proof-row">
              <span><b>Precisión</b>{String(productSpecs(product).Precision || productSpecs(product).Precisión || "Técnica")}</span>
              <span><b>Stock</b>{Number(product.stock || 0) > 0 ? `${product.stock} unidades` : "A validar"}</span>
              <span><b>Soporte</b>Especializado</span>
              <span><b>Entrega</b>Coordinada</span>
            </div>
          </div>

          <aside className="product-buy-panel">
            <p className="eyebrow">{product.brand}</p>
            <h1>{product.name}</h1>
            <div className="rating-line">
              <span>★★★★★</span>
              <b>4.8</b>
              <small>(validación técnica)</small>
            </div>
            <p>{product.summary}</p>
            <div className="product-price-block">
              <strong>{formatPrice(product.price, product.currency)}</strong>
              <small>{quoteOnly ? "Precio referencial, requiere validación comercial" : "Incluye IGV referencial"}</small>
            </div>
            <AddToCartAction product={product} label="Agregar al carrito" />
            <Link className="store-action-button ghost full" href="/checkout/">Ir al checkout</Link>
            <div className="micro-actions">
              <button type="button">♡ Agregar a favoritos</button>
              <button type="button">⇄ Comparar</button>
            </div>
          </aside>
        </div>
      </section>

      <section className="product-tabs-section">
        <div className="container product-tabs-grid">
          <div className="product-description-card">
            <div className="tab-row">
              <span className="is-active">Descripción</span>
              <span>Especificaciones</span>
              <span>Incluye</span>
              <span>Descargas</span>
            </div>
            <p>{product.description || product.summary}</p>
            <ul>
              {specs.slice(0, 7).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {String(value)}
                </li>
              ))}
              {!specs.length ? <li>Ficha técnica administrada desde el workspace Terraqo del cliente.</li> : null}
            </ul>
          </div>
          <aside className="delivery-card">
            <span>Envíos a todo el Perú</span>
            <span>Garantía oficial</span>
            <span>Soporte técnico especializado</span>
            <span>Pedido trazable en Terraqo</span>
          </aside>
        </div>
      </section>

      <section className="related-products-section">
        <div className="container">
          <div className="section-heading compact">
            <p className="eyebrow">Productos relacionados</p>
            <h2>Más soluciones para tu operación técnica.</h2>
          </div>
          <div className="product-grid">
            {related.slice(0, 3).map((item) => (
              <ProductCard product={item} key={item.slug} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
