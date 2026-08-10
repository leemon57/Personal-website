import type { CSSProperties, Ref, ReactNode } from "react";

/**
 * BentoGrid
 *
 * Responsive bento layout container ("Serene Bento" skin). A six-column grid on
 * desktop that collapses to four columns on tablet and a single column on
 * mobile; children (BentoCard) claim width via their `col` span. `dense`
 * auto-flow lets smaller cards backfill gaps. Purely presentational.
 *
 * Used by: the redesigned home / projects / about / courses / photography pages.
 */
export interface BentoGridProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
}

export function BentoGrid({ children, className, style, ref }: BentoGridProps) {
  return (
    <div className={`bento${className ? ` ${className}` : ""}`} ref={ref} style={style}>
      {children}
    </div>
  );
}
