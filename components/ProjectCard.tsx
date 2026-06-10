import Link from "next/link";
import { getCaseStudyHref, type WorkFrontmatter } from "@/lib/content";

/**
 * ProjectCard
 *
 * Renders a project or work-experience teaser for a case study.
 *
 * Used by: app/projects/page.tsx, app/work/page.tsx
 */
export interface ProjectCardProps {
  project: WorkFrontmatter;
  index?: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const href = getCaseStudyHref(project);

  return (
    <article className="proj">
      <div className="idx">{String(index ?? project.order).padStart(2, "0")}</div>
      <div>
        <h3>
          <Link href={href}>{project.title}</Link>
        </h3>
        <p>{project.subtitle}</p>
        <p className="stack">{project.stack.join(" / ")}</p>
        <Link className="more" href={href}>
          read the case study -&gt;
        </Link>
      </div>
    </article>
  );
}
