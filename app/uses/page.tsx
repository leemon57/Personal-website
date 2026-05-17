import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uses",
  description: "Tools, editor setup, hardware, and services used by Hany Jiang.",
  alternates: {
    canonical: "/uses",
  },
};

const sections = ["Editor", "Languages", "Frontend", "Data/ML", "Hardware", "Services"];

export default function UsesPage() {
  return (
    <div className="site-shell">
      <article className="content-column py-16">
        <h1 className="text-[2.5rem] font-medium leading-[1.15]">Uses</h1>
        <div className="mt-12 space-y-12">
          {sections.map((section) => (
            <section key={section} aria-labelledby={section.toLowerCase().replace(/[^a-z0-9]/gu, "-")}>
              <h2 className="section-label" id={section.toLowerCase().replace(/[^a-z0-9]/gu, "-")}>
                {section}
              </h2>
              <p>Draft this section with the tools worth naming.</p>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
