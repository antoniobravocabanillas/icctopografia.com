import type { PortalProfile, PortalRole } from "../../lib/portal-data";

type PortalAccessCardsProps = {
  profiles: PortalProfile[];
  onSelect: (role: PortalRole) => void;
};

export default function PortalAccessCards({ profiles, onSelect }: PortalAccessCardsProps) {
  return (
    <section className="portal-access-section">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Selecciona tu tipo de acceso</p>
          <h2>El Portal Terraqo ordena clientes, profesionales y operacion interna.</h2>
          <p>
            Un solo entorno, con permisos y formularios diferentes segun el perfil. Asi cada usuario ve lo que necesita
            para avanzar sin ruido.
          </p>
        </div>
        <div className="portal-access-grid">
          {profiles.map((profile) => (
            <article className="portal-access-card" key={profile.role}>
              <span>{profile.eyebrow}</span>
              <h3>{profile.title}</h3>
              <p>{profile.summary}</p>
              <ul>
                {profile.actions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
              <button type="button" onClick={() => onSelect(profile.role)}>
                {profile.button}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
