import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MetadataStrip } from "@/components/MetadataStrip";
import { MdxRenderer } from "@/components/MdxRenderer";
import { getAllWork, getWorkBySlug } from "@/lib/content";

interface WorkPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const work = await getAllWork();
  return work.map((entry) => ({
    slug: entry.frontmatter.slug,
  }));
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const entry = await getWorkBySlug(slug);
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
    const entry = await getWorkBySlug(slug);

    return (
      <article className="layout">
        <div className="prose">
          <header>
            <p className="caps">Case study / {String(entry.frontmatter.order).padStart(2, "0")}</p>
            <h1>{entry.frontmatter.title}</h1>
            <p className="lede muted" style={{ fontStyle: "italic", fontSize: "1.25rem" }}>
              {entry.frontmatter.subtitle}
            </p>
            <MetadataStrip
              demo={entry.frontmatter.demo}
              repo={entry.frontmatter.repo}
              role={entry.frontmatter.role}
              stack={entry.frontmatter.stack}
              status={entry.frontmatter.status}
              timeline={entry.frontmatter.timeline}
            />
          </header>
          <MdxRenderer source={entry.body} />
        </div>
      </article>
    );
  } catch {
    notFound();
  }
}
