import type { ReactNode } from "react";

/**
 * Section
 *
 * Standard page-top for the redesigned pages ("Serene Bento" skin): an optional
 * caps eyebrow, a large serif title, and an optional lead paragraph, followed by
 * the section body. Keeps page headers consistent (Playfair title + rhythm) so
 * each page doesn't hand-roll its own header markup.
 *
 * Used by: the redesigned bento pages.
 */
export interface SectionProps {
  title: ReactNode;
  eyebrow?: string;
  lead?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Heading level for the title; defaults to h1 (one page title per page). */
  as?: "h1" | "h2";
}

export function Section({
  title,
  eyebrow,
  lead,
  children,
  className,
  as = "h1",
}: SectionProps) {
  const Heading = as;
  return (
    <section className={`section-shell${className ? ` ${className}` : ""}`}>
      <header className="section-head" data-reveal="">
        {eyebrow ? <p className="caps section-eyebrow">{eyebrow}</p> : null}
        <Heading className="section-title">{title}</Heading>
        {lead ? <p className="section-lead">{lead}</p> : null}
      </header>
      {children}
    </section>
  );
}
