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
 * Sidebar
 *
 * Fixed left navigation rail ("Serene Bento" skin): wordmark, vertical page
 * links, and the command-menu + theme controls. On desktop it is a persistent
 * rounded rail; below the breakpoint it collapses behind a sticky top bar and
 * slides in as a left drawer (aria-expanded + aria-controls), closing on Escape,
 * on scrim click, and after any route change. Body scroll locks while the drawer
 * is open.
 *
 * Reuses NavLinks (active-route marking), CommandMenuButton, and ThemeToggle so
 * the ⌘K palette and theming keep working unchanged.
 *
 * Used by: app/layout.tsx
 */
export function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer after navigating to a new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape and lock body scroll while the drawer is open.
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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      {/* Mobile top bar — hidden on desktop */}
      <header className="topbar">
        <Link className="topbar-name quiet" href="/">
          {profile.name}
        </Link>
        <div className="topbar-actions">
          <CommandMenuButton />
          <ThemeToggle />
          <button
            aria-controls="sidebar-nav"
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
      </header>

      {/* Drawer scrim — mobile only */}
      <button
        aria-hidden="true"
        className="sidebar-scrim"
        data-open={open}
        onClick={() => setOpen(false)}
        tabIndex={-1}
        type="button"
      />

      <aside className="sidebar" data-open={open}>
        <div className="sidebar-card">
          <div className="sidebar-name">
            <Link className="quiet" href="/">
              {profile.name}
            </Link>
          </div>
          <nav aria-label="Primary" className="sidebar-nav" id="sidebar-nav">
            <NavLinks items={navItems} />
          </nav>
          <div className="sidebar-tools">
            <CommandMenuButton />
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
