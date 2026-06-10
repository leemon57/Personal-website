import type { Metadata } from "next";
import Link from "next/link";
import { getAllWork, getCaseStudyHref } from "@/lib/content";
import { profile, profileFacts, profileLinks } from "@/lib/profile";

export const metadata: Metadata = {
  title: "About",
  description: `${profile.name} is a ${profile.program} student at the ${profile.school} building ${profile.focus.toLowerCase()}.`,
  alternates: {
    canonical: "/about",
  },
};

const toolkit = [
  { area: "Languages", items: ["Python", "C++", "Javascript/TypeScript", "SQL", "DAX"] },
  {
    area: "Backend & cloud",
    items: ["AWS Lambda", "DynamoDB", "AWS SAM", "Docker", "Flask", "WebSockets / REST"],
  },
  {
    area: "Frontend & mobile",
    items: ["Next.js", "React", "React Native / Expo", "Material UI"],
  },
  {
    area: "Data & ML",
    items: [
      "pandas",
      "scikit-learn",
      "TensorFlow / Keras",
      "Power BI",
      "anomaly detection",
      "OpenAI APIs",
    ],
  },
  {
    area: "Practices",
    items: [
      "OOP design patterns",
      "testing (Jest / pytest)",
      "local-first data",
      "resilient services",
    ],
  },
];

export default async function AboutPage() {
  const work = await getAllWork();
  const featured = work.filter((entry) => entry.frontmatter.featured).slice(0, 4);

  const profilePageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${profile.siteUrl}/about`,
    mainEntity: {
      "@type": "Person",
      name: profile.name,
      url: profile.siteUrl,
      email: `mailto:${profile.email}`,
      sameAs: [profile.github, profile.linkedin],
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: profile.school,
      },
      knowsAbout: [
        "Backend systems",
        "Data engineering",
        "Applied machine learning",
        "Python",
        "C++",
        "TypeScript",
        "SQL",
        "Power BI",
      ],
    },
  };

  return (
    <div className="layout">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }}
        type="application/ld+json"
      />
      <article className="about-page">
        <header className="about-header">
          <p className="caps">About</p>
          <h1>{profile.name}</h1>
          <p className="lede">
            I am a 3A {profile.program} student at the {profile.school}, based in {profile.location}
            . As of now, most of my work is backend, data engineering, and data analytics
          </p>
        </header>

        <dl className="about-facts" aria-label="Profile facts">
          {profileFacts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>

        <section aria-labelledby="about-work" className="about-section">
          <p className="caps" id="about-work">
            What this site proves
          </p>
          <p>
            The case studies are project-first and span backend, data, and systems work: a
            serverless Discord market-data bot on AWS Lambda, a real-time markets anomaly
            tracker with live WebSocket ingestion, a C++ turn-based card-game engine built
            on classic design patterns, an offline-first React Native finance app, and a
            multi-task-learning price-prediction study - plus a NASA Space Apps research
            explorer and a desktop automation tool. The work tab adds a data-analyst
            consulting engagement building Power BI dashboards. Each one shows the design
            choices, tradeoffs, and proof behind the build, not just a stack.
          </p>
        </section>

        <section aria-labelledby="skillset" className="about-section">
          <p className="caps" id="skillset">
            Skillset
          </p>
          <p>Grouped by area, drawn from the projects and work on this site.</p>
          <dl className="about-skills" aria-label="Skillset">
            {toolkit.map((group) => (
              <div className="skill-group" key={group.area}>
                <dt>{group.area}</dt>
                <dd>
                  <ul className="skill-tags">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="about-start" className="about-section">
          <p className="caps" id="about-start">
            Start here
          </p>
          <div className="about-projects">
            {featured.map((entry) => (
              <Link
                className="about-project"
                href={getCaseStudyHref(entry.frontmatter)}
                key={entry.frontmatter.slug}
              >
                <span>{entry.frontmatter.title}</span>
                <small>{entry.frontmatter.role}</small>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="about-links" className="about-section">
          <p className="caps" id="about-links">
            Links
          </p>
          <div className="about-links">
            {profileLinks.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
