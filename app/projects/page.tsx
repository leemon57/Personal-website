import type { Metadata } from "next";
import { ProjectCard } from "@/components/ProjectCard";
import { getPersonalProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Personal Projects",
  description: "Personal project case studies by Hany Jiang.",
  alternates: {
    canonical: "/projects",
  },
};

export default async function ProjectsIndexPage() {
  const projects = await getPersonalProjects();

  return (
    <div className="layout">
      <div className="prose">
        <header style={{ marginBottom: "2.5rem" }}>
          <h1>Personal Projects</h1>
          <p className="muted" style={{ marginTop: "0.75rem" }}>
            Self-directed builds, prototypes, and technical case studies.
          </p>
        </header>
        <section aria-labelledby="personal-projects" className="work-group">
          <p className="caps" id="personal-projects">
            Personal Projects
          </p>
          <div>
            {projects.map((entry, index) => (
              <ProjectCard
                key={entry.frontmatter.slug}
                index={index + 1}
                project={entry.frontmatter}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
