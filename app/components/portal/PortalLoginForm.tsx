import type { FormEvent } from "react";

type PortalLoginFormProps = {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onRegisterClick: () => void;
};

export default function PortalLoginForm({ onSubmit, onRegisterClick }: PortalLoginFormProps) {
  return (
    <form className="portal-form" onSubmit={onSubmit}>
      <div className="portal-panel-heading">
        <p className="eyebrow">Ingresar al portal</p>
        <h2>Accede a tu espacio de seguimiento</h2>
      </div>
      <label>
        <span>Correo electronico</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        <span>Contrasena</span>
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      <button type="submit">Ingresar</button>
      <a className="portal-muted-link" href="mailto:proyectos@icctopografia.com?subject=Recuperar acceso Portal Terraqo">
        Olvide mi contrasena
      </a>
      <div className="portal-divider">
        <span>Aun no tienes cuenta?</span>
      </div>
      <button className="portal-secondary-button" type="button" onClick={onRegisterClick}>
        Crear cuenta
      </button>
      <a className="corporate-mail-button" href="https://mail.zoho.com/zm/" target="_blank" rel="noopener noreferrer">
        Email corporativo
      </a>
    </form>
  );
}
