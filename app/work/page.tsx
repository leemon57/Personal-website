import type { Metadata } from "next";
import { ProjectCard } from "@/components/ProjectCard";
import { getWorkExperience } from "@/lib/content";
import { pageContent } from "@/lib/site";

export const metadata: Metadata = {
  title: pageContent.work.metadataTitle,
  description: pageContent.work.metadataDescription,
  alternates: {
    canonical: "/work",
  },
};

export default async function WorkIndexPage() {
  const workExperience = await getWorkExperience();

  return (
    <div className="layout">
      <div className="prose">
        <header style={{ marginBottom: "2.5rem" }}>
          <h1>{pageContent.work.title}</h1>
          <p className="muted" style={{ marginTop: "0.75rem" }}>
            {pageContent.work.lede}
          </p>
        </header>
        <section aria-labelledby="work-experience" className="work-group">
          <p className="caps" id="work-experience">
            {pageContent.work.sectionLabel}
          </p>
          {workExperience.length > 0 ? (
            <div>
              {workExperience.map((entry, index) => (
                <ProjectCard
                  key={entry.frontmatter.slug}
                  index={index + 1}
                  project={entry.frontmatter}
                />
              ))}
            </div>
          ) : (
            <p className="muted section-note">{pageContent.work.emptyText}</p>
          )}
        </section>
      </div>
    </div>
  );
}
