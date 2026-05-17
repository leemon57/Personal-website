import type { Metadata } from "next";
import { PostRow } from "@/components/PostRow";
import { ProjectCard } from "@/components/ProjectCard";
import { getAllWork, getAllWriting } from "@/lib/content";

export const metadata: Metadata = {
  title: "Hany Jiang - Data + ML + Systems",
  description:
    "Hany Jiang builds full-stack systems and data tools. Data Science at Waterloo, open to Summer 2026 co-op roles.",
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const [work, writing] = await Promise.all([getAllWork(), getAllWriting()]);
  const featuredWork = work.filter((entry) => entry.frontmatter.featured).slice(0, 4);
  const recentWriting = writing.slice(0, 5);

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
    <div className="site-shell">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        type="application/ld+json"
      />
      <div className="content-column py-16">
        <section aria-labelledby="intro-title">
          <h1 className="text-[2.5rem] font-medium leading-[1.15]" id="intro-title">
            Hany Jiang
          </h1>
          <p className="mt-6 text-[1.25rem] leading-[1.45]">
            I build full-stack systems and data tools. Data Science @ Waterloo.
          </p>
          <p className="mt-4 text-[1.05rem] italic leading-[1.6] text-ink-muted">
            Open to Summer 2026 co-op - SWE, Data, ML.
          </p>
        </section>

        <section aria-labelledby="selected-work" className="mt-24">
          <h2 className="section-label" id="selected-work">
            Selected work
          </h2>
          <div className="space-y-8">
            {featuredWork.map((entry) => (
              <ProjectCard key={entry.frontmatter.slug} project={entry.frontmatter} />
            ))}
          </div>
        </section>

        <section aria-labelledby="recent-writing" className="mt-24">
          <h2 className="section-label" id="recent-writing">
            Writing
          </h2>
          <div>
            {recentWriting.map((entry) => (
              <PostRow key={entry.frontmatter.slug} post={entry.frontmatter} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
