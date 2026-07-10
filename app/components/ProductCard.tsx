import Link from "next/link";

const assetPath = (path?: string) => (path || "/images/equipo-topografico.jpg").replace(/^\.\/public\//, "/").replace(/^\.\/+/, "/");

export default function ProductCard({ product, selected = false, onCompare }: { product: any; selected?: boolean; onCompare?: (slug: string) => void }) {
  const price = product.price ? `${product.currency || "USD"} ${Number(product.price).toLocaleString("en-US")}` : "Cotizar";

  return (
    <article className="product-card store-card reveal">
      <Link href={`/tienda/${product.slug}/`}>
        <div className="product-media">
          <img src={assetPath(product.mainImage)} alt={product.name} />
        </div>
        <div className="product-body">
          <span className="card-meta">
            {product.category} / {product.brand}
          </span>
          <h3>{product.name}</h3>
          <p>{product.summary}</p>
          <div className="product-row">
            <strong>{price}</strong>
            <span>{product.availability}</span>
          </div>
          <span className="text-link">Ver ficha tecnica</span>
        </div>
      </Link>
      {onCompare ? (
        <div className="product-card-tools">
          <button className={`compare-button${selected ? " is-active" : ""}`} type="button" onClick={() => onCompare(product.slug)}>
            {selected ? "Quitar de comparacion" : "Comparar equipo"}
          </button>
        </div>
      ) : null}
    </article>
  );
}
