"use client";

import { FormEvent, useState } from "react";
import type { PortalSession } from "../../lib/portal-session";
import styles from "./ConnectedPortalDashboard.module.css";

type Props = {
  session: PortalSession;
  message: string;
  onLogout: () => void;
  onRefresh: () => Promise<void>;
};

const applicationLabels: Record<string, string> = {
  DRAFT: "Borrador",
  SUBMITTED: "Recibida",
  REVIEWING: "En revision",
  SHORTLISTED: "Preseleccionada",
  ACCEPTED: "Aceptada",
  REJECTED: "No seleccionada",
  WITHDRAWN: "Retirada",
};

const verificationLabels: Record<string, string> = {
  PENDING_DOCUMENTS: "Documentos pendientes",
  UNDER_REVIEW: "En validacion",
  VERIFIED: "Identidad validada",
  REJECTED: "Requiere correccion",
};

function Metric({ value, label }: { value: string | number; label: string }) {
  return (
    <div className={styles.metric}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function ProfessionalDashboard({ session, message, onLogout, onRefresh }: Props) {
  const profile = session.professional;
  const [uploading, setUploading] = useState<"cv" | "identity" | "">("");
  const [uploadMessage, setUploadMessage] = useState("");

  if (!profile) return null;

  async function upload(event: FormEvent<HTMLFormElement>, purpose: "cv" | "identity") {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    formData.set("purpose", purpose);
    setUploading(purpose);
    setUploadMessage("");
    try {
      const response = await fetch("/api/terraqo/portal/documents", { method: "POST", body: formData });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error?.message || "No pudimos cargar los documentos.");
      setUploadMessage(payload?.data?.message || "Documentos recibidos correctamente.");
      formElement.reset();
      await onRefresh();
    } catch (error) {
      setUploadMessage(error instanceof Error ? error.message : "No pudimos cargar los documentos.");
    } finally {
      setUploading("");
    }
  }

  const cvDocument = profile.documents.find((document) => document.type === "CV");
  const identityDocuments = profile.documents.filter((document) => document.type !== "CV");

  return (
    <main className={styles.shell}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Perfil profesional · Portal Terraqo</p>
          <h1>{session.user.name}</h1>
          <p className={styles.lead}>{profile.headline || session.user.title || "Perfil profesional"}</p>
          <div className={styles.meta}>
            <span>{profile.city || "Ubicacion por completar"}</span>
            <span>{profile.yearsExperience} anos de experiencia</span>
            <span>{verificationLabels[profile.identityVerificationStatus] || profile.identityVerificationStatus}</span>
          </div>
        </div>
        <div className={styles.heroActions}>
          <a href="/trabaja-con-nosotros">Ver oportunidades</a>
          <button type="button" onClick={onLogout}>Cerrar sesion</button>
        </div>
      </section>

      {message ? <p className={styles.notice}>{message}</p> : null}

      <section className={styles.metrics} aria-label="Resumen del perfil">
        <Metric value={profile.applications.length} label="Postulaciones" />
        <Metric value={profile.experiences.length} label="Experiencias en CV vivo" />
        <Metric value={profile.affiliations.length} label="Vinculos empresariales" />
        <Metric value={profile.liveCvEnabled ? "Activo" : "Privado"} label="Estado del CV vivo" />
      </section>

      <div className={styles.grid}>
        <section className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>Seguimiento</p>
              <h2>Tus postulaciones</h2>
            </div>
            <span>{profile.applications.length}</span>
          </div>
          <div className={styles.list}>
            {profile.applications.length ? profile.applications.map((application) => (
              <article key={application.id}>
                <div>
                  <strong>{application.jobPost?.title || "Bolsa de talento general"}</strong>
                  <p>{application.professionalCategory}</p>
                </div>
                <span className={styles.status}>{applicationLabels[application.status] || application.status}</span>
              </article>
            )) : <p className={styles.empty}>Aun no tienes postulaciones asociadas a este workspace.</p>}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>Validacion Terraqo</p>
              <h2>Identidad y documentos</h2>
            </div>
            <span>{verificationLabels[profile.identityVerificationStatus] || profile.identityVerificationStatus}</span>
          </div>
          <p className={styles.panelCopy}>Tus documentos son privados y se utilizan solo para validar tu identidad y experiencia profesional.</p>
          <div className={styles.documentSummary}>
            <span>CV: {cvDocument ? `${cvDocument.fileName} · ${cvDocument.reviewStatus}` : "pendiente"}</span>
            <span>DNI: {identityDocuments.length >= 2 ? "recibido" : "pendiente"}</span>
          </div>
          <form className={styles.uploadForm} onSubmit={(event) => upload(event, "cv")}>
            <label>
              <span>Actualizar CV</span>
              <input name="cvFile" type="file" accept=".pdf,.doc,.docx" required />
            </label>
            <button type="submit" disabled={Boolean(uploading)}>{uploading === "cv" ? "Cargando..." : "Subir CV"}</button>
          </form>
          <form className={styles.uploadForm} onSubmit={(event) => upload(event, "identity")}>
            <label>
              <span>DNI frontal</span>
              <input name="dniFront" type="file" accept="image/jpeg,image/png,image/webp,.pdf" required />
            </label>
            <label>
              <span>DNI posterior</span>
              <input name="dniBack" type="file" accept="image/jpeg,image/png,image/webp,.pdf" required />
            </label>
            <button type="submit" disabled={Boolean(uploading)}>{uploading === "identity" ? "Cargando..." : "Enviar a validar"}</button>
          </form>
          {uploadMessage ? <p className={styles.uploadMessage}>{uploadMessage}</p> : null}
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>Capacidades</p>
              <h2>Herramientas declaradas</h2>
            </div>
          </div>
          <h3>Equipos</h3>
          <div className={styles.tags}>{profile.equipment.length ? profile.equipment.map((item) => <span key={item}>{item}</span>) : <p className={styles.empty}>Por completar</p>}</div>
          <h3>Software</h3>
          <div className={styles.tags}>{profile.software.length ? profile.software.map((item) => <span key={item}>{item}</span>) : <p className={styles.empty}>Por completar</p>}</div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>CV vivo</p>
              <h2>Experiencia conectada</h2>
            </div>
            <span>{profile.liveCvEnabled ? "Activo" : "Privado"}</span>
          </div>
          <div className={styles.list}>
            {profile.experiences.length ? profile.experiences.map((experience) => (
              <article key={experience.id}>
                <div>
                  <strong>{experience.title}</strong>
                  <p>{experience.project?.title || experience.companyName || experience.role}</p>
                </div>
                <span className={styles.status}>{experience.verifiedByTerraqo ? "Validada" : "Declarada"}</span>
              </article>
            )) : <p className={styles.empty}>La experiencia validada por proyectos aparecera aqui.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}

function ClientDashboard({ session, message, onLogout }: Props) {
  const client = session.client?.client;
  return (
    <main className={styles.shell}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Perfil cliente · Portal Terraqo</p>
          <h1>{client?.company || session.user.name}</h1>
          <p className={styles.lead}>Cotizaciones y proyectos de ICC Topografia en un solo espacio.</p>
        </div>
        <div className={styles.heroActions}>
          <a href="/contacto">Nueva solicitud</a>
          <button type="button" onClick={onLogout}>Cerrar sesion</button>
        </div>
      </section>
      {message ? <p className={styles.notice}>{message}</p> : null}
      <section className={styles.metrics}>
        <Metric value={client?.quotes.length || 0} label="Cotizaciones" />
        <Metric value={client?.projects.length || 0} label="Proyectos" />
        <Metric value={session.client?.status || "Activo"} label="Estado de cuenta" />
      </section>
      <div className={styles.grid}>
        <section className={styles.panel}><div className={styles.panelHeading}><h2>Cotizaciones</h2></div><div className={styles.list}>{client?.quotes.length ? client.quotes.map((quote) => <article key={quote.id}><strong>{quote.number}</strong><span className={styles.status}>{quote.status}</span></article>) : <p className={styles.empty}>Aun no hay cotizaciones asociadas.</p>}</div></section>
        <section className={styles.panel}><div className={styles.panelHeading}><h2>Proyectos</h2></div><div className={styles.list}>{client?.projects.length ? client.projects.map((project) => <article key={project.id}><div><strong>{project.title}</strong><p>{project.location}</p></div><span className={styles.status}>{project.status}</span></article>) : <p className={styles.empty}>Aun no hay proyectos asociados.</p>}</div></section>
      </div>
    </main>
  );
}

function AdminDashboard({ session, message, onLogout }: Props) {
  return (
    <main className={styles.shell}>
      <section className={styles.hero}>
        <div><p className={styles.eyebrow}>Administrador del workspace</p><h1>{session.user.name}</h1><p className={styles.lead}>Acceso verificado para {session.workspace.brandName || session.workspace.name}.</p></div>
        <div className={styles.heroActions}><button type="button" onClick={onLogout}>Cerrar sesion</button></div>
      </section>
      {message ? <p className={styles.notice}>{message}</p> : null}
      <section className={styles.panel}><p className={styles.eyebrow}>Workspace aislado</p><h2>Tu sesion pertenece unicamente a ICC Topografia.</h2><p className={styles.panelCopy}>La administracion completa seguira conectandose por permisos del workspace, sin compartir datos con otros clientes de Terraqo.</p></section>
    </main>
  );
}

export default function ConnectedPortalDashboard(props: Props) {
  if (props.session.user.role === "professional") return <ProfessionalDashboard {...props} />;
  if (props.session.user.role === "client") return <ClientDashboard {...props} />;
  return <AdminDashboard {...props} />;
}
