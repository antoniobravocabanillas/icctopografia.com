"use client";

import { useEffect } from "react";
import type { CSSProperties } from "react";
import { commitmentItems } from "../lib/home-data";

function CommitmentIcon({ type }: { type: string }) {
  if (type === "clock") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="10" />
        <path d="M16 9v8l5 3" />
      </svg>
    );
  }
  if (type === "quality") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 4l3 2 4-.5 1.5 3.5 3.5 1.5-.5 4 2 3-2 3 .5 4-3.5 1.5-1.5 3.5-4-.5-3 2-3-2-4 .5-1.5-3.5-3.5-1.5.5-4-2-3 2-3-.5-4L7.5 9 9 5.5l4 .5 3-2Z" />
        <path d="m11.5 16.2 3 3 6-6" />
      </svg>
    );
  }
  if (type === "handshake") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="m11 18 4 4a4 4 0 0 0 6 0l5-5" />
        <path d="m6 14 5-5 6 6" />
        <path d="m26 14-5-5-5 5" />
        <path d="m8 16 4 4M21 19l-4-4" />
      </svg>
    );
  }
  if (type === "shield") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 4 26 8v8c0 6-4 10-10 12C10 26 6 22 6 16V8l10-4Z" />
        <path d="M13 16h6v6h-6z" />
        <path d="M14 16v-2a2 2 0 0 1 4 0v2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="7" />
      <path d="M16 4v6M16 22v6M4 16h6M22 16h6" />
      <circle cx="16" cy="16" r="3" />
    </svg>
  );
}

export default function CommitmentSection() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>("[data-commitment-scroll]");
    if (!section) return;

    const cards = Array.from(section.querySelectorAll<HTMLElement>(".commitment-card"));
    const progress = section.querySelector<HTMLElement>(".commitment-progress span");
    const steps = Array.from(section.querySelectorAll<HTMLButtonElement>("[data-commitment-step]"));
    const canAnimate =
      window.matchMedia("(min-width: 1181px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canAnimate || cards.length < 2) {
      section.classList.add("is-static-commitment");
      cards.forEach((card) => card.classList.add("is-active"));
      steps.forEach((step) => step.classList.remove("is-active"));
      if (progress) progress.style.width = "100%";
      return;
    }

    let activeIndex = -1;
    let ticking = false;
    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
    const setActive = (index: number) => {
      if (index === activeIndex) return;
      activeIndex = index;
      cards.forEach((card, cardIndex) => {
        card.classList.toggle("is-active", cardIndex === index);
        card.classList.toggle("is-previous", cardIndex < index);
      });
      steps.forEach((step, stepIndex) => step.classList.toggle("is-active", stepIndex === index));
    };

    const update = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
      const raw = clamp(-rect.top / scrollable, 0, 1);
      const index = clamp(Math.round(raw * (cards.length - 1)), 0, cards.length - 1);
      setActive(index);
      section.style.setProperty("--commitment-active-index", String(index));
      section.style.setProperty("--commitment-progress", String((index + 1) / cards.length));
      if (progress) progress.style.width = `${((index + 1) / cards.length) * 100}%`;
      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    const onStepClick = (event: Event) => {
      const step = event.currentTarget as HTMLButtonElement;
      const stepIndex = Number(step.dataset.commitmentStep || 0);
      const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
      const target = section.offsetTop + scrollable * (stepIndex / Math.max(1, cards.length - 1));
      window.scrollTo({ top: target, behavior: "smooth" });
    };

    update();
    steps.forEach((step) => step.addEventListener("click", onStepClick));
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      steps.forEach((step) => step.removeEventListener("click", onStepClick));
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <section className="commitment-section" aria-labelledby="commitment-title" data-commitment-scroll>
      <div className="commitment-shapes" aria-hidden="true" />
      <div className="container commitment-grid commitment-sticky">
        <div className="commitment-copy">
          <p className="eyebrow">Nuestro compromiso</p>
          <h2 id="commitment-title">
            Exactitud que impulsa confianza. Compromiso que entrega resultados<span>.</span>
          </h2>
          <i />
          <p>
            Combinamos tecnologia, experiencia y procesos rigurosos para garantizar informacion precisa, entregas
            puntuales y total seguridad en cada proyecto.
          </p>
          <div className="commitment-progress" aria-hidden="true">
            <span />
          </div>
          <div className="commitment-steps" aria-label="Secuencia de compromisos">
            {commitmentItems.map((item, index) => (
              <button
                className={`commitment-step${index === 0 ? " is-active" : ""}`}
                type="button"
                data-commitment-step={index}
                key={item.number}
              >
                <span>{item.number}</span>
                <strong>{item.title}</strong>
              </button>
            ))}
          </div>
        </div>
        <div className="commitment-cards" aria-label="Compromisos ICC Topografia">
          {commitmentItems.map((item, index) => (
            <article
              className={`commitment-card${index === 0 ? " is-active" : ""}`}
              data-step={item.number}
              style={{ "--card-index": index } as CSSProperties}
              key={item.number}
            >
              <CommitmentIcon type={item.icon} />
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <i />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
