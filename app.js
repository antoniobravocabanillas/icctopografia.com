(function () {
  const data = window.TERRAQO_DATA || { services: [], projects: [], products: [] };
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const directoryDepth = Math.max(0, pathParts.length - (window.location.pathname.endsWith("/") ? 0 : 1));
  const basePath = "../".repeat(directoryDepth);
  const assetPath = (path) => {
    if (!path) return "";
    if (/^https?:\/\//.test(path)) return path;
    return `${basePath}${path.replace(/^\.\//, "")}`;
  };
  const take = (items, root) => {
    const limit = Number(root.getAttribute("data-limit") || 0);
    return limit > 0 ? items.slice(0, limit) : items;
  };

  const serviceGrid = document.querySelector("[data-services]");
  const projectGrid = document.querySelector("[data-projects]");
  const productGrid = document.querySelector("[data-products]");
  const storeRoot = document.querySelector("[data-store]");
  let revealObserver = null;

  if (serviceGrid) {
    serviceGrid.innerHTML = take(data.services, serviceGrid).map((service) => `
      <article class="service-card reveal">
        <span></span>
        <div class="card-meta">${service.category || "Topografia"} / ${service.metric || "QA/QC"}</div>
        <h3>${service.title}</h3>
        <p>${service.summary}</p>
        <a class="text-link" href="${basePath}servicios/${service.slug}/">Ver servicio</a>
      </article>
    `).join("");
  }

  if (projectGrid) {
    projectGrid.innerHTML = take(data.projects, projectGrid).map((project) => `
      <article class="project-card reveal">
        <a href="${basePath}casos-exito/${project.slug}/">
          <img src="${assetPath(project.image)}" alt="${project.title}" />
          <div>
            <span class="card-meta">${project.sector} / ${project.location}</span>
            <h3>${project.title}</h3>
            <p>${project.summary}</p>
            <span class="text-link">Ver caso de exito</span>
          </div>
        </a>
      </article>
    `).join("");
  }

  if (productGrid && !storeRoot) {
    productGrid.innerHTML = take(data.products, productGrid).map((product) => {
      const price = product.price ? `${product.currency || "USD"} ${Number(product.price).toLocaleString("en-US")}` : "Cotizar";
      return `
        <article class="product-card reveal">
          <a href="${basePath}tienda/${product.slug}/">
            <div class="product-media"><img src="${assetPath(product.mainImage || "./public/images/equipo-topografico.jpg")}" alt="${product.name}" /></div>
            <div class="product-body">
              <span class="card-meta">${product.category} / ${product.brand}</span>
              <h3>${product.name}</h3>
              <p>${product.summary}</p>
              <div class="product-row"><strong>${price}</strong><span>${product.availability}</span></div>
              <span class="text-link">Ver ficha tecnica</span>
            </div>
          </a>
        </article>
      `;
    }).join("");
  }

  if (storeRoot) initStore(storeRoot);

  const revealItems = Array.from(document.querySelectorAll(".reveal, .service-card, .project-card, .product-card, .process-item"));
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });
  revealItems.forEach((item) => revealObserver.observe(item));

  const parallaxItems = Array.from(document.querySelectorAll("[data-parallax]"));
  let ticking = false;
  function updateParallax() {
    const y = window.scrollY || 0;
    parallaxItems.forEach((item) => {
      const speed = Number(item.getAttribute("data-parallax")) || 0.08;
      item.style.transform = `translate3d(0, ${y * speed}px, 0)`;
    });
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  function initStore(root) {
    const products = data.products || [];
    const categories = data.categories || [];
    const state = {
      query: "",
      category: "all",
      availability: "all",
      sort: "featured",
      compare: [],
    };
    const search = root.querySelector("[data-store-search]");
    const categoryBox = root.querySelector("[data-store-categories]");
    const availabilityButtons = Array.from(root.querySelectorAll("[data-store-availability] button"));
    const sort = root.querySelector("[data-store-sort]");
    const clear = root.querySelector("[data-store-clear]");
    const count = root.querySelector("[data-store-count]");
    const grid = root.querySelector("[data-store-products]");
    const compareStrip = root.querySelector("[data-store-compare-strip]");
    const compareOpen = root.querySelector("[data-store-compare-open]");
    const modal = document.querySelector("[data-store-compare-modal]");
    const modalBody = modal ? modal.querySelector("[data-store-compare-body]") : null;

    renderCategories();
    renderStore();

    search?.addEventListener("input", (event) => {
      state.query = event.target.value.trim().toLowerCase();
      renderStore();
    });
    sort?.addEventListener("change", (event) => {
      state.sort = event.target.value;
      renderStore();
    });
    clear?.addEventListener("click", () => {
      state.query = "";
      state.category = "all";
      state.availability = "all";
      state.sort = "featured";
      if (search) search.value = "";
      if (sort) sort.value = "featured";
      renderCategories();
      renderStore();
    });
    availabilityButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.availability = button.dataset.value || "all";
        renderStore();
      });
    });
    compareOpen?.addEventListener("click", () => openCompare());
    modal?.addEventListener("click", (event) => {
      if (event.target.matches("[data-store-compare-modal], [data-store-compare-close]")) {
        modal.hidden = true;
      }
    });

    function renderCategories() {
      if (!categoryBox) return;
      const known = categories.length ? categories : Array.from(new Set(products.map((product) => product.categorySlug || product.category))).map((name) => ({ slug: name, name }));
      const options = [{ slug: "all", name: "Todas", count: products.length }].concat(known.map((category) => ({
        ...category,
        count: products.filter((product) => (product.categorySlug || product.category) === category.slug || product.category === category.name).length,
      })));
      categoryBox.innerHTML = options.map((category) => `
        <button class="filter-button ${state.category === category.slug ? "is-active" : ""}" type="button" data-category="${category.slug}">
          <span>${category.name}</span><strong>${category.count}</strong>
        </button>
      `).join("");
      categoryBox.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
          state.category = button.dataset.category || "all";
          renderCategories();
          renderStore();
        });
      });
    }

    function renderStore() {
      const visible = products.filter(matchesFilters).sort(sortProducts);
      availabilityButtons.forEach((button) => button.classList.toggle("is-active", state.availability === (button.dataset.value || "all")));
      if (count) count.textContent = `${visible.length} equipos disponibles`;
      if (grid) {
        grid.innerHTML = visible.map(renderProductCard).join("") || `<div class="empty-state">No hay equipos con esos filtros.</div>`;
        grid.querySelectorAll("[data-compare]").forEach((button) => {
          button.addEventListener("click", (event) => {
            event.preventDefault();
            toggleCompare(button.dataset.compare);
          });
          button.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              toggleCompare(button.dataset.compare);
            }
          });
        });
      }
      renderCompareStrip();
      refreshRevealObserver();
    }

    function matchesFilters(product) {
      const text = [product.name, product.brand, product.model, product.summary, product.category, product.availability].filter(Boolean).join(" ").toLowerCase();
      const categoryMatch = state.category === "all" || product.categorySlug === state.category || product.category === state.category;
      const queryMatch = !state.query || text.includes(state.query);
      const availability = String(product.availability || "").toLowerCase();
      const availabilityMatch =
        state.availability === "all" ||
        (state.availability === "priced" && product.price) ||
        (state.availability === "quote" && (!product.price || product.requiresQuote)) ||
        (state.availability === "stock" && (Number(product.stock) > 0 || availability.includes("stock") || availability.includes("disponible")));
      return categoryMatch && queryMatch && availabilityMatch;
    }

    function sortProducts(left, right) {
      if (state.sort === "price-asc") return Number(left.price || Infinity) - Number(right.price || Infinity);
      if (state.sort === "price-desc") return Number(right.price || 0) - Number(left.price || 0);
      if (state.sort === "name") return String(left.name).localeCompare(String(right.name));
      return Number(right.featured || 0) - Number(left.featured || 0);
    }

    function renderProductCard(product) {
      const price = product.price ? `${product.currency || "USD"} ${Number(product.price).toLocaleString("en-US")}` : "Cotizar";
      const selected = state.compare.includes(product.slug);
      return `
        <article class="product-card store-card reveal">
          <a href="${basePath}tienda/${product.slug}/">
            <div class="product-media"><img src="${assetPath(product.mainImage || "./public/images/equipo-topografico.jpg")}" alt="${product.name}" /></div>
            <div class="product-body">
              <span class="card-meta">${product.category} / ${product.brand}</span>
              <h3>${product.name}</h3>
              <p>${product.summary}</p>
              <div class="product-row"><strong>${price}</strong><span>${product.availability}</span></div>
              <span class="text-link">Ver ficha tecnica</span>
            </div>
          </a>
          <div class="product-card-tools">
            <button class="compare-button ${selected ? "is-active" : ""}" type="button" data-compare="${product.slug}">${selected ? "Quitar de comparacion" : "Comparar equipo"}</button>
          </div>
        </article>
      `;
    }

    function toggleCompare(slug) {
      if (!slug) return;
      if (state.compare.includes(slug)) {
        state.compare = state.compare.filter((item) => item !== slug);
      } else {
        state.compare = state.compare.concat(slug).slice(-4);
      }
      renderStore();
    }

    function renderCompareStrip() {
      const selected = products.filter((product) => state.compare.includes(product.slug));
      if (compareOpen) {
        compareOpen.textContent = `Comparar equipos (${selected.length})`;
        compareOpen.disabled = selected.length < 2;
      }
      if (!compareStrip) return;
      compareStrip.innerHTML = selected.length ? selected.map((product) => `
        <button type="button" data-compare="${product.slug}">${product.name}<span>Quitar</span></button>
      `).join("") : `<p>Selecciona hasta 4 equipos para comparar especificaciones, precio y disponibilidad.</p>`;
      compareStrip.querySelectorAll("[data-compare]").forEach((button) => {
        button.addEventListener("click", () => toggleCompare(button.dataset.compare));
      });
    }

    function openCompare() {
      const selected = products.filter((product) => state.compare.includes(product.slug));
      if (!modal || !modalBody || selected.length < 2) return;
      modalBody.innerHTML = `
        <table class="compare-table">
          <tbody>
            ${compareRow("Equipo", selected.map((product) => product.name))}
            ${compareRow("Marca / modelo", selected.map((product) => `${product.brand || "Consultar"} ${product.model || ""}`.trim()))}
            ${compareRow("Categoria", selected.map((product) => product.category || "Topografia"))}
            ${compareRow("Precio", selected.map((product) => product.price ? `${product.currency || "USD"} ${Number(product.price).toLocaleString("en-US")}` : "Cotizar"))}
            ${compareRow("Disponibilidad", selected.map((product) => product.availability || "Consultar"))}
            ${compareRow("Uso", selected.map((product) => product.summary || "Ficha tecnica"))}
          </tbody>
        </table>
      `;
      modal.hidden = false;
    }

    function compareRow(label, values) {
      return `<tr><th>${label}</th>${values.map((value) => `<td>${value}</td>`).join("")}</tr>`;
    }
  }

  function refreshRevealObserver() {
    if (!revealObserver) return;
    const freshItems = Array.from(document.querySelectorAll(".reveal:not(.is-visible)"));
    freshItems.forEach((item) => revealObserver.observe(item));
  }
})();
