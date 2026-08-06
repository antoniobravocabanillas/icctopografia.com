import Link from "next/link";
import { assetPath, formatPrice, productSpecs, SellableProduct } from "../lib/sellable-store";
import { AddToCartAction } from "./SellableStoreActions";

export default function ProductCard({
  product,
  selected = false,
  onCompare,
}: {
  product: SellableProduct;
  selected?: boolean;
  onCompare?: (slug: string) => void;
}) {
  const specs = productSpecs(product);
  const specEntries = Object.entries(specs).slice(0, 3);

  return (
    <article className="product-card store-card reveal sellable-product-card">
      <div className="product-media">
        <Link href={`/tienda/${product.slug}/`} aria-label={`Ver ficha de ${product.name}`}>
          <img src={assetPath(product.mainImage || product.images?.[0])} alt={product.name} />
        </Link>
        <span className="store-badge">{product.badge || (Number(product.stock) > 0 ? "En stock" : "Cotizar")}</span>
        <button className="favorite-button" type="button" aria-label="Agregar a favoritos">
          ♡
        </button>
      </div>
      <div className="product-body">
        <span className="card-meta">
          {product.category} / {product.brand}
        </span>
        <Link href={`/tienda/${product.slug}/`}>
          <h3>{product.name}</h3>
        </Link>
        <p>{product.summary}</p>
        {specEntries.length ? (
          <div className="mini-spec-grid">
            {specEntries.map(([key, value]) => (
              <span key={key}>
                <small>{key}</small>
                <strong>{String(value)}</strong>
              </span>
            ))}
          </div>
        ) : null}
        <div className="stock-line">
          <span /> {product.availability || (Number(product.stock) > 0 ? "Stock disponible" : "Bajo cotización")}
        </div>
        <div className="product-row">
          <strong>{formatPrice(product.price, product.currency)}</strong>
          <span>{product.requiresQuote ? "Cotización guiada" : "Compra directa"}</span>
        </div>
        <div className="product-actions">
          <Link className="store-action-button ghost" href={`/tienda/${product.slug}/`}>
            Ver ficha
          </Link>
          <AddToCartAction product={product} label="Agregar" />
        </div>
        {onCompare ? (
          <button className={`compare-button${selected ? " is-active" : ""}`} type="button" onClick={() => onCompare(product.slug)}>
            {selected ? "Quitar de comparación" : "Comparar equipo"}
          </button>
        ) : null}
      </div>
    </article>
  );
}
