(function () {
  const storageKey = "icc_topografia_accounts";
  const sessionKey = "icc_topografia_session";
  const root = document.querySelector("[data-account-app]");
  if (!root) return;

  const readAccounts = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch (error) {
      return [];
    }
  };
  const writeAccounts = (accounts) => localStorage.setItem(storageKey, JSON.stringify(accounts));
  const getSession = () => localStorage.getItem(sessionKey) || "";
  const setSession = (email) => localStorage.setItem(sessionKey, email);
  const clearSession = () => localStorage.removeItem(sessionKey);
  const normalizeEmail = (value) => String(value || "").trim().toLowerCase();
  const makePassword = () => `ICC-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${String(Date.now()).slice(-4)}`;

  function render(message = "") {
    const accounts = readAccounts();
    const activeEmail = getSession();
    const account = accounts.find((item) => item.email === activeEmail);
    root.innerHTML = account ? renderProfile(account, message) : renderAccess(message);
    bindEvents();
  }

  function renderAccess(message) {
    return `
      <section class="account-hero">
        <div class="account-mark" aria-hidden="true"></div>
        <div class="container account-grid">
          <div class="account-intro">
            <p class="eyebrow">Cuenta ICC</p>
            <h1>Portal del cliente topografico</h1>
            <p>Ingresa para gestionar cotizaciones, contactos y solicitudes.</p>
            <span></span>
          </div>
          <div class="account-panel account-flip-panel" data-account-panel>
            ${message ? `<div class="account-alert">${message}</div>` : ""}
            <div class="account-tabs" role="tablist">
              <button class="is-active" type="button" data-account-tab="login">Iniciar sesion</button>
              <button type="button" data-account-tab="register">Registrarse</button>
            </div>
            <div class="account-card-shell">
              <div class="account-card-inner">
                <form class="account-form account-card-face account-card-front is-active" data-account-login>
                  <input name="email" type="email" placeholder="Correo o usuario" required />
                  <input name="password" type="password" placeholder="Contrasena" required />
                  <button type="submit">Ingresar</button>
                  <div class="account-divider"><span>o</span></div>
                  <a class="corporate-mail-button" href="https://mail.zoho.com/zm/" target="_blank" rel="noopener noreferrer">Email corporativo</a>
                </form>
                <form class="account-form account-card-face account-card-back" data-account-register>
                  <input name="name" placeholder="Nombre y apellido" required />
                  <input name="company" placeholder="Empresa" />
                  <input name="phone" placeholder="Telefono / WhatsApp" />
                  <input name="email" type="email" placeholder="Correo" required />
                  <input name="password" type="password" placeholder="Contrasena" required />
                  <button type="submit">Crear cuenta</button>
                  <a class="corporate-mail-button" href="https://mail.zoho.com/zm/" target="_blank" rel="noopener noreferrer">Email corporativo</a>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderProfile(account, message) {
    const quotes = account.quotes || [];
    return `
      <section class="account-hero">
        <div class="container account-grid">
          <div>
            <p class="eyebrow">Perfil cliente</p>
            <h1>${account.name || "Cliente ICC"}</h1>
            <p>${account.company || "Empresa pendiente"} · ${account.email}</p>
            <div class="account-actions">
              <a class="button primary" href="../contacto/">Nueva cotizacion</a>
              <button type="button" data-account-logout>Cerrar sesion</button>
            </div>
          </div>
          <div class="account-panel">
            ${message ? `<div class="account-alert">${message}</div>` : ""}
            <p class="eyebrow">Historial</p>
            <h2>${quotes.length} solicitudes</h2>
            <div class="quote-history">
              ${quotes.length ? quotes.map(renderQuote).join("") : `<p class="muted">Aun no hay cotizaciones asociadas a esta cuenta.</p>`}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderQuote(quote) {
    return `
      <article>
        <span>${quote.date || "Sin fecha"}</span>
        <strong>${quote.service || "Servicio topografico"}</strong>
        <p>${quote.scope || "Solicitud registrada desde la web."}</p>
        <small>${quote.status || "Recibida"}</small>
      </article>
    `;
  }

  function bindEvents() {
    root.querySelectorAll("[data-account-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.dataset.accountTab;
        root.querySelectorAll("[data-account-tab]").forEach((item) => item.classList.toggle("is-active", item === button));
        root.querySelector("[data-account-panel]")?.classList.toggle("is-register", target === "register");
        root.querySelector("[data-account-login]")?.classList.toggle("is-active", target === "login");
        root.querySelector("[data-account-register]")?.classList.toggle("is-active", target === "register");
      });
    });

    root.querySelector("[data-account-login]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const email = normalizeEmail(form.get("email"));
      const password = String(form.get("password") || "");
      const account = readAccounts().find((item) => item.email === email && item.password === password);
      if (!account) return render("Credenciales no encontradas. Revisa tu correo o registrate.");
      setSession(email);
      render("Sesion iniciada correctamente.");
    });

    root.querySelector("[data-account-register]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const email = normalizeEmail(form.get("email"));
      const accounts = readAccounts();
      if (accounts.some((item) => item.email === email)) return render("Ya existe una cuenta con ese correo.");
      const account = {
        id: `icc-${Date.now()}`,
        name: String(form.get("name") || "").trim(),
        company: String(form.get("company") || "").trim(),
        phone: String(form.get("phone") || "").trim(),
        email,
        password: String(form.get("password") || makePassword()),
        quotes: [],
        createdAt: new Date().toISOString(),
      };
      writeAccounts(accounts.concat(account));
      setSession(email);
      render("Cuenta creada. Ya puedes guardar solicitudes y cotizaciones.");
    });

    root.querySelector("[data-account-logout]")?.addEventListener("click", () => {
      clearSession();
      render("Sesion cerrada.");
    });
  }

  function initialMessage() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("quote") !== "created") return "";
    const email = getSession();
    const account = readAccounts().find((item) => item.email === email);
    const draft = sessionStorage.getItem("icc_last_credential_mailto");
    const mailLink = draft ? ` <a href="${draft}">Abrir correo de credenciales</a>` : "";
    return `Solicitud registrada y cuenta creada. Usuario: <strong>${email}</strong>. Contrasena temporal: <strong>${account?.password || "generada"}</strong>.${mailLink}`;
  }

  render(initialMessage());
})();
