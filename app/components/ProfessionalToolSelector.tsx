"use client";

import type { ProfessionalTaxonomy } from "../lib/careers";
import styles from "../trabaja-con-nosotros/trabaja-con-nosotros.module.css";

type ProfessionalToolSelectorProps = {
  category: string;
  taxonomies: ProfessionalTaxonomy[];
};

function OptionGroup({ title, description, name, options }: { title: string; description: string; name: string; options: string[] }) {
  return (
    <section className={styles.optionGroup}>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {options.length ? (
        <div className={styles.optionGrid}>
          {options.map((option) => (
            <label key={option} className={styles.optionChoice}>
              <input type="checkbox" name={name} value={option} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      ) : (
        <p className={styles.optionEmpty}>Selecciona primero una categoria profesional.</p>
      )}
    </section>
  );
}

export default function ProfessionalToolSelector({ category, taxonomies }: ProfessionalToolSelectorProps) {
  const taxonomy = taxonomies.find((item) => item.category === category);

  return (
    <div key={category} className={`${styles.fullField} ${styles.optionSelector}`}>
      <OptionGroup
        title="Equipos y herramientas que manejas"
        description="Selecciona solo las opciones que utilizas con autonomia."
        name="equipment"
        options={taxonomy?.equipment || []}
      />
      <OptionGroup
        title="Software que utilizas"
        description="Marca las plataformas que forman parte de tu trabajo habitual."
        name="software"
        options={taxonomy?.software || []}
      />
    </div>
  );
}
