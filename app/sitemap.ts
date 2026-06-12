import type { MetadataRoute } from "next";
import { getAllWork, getCaseStudyHref } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hanyjiang.com";
  const work = await getAllWork();
  const staticRoutes = ["", "/about", "/contact", "/courses", "/projects", "/work"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...work.map((entry) => ({
      url: `${siteUrl}${getCaseStudyHref(entry.frontmatter)}`,
      lastModified: new Date(entry.frontmatter.date),
    })),
  ];
}
