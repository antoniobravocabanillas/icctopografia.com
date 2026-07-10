"use client";

import { useMemo, useState } from "react";
import ServiceCard from "./ServiceCard";

type CatalogService = {
  slug: string;
  title: string;
  category: string;
  metric: string;
  summary: string;
  featured?: boolean;
};

type ServicesCatalogProps = {
  services: CatalogService[];
  categories: string[];
};

const PAGE_SIZE = 9;

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export default function ServicesCatalog({ services, categories }: ServicesCatalogProps) {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const cleanQuery = normalize(query.trim());
    return services.filter((service) => {
      const matchesCategory = activeCategory === "Todos" || service.category === activeCategory;
      const haystack = normalize(`${service.title} ${service.category} ${service.metric} ${service.summary}`);
      return matchesCategory && (!cleanQuery || haystack.includes(cleanQuery));
    });
  }, [activeCategory, query, services]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleServices = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const changeCategory = (category: string) => {
    setActiveCategory(category);
    setPage(1);
  };

  const changeQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  return (
    <section className="section services-catalog" id="catalogo-servicios">
      <div className="container">
        <div className="services-catalog-head">
          <div>
            <p className="eyebrow">Catalogo tecnico</p>
            <h2>Encuentra el servicio segun tu obra, terreno o entregable.</h2>
          </div>
          <div className="services-search">
            <label htmlFor="service-search">Buscar servicio</label>
            <input
              id="service-search"
              value={query}
              onChange={(event) => changeQuery(event.target.value)}
              placeholder="Ej. replanteo, catastro, LiDAR, mineria"
            />
          </div>
        </div>

        <div className="services-filter-panel">
          <div className="services-filter-bar" aria-label="Filtrar servicios por categoria">
            {["Todos", ...categories].map((category) => (
              <button
                className={activeCategory === category ? "is-active" : ""}
                key={category}
                type="button"
                onClick={() => changeCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="services-results-meta">
          <span>{filtered.length} servicios disponibles</span>
          <span>
            Pagina {safePage} de {totalPages}
          </span>
        </div>

        {visibleServices.length ? (
          <div className="service-grid services-list-grid">
            {visibleServices.map((service, index) => (
              <ServiceCard key={service.slug} service={service} index={index} />
            ))}
          </div>
        ) : (
          <div className="services-empty">
            <h3>No encontramos un servicio con ese filtro.</h3>
            <p>Prueba con otra palabra clave o vuelve a ver todos los servicios.</p>
            <button type="button" onClick={() => changeCategory("Todos")}>
              Ver todos
            </button>
          </div>
        )}

        <div className="services-pagination" aria-label="Paginacion de servicios">
          <button type="button" disabled={safePage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
            Anterior
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              className={safePage === pageNumber ? "is-active" : ""}
              key={pageNumber}
              type="button"
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          <button
            type="button"
            disabled={safePage === totalPages}
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  );
}
