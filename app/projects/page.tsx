import type { Metadata } from "next";
import { ProjectCard } from "@/components/ProjectCard";
import { getPersonalProjects } from "@/lib/content";
import { pageContent } from "@/lib/site";

export const metadata: Metadata = {
  title: pageContent.projects.metadataTitle,
  description: pageContent.projects.metadataDescription,
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
          <h1>{pageContent.projects.title}</h1>
          <p className="muted" style={{ marginTop: "0.75rem" }}>
            {pageContent.projects.lede}
          </p>
        </header>
        <section aria-labelledby="personal-projects" className="work-group">
          <p className="caps" id="personal-projects">
            {pageContent.projects.sectionLabel}
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
