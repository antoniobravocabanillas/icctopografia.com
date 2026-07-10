"use client";

import { useEffect } from "react";

export default function SiteEffects() {
  useEffect(() => {
    const revealItems = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal, .service-card, .project-card, .product-card, .process-item"),
    );
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );
    revealItems.forEach((item) => revealObserver.observe(item));

    const parallaxItems = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let ticking = false;
    const updateParallax = () => {
      const y = window.scrollY || 0;
      parallaxItems.forEach((item) => {
        const speed = Number(item.getAttribute("data-parallax")) || 0.08;
        item.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
      ticking = false;
    };
    const requestParallax = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener("scroll", requestParallax, { passive: true });
    return () => {
      revealObserver.disconnect();
      window.removeEventListener("scroll", requestParallax);
    };
  }, []);

  return null;
}
