import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { getReadingTime } from "@/lib/reading-time";

const contentRoot = path.join(process.cwd(), "content");

const contentFolders = [
  { directory: "projects", defaultCategory: "personal project" },
  { directory: "work", defaultCategory: "work experience" },
] as const;

type ContentDirectory = (typeof contentFolders)[number]["directory"];

export interface WorkFrontmatter {
  title: string;
  subtitle: string;
  slug: string;
  category: string;
  date: string;
  status: string;
  role: string;
  timeline: string;
  stack: string[];
  repo?: string;
  demo?: string;
  /** Optional full-bleed hero image (path under /public), e.g. /work/foo.jpg. */
  heroImage?: string;
  featured: boolean;
  order: number;
}

export interface ContentEntry<TFrontmatter> {
  frontmatter: TFrontmatter;
  body: string;
  readingTime: string;
}

export function getCaseStudyHref(
  entry: Pick<WorkFrontmatter, "category" | "slug">,
): string {
  return entry.category.toLowerCase() === "work experience"
    ? `/work/${entry.slug}`
    : `/projects/${entry.slug}`;
}

function readString(data: Record<string, unknown>, key: string): string {
  const value = data[key];
  return typeof value === "string" ? value : "";
}

function readOptionalString(
  data: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = data[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function readBoolean(
  data: Record<string, unknown>,
  key: string,
  fallback: boolean,
): boolean {
  const value = data[key];
  return typeof value === "boolean" ? value : fallback;
}

function readNumber(
  data: Record<string, unknown>,
  key: string,
  fallback: number,
): number {
  const value = data[key];
  return typeof value === "number" ? value : fallback;
}

function readStringArray(data: Record<string, unknown>, key: string): string[] {
  const value = data[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

async function readMdxFile(
  directory: ContentDirectory,
  slug: string,
): Promise<matter.GrayMatterFile<string>> {
  const filePath = path.join(contentRoot, directory, `${slug}.mdx`);
  const raw = await fs.readFile(filePath, "utf8");
  return matter(raw);
}

async function listContentFiles(): Promise<
  Array<{
    directory: ContentDirectory;
    slug: string;
    defaultCategory: string;
  }>
> {
  const fileGroups = await Promise.all(
    contentFolders.map(async (folder) => {
      const directoryPath = path.join(contentRoot, folder.directory);
      const entries = await fs.readdir(directoryPath, { withFileTypes: true });
      return entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
        .map((entry) => ({
          directory: folder.directory,
          slug: entry.name.replace(/\.mdx$/u, ""),
          defaultCategory: folder.defaultCategory,
        }));
    }),
  );

  return fileGroups.flat();
}

function parseWork(
  data: Record<string, unknown>,
  defaultCategory: string,
): WorkFrontmatter {
  return {
    title: readString(data, "title"),
    subtitle: readString(data, "subtitle"),
    slug: readString(data, "slug"),
    category: readString(data, "category") || defaultCategory,
    date: readString(data, "date"),
    status: readString(data, "status"),
    role: readString(data, "role"),
    timeline: readString(data, "timeline"),
    stack: readStringArray(data, "stack"),
    repo: readOptionalString(data, "repo"),
    demo: readOptionalString(data, "demo"),
    heroImage: readOptionalString(data, "heroImage"),
    featured: readBoolean(data, "featured", false),
    order: readNumber(data, "order", 999),
  };
}

/**
 * Reads one case study MDX file and returns typed frontmatter plus source body.
 */
export async function getWorkBySlug(
  slug: string,
  category?: string,
): Promise<ContentEntry<WorkFrontmatter>> {
  const files = await listContentFiles();
  const normalizedCategory = category?.toLowerCase();
  const match = files.find(
    (file) =>
      file.slug === slug &&
      (!normalizedCategory ||
        file.defaultCategory.toLowerCase() === normalizedCategory),
  );

  if (!match) {
    throw new Error(`Unknown work slug: ${slug}`);
  }

  const file = await readMdxFile(match.directory, slug);
  const frontmatter = parseWork(file.data, match.defaultCategory);

  if (
    normalizedCategory &&
    frontmatter.category.toLowerCase() !== normalizedCategory
  ) {
    throw new Error(`Unknown ${category} slug: ${slug}`);
  }

  return {
    frontmatter,
    body: file.content,
    readingTime: getReadingTime(file.content),
  };
}

/**
 * Reads all case studies, sorted by explicit order and then by newest date.
 */
export async function getAllWork(): Promise<Array<ContentEntry<WorkFrontmatter>>> {
  const files = await listContentFiles();
  const entries = await Promise.all(
    files.map(async (item) => {
      const file = await readMdxFile(item.directory, item.slug);
      return {
        frontmatter: parseWork(file.data, item.defaultCategory),
        body: file.content,
        readingTime: getReadingTime(file.content),
      };
    }),
  );
  return entries.sort((a, b) => {
    const orderDelta = a.frontmatter.order - b.frontmatter.order;
    if (orderDelta !== 0) {
      return orderDelta;
    }
    return b.frontmatter.date.localeCompare(a.frontmatter.date);
  });
}

export async function getPersonalProjects(): Promise<
  Array<ContentEntry<WorkFrontmatter>>
> {
  const entries = await getAllWork();
  return entries.filter(
    (entry) => entry.frontmatter.category.toLowerCase() === "personal project",
  );
}

export async function getWorkExperience(): Promise<
  Array<ContentEntry<WorkFrontmatter>>
> {
  const entries = await getAllWork();
  return entries.filter(
    (entry) => entry.frontmatter.category.toLowerCase() === "work experience",
  );
}
