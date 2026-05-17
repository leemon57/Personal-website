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
    <div className="layout">
      <article className="prose">
        <header style={{ marginBottom: "2.5rem" }}>
          <h1>/now</h1>
          <p className="mono small muted" style={{ marginTop: "0.5rem" }}>
            Updated 2026-05-04 / Waterloo, ON
          </p>
        </header>
        <section aria-labelledby="working-on" className="now-section">
          <p className="caps" id="working-on">Working on</p>
          <p>
            Recruiting for Summer 2026 co-op: applications out, working through interviews.
            Between cycles I am extending SPIKE with a second schema variant for review articles,
            and writing up the dead-letter pattern.
          </p>
        </section>
        <section aria-labelledby="learning" className="now-section">
          <p className="caps" id="learning">Learning</p>
          <p>
            Slowly working through <em>Designing Data-Intensive Applications</em> a second time.
            First pass was before I had built anything; rereading is a completely different book.
            Also picking up Rust well enough to ship the logbook CLI.
          </p>
        </section>
        <section aria-labelledby="reading" className="now-section">
          <p className="caps" id="reading">Reading</p>
          <ul>
            <li><em>The Mythical Man-Month</em> by Brooks.</li>
            <li><em>The Dream Machine</em>, Stripe Press edition.</li>
            <li>Whatever Simon Willison is linking to this week.</li>
          </ul>
        </section>
      </article>
    </div>
  );
}
