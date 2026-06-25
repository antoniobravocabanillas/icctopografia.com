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

  function initAccountMenu() {
    document.querySelectorAll(".account-link").forEach((link) => {
      const nav = link.closest("nav");
      if (!nav || link.closest(".account-control")) return;

      const href = link.getAttribute("href") || "./cuenta/";
      const active = link.classList.contains("is-active");
      const control = document.createElement("div");
      control.className = "account-control";
      link.parentNode.insertBefore(control, link);
      control.appendChild(link);

      link.setAttribute("role", "button");
      link.setAttribute("aria-haspopup", "true");
      link.setAttribute("aria-expanded", "false");
      link.innerHTML = "<span>Cuenta</span>";

      const menu = document.createElement("div");
      menu.className = "account-menu";
      menu.innerHTML = `
        <a class="account-menu-primary" href="${href}">${active ? "Ver portal" : "Ingresar / registrarse"}</a>
        <a href="https://mail.zoho.com/zm/" target="_blank" rel="noopener noreferrer">Email corporativo</a>
      `;
      control.appendChild(menu);

      const close = () => {
        control.classList.remove("is-open");
        link.setAttribute("aria-expanded", "false");
      };
      const toggle = (event) => {
        event.preventDefault();
        const open = control.classList.toggle("is-open");
        link.setAttribute("aria-expanded", String(open));
      };

      link.addEventListener("click", toggle);
      document.addEventListener("click", (event) => {
        if (!control.contains(event.target)) close();
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") close();
      });
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
      initAccountMenu();
      initScrollState();
    });
  } else {
    initMobileNav();
    initAccountMenu();
    initScrollState();
  }
})();
