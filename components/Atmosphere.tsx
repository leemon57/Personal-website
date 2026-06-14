"use client";

import { useEffect, useRef } from "react";

/**
 * Atmosphere
 *
 * Fixed, full-viewport pixel-art farm backdrop (Stardew skin). A banded sky
 * sits across the top, rolling hills + a fence + crop rows line the bottom,
 * and the wide middle stays the solid field colour so content reads cleanly.
 *
 * Day  -> blue sky, pixel sun, drifting clouds, green hills.
 * Night -> indigo sky, twinkling stars, pixel moon, fireflies.
 *
 * Which set shows is driven entirely by CSS (html[data-theme]); this component
 * only renders the layers. A cheap pointer-parallax nudges a few layers via
 * CSS custom properties (compositor-only) and is skipped under reduced-motion.
 * Purely decorative and inert to assistive tech.
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
        <div className="sky" />
        <div className="stars" />
        <div className="sky-body sun" />
        <div className="sky-body moon" />
        <div className="clouds">
          <div className="cloud cloud-1" />
          <div className="cloud cloud-2" />
          <div className="cloud cloud-3" />
        </div>
        <div className="hills">
          <div className="hill hill-back" />
          <div className="hill hill-front" />
        </div>
        <div className="fence" />
        <div className="crops" />
        <div className="fireflies">
          <div className="firefly" />
          <div className="firefly" />
          <div className="firefly" />
          <div className="firefly" />
          <div className="firefly" />
        </div>
        <div className="vignette" />
      </div>
      <div aria-hidden="true" className="grain" />
    </>
  );
}
