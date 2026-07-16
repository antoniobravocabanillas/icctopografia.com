"use client";

import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./ConnectedPortalDashboard.module.css";

const endpoint = "/api/terraqo/portal/field-verification";

type VerificationStatus = {
  hasPasskey: boolean;
  projects: Array<{ id: string; title: string; location?: string | null }>;
  supervisors: Array<{ userId: string; name: string; title: string }>;
  latestAttendance: { type: "CHECK_IN" | "CHECK_OUT"; capturedAt: string; projectId: string; project: { title: string } } | null;
  pendingValidations: Array<{
    id: string;
    worklog: { title: string; occurredAt: string; author: { name?: string | null }; project?: { title: string } | null };
  }>;
};

async function portalRequest<T>(body: object) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error?.message || "No pudimos completar la operacion.");
  return payload.data as T;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function ConnectedFieldVerification({ showAttendance = true }: { showAttendance?: boolean }) {
  const [status, setStatus] = useState<VerificationStatus | null>(null);
  const [projectId, setProjectId] = useState("");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const next = await portalRequest<VerificationStatus>({ action: "status" });
      setStatus(next);
      setProjectId((current) => current || next.projects[0]?.id || "");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No pudimos cargar el control de campo.");
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const nextType = useMemo(() => {
    if (!status?.latestAttendance || status.latestAttendance.projectId !== projectId || status.latestAttendance.type === "CHECK_OUT") return "CHECK_IN" as const;
    return "CHECK_OUT" as const;
  }, [projectId, status?.latestAttendance]);

  async function activateDevice() {
    setBusy("device");
    setMessage("");
    try {
      const registration = await portalRequest<{ challengeId: string; options: Parameters<typeof startRegistration>[0] }>({ action: "passkey_registration_options" });
      const response = await startRegistration(registration.options);
      await portalRequest({ action: "passkey_registration_verify", challengeId: registration.challengeId, response, deviceName: "Dispositivo personal" });
      setMessage("Dispositivo seguro activado. Ya puedes firmar registros y validaciones.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No pudimos activar este dispositivo.");
    } finally {
      setBusy("");
    }
  }

  async function attendance() {
    if (!projectId) return;
    setBusy("attendance");
    setMessage("Obteniendo tu ubicacion exacta...");
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) return reject(new Error("Este dispositivo no permite obtener ubicacion."));
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
      });
      const authentication = await portalRequest<{ challengeId: string; options: Parameters<typeof startAuthentication>[0] }>({
        action: "attendance_options",
        data: {
          projectId,
          type: nextType,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracyMeters: position.coords.accuracy,
        },
      });
      setMessage("Confirma tu identidad con la huella, Face ID o PIN del dispositivo.");
      const response = await startAuthentication(authentication.options);
      const result = await portalRequest<{ type: "CHECK_IN" | "CHECK_OUT"; capturedAt: string; project: { title: string } }>({
        action: "attendance_verify",
        challengeId: authentication.challengeId,
        response,
      });
      setMessage(`${result.type === "CHECK_IN" ? "Entrada" : "Salida"} registrada en ${result.project.title}: ${formatDateTime(result.capturedAt)}.`);
      await load();
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && typeof error.code === "number") {
        setMessage(error.code === 1 ? "Necesitamos permiso de ubicacion para confirmar que estas en tu trabajo." : "No pudimos obtener una ubicacion precisa. Intenta nuevamente.");
      } else {
        setMessage(error instanceof Error ? error.message : "No pudimos registrar tu asistencia.");
      }
    } finally {
      setBusy("");
    }
  }

  async function approve(validationId: string) {
    setBusy(validationId);
    setMessage("");
    try {
      const authentication = await portalRequest<{ challengeId: string; options: Parameters<typeof startAuthentication>[0] }>({ action: "validation_options", validationId });
      const response = await startAuthentication(authentication.options);
      await portalRequest({ action: "validation_verify", challengeId: authentication.challengeId, response });
      setMessage("Bitacora validada con tu identidad y la hora segura de Terraqo.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No pudimos validar la bitacora.");
    } finally {
      setBusy("");
    }
  }

  if (!status) return <section className={styles.fieldPanel}><p>Cargando control seguro...</p></section>;

  return (
    <section className={styles.fieldPanel} aria-label="Control de asistencia y validaciones">
      <div className={styles.fieldHeader}>
        <div><p className={styles.eyebrow}>Control seguro Terraqo</p><h2>Tu jornada y validaciones</h2><p>Terraqo registra la hora. El dispositivo confirma tu identidad y la ubicacion valida el puesto de trabajo.</p></div>
        <span className={status.hasPasskey ? styles.fieldReady : styles.fieldPending}>{status.hasPasskey ? "Dispositivo verificado" : "Activacion pendiente"}</span>
      </div>

      {!status.hasPasskey ? <div className={styles.deviceActivation}><p>Activa la huella, Face ID o PIN disponible en este equipo. Terraqo no recibe ni almacena tus datos biometricos.</p><button type="button" onClick={activateDevice} disabled={Boolean(busy)}>{busy === "device" ? "Activando..." : "Activar dispositivo"}</button></div> : null}

      {showAttendance && status.projects.length ? <div className={styles.attendanceRow}>
        <label><span>Puesto de trabajo</span><select value={projectId} onChange={(event) => setProjectId(event.target.value)}>{status.projects.map((project) => <option key={project.id} value={project.id}>{project.title}{project.location ? ` | ${project.location}` : ""}</option>)}</select></label>
        <button type="button" onClick={attendance} disabled={!status.hasPasskey || Boolean(busy)}>{busy === "attendance" ? "Verificando..." : nextType === "CHECK_IN" ? "Registrar entrada" : "Registrar salida"}</button>
        {status.latestAttendance ? <p><strong>Ultimo registro</strong><span>{formatDateTime(status.latestAttendance.capturedAt)} · {status.latestAttendance.project.title}</span></p> : null}
      </div> : showAttendance ? <p className={styles.fieldEmpty}>La asistencia se habilitara cuando tu empresa te asigne a un proyecto con ubicacion configurada.</p> : null}

      {status.pendingValidations.length ? <div className={styles.validationInbox}><div><p className={styles.eyebrow}>Pendientes para ti</p><h3>Bitacoras por supervisar</h3></div>{status.pendingValidations.map((validation) => <article key={validation.id}><div><strong>{validation.worklog.title}</strong><p>{validation.worklog.author.name || "Profesional"}{validation.worklog.project ? ` · ${validation.worklog.project.title}` : ""}</p><small>{formatDateTime(validation.worklog.occurredAt)}</small></div><button type="button" onClick={() => approve(validation.id)} disabled={!status.hasPasskey || Boolean(busy)}>{busy === validation.id ? "Validando..." : "Validar con mi dispositivo"}</button></article>)}</div> : null}

      {message ? <p role="status" className={message === "No estas en tu trabajo." ? styles.fieldError : styles.fieldMessage}>{message}</p> : null}
    </section>
  );
}

