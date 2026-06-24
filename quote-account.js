(function () {
  const storageKey = "icc_topografia_accounts";
  const sessionKey = "icc_topografia_session";
  const normalizeEmail = (value) => String(value || "").trim().toLowerCase();
  const makePassword = () => `ICC-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${String(Date.now()).slice(-4)}`;
  const readAccounts = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch (error) {
      return [];
    }
  };
  const writeAccounts = (accounts) => localStorage.setItem(storageKey, JSON.stringify(accounts));

  function bindQuoteForm(form) {
    form.addEventListener("submit", async (event) => {
      const data = new FormData(form);
      const email = normalizeEmail(data.get("correo") || data.get("email"));
      if (!email) return;
      event.preventDefault();

      const accounts = readAccounts();
      let account = accounts.find((item) => item.email === email);
      const password = account?.password || makePassword();
      const quote = {
        id: `quote-${Date.now()}`,
        date: new Date().toLocaleDateString("es-PE"),
        name: String(data.get("nombre") || "").trim(),
        company: String(data.get("empresa") || "").trim(),
        phone: String(data.get("telefono") || "").trim(),
        email,
        service: String(data.get("servicio") || "Servicio topografico").trim(),
        scope: String(data.get("alcance") || "").trim(),
        interestedEquipment: data.get("interes_equipos") === "si",
        status: "Recibida",
      };

      if (account) {
        account = { ...account, quotes: [quote].concat(account.quotes || []) };
        writeAccounts(accounts.map((item) => item.email === email ? account : item));
      } else {
        account = {
          id: `icc-${Date.now()}`,
          name: quote.name,
          company: quote.company,
          phone: quote.phone,
          email,
          password,
          quotes: [quote],
          createdAt: new Date().toISOString(),
          source: "quote-form",
        };
        writeAccounts(accounts.concat(account));
      }

      localStorage.setItem(sessionKey, email);
      sendCredentialDraft(account, quote, password);
      await submitLead(form, data, quote);
      window.location.href = `${form.dataset.accountRedirect || "./cuenta/"}?quote=created`;
    });
  }

  async function submitLead(form, data, quote) {
    const body = new URLSearchParams();
    body.set("form-name", form.getAttribute("name") || "cotizacion");
    data.forEach((value, key) => body.set(key, value));
    body.set("correo", quote.email);
    body.set("estado", quote.status);
    body.set("origen", "icc-topografia-web");
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
    } catch (error) {
      sessionStorage.setItem("icc_last_lead_sync_error", "netlify-form");
    }
  }

  function sendCredentialDraft(account, quote, password) {
    const subject = encodeURIComponent("Acceso a tu cuenta ICC Topografia");
    const body = encodeURIComponent([
      `Hola ${account.name || "cliente"},`,
      "",
      "Hemos registrado tu solicitud de cotizacion en ICC Topografia.",
      "",
      `Usuario: ${account.email}`,
      `Contrasena temporal: ${password}`,
      "",
      `Servicio solicitado: ${quote.service}`,
      "",
      "Ingresa al portal del cliente para revisar tu historial de cotizaciones.",
      "https://icctopografia.com/cuenta/",
    ].join("\n"));
    const draft = `mailto:${account.email}?subject=${subject}&body=${body}`;
    sessionStorage.setItem("icc_last_credential_mailto", draft);
  }

  document.querySelectorAll(".quote-form").forEach(bindQuoteForm);
})();
