"use client";

import { useEffect, useRef } from "react";

/**
 * Atmosphere
 *
 * Fixed, full-viewport cinematic backdrop: a drifting gradient mesh of
 * violet / rose / gold orbs plus a film-grain overlay. The orbs respond to
 * pointer movement with subtle parallax (driven by CSS custom properties so
 * the animation stays on the compositor). Purely decorative and inert to
 * assistive tech.
 *
 * Used by: app/layout.tsx
 */
export function Atmosphere() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      return;
    }

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    function onPointerMove(event: PointerEvent) {
      targetX = event.clientX / window.innerWidth - 0.5;
      targetY = event.clientY / window.innerHeight - 0.5;
    }

    function tick() {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      if (node) {
        node.style.setProperty("--mx", currentX.toFixed(4));
        node.style.setProperty("--my", currentY.toFixed(4));
      }
      frame = window.requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div aria-hidden="true" className="atmosphere" ref={ref}>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="vignette" />
      </div>
      <div aria-hidden="true" className="grain" />
    </>
  );
}
