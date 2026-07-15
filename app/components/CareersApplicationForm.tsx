"use client";

import { FormEvent, useMemo, useState } from "react";
import type { CareerJob, ProfessionalTaxonomy } from "../lib/careers";
import ProfessionalToolSelector from "./ProfessionalToolSelector";
import styles from "../trabaja-con-nosotros/trabaja-con-nosotros.module.css";

type CareersApplicationFormProps = {
  categories: string[];
  taxonomies: ProfessionalTaxonomy[];
  jobs: CareerJob[];
};

export default function CareersApplicationForm({ categories, taxonomies, jobs }: CareersApplicationFormProps) {
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedJobId), [jobs, selectedJobId]);

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setStatus("sending");
    setMessage("");

    const form = new FormData(formElement);
    const password = String(form.get("password") || "");
    const passwordConfirmation = String(form.get("passwordConfirmation") || "");
    if (password !== passwordConfirmation) {
      setStatus("error");
      setMessage("Las contrasenas no coinciden.");
      return;
    }

    const payload = {
      jobPostId: selectedJobId || undefined,
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      password,
      category: String(form.get("category") || ""),
      specialty: String(form.get("specialty") || ""),
      roleTitle: String(form.get("roleTitle") || "") || undefined,
      city: String(form.get("city") || ""),
      yearsExperience: Number(form.get("yearsExperience") || 0),
      currentCompany: String(form.get("currentCompany") || "") || undefined,
      currentRole: String(form.get("currentRole") || "") || undefined,
      portfolioUrl: String(form.get("portfolioUrl") || "") || undefined,
      cvUrl: String(form.get("cvUrl") || "") || undefined,
      equipment: form.getAll("equipment").map(String),
      software: form.getAll("software").map(String),
      coverNote: String(form.get("coverNote") || ""),
      availabilityNote: String(form.get("availabilityNote") || "") || undefined,
      termsAccepted: form.get("termsAccepted") === "on",
      privacyAccepted: form.get("privacyAccepted") === "on",
    };

    try {
      const requestBody = new FormData();
      requestBody.set("payload", JSON.stringify(payload));
      const cvFile = form.get("cvFile");
      if (cvFile instanceof File && cvFile.size > 0) requestBody.set("cvFile", cvFile);

      const response = await fetch("/api/terraqo/careers", {
        method: "POST",
        headers: { accept: "application/json" },
        body: requestBody,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error?.message || "No pudimos registrar tu postulacion.");
      }

      setStatus("success");
      setMessage(data?.data?.message || "Tu postulacion fue registrada correctamente.");
      formElement.reset();
      setSelectedJobId("");
      setSelectedCategory("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "No pudimos registrar tu postulacion.");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.successPanel} role="status">
        <span>Postulacion recibida</span>
        <h2>Tu perfil profesional ya tiene un punto de partida.</h2>
        <p>{message}</p>
        <p>
          Creaste una cuenta privada en Red Profesional Terraqo. Desde el portal podras seguir tu postulacion y, cuando
          corresponda, vincular experiencia validada, empresas y proyectos a tu CV vivo. Para activar el distintivo de
          identidad deberas ingresar y subir el frente y reverso de tu DNI en el area privada.
        </p>
        <a href="/cuenta">
          Ingresar a mi perfil profesional
        </a>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submitApplication}>
      <div className={styles.formHeading}>
        <div>
          <span>Postulacion profesional</span>
          <h2>Presenta tu perfil a ICC Topografia.</h2>
        </div>
        <p>Los campos marcados con * son obligatorios.</p>
      </div>

      <fieldset>
        <legend>Oportunidad</legend>
        <label className={styles.fullField}>
          <span>Convocatoria</span>
          <select value={selectedJobId} onChange={(event) => setSelectedJobId(event.target.value)}>
            <option value="">Postulacion general a la bolsa de talento</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
          <small>{selectedJob?.summary || "Tu perfil quedara disponible para futuras oportunidades de ICC Topografia."}</small>
        </label>
      </fieldset>

      <fieldset>
        <legend>Datos de acceso</legend>
        <label>
          <span>Nombre completo *</span>
          <input name="name" autoComplete="name" required minLength={3} />
        </label>
        <label>
          <span>Telefono / WhatsApp *</span>
          <input name="phone" autoComplete="tel" required minLength={7} />
        </label>
        <label>
          <span>Correo electronico *</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          <span>Ciudad *</span>
          <input name="city" autoComplete="address-level2" required />
        </label>
        <label>
          <span>Crear contrasena *</span>
          <input name="password" type="password" autoComplete="new-password" required minLength={8} />
        </label>
        <label>
          <span>Confirmar contrasena *</span>
          <input name="passwordConfirmation" type="password" autoComplete="new-password" required minLength={8} />
        </label>
      </fieldset>

      <fieldset>
        <legend>Perfil profesional</legend>
        <label>
          <span>Categoria profesional *</span>
          <select name="category" required value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
            <option value="" disabled>Selecciona una categoria</option>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label>
          <span>Especialidad principal *</span>
          <input name="specialty" required placeholder="Ej. topografia, administracion, desarrollo web" />
        </label>
        <label>
          <span>Cargo o perfil</span>
          <input name="roleTitle" placeholder="Ej. Topografo de obra" />
        </label>
        <label>
          <span>Anos de experiencia *</span>
          <input name="yearsExperience" type="number" min={0} max={80} required defaultValue={0} />
        </label>
        <label>
          <span>Empresa actual</span>
          <input name="currentCompany" placeholder="Se registrara como declarada hasta validarla" />
        </label>
        <label>
          <span>Cargo actual</span>
          <input name="currentRole" />
        </label>
        <ProfessionalToolSelector category={selectedCategory} taxonomies={taxonomies} />
        <label>
          <span>Portafolio o LinkedIn</span>
          <input name="portfolioUrl" type="url" placeholder="https://" />
        </label>
        <label>
          <span>Enlace a CV</span>
          <input name="cvUrl" type="url" placeholder="https://" />
          <small>Opcional si prefieres compartir un enlace privado.</small>
        </label>
        <label>
          <span>O sube tu CV</span>
          <input name="cvFile" type="file" accept=".pdf,.doc,.docx" />
          <small>PDF, DOC o DOCX. Maximo 10 MB.</small>
        </label>
        <label className={styles.fullField}>
          <span>Presentacion profesional *</span>
          <textarea name="coverNote" required minLength={20} rows={5} placeholder="Cuentanos en que destacas, que experiencia tienes y como podrias aportar." />
        </label>
        <label className={styles.fullField}>
          <span>Disponibilidad</span>
          <textarea name="availabilityNote" rows={3} placeholder="Disponibilidad, modalidad o fecha desde la que puedes incorporarte." />
        </label>
      </fieldset>

      <div className={styles.consentBlock}>
        <label>
          <input name="termsAccepted" type="checkbox" required />
          <span>
            Acepto los <a href="https://iridescent-fenglisu-d6595c.netlify.app/terminos" target="_blank" rel="noreferrer">Terminos y condiciones</a> de Red Profesional Terraqo y autorizo la creacion de mi perfil privado. *
          </span>
        </label>
        <label>
          <input name="privacyAccepted" type="checkbox" required />
          <span>
            He leido la <a href="https://iridescent-fenglisu-d6595c.netlify.app/privacidad" target="_blank" rel="noreferrer">Politica de privacidad</a> y autorizo el tratamiento de mis datos para procesos profesionales. *
          </span>
        </label>
      </div>

      {status === "error" ? <p className={styles.errorMessage} role="alert">{message}</p> : null}

      <div className={styles.formFooter}>
        <p>Tu perfil sera privado. No publicaremos tu experiencia ni tus datos sin permisos adicionales.</p>
        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Registrando..." : "Crear perfil y postular"}
        </button>
      </div>
    </form>
  );
}
