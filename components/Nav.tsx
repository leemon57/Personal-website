import Link from "next/link";
import { CommandMenuButton } from "@/components/CommandPalette";
import { ThemeToggle } from "@/components/ThemeToggle";
import { profile } from "@/lib/profile";
import { navItems } from "@/lib/site";

/**
 * Nav
 *
 * Renders the left-aligned site navigation used in the root layout.
 *
 * Used by: app/layout.tsx
 */
export interface NavProps {
  className?: string;
}

export function Nav({ className }: NavProps) {
  return (
    <header className={`nav ${className ?? ""}`}>
      <nav aria-label="Primary" className="layout nav-inner">
        <div className="nav-name">
          <Link className="quiet" href="/">
            {profile.name}
          </Link>
        </div>
        <div className="nav-links">
          {navItems.map((item, index) => (
            <span key={item.href}>
              <Link className="quiet" href={item.href}>
                {item.label}
              </Link>
              {index < navItems.length - 1 ? <span className="sep">/</span> : null}
            </span>
          ))}
          <CommandMenuButton />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
