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
    // Cursor-following glow: raw pixel coordinates, smoothed so it trails gently.
    let targetCx = -9999;
    let targetCy = -9999;
    let currentCx = -9999;
    let currentCy = -9999;
    let seenPointer = false;

    function onPointerMove(event: PointerEvent) {
      targetX = event.clientX / window.innerWidth - 0.5;
      targetY = event.clientY / window.innerHeight - 0.5;
      targetCx = event.clientX;
      targetCy = event.clientY;
      if (!seenPointer) {
        // Jump to the first position so the glow doesn't sweep in from a corner.
        currentCx = targetCx;
        currentCy = targetCy;
        seenPointer = true;
      }
    }

    function tick() {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      currentCx += (targetCx - currentCx) * 0.12;
      currentCy += (targetCy - currentCy) * 0.12;
      if (node) {
        node.style.setProperty("--mx", currentX.toFixed(4));
        node.style.setProperty("--my", currentY.toFixed(4));
        node.style.setProperty("--cx", `${currentCx.toFixed(1)}px`);
        node.style.setProperty("--cy", `${currentCy.toFixed(1)}px`);
        if (seenPointer) {
          node.dataset.pointer = "true";
        }
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
      <div className="glow-cursor" />
      <div className="grid" />
      <div className="grain" />
    </div>
  );
}
