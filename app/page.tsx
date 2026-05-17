import type { Metadata } from "next";
import Link from "next/link";
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
    <div className="layout">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        type="application/ld+json"
      />
      <div className="prose">
        <section aria-labelledby="intro-title" className="intro">
          <h1 id="intro-title">Hany Jiang</h1>
          <p className="lede">
            I build full-stack systems and data tools. Data Science <span className="muted">@ Waterloo</span>.
          </p>
          <p className="open">Open to Summer 2026 co-op - SWE, Data, ML.</p>
        </section>

        <hr className="rule" />

        <section aria-labelledby="selected-work">
          <p className="caps" id="selected-work">
            <span className="num">01</span>Selected work
          </p>
          <div>
            {featuredWork.map((entry, index) => (
              <ProjectCard key={entry.frontmatter.slug} index={index + 1} project={entry.frontmatter} />
            ))}
          </div>
        </section>

        <hr className="rule" />

        <section aria-labelledby="recent-writing">
          <p className="caps" id="recent-writing">
            <span className="num">02</span>Recent writing
          </p>
          <div>
            {recentWriting.slice(0, 4).map((entry) => (
              <PostRow key={entry.frontmatter.slug} post={entry.frontmatter} />
            ))}
          </div>
          <p className="mono" style={{ marginTop: "1.5rem" }}>
            <Link href="/writing">all writing -&gt;</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
