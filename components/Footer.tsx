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
    <footer className={className}>
      <div className="site-shell border-t border-rule py-8">
        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-[0.8125rem] text-ink-muted"
        >
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
