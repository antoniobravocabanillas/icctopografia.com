"use client";

import { FormEvent, useState } from "react";
import type { PortalAccount } from "./PortalTypes";

type PortalDashboardProps = {
  account: PortalAccount;
  message: string;
  onLogout: () => void;
  onCreateRequest: (request: NonNullable<PortalAccount["quotes"]>[number]) => boolean | Promise<boolean>;
};

const roleLabels = {
  client: "Perfil cliente",
  professional: "Perfil profesional",
  admin: "Administrador",
};

const serviceOptions = [
  "Levantamiento topografico",
  "Replanteo y control de obra",
  "Escaneo 3D y drones",
  "Catastro y saneamiento",
  "Monitoreo y control",
  "Tienda tecnica / equipos",
  "Otro requerimiento topografico",
];

export default function PortalDashboard({ account, message, onLogout, onCreateRequest }: PortalDashboardProps) {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const service = String(form.get("service") || "").trim();
    const scope = String(form.get("scope") || "").trim();
    const location = String(form.get("location") || "").trim();

    if (!service || !scope) return;

    setIsSubmitting(true);
    const created = await onCreateRequest({
      id: `sol-${Date.now()}`,
      date: new Date().toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" }),
      service,
      scope,
      location,
      status: "Recibida",
    });
    setIsSubmitting(false);

    if (!created) return;

    formElement.reset();
    setShowRequestForm(false);
  };

  return (
    <section className="account-hero portal-dashboard">
      <div className="account-mark" aria-hidden="true" />
      <div className="container account-grid">
        <div className="portal-intro">
          <p className="eyebrow">{roleLabels[account.role]}</p>
          <h1>{account.name || "Portal Terraqo"}</h1>
          <p>
            {account.company || account.profile.specialty || "Cuenta registrada"} - {account.email}
          </p>
          <div className="account-actions">
            <button className="button primary" type="button" onClick={() => setShowRequestForm((value) => !value)}>
              Nueva solicitud
            </button>
            <button type="button" onClick={onLogout}>
              Cerrar sesion
            </button>
          </div>
        </div>
        <div className="account-panel">
          {message ? <div className="account-alert">{message}</div> : null}
          {showRequestForm ? (
            <form className="portal-request-form" onSubmit={submitRequest}>
              <p className="eyebrow">Nueva solicitud</p>
              <h2>Cuéntanos qué necesitas medir o controlar.</h2>
              <label>
                <span>Tipo de servicio</span>
                <select name="service" required defaultValue="">
                  <option value="" disabled>
                    Selecciona una opcion
                  </option>
                  {serviceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Ubicacion / obra</span>
                <input name="location" placeholder="Ej. Lima, obra multifamiliar, terreno industrial" />
              </label>
              <label>
                <span>Alcance</span>
                <textarea name="scope" required placeholder="Indica area aproximada, fecha requerida y entregable esperado." />
              </label>
              <div className="portal-request-actions">
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Registrando..." : "Registrar solicitud"}
                </button>
                <button type="button" className="portal-secondary-button" onClick={() => setShowRequestForm(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          ) : null}
          <p className="eyebrow">Seguimiento</p>
          <h2>{account.quotes.length} solicitudes</h2>
          <div className="quote-history">
            {account.quotes.length ? (
              account.quotes.map((quote, index) => (
                <article key={quote.id || index}>
                  <span>{quote.date || "Sin fecha"}</span>
                  <strong>{quote.service || "Servicio topografico"}</strong>
                  {quote.location ? <em>{quote.location}</em> : null}
                  <p>{quote.scope || "Solicitud registrada desde la web."}</p>
                  <small>{quote.status || "Recibida"}</small>
                </article>
              ))
            ) : (
              <p className="muted">Aun no hay solicitudes asociadas a esta cuenta.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
