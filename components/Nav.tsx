import Link from "next/link";
import { cn } from "@/lib/cn";

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
  { href: "/work", label: "work" },
  { href: "/writing", label: "writing" },
  { href: "/now", label: "now" },
  { href: "/uses", label: "uses" },
  { href: "/resume.pdf", label: "resume" },
];

export function Nav({ className }: NavProps) {
  return (
    <header className={cn("site-shell py-8", className)}>
      <nav aria-label="Primary" className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
        <Link className="unstyled-link text-[0.95rem] font-medium leading-none text-ink" href="/">
          Hany Jiang
        </Link>
        <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-[0.8125rem] leading-none text-ink-muted">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
