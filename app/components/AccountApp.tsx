"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  adminFields,
  clientFields,
  portalProfiles,
  portalTrustMessages,
  professionalFields,
  type PortalField,
  type PortalRole,
} from "../lib/portal-data";
import PortalAccessCards from "./portal/PortalAccessCards";
import PortalDashboard from "./portal/PortalDashboard";
import PortalFooterNote from "./portal/PortalFooterNote";
import PortalIntro from "./portal/PortalIntro";
import PortalLoginForm from "./portal/PortalLoginForm";
import PortalProfileSelector from "./portal/PortalProfileSelector";
import PortalRegisterForm from "./portal/PortalRegisterForm";
import type { PortalAccount, PortalMode } from "./portal/PortalTypes";

const storageKey = "icc_topografia_accounts";
const sessionKey = "icc_topografia_session";

const readAccounts = (): PortalAccount[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "[]");
  } catch {
    return [];
  }
};

const writeAccounts = (accounts: PortalAccount[]) => localStorage.setItem(storageKey, JSON.stringify(accounts));
const normalizeEmail = (value: FormDataEntryValue | null) => String(value || "").trim().toLowerCase();

const fieldsByRole: Record<PortalRole, PortalField[]> = {
  client: clientFields,
  professional: professionalFields,
  admin: adminFields,
};

export default function AccountApp() {
  const [accounts, setAccounts] = useState<PortalAccount[]>([]);
  const [session, setSessionState] = useState("");
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<PortalMode>("login");
  const [selectedRole, setSelectedRole] = useState<PortalRole>("client");

  useEffect(() => {
    setAccounts(readAccounts());
    setSessionState(localStorage.getItem(sessionKey) || "");
  }, []);

  const account = accounts.find((item) => item.email === session);
  const setSession = (email: string) => {
    localStorage.setItem(sessionKey, email);
    setSessionState(email);
  };

  const selectRole = (role: PortalRole) => {
    setSelectedRole(role);
    setMode(role === "admin" ? "login" : "register");
    setMessage(
      role === "admin"
        ? "El acceso administrador requiere una cuenta autorizada por ICC Topografia."
        : `Completa el registro para ${role === "client" ? "cliente" : "profesional tecnico"}.`,
    );
    window.requestAnimationFrame(() => document.getElementById("portal-access")?.scrollIntoView({ behavior: "smooth" }));
  };

  const login = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = normalizeEmail(form.get("email"));
    const password = String(form.get("password") || "");
    const found = accounts.find((item) => item.email === email && item.password === password);

    if (!found) {
      setMessage("El correo ingresado no esta registrado o la contrasena es incorrecta.");
      return;
    }

    if (found.status === "pending") {
      setMessage("Tu cuenta esta pendiente de validacion.");
      return;
    }

    setSession(email);
    setMessage("Bienvenido al Portal Terraqo.");
  };

  const create = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = normalizeEmail(form.get("email"));
    const password = String(form.get("password") || "");
    const confirmPassword = String(form.get("confirmPassword") || "");

    if (!email || !password) {
      setMessage("Completa los campos obligatorios para continuar.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("La confirmacion de contrasena no coincide.");
      return;
    }

    if (accounts.some((item) => item.email === email)) {
      setMessage("Ya existe una cuenta con ese correo.");
      return;
    }

    if (selectedRole === "admin") {
      setMessage("Este tipo de acceso requiere autorizacion del equipo administrador.");
      return;
    }

    const profile = Object.fromEntries(
      fieldsByRole[selectedRole]
        .filter((field) => field.name !== "password" && field.name !== "confirmPassword")
        .map((field) => [field.name, String(form.get(field.name) || "").trim()]),
    );

    const accountData: PortalAccount = {
      id: `terraqo-${Date.now()}`,
      role: selectedRole,
      status: selectedRole === "professional" ? "pending" : "active",
      name: String(form.get("name") || "").trim(),
      company: String(form.get("company") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      email,
      password,
      profile,
      quotes: [],
      createdAt: new Date().toISOString(),
    };

    const next = accounts.concat(accountData);
    writeAccounts(next);
    setAccounts(next);

    if (accountData.status === "pending") {
      setMode("login");
      setMessage("Tus datos fueron registrados. Tu cuenta profesional queda pendiente de validacion.");
      return;
    }

    setSession(email);
    setMessage("Cuenta creada correctamente. Bienvenido al Portal Terraqo.");
  };

  if (account) {
    return (
      <>
        <PortalDashboard
          account={account}
          message={message}
          onLogout={() => {
            localStorage.removeItem(sessionKey);
            setSessionState("");
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
              <button className={mode === "login" ? "is-active" : ""} type="button" onClick={() => setMode("login")}>
                Iniciar sesion
              </button>
              <button
                className={mode === "register" ? "is-active" : ""}
                type="button"
                onClick={() => {
                  setMode("register");
                  if (selectedRole === "admin") setSelectedRole("client");
                }}
              >
                Crear cuenta
              </button>
            </div>

            {mode === "login" ? (
              <PortalLoginForm onSubmit={login} onRegisterClick={() => setMode("register")} />
            ) : (
              <>
                <PortalProfileSelector profiles={portalProfiles} activeRole={selectedRole} onSelect={setSelectedRole} />
                <PortalRegisterForm
                  role={selectedRole}
                  fields={fieldsByRole[selectedRole]}
                  onSubmit={create}
                  onAdminAccess={() => {
                    setMode("login");
                    setMessage("Ingresa con tu correo corporativo autorizado.");
                  }}
                />
              </>
            )}
          </div>
        </div>
      </section>

      <PortalAccessCards profiles={portalProfiles} onSelect={selectRole} />

      <section className="portal-trust-section">
        <div className="container portal-trust-grid">
          {portalTrustMessages.map((trust) => (
            <p key={trust}>{trust}</p>
          ))}
        </div>
      </section>

      <PortalFooterNote />
    </>
  );
}
