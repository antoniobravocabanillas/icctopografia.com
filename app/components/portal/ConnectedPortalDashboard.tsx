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

const evidenceLabels: Record<string, string> = {
  DECLARED: "Declarada",
  LINKED: "Vinculada a un proyecto",
  CONFIRMED: "Confirmada por ICC",
  VERIFIED: "Verificada por Terraqo",
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
  const [savingWorklog, setSavingWorklog] = useState(false);
  const [worklogMessage, setWorklogMessage] = useState("");

  if (!profile) return null;
  const worklogs = profile.worklogs || [];

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

  async function saveWorklog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    setSavingWorklog(true);
    setWorklogMessage("");
    try {
      const response = await fetch("/api/terraqo/portal/worklog", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          projectId: String(formData.get("projectId") || "") || undefined,
          title: String(formData.get("title") || ""),
          summary: String(formData.get("summary") || ""),
          outcome: String(formData.get("outcome") || "") || undefined,
          type: String(formData.get("type") || "FIELD_UPDATE"),
          visibility: String(formData.get("visibility") || "PRIVATE"),
          skills: String(formData.get("skills") || "").split(",").map((item) => item.trim()).filter(Boolean),
          evidenceUrls: [],
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error?.message || "No pudimos registrar tu bitacora.");
      formElement.reset();
      setWorklogMessage("Bitacora registrada. Esta evidencia ya forma parte de tu historial profesional.");
      await onRefresh();
    } catch (error) {
      setWorklogMessage(error instanceof Error ? error.message : "No pudimos registrar tu bitacora.");
    } finally {
      setSavingWorklog(false);
    }
  }

  return (
    <main className={styles.shell}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Perfil profesional · Portal Terraqo</p>
          <h1>{session.user.name}</h1>
          <p className={styles.lead}>{profile.headline || session.user.title || "Perfil profesional"}</p>
          <div className={styles.meta}>
            <span>{profile.city || "Ubicacion por completar"}</span>
            <span>{profile.yearsExperience ?? 0} anos de experiencia</span>
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
        <Metric value={worklogs.length} label="Evidencias en Bitacora" />
        <Metric value={profile.affiliations.length} label="Vinculos empresariales" />
        <Metric value={profile.liveCvEnabled ? "Activo" : "Privado"} label="Estado del CV vivo" />
      </section>

      <div className={styles.grid}>
        <section className={`${styles.panel} ${styles.widePanel}`}>
          <div className={styles.panelHeading}>
            <div><p className={styles.eyebrow}>Bitacora Terraqo</p><h2>Documenta trabajo real</h2></div>
            <span>Privado por defecto</span>
          </div>
          <p className={styles.panelCopy}>Registra avances, entregables o problemas resueltos. Puedes vincularlos a un proyecto asignado y decidir quien puede verlos.</p>
          <form className={styles.worklogForm} onSubmit={saveWorklog}>
            <label><span>Titulo</span><input name="title" placeholder="Ej. Control de niveles completado" required minLength={4} /></label>
            <label><span>Tipo</span><select name="type"><option value="FIELD_UPDATE">Avance de trabajo</option><option value="DELIVERABLE">Entregable</option><option value="PROBLEM_SOLVED">Problema resuelto</option><option value="MILESTONE">Hito alcanzado</option><option value="LEARNING">Aprendizaje tecnico</option></select></label>
            <label><span>Proyecto vinculado</span><select name="projectId"><option value="">Sin proyecto vinculado</option>{session.professionalNetwork?.projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}</select></label>
            <label><span>Visibilidad</span><select name="visibility" defaultValue="PRIVATE"><option value="PRIVATE">Solo yo</option><option value="WORKSPACE">ICC Topografia</option><option value="COMMUNITY">Comunidad Terraqo</option><option value="PUBLIC">Publico</option></select></label>
            <label className={styles.formWide}><span>Que hiciste y que problema resolviste</span><textarea name="summary" required minLength={20} placeholder="Describe el trabajo y el contexto necesario para entenderlo." /></label>
            <label className={styles.formWide}><span>Resultado observable</span><textarea name="outcome" placeholder="Que cambio, se entrego o quedo habilitado gracias a este trabajo." /></label>
            <label className={styles.formWide}><span>Habilidades, separadas por coma</span><input name="skills" placeholder="Topografia, AutoCAD, control de obra" /></label>
            <button type="submit" disabled={savingWorklog}>{savingWorklog ? "Registrando..." : "Guardar en mi bitacora"}</button>
          </form>
          {worklogMessage ? <p className={styles.uploadMessage}>{worklogMessage}</p> : null}
        </section>

        <section className={`${styles.panel} ${styles.widePanel}`}>
          <div className={styles.panelHeading}><div><p className={styles.eyebrow}>CV vivo</p><h2>Evidencia reciente</h2></div><span>{worklogs.length}</span></div>
          <div className={styles.worklogList}>{worklogs.length ? worklogs.map((worklog) => <article key={worklog.id}><div><span>{worklog.type.replaceAll("_", " ")}</span><strong>{worklog.title}</strong><p>{worklog.summary}</p>{worklog.project ? <small>Proyecto: {worklog.project.title}</small> : null}</div><aside><b>{evidenceLabels[worklog.evidenceStatus] || worklog.evidenceStatus}</b><small>{worklog.visibility}</small></aside></article>) : <p className={styles.empty}>Tu primera entrada puede ser un avance, un entregable o un problema resuelto.</p>}</div>
        </section>

        {session.professionalNetwork?.opportunities.length ? <section className={`${styles.panel} ${styles.widePanel}`}><div className={styles.panelHeading}><div><p className={styles.eyebrow}>Oportunidades ICC</p><h2>Convocatorias abiertas</h2></div><span>{session.professionalNetwork.opportunities.length}</span></div><div className={styles.opportunityGrid}>{session.professionalNetwork.opportunities.map((opportunity) => <article key={opportunity.id}><strong>{opportunity.title}</strong><p>{opportunity.summary}</p><span>{opportunity.location || opportunity.modality || "Por coordinar"}</span></article>)}</div></section> : null}

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
