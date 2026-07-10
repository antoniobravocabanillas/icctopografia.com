"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";

export default function StoreClient({ products, categories }: { products: any[]; categories: any[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [sort, setSort] = useState("featured");
  const [compare, setCompare] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

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
        const haystack = [product.name, product.brand, product.model, product.summary, product.category, ...(product.tags || [])]
          .join(" ")
          .toLowerCase();
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
        return Number(right.featured || 0) - Number(left.featured || 0);
      });
  }, [availability, category, products, query, sort]);

  const selected = products.filter((product) => compare.includes(product.slug));

  const toggleCompare = (slug: string) => {
    setCompare((current) => (current.includes(slug) ? current.filter((item) => item !== slug) : current.concat(slug).slice(-4)));
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
    setAvailability("all");
    setSort("featured");
  };

  return (
    <>
      <section className="store-section">
        <div className="container store-layout" data-store>
          <aside className="store-filters">
            <div>
              <p className="eyebrow">Buscar</p>
              <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Equipo, marca, modelo o uso" />
            </div>
            <div>
              <p className="eyebrow">Categorias</p>
              <div className="filter-stack">
                {categoryOptions.map((item) => (
                  <button
                    className={`filter-button${category === item.slug ? " is-active" : ""}`}
                    type="button"
                    key={item.slug}
                    onClick={() => setCategory(item.slug)}
                  >
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
                  ["quote", "Cotizacion"],
                  ["stock", "Stock"],
                ].map(([value, label]) => (
                  <button
                    className={`filter-button${availability === value ? " is-active" : ""}`}
                    type="button"
                    data-value={value}
                    key={value}
                    onClick={() => setAvailability(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow">Orden</p>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="featured">Destacados</option>
                <option value="price-asc">Precio menor a mayor</option>
                <option value="price-desc">Precio mayor a menor</option>
                <option value="name">Nombre A-Z</option>
              </select>
            </div>
            <button className="clear-button" type="button" onClick={clearFilters}>
              Limpiar filtros
            </button>
          </aside>

          <div className="store-content">
            <div className="store-toolbar">
              <p>{visible.length} equipos disponibles</p>
              <button className="compare-open" type="button" disabled={compare.length < 2} onClick={() => setModalOpen(true)}>
                Comparar equipos ({compare.length})
              </button>
            </div>
            <div className="compare-strip">
              {selected.map((product) => (
                <span key={product.slug}>{product.name}</span>
              ))}
            </div>
            <div className="product-grid">
              {visible.map((product) => (
                <ProductCard key={product.slug} product={product} selected={compare.includes(product.slug)} onCompare={toggleCompare} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="compare-modal" hidden={!modalOpen} onClick={(event) => event.target === event.currentTarget && setModalOpen(false)}>
        <div className="compare-dialog" role="dialog" aria-modal="true" aria-label="Comparador de equipos">
          <div className="compare-head">
            <div>
              <p className="eyebrow">Comparador tecnico</p>
              <h2>Equipos seleccionados</h2>
            </div>
            <button type="button" onClick={() => setModalOpen(false)}>
              Cerrar
            </button>
          </div>
          <div className="compare-body">
            {selected.map((product) => (
              <article key={product.slug}>
                <h3>{product.name}</h3>
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
                  {Object.entries(product.specs || {}).map(([key, value]) => (
                    <div key={key}>
                      <dt>{key}</dt>
                      <dd>{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