type ExistingValidation = { id: string; status: string; validator: { name?: string | null } };

export function ConnectedWorklogValidation({ worklogId, validations }: { worklogId: string; validations: ExistingValidation[] }) {
  const latest = validations[0];
  const [supervisors, setSupervisors] = useState<VerificationStatus["supervisors"]>([]);
  const [validatorUserId, setValidatorUserId] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function openSelector() {
    setOpen(true);
    setBusy(true);
    try {
      const status = await portalRequest<VerificationStatus>({ action: "status" });
      setSupervisors(status.supervisors);
      setValidatorUserId(status.supervisors[0]?.userId || "");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No pudimos cargar tus responsables.");
    } finally {
      setBusy(false);
    }
  }

  async function requestValidation() {
    setBusy(true);
    try {
      await portalRequest({ action: "request_worklog_validation", worklogId, data: { validatorUserId } });
      setMessage("Validacion solicitada");
      setOpen(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No pudimos enviar la solicitud.");
    } finally {
      setBusy(false);
    }
  }

  if (latest?.status === "APPROVED") return <span className={styles.validationApproved}>Validada por {latest.validator.name || "responsable"}</span>;
  if (latest?.status === "REQUESTED" || message === "Validacion solicitada") return <span className={styles.validationRequested}>Validacion solicitada</span>;

  return <div className={styles.validationRequest}>
    {!open ? <button type="button" onClick={openSelector}>Solicitar validacion</button> : <div><select value={validatorUserId} onChange={(event) => setValidatorUserId(event.target.value)} disabled={busy}><option value="">Selecciona a tu responsable</option>{supervisors.map((supervisor) => <option key={supervisor.userId} value={supervisor.userId}>{supervisor.name} · {supervisor.title}</option>)}</select><button type="button" onClick={requestValidation} disabled={busy || !validatorUserId}>{busy ? "Enviando..." : "Enviar"}</button><button type="button" onClick={() => setOpen(false)}>Cancelar</button></div>}
    {message && message !== "Validacion solicitada" ? <small>{message}</small> : null}
  </div>;
}
