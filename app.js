(function () {
  const data = window.TERRAQO_DATA || { services: [], projects: [] };
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const directoryDepth = Math.max(0, pathParts.length - (window.location.pathname.endsWith("/") ? 0 : 1));
  const basePath = "../".repeat(directoryDepth);
  const assetPath = (path) => path ? `${basePath}${path.replace(/^\.\//, "")}` : "";

  const serviceGrid = document.querySelector("[data-services]");
  const projectGrid = document.querySelector("[data-projects]");

  if (serviceGrid) {
    serviceGrid.innerHTML = data.services.map((service) => `
      <article class="service-card reveal">
        <span></span>
        <div class="card-meta">${service.metric} / ${service.metricLabel}</div>
        <h3>${service.title}</h3>
        <p>${service.summary}</p>
        <a class="text-link" href="${basePath}servicios/${service.slug}/">Ver servicio</a>
      </article>
    `).join("");
  }

  if (projectGrid) {
    projectGrid.innerHTML = data.projects.map((project) => `
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

  const revealItems = Array.from(document.querySelectorAll(".reveal, .service-card, .project-card, .process-item"));
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
