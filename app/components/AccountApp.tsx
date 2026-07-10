"use client";

import { FormEvent, useEffect, useState } from "react";

type Account = {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  password: string;
  quotes: Array<{ date?: string; service?: string; scope?: string; status?: string }>;
  createdAt: string;
};

const storageKey = "icc_topografia_accounts";
const sessionKey = "icc_topografia_session";

const readAccounts = (): Account[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "[]");
  } catch {
    return [];
  }
};
const writeAccounts = (accounts: Account[]) => localStorage.setItem(storageKey, JSON.stringify(accounts));
const normalizeEmail = (value: FormDataEntryValue | null) => String(value || "").trim().toLowerCase();

export default function AccountApp() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [session, setSessionState] = useState("");
  const [message, setMessage] = useState("");
  const [register, setRegister] = useState(false);

  useEffect(() => {
    setAccounts(readAccounts());
    setSessionState(localStorage.getItem(sessionKey) || "");
  }, []);

  const account = accounts.find((item) => item.email === session);

  const setSession = (email: string) => {
    localStorage.setItem(sessionKey, email);
    setSessionState(email);
  };

  const login = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = normalizeEmail(form.get("email"));
    const password = String(form.get("password") || "");
    const found = accounts.find((item) => item.email === email && item.password === password);
    if (!found) {
      setMessage("Credenciales no encontradas. Revisa tu correo o registrate.");
      return;
    }
    setSession(email);
    setMessage("Sesion iniciada correctamente.");
  };

  const create = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = normalizeEmail(form.get("email"));
    if (accounts.some((item) => item.email === email)) {
      setMessage("Ya existe una cuenta con ese correo.");
      return;
    }
    const accountData: Account = {
      id: `icc-${Date.now()}`,
      name: String(form.get("name") || "").trim(),
      company: String(form.get("company") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      email,
      password: String(form.get("password") || ""),
      quotes: [],
      createdAt: new Date().toISOString(),
    };
    const next = accounts.concat(accountData);
    writeAccounts(next);
    setAccounts(next);
    setSession(email);
    setMessage("Cuenta creada. Ya puedes guardar solicitudes y cotizaciones.");
  };

  if (account) {
    return (
      <section className="account-hero">
        <div className="container account-grid">
          <div>
            <p className="eyebrow">Perfil cliente</p>
            <h1>{account.name || "Cliente ICC"}</h1>
            <p>
              {account.company || "Empresa pendiente"} - {account.email}
            </p>
            <div className="account-actions">
              <a className="button primary" href="/contacto/">
                Nueva cotizacion
              </a>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem(sessionKey);
                  setSessionState("");
                  setMessage("Sesion cerrada.");
                }}
              >
                Cerrar sesion
              </button>
            </div>
          </div>
          <div className="account-panel">
            {message ? <div className="account-alert">{message}</div> : null}
            <p className="eyebrow">Historial</p>
            <h2>{account.quotes.length} solicitudes</h2>
            <div className="quote-history">
              {account.quotes.length ? (
                account.quotes.map((quote, index) => (
                  <article key={index}>
                    <span>{quote.date || "Sin fecha"}</span>
                    <strong>{quote.service || "Servicio topografico"}</strong>
                    <p>{quote.scope || "Solicitud registrada desde la web."}</p>
                    <small>{quote.status || "Recibida"}</small>
                  </article>
                ))
              ) : (
                <p className="muted">Aun no hay cotizaciones asociadas a esta cuenta.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="account-hero">
      <div className="account-mark" aria-hidden="true" />
      <div className="container account-grid">
        <div className="account-intro">
          <p className="eyebrow">ICC Topografia</p>
          <h1>Portal Terraqo</h1>
          <p>Ingresa para gestionar cotizaciones, contactos y solicitudes.</p>
          <span />
        </div>
        <div className={`account-panel account-flip-panel${register ? " is-register" : ""}`}>
          {message ? <div className="account-alert">{message}</div> : null}
          <div className="account-tabs" role="tablist">
            <button className={!register ? "is-active" : ""} type="button" onClick={() => setRegister(false)}>
              Iniciar sesion
            </button>
            <button className={register ? "is-active" : ""} type="button" onClick={() => setRegister(true)}>
              Registrarse
            </button>
          </div>
          <div className="account-card-shell">
            <div className="account-card-inner">
              <form className={`account-form account-card-face account-card-front${!register ? " is-active" : ""}`} onSubmit={login}>
                <input name="email" type="email" placeholder="Correo o usuario" required />
                <input name="password" type="password" placeholder="Contrasena" required />
                <button type="submit">Ingresar</button>
                <div className="account-divider">
                  <span>o</span>
                </div>
                <a className="corporate-mail-button" href="https://mail.zoho.com/zm/" target="_blank" rel="noopener noreferrer">
                  Email corporativo
                </a>
              </form>
              <form className={`account-form account-card-face account-card-back${register ? " is-active" : ""}`} onSubmit={create}>
                <input name="name" placeholder="Nombre y apellido" required />
                <input name="company" placeholder="Empresa" />
                <input name="phone" placeholder="Telefono / WhatsApp" />
                <input name="email" type="email" placeholder="Correo" required />
                <input name="password" type="password" placeholder="Contrasena" required />
                <button type="submit">Crear cuenta</button>
                <a className="corporate-mail-button" href="https://mail.zoho.com/zm/" target="_blank" rel="noopener noreferrer">
                  Email corporativo
                </a>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
