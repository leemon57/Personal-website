import { profile, profileLinks } from "@/lib/profile";

/**
 * Footer
 *
 * Renders the compact contact and profile links shown on every page.
 *
 * Used by: app/layout.tsx
 */
export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={`footer ${className ?? ""}`}>
      <div className="layout footer-inner">
        {profileLinks.map((link, index) => (
          <span key={link.href}>
            <a href={link.href}>{link.label}</a>
            {index < profileLinks.length - 1 ? <span className="faint"> / </span> : null}
          </span>
        ))}
        <span className="right">2026 / {profile.location.toLowerCase()}</span>
      </div>
    </footer>
  );
}
