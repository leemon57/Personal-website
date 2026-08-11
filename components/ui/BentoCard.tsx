import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

/**
 * BentoCard
 *
 * A single cell in a BentoGrid ("Serene Bento" skin): a rounded, hairline-bordered,
 * soft-shadow surface with an optional caps eyebrow (`label`) and sans title. Set
 * `href` to make the whole card a link (internal routes use next/link, external /
 * hash / file links fall back to <a>). `col`/`row` control the grid span; `tone`
 * switches the surface treatment. Carries `data-reveal` so ScrollReveal fades it
 * in (opt out with `reveal={false}`).
 *
 * Used by: the redesigned bento pages.
 */
export interface BentoCardProps {
  children?: ReactNode;
  /** Caps eyebrow shown at the top of the card. */
  label?: string;
  /** Sans-serif card title under the label. */
  title?: ReactNode;
  /** Whole-card link target. */
  href?: string;
  /** Columns to span in the 6-col desktop grid (clamped by narrower grids). */
  col?: number;
  /** Rows to span. */
  row?: number;
  /** Surface treatment. `media` removes padding for edge-to-edge imagery. */
  tone?: "default" | "accent" | "media";
  className?: string;
  style?: CSSProperties;
  /** Set false to opt out of the ScrollReveal fade-in. */
  reveal?: boolean;
}

function isInternal(href: string): boolean {
  return href.startsWith("/") && !href.endsWith(".pdf");
}

export function BentoCard({
  children,
  label,
  title,
  href,
  col = 2,
  row = 1,
  tone = "default",
  className,
  style,
  reveal = true,
}: BentoCardProps) {
  const spanStyle: CSSProperties = {
    "--bento-col": col,
    "--bento-row": row,
    ...style,
  } as CSSProperties;

  const classes = `bento-card${href ? " bento-card--link" : ""}${
    className ? ` ${className}` : ""
  }`;

  const inner = (
    <>
      {label ? <p className="bento-label">{label}</p> : null}
      {title ? <h3 className="bento-title">{title}</h3> : null}
      {children}
    </>
  );

  const shared = {
    className: classes,
    "data-tone": tone,
    "data-reveal": reveal ? "" : undefined,
    style: spanStyle,
  } as const;

  if (href && isInternal(href)) {
    return (
      <Link href={href} {...shared}>
        {inner}
      </Link>
    );
  }

  if (href) {
    const external = /^https?:/u.test(href);
    return (
      <a
        href={href}
        rel={external ? "noreferrer" : undefined}
        target={external || href.endsWith(".pdf") ? "_blank" : undefined}
        {...shared}
      >
        {inner}
      </a>
    );
  }

  return (
    <article {...shared}>{inner}</article>
  );
}
