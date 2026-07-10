import type { FormEvent } from "react";
import type { PortalField, PortalRole } from "../../lib/portal-data";

type PortalRegisterFormProps = {
  role: PortalRole;
  fields: PortalField[];
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onAdminAccess: () => void;
};

function FieldControl({ field }: { field: PortalField }) {
  if (field.type === "textarea") {
    return <textarea name={field.name} required={field.required} rows={4} />;
  }

  if (field.type === "select") {
    return (
      <select name={field.name} required={field.required} defaultValue="">
        <option value="" disabled>
          Selecciona una opcion
        </option>
        {field.options?.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "file") {
    return <input name={field.name} type="text" placeholder="Pega un enlace a tu CV o portafolio" />;
  }

  return <input name={field.name} type={field.type || "text"} required={field.required} />;
}

export default function PortalRegisterForm({ role, fields, onSubmit, onAdminAccess }: PortalRegisterFormProps) {
  if (role === "admin") {
    return (
      <div className="portal-admin-lock">
        <p className="eyebrow">Administrador</p>
        <h3>Acceso exclusivo para equipo interno autorizado.</h3>
        <p>
          Las cuentas administrativas se crean o habilitan desde el panel interno. Si ya tienes acceso, ingresa con tu
          correo corporativo.
        </p>
        <button type="button" onClick={onAdminAccess}>
          Acceder como administrador
        </button>
      </div>
    );
  }

  return (
    <form className="portal-form portal-register-form" onSubmit={onSubmit}>
      <div className="portal-panel-heading">
        <p className="eyebrow">Crea tu cuenta en Portal Terraqo</p>
        <h2>{role === "client" ? "Cuenta de cliente" : "Cuenta profesional"}</h2>
        <p>
          Completa tus datos para acceder al entorno digital de ICC Topografia. Tu perfil nos ayuda a gestionar mejor
          tus solicitudes, proyectos o actividades tecnicas.
        </p>
      </div>
      <div className="portal-form-grid">
        {fields.map((field) => (
          <label className={field.type === "textarea" ? "is-wide" : ""} key={field.name}>
            <span>{field.label}</span>
            <FieldControl field={field} />
          </label>
        ))}
      </div>
      <button type="submit">{role === "client" ? "Crear cuenta de cliente" : "Crear cuenta profesional"}</button>
    </form>
  );
}
