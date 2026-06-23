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

  if (productGrid) {
    productGrid.innerHTML = take(data.products, productGrid).map((product) => {
      const price = product.price ? `${product.currency || "USD"} ${Number(product.price).toLocaleString("en-US")}` : "Cotizar";
      return `
        <article class="product-card reveal">
          <a href="${basePath}tienda/${product.slug}/">
            <div class="product-media"><img src="${assetPath(product.mainImage || "./public/images/equipo-topografico.jpg")}" alt="${product.name}" /></div>
            <div>
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

  const revealItems = Array.from(document.querySelectorAll(".reveal, .service-card, .project-card, .product-card, .process-item"));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });
  revealItems.forEach((item) => observer.observe(item));

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
})();
