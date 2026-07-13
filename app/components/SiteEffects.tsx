"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const revealSelector = ".reveal, .service-card, .project-card, .product-card, .process-item";
    const observed = new WeakSet<HTMLElement>();
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

    const observeReveals = (root: ParentNode = document) => {
      root.querySelectorAll<HTMLElement>(revealSelector).forEach((item) => {
        if (observed.has(item) || item.classList.contains("is-visible")) return;
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
          item.classList.add("is-visible");
          return;
        }
        observed.add(item);
        revealObserver.observe(item);
      });
    };

    observeReveals();

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches(revealSelector) && !observed.has(node)) {
            const rect = node.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
              node.classList.add("is-visible");
              return;
            }
            observed.add(node);
            revealObserver.observe(node);
          }
          observeReveals(node);
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

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
      mutationObserver.disconnect();
      window.removeEventListener("scroll", requestParallax);
    };
  }, [pathname]);

  return null;
}
