(function () {
  function initMobileNav() {
    const header = document.querySelector(".site-header");
    const nav = header?.querySelector("nav");
    if (!header || !nav || header.querySelector(".mobile-nav-toggle")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "mobile-nav-toggle";
    button.setAttribute("aria-label", "Abrir menu de navegacion");
    button.setAttribute("aria-expanded", "false");
    button.innerHTML = "<span></span><span></span><span></span>";
    header.insertBefore(button, nav);

    const closeMenu = () => {
      header.classList.remove("is-mobile-open");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Abrir menu de navegacion");
    };
    const toggleMenu = () => {
      const open = header.classList.toggle("is-mobile-open");
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? "Cerrar menu de navegacion" : "Abrir menu de navegacion");
    };

    button.addEventListener("click", toggleMenu);
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  function initScrollState() {
    const update = () => {
      document.body.classList.toggle("is-scrolled", window.scrollY > 80);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initMobileNav();
      initScrollState();
    });
  } else {
    initMobileNav();
    initScrollState();
  }
})();
