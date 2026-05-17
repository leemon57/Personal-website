import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uses",
  description: "Tools, editor setup, hardware, and services used by Hany Jiang.",
  alternates: {
    canonical: "/uses",
  },
};

const sections = [
  { title: "Editor", items: [["Neovim", "LazyVim config, kept boring on purpose"], ["VS Code", "for anything MDX or notebook-adjacent"], ["Theme", "Rose Pine Dawn"]] },
  { title: "Languages", items: [["TypeScript", "primary; strict + noUncheckedIndexedAccess"], ["Python", "data work, notebooks, ingest workers"], ["Rust", "CLI tools, learning"]] },
  { title: "Frontend", items: [["Next.js", "App Router; static-first"], ["Tailwind", "v4, with CSS variables for tokens"], ["MDX", "content lives next to code"]] },
  { title: "Data / ML", items: [["Postgres", "default datastore"], ["DuckDB", "local analytics"], ["dlt", "small ELT pipelines"], ["OpenAI", "structured outputs only"]] },
  { title: "Hardware", items: [["Laptop", "M2 MacBook Air 16GB"], ["Keyboard", "Keychron Q1"], ["Display", "Dell U2723QE 4K"], ["Notes", "Field Notes + Pilot G2"]] },
  { title: "Services", items: [["Hosting", "Vercel"], ["Domain", "Cloudflare Registrar"], ["Email", "Fastmail"], ["Analytics", "Plausible"]] },
];

export default function UsesPage() {
  return (
    <div className="layout">
      <article className="prose">
        <header style={{ marginBottom: "2rem" }}>
          <h1>/uses</h1>
          <p className="muted" style={{ marginTop: "0.75rem" }}>
            The tools and configs I use day-to-day.
          </p>
        </header>
        <div>
          {sections.map((section) => (
            <section className="uses-group" key={section.title}>
              <h3>{section.title}</h3>
              <ul>
                {section.items.map(([key, value]) => (
                  <li key={key}>
                    <span className="k">{key}</span>
                    <span className="v">{value}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
