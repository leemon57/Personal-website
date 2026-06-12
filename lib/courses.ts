/**
 * Academic plan — University of Waterloo, Data Science (2024-2028).
 *
 * Source: Hany's UniPlan worksheet. Completed terms include the final
 * percentage grade; later terms are planned and list course codes only.
 * Course titles are the standard UW calendar names; a handful of upper-year
 * electives are intentionally left untitled until confirmed.
 *
 * Used by: app/courses/page.tsx
 */

export type TermStatus = "completed" | "planned";

export interface Course {
  code: string;
  title?: string;
  /** Final grade as a percentage, present only for completed courses. */
  grade?: number;
}

export interface Term {
  /** Display label, e.g. "Fall 2024". */
  term: string;
  /** Plain term id used as a React key, e.g. "fall-2024". */
  id: string;
  status: TermStatus;
  /** Term average (percentage) for completed terms. */
  average?: number;
  /** Term GPA on the UW 4.0 scale for completed terms. */
  gpa?: number;
  /** Marks a term that also carries a co-op work term. */
  coop?: boolean;
  courses: Course[];
}

export const program = {
  degree: "Honours Data Science (Co-op)",
  school: "University of Waterloo",
  years: "2024 - 2028",
};

export const gpaStats = [
  { label: "Cumulative", value: "78.9%", detail: "3.24 GPA" },
  { label: "CS average", value: "77.2%", detail: "core CS" },
  { label: "Math average", value: "74.1%", detail: "math + stat" },
  { label: "Terms done", value: "4", detail: "of 8 study terms" },
];

export const terms: Term[] = [
  {
    term: "Fall 2024",
    id: "fall-2024",
    status: "completed",
    average: 80.4,
    gpa: 3.5,
    courses: [
      { code: "CS 135", title: "Designing Functional Programs", grade: 81 },
      { code: "MATH 135", title: "Algebra for Honours Mathematics", grade: 76 },
      { code: "MATH 137", title: "Calculus 1 for Honours Mathematics", grade: 74 },
      { code: "ECON 102", title: "Introduction to Macroeconomics", grade: 85 },
      { code: "ENGL 109", title: "Introduction to Academic Writing", grade: 86 },
    ],
  },
  {
    term: "Winter 2025",
    id: "winter-2025",
    status: "completed",
    average: 78.3,
    gpa: 3.18,
    courses: [
      { code: "CS 136", title: "Elementary Algorithm Design & Data Abstraction", grade: 82 },
      { code: "CS 136L", title: "Tools & Techniques for Software Development" },
      { code: "MATH 136", title: "Linear Algebra 1 for Honours Mathematics", grade: 78 },
      { code: "STAT 230", title: "Probability", grade: 60 },
      { code: "AFM 101", title: "Introduction to Financial Accounting", grade: 93 },
    ],
  },
  {
    term: "Spring 2025",
    id: "spring-2025",
    status: "completed",
    average: 82.2,
    gpa: 3.44,
    courses: [
      { code: "CS 246", title: "Object-Oriented Software Development", grade: 79 },
      { code: "MATH 138", title: "Calculus 2 for Honours Mathematics", grade: 79 },
      { code: "MATH 235", title: "Linear Algebra 2 for Honours Mathematics", grade: 71 },
      { code: "ECON 101", title: "Introduction to Microeconomics", grade: 89 },
      { code: "AFM 102", title: "Managerial & Cost Accounting", grade: 93 },
    ],
  },
  {
    term: "Winter 2026",
    id: "winter-2026",
    status: "completed",
    average: 74.8,
    gpa: 2.86,
    courses: [
      { code: "CS 241", title: "Foundations of Sequential Programs", grade: 76 },
      { code: "CS 245", title: "Logic & Computation", grade: 68 },
      { code: "MATH 237", title: "Calculus 3 for Honours Mathematics", grade: 75 },
      { code: "STAT 231", title: "Statistics", grade: 64 },
      { code: "HRM 200", title: "Basic Human Resources Management", grade: 91 },
    ],
  },
  {
    term: "Fall 2026",
    id: "fall-2026",
    status: "planned",
    courses: [
      { code: "CS 240", title: "Data Structures & Data Management" },
      { code: "CS 251", title: "Computer Organization & Design" },
      { code: "CS 370", title: "Numerical Computation" },
      { code: "MATH 239", title: "Introduction to Combinatorics" },
      { code: "STAT 332", title: "Sampling & Experimental Design" },
    ],
  },
  {
    term: "Spring 2027",
    id: "spring-2027",
    status: "planned",
    coop: true,
    courses: [
      { code: "CS 341", title: "Algorithms" },
      { code: "CS 348", title: "Introduction to Database Management" },
      { code: "STAT 331", title: "Applied Linear Models" },
      { code: "STAT 333", title: "Stochastic Processes 1" },
    ],
  },
  {
    term: "Winter 2028",
    id: "winter-2028",
    status: "planned",
    courses: [
      { code: "CS 431", title: "Data-Intensive Distributed Computing" },
      { code: "STAT 330", title: "Mathematical Statistics" },
      { code: "STAT 341", title: "Computational Statistics & Data Analysis" },
      { code: "STAT 443", title: "Forecasting" },
      { code: "ENGL 379" },
    ],
  },
  {
    term: "Fall 2028",
    id: "fall-2028",
    status: "planned",
    coop: true,
    courses: [
      { code: "CS 479" },
      { code: "CS 480", title: "Introduction to Machine Learning" },
      { code: "CS 484", title: "Computational Vision" },
      { code: "STAT 442", title: "Data Visualization" },
    ],
  },
];

export const courseNotes = [
  "Co-op work terms (Waterloo Works) are interspersed between study terms; tagged on the terms above.",
  "Upper-year focus leans into machine learning (CS 480 / 484 / 485 / 486) and statistical learning (STAT 440-444).",
  "GEOG 225 is planned as a breadth elective, term to be scheduled.",
];

/**
 * Compact, single-string summary of the academic plan for the portfolio
 * assistant's grounding context. Includes the degree, GPA stats, completed
 * terms with grades, and planned terms.
 */
export function formatCoursesSummary(): string {
  const completed = terms.filter((term) => term.status === "completed");
  const planned = terms.filter((term) => term.status === "planned");

  const completedText = completed
    .map((term) => {
      const list = term.courses
        .map((course) =>
          [
            course.code,
            course.title,
            typeof course.grade === "number" ? `${course.grade}%` : "credit",
          ]
            .filter(Boolean)
            .join(" "),
        )
        .join("; ");
      return `${term.term} (term average ${term.average}%, GPA ${term.gpa?.toFixed(2)}): ${list}`;
    })
    .join(". ");

  const plannedText = planned
    .map((term) => {
      const list = term.courses
        .map((course) => [course.code, course.title].filter(Boolean).join(" "))
        .join("; ");
      return `${term.term}${term.coop ? " (co-op work term)" : ""}: ${list}`;
    })
    .join(". ");

  const stats = gpaStats
    .map((stat) => `${stat.label} ${stat.value} (${stat.detail})`)
    .join("; ");

  return [
    `${program.degree} at ${program.school}, ${program.years}.`,
    `Grade summary: ${stats}.`,
    `Completed terms with grades: ${completedText}.`,
    `Planned terms: ${plannedText}.`,
    courseNotes.join(" "),
  ].join(" ");
}
