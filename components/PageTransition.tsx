"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * PageTransition
 *
 * Gives client-side route changes a soft "settle in" animation (a gentle
 * cross-fade + rise) so navigation feels smooth and premium rather than an
 * instant swap. Re-triggers the CSS enter animation whenever the pathname
 * changes. Purely presentational; the animation itself is CSS (.page-enter), so
 * content stays visible without JS and is disabled under reduced-motion.
 *
 * Used by: app/layout.tsx (wraps the page content inside <main>).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    // Restart the enter animation on each navigation.
    node.classList.remove("page-enter");
    void node.offsetWidth; // force reflow so the animation replays
    node.classList.add("page-enter");
  }, [pathname]);

  return (
    <div className="page-enter" ref={ref}>
      {children}
    </div>
  );
}
