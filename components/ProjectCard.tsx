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
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="border-b border-rule pb-8">
      <h3 className="text-[1.25rem] font-medium leading-[1.3]">
        <Link className="unstyled-link hover:text-accent" href={`/work/${project.slug}`}>
          {project.title}
        </Link>
      </h3>
      <p className="mt-3 text-ink">{project.subtitle}</p>
      <p className="mt-3 font-mono text-[0.8125rem] leading-normal text-ink-muted">
        {project.stack.join(" / ")}
      </p>
      <Link className="mt-4 inline-block font-mono text-[0.8125rem]" href={`/work/${project.slug}`}>
        read the case study -&gt;
      </Link>
    </article>
  );
}
