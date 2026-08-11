"use client";

import { useEffect, useRef, useState } from "react";
import { BentoCard } from "@/components/ui/BentoCard";
import { BentoGrid } from "@/components/ui/BentoGrid";

/**
 * ProjectFilters
 *
 * Client-side domain filter for the Projects bento ("Serene Bento" skin). Renders
 * All / Web / ML / Data Science chips (as a tablist) and the filtered grid of
 * project BentoCards. Domains are derived server-side from each project's stack
 * and passed in, so no content authoring is required.
 *
 * Used by: app/projects/page.tsx
 */
export interface ProjectFilterItem {
  slug: string;
  title: string;
  subtitle: string;
  href: string;
  stack: string[];
  domains: string[];
}

const FILTERS = ["All", "Web", "ML", "Data Science"] as const;

export function ProjectFilters({ projects }: { projects: ProjectFilterItem[] }) {
  const [active, setActive] = useState<string>("All");
  const gridRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const visible =
    active === "All"
      ? projects
      : projects.filter((project) => project.domains.includes(active));

  // Changing the filter unmounts/remounts cards; a remounted card carries
  // `data-reveal` but not `.is-visible`, so the shared ScrollReveal (which only
  // rescans on route change) would leave it stuck at opacity 0 and the grid
  // would appear empty. Reveal the freshly shown cards on every filter change.
  // The first render is left to ScrollReveal so the initial scroll animation
  // is preserved.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    gridRef.current
      ?.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)")
      .forEach((element) => element.classList.add("is-visible"));
  }, [active]);

  return (
    <>
      <div aria-label="Filter projects" className="filter-chips" role="tablist">
        {FILTERS.map((filter) => (
          <button
            aria-selected={active === filter}
            className={`chip${active === filter ? " is-active" : ""}`}
            key={filter}
            onClick={() => setActive(filter)}
            role="tab"
            type="button"
          >
            {filter}
          </button>
        ))}
      </div>

      <BentoGrid className="projects-bento" ref={gridRef}>
        {visible.map((project) => (
          <BentoCard
            col={3}
            href={project.href}
            key={project.slug}
            title={project.title}
          >
            <p className="bento-sub">{project.subtitle}</p>
            {project.stack.length ? (
              <ul className="proj-tags">
                {project.stack.slice(0, 4).map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            ) : null}
          </BentoCard>
        ))}
      </BentoGrid>
    </>
  );
}
