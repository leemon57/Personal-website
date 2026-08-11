import coursesContent from "@/content/courses.json";

/**
 * Academic plan content adapter.
 *
 * Edit content/courses.json to update terms, courses, notes, or program
 * metadata. Grades/GPA are intentionally not part of this model — the courses
 * page and portfolio assistant present coursework only, no marks.
 */

export type TermStatus = "completed" | "planned";

export interface Program {
  degree: string;
  school: string;
  years: string;
}

export interface Course {
  code: string;
  title?: string;
}

export interface Term {
  /** Display label, e.g. "Fall 2024". */
  term: string;
  /** Plain term id used as a React key, e.g. "fall-2024". */
  id: string;
  status: TermStatus;
  /** Marks a term that also carries a co-op work term. */
  coop?: boolean;
  courses: Course[];
}

type CourseInput =
  | string
  | {
      code: string;
      title?: string;
    };

interface TermInput {
  term: string;
  id?: string;
  status?: string;
  coop?: boolean;
  courses: CourseInput[];
}

interface CoursesContent {
  program: Program;
  terms: TermInput[];
  notes: string[];
}

const data = coursesContent as CoursesContent;

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/gu, "and")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
}

function normalizeCourse(course: CourseInput): Course {
  if (typeof course === "string") {
    return { code: course.trim() };
  }

  if (!course.code.trim()) {
    throw new Error("Course entries must include a non-empty code.");
  }

  return {
    code: course.code.trim(),
    ...(course.title ? { title: course.title } : {}),
  };
}

function inferTermStatus(term: TermInput): TermStatus {
  if (term.status === "completed" || term.status === "planned") {
    return term.status;
  }

  if (term.status) {
    throw new Error(`Unknown course term status "${term.status}" for ${term.term}.`);
  }

  return "planned";
}

function normalizeTerm(term: TermInput): Term {
  if (!term.term.trim()) {
    throw new Error("Course terms must include a non-empty term label.");
  }

  if (!Array.isArray(term.courses)) {
    throw new Error(`Course term "${term.term}" must include a courses array.`);
  }

  return {
    term: term.term.trim(),
    id: term.id ?? slugify(term.term),
    status: inferTermStatus(term),
    ...(term.coop ? { coop: term.coop } : {}),
    courses: term.courses.map(normalizeCourse),
  };
}

export const program = data.program;
export const terms: Term[] = data.terms.map(normalizeTerm);
export const courseNotes = data.notes;

/**
 * Compact, single-string summary of the academic plan for the portfolio
 * assistant's grounding context: the degree, completed terms, and planned
 * terms — course topics only, no grades.
 */
export function formatCoursesSummary(): string {
  const completed = terms.filter((term) => term.status === "completed");
  const planned = terms.filter((term) => term.status === "planned");

  const listTerm = (term: Term): string => {
    const list = term.courses
      .map((course) => [course.code, course.title].filter(Boolean).join(" "))
      .join("; ");
    return `${term.term}${term.coop ? " (co-op work term)" : ""}: ${list}`;
  };

  return [
    `${program.degree} at ${program.school}, ${program.years}.`,
    `Completed terms: ${completed.map(listTerm).join(". ")}.`,
    `Planned terms: ${planned.map(listTerm).join(". ")}.`,
    courseNotes.join(" "),
  ].join(" ");
}
