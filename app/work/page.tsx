import type { Metadata } from "next";
import { ProjectCard } from "@/components/ProjectCard";
import { getWorkExperience } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work Experience",
  description: "Formal work experience write-ups by Hany Jiang.",
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
          <h1>Work Experience</h1>
          <p className="muted" style={{ marginTop: "0.75rem" }}>
            Formal roles and organization-backed work, separated from personal projects.
          </p>
        </header>
        <section aria-labelledby="work-experience" className="work-group">
          <p className="caps" id="work-experience">
            Work Experience
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
            <p className="muted section-note">
              Formal experience write-ups will live here separately from personal projects.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
