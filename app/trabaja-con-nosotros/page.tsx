import type { Metadata } from "next";
import CareersApplicationForm from "../components/CareersApplicationForm";
import { professionalCategories, type CareersResponse } from "../lib/careers";
import { terraqoUrl } from "../lib/terraqo-api";
import styles from "./trabaja-con-nosotros.module.css";

export const metadata: Metadata = {
  title: "Trabaja con nosotros | ICC Topografia",
  description:
    "Postula a ICC Topografia y crea tu perfil privado en Red Profesional Terraqo para seguir oportunidades, proyectos y experiencia validada.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getCareersData(): Promise<CareersResponse | null> {
  try {
    const response = await fetch(terraqoUrl("/api/public/workspaces/icc-topografia/careers"), {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const payload = await response.json();
    return payload?.data || null;
  } catch {
    return null;
  }
}

export default async function CareersPage() {
  const data = await getCareersData();
  const jobs = data?.jobs || [];
  const categories = data?.categories?.length ? data.categories : [...professionalCategories];
  const taxonomies = data?.taxonomies || [];

  return (
    <>
      <section className={styles.hero}>
        <img src="/images/ingenieria-campo.jpg" alt="Equipo profesional coordinando informacion tecnica de un proyecto" />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={`container ${styles.heroLayout}`}>
          <div className={styles.heroCopy}>
            <p>Talento ICC Topografia</p>
            <h1>Haz que tu experiencia forme parte de proyectos reales.</h1>
            <span>
              Buscamos personas responsables, tecnicas y curiosas. Puedes postular a una vacante o dejar tu perfil para
              futuras oportunidades, dentro y fuera del trabajo de campo.
            </span>
            <div className={styles.heroActions}>
              <a href="#postular">Postular ahora</a>
              <a href="#oportunidades">Ver oportunidades</a>
            </div>
          </div>
          <div className={styles.heroProof} aria-label="Beneficios del perfil profesional">
            <div><b>01</b><strong>Seguimiento privado</strong><span>Revisa el estado de tu postulacion.</span></div>
            <div><b>02</b><strong>Perfil profesional</strong><span>Organiza experiencia, herramientas y especialidades.</span></div>
            <div><b>03</b><strong>CV vivo</strong><span>Los proyectos validados fortalecen tu trayectoria.</span></div>
          </div>
        </div>
      </section>

      <section className={styles.networkSection}>
        <div className={`container ${styles.networkLayout}`}>
          <div className={styles.sectionCopy}>
            <p>Una postulacion, mas continuidad</p>
            <h2>Tu perfil no termina cuando envias el formulario.</h2>
            <span>
              Con tu autorizacion, la postulacion crea una cuenta privada en Red Profesional Terraqo. Asi puedes dar
              seguimiento al proceso y construir una trayectoria conectada con empresas y proyectos verificables.
            </span>
          </div>
          <div className={styles.flow}>
            <article><span>01</span><h3>Postulas</h3><p>Eliges una oportunidad o ingresas a la bolsa general de talento.</p></article>
            <article><span>02</span><h3>Das seguimiento</h3><p>Tu cuenta conserva el estado de cada proceso en un solo lugar.</p></article>
            <article><span>03</span><h3>Construyes trayectoria</h3><p>Empresas, roles y proyectos pueden incorporarse a tu CV vivo al validarse.</p></article>
          </div>
        </div>
      </section>

      <section className={styles.opportunities} id="oportunidades">
        <div className="container">
          <div className={styles.opportunitiesHeading}>
            <div>
              <p>Oportunidades abiertas</p>
              <h2>{jobs.length ? "Convocatorias activas" : "Siempre puedes presentar tu perfil"}</h2>
            </div>
            <span>
              ICC Topografia trabaja con perfiles de campo, gabinete, gestion, tecnologia y soporte empresarial.
            </span>
          </div>

          {jobs.length ? (
            <div className={styles.jobsGrid}>
              {jobs.map((job) => (
                <article key={job.id}>
                  <div className={styles.jobMeta}>
                    <span>{job.modality || "Modalidad por coordinar"}</span>
                    <span>{job.location || "Ubicacion por confirmar"}</span>
                  </div>
                  <h3>{job.title}</h3>
                  <p>{job.summary}</p>
                  <div className={styles.jobSkills}>
                    {(job.professionalCategories.length ? job.professionalCategories : job.requiredSkills).slice(0, 3).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  <a href="#postular">Postular a esta oportunidad</a>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.openApplication}>
              <div>
                <span>Bolsa de talento</span>
                <h3>No necesitas esperar una vacante para presentarte.</h3>
              </div>
              <p>
                Registraremos tu especialidad, experiencia y disponibilidad para considerarte cuando aparezca una
                oportunidad compatible. Tu perfil permanecera privado.
              </p>
              <a href="#postular">Crear mi perfil</a>
            </div>
          )}
        </div>
      </section>

      <section className={styles.categoriesSection}>
        <div className={`container ${styles.categoriesLayout}`}>
          <div className={styles.sectionCopy}>
            <p>Perfiles diversos</p>
            <h2>La red profesional no esta limitada a un solo rubro.</h2>
            <span>
              La operacion de ICC Topografia necesita especialidades topograficas, pero tambien capacidades de
              ingenieria, tecnologia, administracion, comunicacion, operaciones y soporte.
            </span>
          </div>
          <div className={styles.categoryRail}>
            {categories.map((category, index) => (
              <span key={category}><b>{String(index + 1).padStart(2, "0")}</b>{category}</span>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.applicationSection} id="postular">
        <div className="container">
          <CareersApplicationForm categories={categories} taxonomies={taxonomies} jobs={jobs} />
        </div>
      </section>
    </>
  );
}
