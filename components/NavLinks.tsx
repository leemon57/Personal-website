"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * NavLinks
 *
 * Client wrapper that renders the primary navigation links and marks the
 * current page with `aria-current="page"` + an `is-active` class. Kept separate
 * so the rest of Nav can stay server-rendered. Returns a fragment so the links
 * sit directly inside the existing `.nav-links` fl. container.
 *
 * Used by: components/Nav.tsx
 */
export interface NavLinkItem {
  href: string;
  label: string;
}

export function NavLinks({ items }: { items: NavLinkItem[] }) {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    // External / file links (e.g. /resume.pdf) are never an "active page".
    if (/^https?:/u.test(href) || href.endsWith(".pdf")) {
      return false;
    }
    const path = href.split("#")[0] || "/";
    if (path === "/") {
      return pathname === "/";
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  return (
    <>
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={`quiet${active ? " is-active" : ""}`}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
