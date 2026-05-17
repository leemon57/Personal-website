import type { MetadataRoute } from "next";
import { getAllWork, getAllWriting } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hanyjiang.com";
  const [work, writing] = await Promise.all([getAllWork(), getAllWriting()]);
  const staticRoutes = ["", "/work", "/writing", "/now", "/uses"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...work.map((entry) => ({
      url: `${siteUrl}/work/${entry.frontmatter.slug}`,
      lastModified: new Date(entry.frontmatter.date),
    })),
    ...writing.map((entry) => ({
      url: `${siteUrl}/writing/${entry.frontmatter.slug}`,
      lastModified: new Date(entry.frontmatter.date),
    })),
  ];
}
