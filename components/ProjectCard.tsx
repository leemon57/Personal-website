import Link from "next/link";
import type { WorkFrontmatter } from "@/lib/content";

/**
 * ProjectCard
 *
 * Renders a homepage or work-index teaser for a case study.
 *
 * Used by: app/page.tsx, app/work/page.tsx
 */
export interface ProjectCardProps {
  project: WorkFrontmatter;
  index?: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article className="proj">
      <div className="idx">{String(index ?? project.order).padStart(2, "0")}</div>
      <div>
        <h3>
          <Link href={`/work/${project.slug}`}>{project.title}</Link>
        </h3>
        <p>{project.subtitle}</p>
        <p className="stack">{project.stack.join(" / ")}</p>
        <Link className="more" href={`/work/${project.slug}`}>
          read the case study -&gt;
        </Link>
      </div>
    </article>
  );
}
