import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Prose
 *
 * Applies the site typography system to long-form MDX content.
 *
 * Used by: app/work/[slug]/page.tsx, app/writing/[slug]/page.tsx
 */
export interface ProseProps {
  children: ReactNode;
  className?: string;
}

export function Prose({ children, className }: ProseProps) {
  return <div className={cn("prose", className)}>{children}</div>;
}
