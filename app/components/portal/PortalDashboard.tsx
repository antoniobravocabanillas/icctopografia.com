import type { PortalAccount } from "./PortalTypes";

type PortalDashboardProps = {
  account: PortalAccount;
  message: string;
  onLogout: () => void;
};

const roleLabels = {
  client: "Perfil cliente",
  professional: "Perfil profesional",
  admin: "Administrador",
};

export default function PortalDashboard({ account, message, onLogout }: PortalDashboardProps) {
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
            <a className="button primary" href="/contacto/">
              Nueva solicitud
            </a>
            <button type="button" onClick={onLogout}>
              Cerrar sesion
            </button>
          </div>
        </div>
        <div className="account-panel">
          {message ? <div className="account-alert">{message}</div> : null}
          <p className="eyebrow">Seguimiento</p>
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
              <p className="muted">Aun no hay solicitudes asociadas a esta cuenta.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
