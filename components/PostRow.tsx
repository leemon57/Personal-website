import Link from "next/link";
import type { WritingFrontmatter } from "@/lib/content";

/**
 * PostRow
 *
 * Renders one dated row in the writing index and homepage writing section.
 *
 * Used by: app/page.tsx, app/writing/page.tsx
 */
export interface PostRowProps {
  post: WritingFrontmatter;
}

export function PostRow({ post }: PostRowProps) {
  return (
    <article className="post-row">
      <time className="date" dateTime={post.date}>
        {post.date}
      </time>
      <div>
        <h3 className="title">
          <Link href={`/writing/${post.slug}`}>{post.title}</Link>
        </h3>
        <span className="desc">{post.description}</span>
      </div>
    </article>
  );
}
