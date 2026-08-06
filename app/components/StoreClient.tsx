"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";

export default function StoreClient({ products, categories }: { products: any[]; categories: any[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [sort, setSort] = useState("featured");
  const [compare, setCompare] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const categoryOptions = useMemo(
    () => [
      { slug: "all", name: "Todas", count: products.length },
      ...categories.map((item) => ({
        ...item,
        count: products.filter((product) => (product.categorySlug || product.category) === item.slug || product.category === item.name).length,
      })),
    ],
    [categories, products],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products
      .filter((product) => {
        const haystack = [product.name, product.brand, product.model, product.summary, product.category, ...(product.tags || [])].join(" ").toLowerCase();
        if (needle && !haystack.includes(needle)) return false;
        if (category !== "all" && (product.categorySlug || product.category) !== category && product.category !== category) return false;
        if (availability === "priced" && !product.price) return false;
        if (availability === "quote" && !product.requiresQuote) return false;
        if (availability === "stock" && !(Number(product.stock) > 0)) return false;
        return true;
      })
      .sort((left, right) => {
        if (sort === "price-asc") return Number(left.price || Number.MAX_SAFE_INTEGER) - Number(right.price || Number.MAX_SAFE_INTEGER);
        if (sort === "price-desc") return Number(right.price || 0) - Number(left.price || 0);
        if (sort === "name") return String(left.name).localeCompare(String(right.name));
        return Number(right.isFeatured || right.featured || 0) - Number(left.isFeatured || left.featured || 0);
      });
  }, [availability, category, products, query, sort]);

  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
  const paged = visible.slice((page - 1) * pageSize, page * pageSize);
  const selected = products.filter((product) => compare.includes(product.slug));

  function setFilter(next: () => void) {
    next();
    setPage(1);
  }

  const toggleCompare = (slug: string) => setCompare((current) => (current.includes(slug) ? current.filter((item) => item !== slug) : current.concat(slug).slice(-4)));

  return (
    <section className="store-section sellable-store-section">
      <div className="container store-layout" data-store>
        <aside className="store-filters sellable-filters">
          <label>
            <span className="eyebrow">Buscar producto</span>
            <input value={query} onChange={(event) => setFilter(() => setQuery(event.target.value))} type="search" placeholder="Equipo, marca, modelo o uso..." />
          </label>
          <div>
            <p className="eyebrow">Categorías</p>
            <div className="filter-stack">
              {categoryOptions.map((item) => (
                <button className={`filter-button${category === item.slug ? " is-active" : ""}`} type="button" key={item.slug} onClick={() => setFilter(() => setCategory(item.slug))}>
                  <span>{item.name}</span>
                  <strong>{item.count}</strong>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow">Disponibilidad</p>
            <div className="filter-grid">
              {[
                ["all", "Todos"],
                ["priced", "Con precio"],
                ["quote", "Cotización"],
                ["stock", "Stock"],
              ].map(([value, label]) => (
                <button className={`filter-button${availability === value ? " is-active" : ""}`} type="button" key={value} onClick={() => setFilter(() => setAvailability(value))}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow">Ordenar por</p>
            <select value={sort} onChange={(event) => setFilter(() => setSort(event.target.value))}>
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio menor a mayor</option>
              <option value="price-desc">Precio mayor a menor</option>
              <option value="name">Nombre A-Z</option>
            </select>
          </div>
          <button className="clear-button" type="button" onClick={() => setFilter(() => { setQuery(""); setCategory("all"); setAvailability("all"); setSort("featured"); })}>
            Limpiar filtros
          </button>
        </aside>

        <div className="store-content">
          <div className="store-toolbar">
            <p>{visible.length} equipos disponibles</p>
            <div>
              <select aria-label="Ordenar productos" value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="featured">Destacados</option>
                <option value="price-asc">Menor precio</option>
                <option value="price-desc">Mayor precio</option>
              </select>
              <button className="compare-open" type="button" disabled={compare.length < 2}>
                Comparar equipos ({compare.length})
              </button>
            </div>
          </div>
          <div className="product-grid">
            {paged.map((product) => (
              <ProductCard key={product.slug} product={product} selected={compare.includes(product.slug)} onCompare={toggleCompare} />
            ))}
          </div>
          <div className="store-pagination">
            <button disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button">Anterior</button>
            <span>{page} / {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} type="button">Siguiente</button>
          </div>
          {selected.length ? <div className="compare-strip">{selected.map((product) => <span key={product.slug}>{product.name}</span>)}</div> : null}
        </div>
      </div>
    </section>
  );
}
