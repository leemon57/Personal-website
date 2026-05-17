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
    <article className="grid gap-2 border-b border-rule py-4 sm:grid-cols-[7.5rem_1fr]">
      <time className="font-mono text-[0.8125rem] leading-7 tabular-nums text-ink-faint" dateTime={post.date}>
        {post.date}
      </time>
      <div>
        <h3 className="text-[1rem] font-medium leading-7">
          <Link className="unstyled-link hover:text-accent" href={`/writing/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
        <p className="mt-1 text-[0.9rem] leading-6 text-ink-muted">{post.description}</p>
      </div>
    </article>
  );
}
