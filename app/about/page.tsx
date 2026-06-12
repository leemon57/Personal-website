import type { Metadata } from "next";
import Link from "next/link";
import { certificates } from "@/lib/certificates";
import { getAllWork, getCaseStudyHref } from "@/lib/content";
import { profile, profileFacts, profileLinks } from "@/lib/profile";
import { skillsetGroups } from "@/lib/skillset";

export const metadata: Metadata = {
  title: "About",
  description: `${profile.name} is a ${profile.program} student at the ${profile.school} building ${profile.focus.toLowerCase()}.`,
  alternates: {
    canonical: "/about",
  },
};

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

        <dl className="about-facts" aria-label="Profile facts" data-reveal>
          {profileFacts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>

        <section aria-labelledby="skillset" className="about-section" data-reveal>
          <p className="caps" id="skillset">
            Skillset
          </p>
          <p>Grouped by area, drawn from the projects and work on this site.</p>
          <dl className="about-skills" aria-label="Skillset">
            {skillsetGroups.map((group) => (
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

        <section aria-labelledby="certificates" className="about-section" data-reveal>
          <p className="caps" id="certificates">
            Certificates
          </p>
          {certificates.length > 0 ? (
            <div className="about-certs">
              {certificates.map((cert) => {
                const inner = (
                  <>
                    <span className="cert-main">
                      <span className="cert-name">{cert.name}</span>
                      <small className="cert-issuer">
                        {cert.issuer}
                        {cert.credentialId ? ` · ${cert.credentialId}` : ""}
                      </small>
                    </span>
                    <small className="cert-date">{cert.date}</small>
                  </>
                );
                const key = `${cert.name}-${cert.issuer}`;
                return cert.url ? (
                  <a
                    className="about-cert"
                    href={cert.url}
                    key={key}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="about-cert" key={key}>
                    {inner}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="section-note muted">
              Certifications will be listed here as I complete them.
            </p>
          )}
        </section>

        <section aria-labelledby="about-start" className="about-section" data-reveal>
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

        <section aria-labelledby="about-links" className="about-section" data-reveal>
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
