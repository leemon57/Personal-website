import type { Metadata } from "next";
import { PostRow } from "@/components/PostRow";
import { getAllWriting } from "@/lib/content";

export const metadata: Metadata = {
  title: "Writing",
  description: "Technical writing by Hany Jiang on systems, data tooling, and ML-adjacent engineering.",
  alternates: {
    canonical: "/writing",
  },
};

export default async function WritingIndexPage() {
  const posts = await getAllWriting();
  const years = Array.from(new Set(posts.map((entry) => entry.frontmatter.date.slice(0, 4))));

  return (
    <div className="layout">
      <div className="prose">
        <header style={{ marginBottom: "2.5rem" }}>
          <h1>Writing</h1>
          <p className="muted" style={{ marginTop: "0.75rem" }}>
            Technical notes, mostly extracted from things I built and got wrong the first time.{" "}
            <span className="mono small">
              <a href="/feed.xml">rss</a>
            </span>
          </p>
        </header>
        {years.map((year) => (
          <section key={year} style={{ marginBottom: "3rem" }}>
            <p className="caps">{year}</p>
            {posts
              .filter((entry) => entry.frontmatter.date.startsWith(year))
              .map((entry) => (
                <PostRow key={entry.frontmatter.slug} post={entry.frontmatter} />
              ))}
          </section>
        ))}
      </div>
    </div>
  );
}
