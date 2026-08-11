import type { MetadataRoute } from "next";
import { getAllWork, getCaseStudyHref } from "@/lib/content";
import { profile } from "@/lib/profile";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? profile.siteUrl;
  const work = await getAllWork();
  // /photography is intentionally kept out of the sitemap (not linked in nav).
  const staticRoutes = ["", "/about", "/contact", "/courses", "/projects", "/work"].map(
    (route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
    }),
  );

  return [
    ...staticRoutes,
    ...work.map((entry) => ({
      url: `${siteUrl}${getCaseStudyHref(entry.frontmatter)}`,
      lastModified: new Date(entry.frontmatter.date),
    })),
  ];
}
