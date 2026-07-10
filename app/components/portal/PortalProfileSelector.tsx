import type { PortalProfile, PortalRole } from "../../lib/portal-data";

type PortalProfileSelectorProps = {
  profiles: PortalProfile[];
  activeRole: PortalRole;
  onSelect: (role: PortalRole) => void;
};

export default function PortalProfileSelector({ profiles, activeRole, onSelect }: PortalProfileSelectorProps) {
  return (
    <div className="portal-profile-selector" aria-label="Selecciona tu tipo de acceso">
      <div className="portal-selector-heading">
        <p className="eyebrow">Selecciona tu tipo de acceso</p>
        <h2>Un solo registro, perfiles distintos</h2>
      </div>
      <div className="portal-profile-grid">
        {profiles.map((profile) => (
          <button
            className={`portal-profile-card${profile.role === activeRole ? " is-active" : ""}`}
            type="button"
            onClick={() => onSelect(profile.role)}
            key={profile.role}
          >
            <span>{profile.eyebrow}</span>
            <strong>{profile.title}</strong>
            <small>{profile.locked ? "Acceso por autorizacion" : "Registro disponible"}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
