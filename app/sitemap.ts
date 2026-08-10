import type { MetadataRoute } from "next";
import { getAllWork, getCaseStudyHref } from "@/lib/content";
import { profile } from "@/lib/profile";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? profile.siteUrl;
  const work = await getAllWork();
  // /courses is recruiter-gated (and /photography is optional); keep gated/soft
  // routes out of the sitemap.
  const staticRoutes = ["", "/about", "/contact", "/projects", "/work"].map(
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
