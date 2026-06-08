import type { MetadataRoute } from "next";
import { getAllWork } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hanyjiang.com";
  const work = await getAllWork();
  const staticRoutes = ["", "/work", "/now", "/uses"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...work.map((entry) => ({
      url: `${siteUrl}/work/${entry.frontmatter.slug}`,
      lastModified: new Date(entry.frontmatter.date),
    })),
  ];
}
