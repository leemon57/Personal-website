import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MdxRenderer } from "@/components/MdxRenderer";
import { getAllWriting, getWritingBySlug } from "@/lib/content";

interface WritingPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getAllWriting();
  return posts.map((entry) => ({
    slug: entry.frontmatter.slug,
  }));
}

export async function generateMetadata({ params }: WritingPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const entry = await getWritingBySlug(slug);
    return {
      title: entry.frontmatter.title,
      description: entry.frontmatter.description,
      alternates: {
        canonical: `/writing/${slug}`,
      },
    };
  } catch {
    return {};
  }
}

export default async function WritingPage({ params }: WritingPageProps) {
  const { slug } = await params;

  try {
    const entry = await getWritingBySlug(slug);
    const articleJsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: entry.frontmatter.title,
      datePublished: entry.frontmatter.date,
      author: {
        "@type": "Person",
        name: "Hany Jiang",
      },
    };

    return (
      <article className="site-shell">
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
          type="application/ld+json"
        />
        <div className="content-column py-16">
          <header>
            <h1 className="text-[2.5rem] font-medium leading-[1.15]">{entry.frontmatter.title}</h1>
            <p className="mt-4 font-mono text-[0.8125rem] text-ink-muted">
              <time dateTime={entry.frontmatter.date}>{entry.frontmatter.date}</time> /{" "}
              {entry.readingTime}
            </p>
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
