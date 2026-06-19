"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CommandMenuButton } from "@/components/CommandPalette";
import { NavLinks } from "@/components/NavLinks";
import { ThemeToggle } from "@/components/ThemeToggle";
import { profile } from "@/lib/profile";
import { navItems } from "@/lib/site";

/**
 * Nav
 *
 * Sticky primary navigation. On desktop the page links sit inline; on mobile
 * they collapse into a disclosure panel toggled by a hamburger button
 * (aria-expanded + aria-controls). The menu closes on Escape and after any
 * route change. Search (command menu) and the theme toggle stay visible at all
 * widths.
 *
 * Used by: app/layout.tsx
 */
export interface NavProps {
  className?: string;
}

export function Nav({ className }: NavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu after navigating to a new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape while the menu is open.
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

  return (
    <header className={`nav ${className ?? ""}`} data-menu-open={open}>
      <nav aria-label="Primary" className="layout nav-inner">
        <div className="nav-name">
          <Link className="quiet" href="/">
            {profile.name}
          </Link>
        </div>
        <div className="nav-cluster">
          <div className="nav-links" id="primary-menu">
            <NavLinks items={navItems} />
          </div>
          <CommandMenuButton />
          <ThemeToggle />
          <button
            aria-controls="primary-menu"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="nav-toggle"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            <span aria-hidden="true" className="nav-toggle-box">
              <span className="nav-toggle-bar" />
              <span className="nav-toggle-bar" />
              <span className="nav-toggle-bar" />
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}
