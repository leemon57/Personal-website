import type { Metadata } from "next";
import {
  ProjectFilters,
  type ProjectFilterItem,
} from "@/components/ProjectFilters";
import { Section } from "@/components/ui/Section";
import { getCaseStudyHref, getPersonalProjects } from "@/lib/content";
import { pageContent } from "@/lib/site";

export const metadata: Metadata = {
  title: pageContent.projects.metadataTitle,
  description: pageContent.projects.metadataDescription,
  alternates: {
    canonical: "/projects",
  },
};

/**
 * Maps a project's tech stack to broad domains used by the filter chips. Purely
 * derived from existing frontmatter — no extra content authoring needed.
 */
const DOMAIN_RULES: Array<{ domain: string; match: string[] }> = [
  {
    domain: "ML",
    match: [
      "tensorflow",
      "pytorch",
      "keras",
      "scikit",
      "sklearn",
      "openai",
      "anomaly",
      "ml",
      "model",
    ],
  },
  {
    domain: "Data Science",
    match: [
      "pandas",
      "power bi",
      "dax",
      "power query",
      "sql",
      "postgres",
      "excel",
      "data modeling",
      "numpy",
    ],
  },
  {
    domain: "Web",
    match: [
      "react",
      "next",
      "node",
      "flask",
      "typescript",
      "javascript",
      "material ui",
      "websocket",
      "rest",
      "expo",
      "tailwind",
      "aws",
      "dynamodb",
    ],
  },
];

function deriveDomains(stack: string[]): string[] {
  const haystack = stack.map((item) => item.toLowerCase());
  const domains = new Set<string>();
  for (const rule of DOMAIN_RULES) {
    if (
      haystack.some((tech) => rule.match.some((needle) => tech.includes(needle)))
    ) {
      domains.add(rule.domain);
    }
  }
  return [...domains];
}

export default async function ProjectsIndexPage() {
  const projects = await getPersonalProjects();
  const items: ProjectFilterItem[] = projects.map((entry) => ({
    slug: entry.frontmatter.slug,
    title: entry.frontmatter.title,
    subtitle: entry.frontmatter.subtitle,
    href: getCaseStudyHref(entry.frontmatter),
    stack: entry.frontmatter.stack,
    domains: deriveDomains(entry.frontmatter.stack),
  }));

  return (
    <div className="layout">
      <Section lead={pageContent.projects.lede} title={pageContent.projects.title}>
        <ProjectFilters projects={items} />
      </Section>
    </div>
  );
}
