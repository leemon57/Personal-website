import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MetadataStrip } from "@/components/MetadataStrip";
import { MdxRenderer } from "@/components/MdxRenderer";
import { TrackView } from "@/components/TrackView";
import { getWorkBySlug, getWorkExperience } from "@/lib/content";

interface WorkPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const work = await getWorkExperience();
  return work.map((entry) => ({
    slug: entry.frontmatter.slug,
  }));
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const entry = await getWorkBySlug(slug, "work experience");
    return {
      title: entry.frontmatter.title,
      description: entry.frontmatter.subtitle,
      alternates: {
        canonical: `/work/${slug}`,
      },
    };
  } catch {
    return {};
  }
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;

  try {
    const entry = await getWorkBySlug(slug, "work experience");

    return (
      <article className="layout">
        <TrackView
          event="project_view"
          props={{ slug: entry.frontmatter.slug, title: entry.frontmatter.title }}
        />
        <div className="prose">
          {entry.frontmatter.heroImage ? (
            <figure className="case-hero" data-reveal>
              <Image
                alt={entry.frontmatter.title}
                className="case-hero-img"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 820px"
                src={entry.frontmatter.heroImage}
              />
            </figure>
          ) : null}
          <header>
            <p className="caps">
              Experience / {String(entry.frontmatter.order).padStart(2, "0")}
            </p>
            <h1>{entry.frontmatter.title}</h1>
            <p className="lede muted" style={{ fontStyle: "italic", fontSize: "1.25rem" }}>
              {entry.frontmatter.subtitle}
            </p>
            <div data-reveal>
              <MetadataStrip
                demo={entry.frontmatter.demo}
                repo={entry.frontmatter.repo}
                role={entry.frontmatter.role}
                stack={entry.frontmatter.stack}
                status={entry.frontmatter.status}
                timeline={entry.frontmatter.timeline}
              />
            </div>
          </header>
          <MdxRenderer source={entry.body} />
        </div>
      </article>
    );
  } catch {
    notFound();
  }
}
