import { getAllWriting } from "@/lib/content";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hanyjiang.com";
  const posts = await getAllWriting();
  const items = posts
    .map((entry) => {
      const url = `${siteUrl}/writing/${entry.frontmatter.slug}`;
      return `<item>
  <title>${escapeXml(entry.frontmatter.title)}</title>
  <link>${url}</link>
  <guid>${url}</guid>
  <pubDate>${new Date(entry.frontmatter.date).toUTCString()}</pubDate>
  <description>${escapeXml(entry.frontmatter.description)}</description>
</item>`;
    })
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>Hany Jiang</title>
  <link>${siteUrl}</link>
  <description>Technical writing by Hany Jiang.</description>
  ${items}
</channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
