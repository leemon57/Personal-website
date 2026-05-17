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
    <div className="site-shell">
      <div className="content-column py-16">
        <h1 className="text-[2.5rem] font-medium leading-[1.15]">Work</h1>
        <div className="mt-12 space-y-8">
          {work.map((entry) => (
            <ProjectCard key={entry.frontmatter.slug} project={entry.frontmatter} />
          ))}
        </div>
      </div>
    </div>
  );
}
