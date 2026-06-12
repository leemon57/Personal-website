import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

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

const navItems = [
  { href: "/#ask-hany", label: "ask" },
  { href: "/about", label: "about" },
  { href: "/projects", label: "projects" },
  { href: "/work", label: "work" },
  { href: "/courses", label: "courses" },
  { href: "/contact", label: "contact" },
  { href: "/resume.pdf", label: "resume" },
];

export function Nav({ className }: NavProps) {
  return (
    <header className={`nav ${className ?? ""}`}>
      <nav aria-label="Primary" className="layout nav-inner">
        <div className="nav-name">
          <Link className="quiet" href="/">
            Hany Jiang
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
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
