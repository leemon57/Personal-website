import type { Metadata } from "next";
import { certificates } from "@/lib/certificates";
import { profile, profileFacts, profileLinks } from "@/lib/profile";
import { pageContent } from "@/lib/site";
import { skillsetGroups } from "@/lib/skillset";

export const metadata: Metadata = {
  title: pageContent.about.metadataTitle,
  description: pageContent.about.metadataDescription,
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const firstName = profile.name.split(/\s+/u)[0] ?? profile.name;

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
      knowsAbout: pageContent.about.knowsAbout,
    },
  };

  return (
    <div className="layout">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }}
        type="application/ld+json"
      />

      <header className="section-head" data-reveal>
        <h1 className="section-title">About {firstName}</h1>
      </header>

      <div className="about-stack">
        <div className="about-panel" data-reveal>
          <p className="about-lede">{pageContent.about.lede}</p>
          <p className="muted">{profile.summary}</p>
          <dl className="about-mini-facts">
            {profileFacts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <section aria-labelledby="skillset" className="about-panel" data-reveal>
          <p className="bento-label" id="skillset">
            {pageContent.about.skillset.heading}
          </p>
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

        <section
          aria-labelledby="certificates"
          className="about-panel"
          data-reveal
        >
          <p className="bento-label" id="certificates">
            {pageContent.about.certificates.heading}
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
              {pageContent.about.certificates.emptyText}
            </p>
          )}
        </section>

        <section aria-labelledby="about-links" className="about-panel" data-reveal>
          <p className="bento-label" id="about-links">
            {pageContent.about.linksHeading}
          </p>
          <div className="about-links">
            {profileLinks.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
