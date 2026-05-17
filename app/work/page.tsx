import type { Metadata } from "next";
import { ProjectCard } from "@/components/ProjectCard";
import { getAllWork } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Case studies on full-stack systems, data tools, and ML-adjacent engineering by Hany Jiang.",
  alternates: {
    canonical: "/work",
  },
};

export default async function WorkIndexPage() {
  const work = await getAllWork();

  return (
    <div className="layout">
      <div className="prose">
        <header style={{ marginBottom: "2.5rem" }}>
          <h1>Work</h1>
          <p className="muted" style={{ marginTop: "0.75rem" }}>
            Case studies on full-stack systems, data tools, and ML-adjacent engineering.
          </p>
        </header>
        <div>
          {work.map((entry, index) => (
            <ProjectCard key={entry.frontmatter.slug} index={index + 1} project={entry.frontmatter} />
          ))}
        </div>
      </div>
    </div>
  );
}
