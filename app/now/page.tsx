import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Now",
  description: "What Hany Jiang is working on, learning, and reading this month.",
  alternates: {
    canonical: "/now",
  },
};

export default function NowPage() {
  return (
    <div className="site-shell">
      <article className="content-column py-16">
        <header>
          <h1 className="text-[2.5rem] font-medium leading-[1.15]">Now</h1>
          <p className="mt-4 font-mono text-[0.8125rem] text-ink-muted">Updated 2026-05-17</p>
        </header>
        <section className="mt-12" aria-labelledby="working-on">
          <h2 className="section-label" id="working-on">
            Working on
          </h2>
          <p>Draft this section with current work, recruiting focus, and shipped projects.</p>
        </section>
        <section className="mt-16" aria-labelledby="learning">
          <h2 className="section-label" id="learning">
            Learning
          </h2>
          <p>Draft this section with current technical reading and practice.</p>
        </section>
        <section className="mt-16" aria-labelledby="reading">
          <h2 className="section-label" id="reading">
            Reading
          </h2>
          <p>Draft this section with a short list of books, papers, and essays.</p>
        </section>
      </article>
    </div>
  );
}
