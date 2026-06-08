import type { Metadata } from "next";
import { PortfolioAgent } from "@/components/PortfolioAgent";
import { ProjectCard } from "@/components/ProjectCard";
import { getAllWork } from "@/lib/content";

export const metadata: Metadata = {
  title: "Hany Jiang - Data + ML + Systems",
  description:
    "Hany Jiang builds full-stack systems and data tools. Data Science at Waterloo, open to Summer 2026 co-op roles.",
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const work = await getAllWork();
  const featuredWork = work.filter((entry) => entry.frontmatter.featured).slice(0, 4);
  const agentProjects = work.map((entry) => ({
    title: entry.frontmatter.title,
    subtitle: entry.frontmatter.subtitle,
    slug: entry.frontmatter.slug,
    status: entry.frontmatter.status,
    role: entry.frontmatter.role,
    timeline: entry.frontmatter.timeline,
    stack: entry.frontmatter.stack,
    repo: entry.frontmatter.repo,
    demo: entry.frontmatter.demo,
    featured: entry.frontmatter.featured,
    order: entry.frontmatter.order,
  }));

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Hany Jiang",
    url: "https://hanyjiang.com",
    email: "mailto:hanyjiang@gmail.com",
    sameAs: ["https://github.com/HanyJiang", "https://www.linkedin.com/in/hanyjiang"],
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "University of Waterloo",
    },
  };

  return (
    <div className="layout">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        type="application/ld+json"
      />
      <div className="home-stack">
        <section aria-labelledby="intro-title" className="intro agent-intro">
          <h1 id="intro-title">Hany Jiang</h1>
          <p className="lede">
            I build full-stack systems and data tools. Data Science{" "}
            <span className="muted">@ Waterloo</span>.
          </p>
          <p className="open">
            Ask the site about my projects, stack, resume, or Summer 2026 co-op fit.
          </p>
        </section>

        <PortfolioAgent projects={agentProjects} />

        <section aria-labelledby="selected-work">
          <p className="caps" id="selected-work">
            <span className="num">01</span>Selected work
          </p>
          <div>
            {featuredWork.map((entry, index) => (
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
