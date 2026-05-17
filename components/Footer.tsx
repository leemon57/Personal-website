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

const links = [
  { href: "mailto:hanyjiang@gmail.com", label: "hanyjiang@gmail.com" },
  { href: "https://github.com/HanyJiang", label: "github" },
  { href: "https://www.linkedin.com/in/hanyjiang", label: "linkedin" },
  { href: "/resume.pdf", label: "resume (pdf)" },
  { href: "/feed.xml", label: "rss" },
];

export function Footer({ className }: FooterProps) {
  return (
    <footer className={`footer ${className ?? ""}`}>
      <div className="layout footer-inner">
        {links.map((link, index) => (
          <span key={link.href}>
            <a href={link.href}>{link.label}</a>
            {index < links.length - 1 ? <span className="faint"> / </span> : null}
          </span>
        ))}
        <span className="right">2026 / waterloo, on</span>
      </div>
    </footer>
  );
}
