"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * ScrollReveal
 *
 * Reveals elements marked with `data-reveal` as they scroll into view using a
 * single shared IntersectionObserver. Elements are hidden via CSS only when
 * `html.js` is present, so content stays visible without JavaScript. Honors
 * `prefers-reduced-motion` by revealing everything immediately.
 *
 * Re-scans on every route change: this component lives in the root layout and
 * does not remount during client-side navigation, so it keys off `usePathname`
 * to observe the freshly rendered page's `data-reveal` elements. A safety
 * timer also reveals anything still hidden (e.g. content that streams in late)
 * so nothing can get stuck invisible.
 *
 * Optional per-element stagger: set `style={{ "--reveal-delay": <ms> }}`.
 *
 * Used by: app/layout.tsx
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"),
    );

    if (elements.length === 0) {
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
    );

    elements.forEach((el) => observer.observe(el));

    // Failsafe: reveal anything already within (or above) the viewport that the
    // observer hasn't caught yet, so on-screen content can never stay hidden.
    // Below-the-fold elements are left for the observer to animate on scroll.
    const failsafe = window.setTimeout(() => {
      elements.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      });
    }, 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [pathname]);

  return null;
}
