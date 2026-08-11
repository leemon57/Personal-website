"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PortfolioAgent } from "@/components/PortfolioAgent";
import type { AgentProject } from "@/lib/portfolio-agent";
import { assistantContent } from "@/lib/site";

/**
 * FloatingAssistant
 *
 * Global dockable wrapper around the existing PortfolioAgent ("Serene Bento"
 * skin). Rendered once in the layout: a collapsed launcher (FAB) bottom-right on
 * every page that expands into a floating panel. Auto-opens on the home page and
 * whenever the "ask" nav is used (`/#ask-hany`). Closes on Escape or the close
 * button.
 *
 * The agent's request/response logic lives entirely in PortfolioAgent and is
 * reused verbatim here — this component only controls open/closed presentation.
 *
 * Used by: app/layout.tsx
 */
export function FloatingAssistant({ projects }: { projects: AgentProject[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Open when navigated to via the "ask" hash (the home page hosts the assistant
  // inline instead, so the floating panel is hidden there — see the render).
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#ask-hany") {
      setOpen(true);
    }
  }, [pathname]);

  // Open when the "ask" nav hash is applied on the current page.
  useEffect(() => {
    function onHashChange() {
      if (window.location.hash === "#ask-hany") {
        setOpen(true);
      }
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Escape closes the panel.
  useEffect(() => {
    if (!open) {
      return;
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // The home page renders the assistant inline, so skip the floating dock there.
  if (pathname === "/") {
    return null;
  }

  return (
    <div className="assistant-dock" data-open={open}>
      {open ? (
        <div
          aria-label={assistantContent.title}
          className="assistant-panel"
          role="dialog"
        >
          <button
            aria-label="Close assistant"
            className="assistant-close"
            onClick={() => setOpen(false)}
            type="button"
          >
            <span aria-hidden="true">×</span>
          </button>
          <PortfolioAgent projects={projects} />
        </div>
      ) : null}

      <button
        aria-expanded={open}
        aria-label={open ? "Close portfolio assistant" : "Open portfolio assistant"}
        className="assistant-fab"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span aria-hidden="true" className="assistant-fab-dot" />
        {open ? "Close" : "Ask Hany"}
      </button>
    </div>
  );
}
