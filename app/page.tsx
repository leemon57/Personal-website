import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PortfolioAgent } from "@/components/PortfolioAgent";
import { getAllWork } from "@/lib/content";
import { profile, profileFacts } from "@/lib/profile";
import { pageContent } from "@/lib/site";

export const metadata: Metadata = {
  title: profile.name,
  description: pageContent.home.metadataDescription,
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const work = await getAllWork();
  const agentProjects = work.map((entry) => ({
    title: entry.frontmatter.title,
    subtitle: entry.frontmatter.subtitle,
    slug: entry.frontmatter.slug,
    category: entry.frontmatter.category,
    status: entry.frontmatter.status,
    role: entry.frontmatter.role,
    timeline: entry.frontmatter.timeline,
    stack: entry.frontmatter.stack,
    repo: entry.frontmatter.repo,
    demo: entry.frontmatter.demo,
    featured: entry.frontmatter.featured,
    order: entry.frontmatter.order,
  }));

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: profile.siteUrl,
    email: `mailto:${profile.email}`,
    sameAs: [profile.github, profile.linkedin],
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.address.locality,
      addressRegion: profile.address.region,
      addressCountry: profile.address.country,
    },
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: profile.school,
    },
  };

  return (
    <div className="layout">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        type="application/ld+json"
      />
      <div className="home-stack">
        <section aria-labelledby="intro-title" className="intro agent-intro">
          <h1 className="sr-only" id="intro-title">
            {profile.name}
          </h1>
          <p className="lede">{pageContent.home.introLede}</p>
          <dl className="profile-facts" aria-label="Profile facts">
            {profileFacts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div data-reveal>
          <PortfolioAgent projects={agentProjects} />
        </div>

        <section
          aria-labelledby="contact-title"
          className="contact-panel"
          data-reveal
          id="contact"
        >
          <div className="contact-panel-copy">
            <p className="caps">{pageContent.home.contact.eyebrow}</p>
            <h2 id="contact-title">{pageContent.home.contact.title}</h2>
            <p className="muted">{pageContent.home.contact.body}</p>
          </div>
          <ContactForm />
        </section>
      </div>
    </div>
  );
}
