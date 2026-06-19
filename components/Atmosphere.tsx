"use client";

import { useEffect, useRef } from "react";

/**
 * Atmosphere
 *
 * Fixed, full-viewport minimalist backdrop ("Trust & Authority" skin). Two
 * quiet layers: a barely-there dot grid for texture and a single soft accent
 * glow behind the hero. Neutral by design so the content leads.
 *
 * A cheap pointer-parallax nudges the glow via CSS custom properties
 * (compositor-only --mx / --my) and is skipped under reduced-motion. Purely
 * decorative and inert to assistive tech. Adapts to light/dark via CSS.
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
    <div aria-hidden="true" className="atmosphere" ref={ref}>
      <div className="glow" />
      <div className="grid" />
    </div>
  );
}
