"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  adminFields,
  clientFields,
  portalProfiles,
  portalTrustMessages,
  professionalFields,
  type PortalField,
  type PortalRole,
} from "../lib/portal-data";
import type { PortalSession } from "../lib/portal-session";
import ConnectedPortalDashboard from "./portal/ConnectedPortalDashboard";
import PortalAccessCards from "./portal/PortalAccessCards";
import PortalFooterNote from "./portal/PortalFooterNote";
import PortalIntro from "./portal/PortalIntro";
import PortalLoginForm from "./portal/PortalLoginForm";
import PortalProfileSelector from "./portal/PortalProfileSelector";
import PortalRegisterForm from "./portal/PortalRegisterForm";
import type { PortalMode } from "./portal/PortalTypes";

const normalizeEmail = (value: FormDataEntryValue | null) => String(value || "").trim().toLowerCase();

function apiMessage(payload: any, fallback: string) {
  return payload?.error?.message || payload?.error || payload?.message || fallback;
}

async function postJson(path: string, payload?: unknown) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(payload || {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(apiMessage(data, "No se pudo completar la operacion."));
  return data?.data || data;
}

const fieldsByRole: Record<PortalRole, PortalField[]> = {
  client: clientFields,
  professional: professionalFields,
  admin: adminFields,
};

export default function AccountApp() {
  const [session, setSession] = useState<PortalSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<PortalMode>("login");
  const [selectedRole, setSelectedRole] = useState<PortalRole>("client");

  const loadSession = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await fetch("/api/terraqo/portal/session", { headers: { accept: "application/json" }, cache: "no-store" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 401) {
          setSession(null);
          return;
        }
        throw new Error(apiMessage(payload, "No pudimos consultar tu perfil."));
      }
      setSession(payload.data as PortalSession);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No pudimos conectar con Portal Terraqo.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => { void loadSession(); }, [loadSession]);

  const selectRole = (role: PortalRole) => {
    setSelectedRole(role);
    setMode(role === "admin" ? "login" : "register");
    setMessage(role === "admin"
      ? "El acceso administrador requiere una cuenta autorizada para el workspace ICC Topografia."
      : `Completa el registro para ${role === "client" ? "cliente" : "profesional"}.`);
    window.requestAnimationFrame(() => document.getElementById("portal-access")?.scrollIntoView({ behavior: "smooth" }));
  };

  async function authenticate(email: string, password: string) {
    await postJson("/api/terraqo/portal/login", { email, password });
    await loadSession(true);
  }

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setMessage("");
    try {
      await authenticate(normalizeEmail(form.get("email")), String(form.get("password") || ""));
      setMessage("Bienvenido a tu espacio profesional en Portal Terraqo.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "El correo o la contrasena no son correctos.");
    } finally {
      setSubmitting(false);
    }
  };

  const create = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = normalizeEmail(form.get("email"));
    const password = String(form.get("password") || "");
    const confirmPassword = String(form.get("confirmPassword") || "");

    if (!email || !password) return setMessage("Completa los campos obligatorios para continuar.");
    if (password !== confirmPassword) return setMessage("La confirmacion de contrasena no coincide.");
    if (selectedRole === "admin") return setMessage("Este tipo de acceso requiere autorizacion del equipo administrador.");

    const profile = Object.fromEntries(
      fieldsByRole[selectedRole]
        .filter((field) => field.name !== "password" && field.name !== "confirmPassword")
        .map((field) => [field.name, String(form.get(field.name) || "").trim()]),
    );

    setSubmitting(true);
    setMessage("");
    try {
      await postJson("/api/terraqo/register", {
        accountType: selectedRole,
        name: String(form.get("name") || "").trim(),
        email,
        password,
        company: String(form.get("company") || "").trim(),
        document: profile.ruc || profile.document,
        phone: String(form.get("phone") || "").trim(),
        roleTitle: profile.position || profile.roleTitle,
        specialty: profile.specialty,
        city: profile.city,
        yearsExperience: profile.experience ? Number(profile.experience) : undefined,
        equipment: profile.equipment,
        software: profile.software,
        portfolioUrl: profile.portfolio,
      });
      await authenticate(email, password);
      setMessage("Cuenta creada correctamente. Bienvenido a Portal Terraqo.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo crear la cuenta en Portal Terraqo.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="account-hero portal-dashboard">
        <div className="container account-grid"><div className="portal-intro"><p className="eyebrow">Portal Terraqo</p><h1>Validando tu acceso</h1><p>Conectando con el workspace seguro de ICC Topografia.</p></div></div>
      </section>
    );
  }

  if (session) {
    return (
      <>
        <ConnectedPortalDashboard
          session={session}
          message={message}
          onRefresh={() => loadSession(true)}
          onLogout={async () => {
            await postJson("/api/terraqo/portal/logout");
            setSession(null);
            setMessage("Sesion cerrada.");
          }}
        />
        <PortalFooterNote />
      </>
    );
  }

  return (
    <>
      <section className="account-hero portal-hero" id="portal-access">
        <div className="account-mark" aria-hidden="true" />
        <div className="portal-grid-overlay" aria-hidden="true" />
        <div className="container account-grid portal-account-grid">
          <PortalIntro />
          <div className="account-panel portal-panel">
            {message ? <div className="account-alert">{message}</div> : null}
            <div className="account-tabs" role="tablist" aria-label="Ingreso y registro Portal Terraqo">
              <button className={mode === "login" ? "is-active" : ""} type="button" onClick={() => setMode("login")}>Iniciar sesion</button>
              <button className={mode === "register" ? "is-active" : ""} type="button" onClick={() => { setMode("register"); if (selectedRole === "admin") setSelectedRole("client"); }}>Crear cuenta</button>
            </div>
            {submitting ? <div className="account-alert">Conectando con tu workspace...</div> : null}
            {mode === "login" ? (
              <PortalLoginForm onSubmit={login} onRegisterClick={() => setMode("register")} />
            ) : (
              <>
                <PortalProfileSelector profiles={portalProfiles} activeRole={selectedRole} onSelect={setSelectedRole} />
                <PortalRegisterForm role={selectedRole} fields={fieldsByRole[selectedRole]} onSubmit={create} onAdminAccess={() => { setMode("login"); setMessage("Ingresa con tu correo corporativo autorizado."); }} />
              </>
            )}
          </div>
        </div>
      </section>
      <PortalAccessCards profiles={portalProfiles} onSelect={selectRole} />
      <section className="portal-trust-section"><div className="container portal-trust-grid">{portalTrustMessages.map((trust) => <p key={trust}>{trust}</p>)}</div></section>
      <PortalFooterNote />
    </>
  );
}
