import type { Metadata } from "next";
import { BentoCard } from "@/components/ui/BentoCard";
import { BentoGrid } from "@/components/ui/BentoGrid";
import { Section } from "@/components/ui/Section";
import { getCaseStudyHref, getWorkExperience } from "@/lib/content";
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
      <Section lead={pageContent.work.lede} title={pageContent.work.title}>
        {workExperience.length > 0 ? (
          <BentoGrid className="projects-bento">
            {workExperience.map((entry) => (
              <BentoCard
                col={3}
                href={getCaseStudyHref(entry.frontmatter)}
                key={entry.frontmatter.slug}
                title={entry.frontmatter.title}
              >
                <p className="bento-sub">{entry.frontmatter.subtitle}</p>
                {entry.frontmatter.stack.length ? (
                  <ul className="proj-tags">
                    {entry.frontmatter.stack.slice(0, 4).map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                ) : null}
              </BentoCard>
            ))}
          </BentoGrid>
        ) : (
          <p className="muted section-note">{pageContent.work.emptyText}</p>
        )}
      </Section>
    </div>
  );
}
