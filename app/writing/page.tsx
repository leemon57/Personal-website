import type { Metadata } from "next";
import { PostRow } from "@/components/PostRow";
import { getAllWriting } from "@/lib/content";

export const metadata: Metadata = {
  title: "Writing",
  description: "Technical writing by Hany Jiang on systems, data tooling, and ML-adjacent engineering.",
  alternates: {
    canonical: "/writing",
  },
};

export default async function WritingIndexPage() {
  const posts = await getAllWriting();

  return (
    <div className="site-shell">
      <div className="content-column py-16">
        <h1 className="text-[2.5rem] font-medium leading-[1.15]">Writing</h1>
        <div className="mt-12">
          {posts.map((entry) => (
            <PostRow key={entry.frontmatter.slug} post={entry.frontmatter} />
          ))}
        </div>
      </div>
    </div>
  );
}
