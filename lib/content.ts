import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { getReadingTime } from "@/lib/reading-time";

const contentRoot = path.join(process.cwd(), "content");

export interface WorkFrontmatter {
  title: string;
  subtitle: string;
  slug: string;
  date: string;
  status: string;
  role: string;
  timeline: string;
  stack: string[];
  repo?: string;
  demo?: string;
  featured: boolean;
  order: number;
}

export interface ContentEntry<TFrontmatter> {
  frontmatter: TFrontmatter;
  body: string;
  readingTime: string;
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

async function readMdxFile(slug: string): Promise<matter.GrayMatterFile<string>> {
  const filePath = path.join(contentRoot, "work", `${slug}.mdx`);
  const raw = await fs.readFile(filePath, "utf8");
  return matter(raw);
}

async function listWorkSlugs(): Promise<string[]> {
  const directoryPath = path.join(contentRoot, "work");
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => entry.name.replace(/\.mdx$/u, ""));
}

function parseWork(data: Record<string, unknown>): WorkFrontmatter {
  return {
    title: readString(data, "title"),
    subtitle: readString(data, "subtitle"),
    slug: readString(data, "slug"),
    date: readString(data, "date"),
    status: readString(data, "status"),
    role: readString(data, "role"),
    timeline: readString(data, "timeline"),
    stack: readStringArray(data, "stack"),
    repo: readOptionalString(data, "repo"),
    demo: readOptionalString(data, "demo"),
    featured: readBoolean(data, "featured", false),
    order: readNumber(data, "order", 999),
  };
}

/**
 * Reads one case study MDX file and returns typed frontmatter plus source body.
 */
export async function getWorkBySlug(
  slug: string,
): Promise<ContentEntry<WorkFrontmatter>> {
  const file = await readMdxFile(slug);
  return {
    frontmatter: parseWork(file.data),
    body: file.content,
    readingTime: getReadingTime(file.content),
  };
}

/**
 * Reads all case studies, sorted by explicit order and then by newest date.
 */
export async function getAllWork(): Promise<Array<ContentEntry<WorkFrontmatter>>> {
  const slugs = await listWorkSlugs();
  const entries = await Promise.all(slugs.map((slug) => getWorkBySlug(slug)));
  return entries.sort((a, b) => {
    const orderDelta = a.frontmatter.order - b.frontmatter.order;
    if (orderDelta !== 0) {
      return orderDelta;
    }
    return b.frontmatter.date.localeCompare(a.frontmatter.date);
  });
}
