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
      <article className="site-shell">
        <div className="content-column py-16">
          <header>
            <h1 className="text-[2.5rem] font-medium leading-[1.15]">{entry.frontmatter.title}</h1>
            <p className="mt-4 text-[1.25rem] leading-[1.45] text-ink-muted">
              {entry.frontmatter.subtitle}
            </p>
            <div className="mt-8">
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
          <div className="mt-12">
            <MdxRenderer source={entry.body} />
          </div>
        </div>
      </article>
    );
  } catch {
    notFound();
  }
}
