import { certificates, formatCertificates } from "@/lib/certificates";
import { gpaStats, program } from "@/lib/courses";
import { profile } from "@/lib/profile";
import { formatSkillsetGroups } from "@/lib/skillset";

export interface AgentProject {
  title: string;
  subtitle: string;
  slug: string;
  category: string;
  status: string;
  role: string;
  timeline: string;
  stack: string[];
  repo?: string;
  demo?: string;
  featured: boolean;
  order: number;
}

export interface SourceLink {
  id: string;
  label: string;
  href: string;
}

export interface AgentAnswer {
  content: string;
  sources: SourceLink[];
}

export interface AgentHistoryMessage {
  role: "assistant" | "user";
  content: string;
}

export const profileSource: SourceLink = { id: "home", label: "Home", href: "/" };
export const allWorkSource: SourceLink = {
  id: "projects",
  label: "Personal projects",
  href: "/projects",
};
export const workExperienceSource: SourceLink = {
  id: "work",
  label: "Work experience",
  href: "/work",
};
export const contactSource: SourceLink = {
  id: "contact",
  label: "Contact",
  href: "/contact",
};
export const resumeSource: SourceLink = {
  id: "resume",
  label: "Resume",
  href: "/resume.pdf",
};
export const aboutSource: SourceLink = { id: "about", label: "About", href: "/about" };
export const skillsetSource: SourceLink = {
  id: "skillset",
  label: "Skillset",
  href: "/about#skillset",
};
export const coursesSource: SourceLink = {
  id: "courses",
  label: "Courses",
  href: "/courses",
};
export const certificatesSource: SourceLink = {
  id: "certificates",
  label: "Certificates",
  href: "/about#certificates",
};

function possessiveName(name: string): string {
  return name.endsWith("s") ? `${name}'` : `${name}'s`;
}

const profilePossessive = possessiveName(profile.name);

export function projectSource(project: AgentProject): SourceLink {
  return {
    id: `work:${project.slug}`,
    label: project.title,
    href:
      project.category.toLowerCase() === "work experience"
        ? `/work/${project.slug}`
        : `/projects/${project.slug}`,
  };
}

export function getAgentSourceRegistry(projects: AgentProject[]): SourceLink[] {
  return [
    profileSource,
    aboutSource,
    skillsetSource,
    coursesSource,
    certificatesSource,
    allWorkSource,
    workExperienceSource,
    contactSource,
    resumeSource,
    ...projects.map(projectSource),
  ];
}

function normalize(value: string): string {
  return value.toLowerCase().replaceAll(/[^a-z0-9+#.\s-]/g, " ");
}

function includesTerm(value: string, term: string): boolean {
  const normalizedTerm = normalize(term).trim();
  if (/^[a-z0-9]{1,2}$/u.test(normalizedTerm)) {
    return value.split(/\s+/u).includes(normalizedTerm);
  }

  return value.includes(normalizedTerm);
}

function includesAny(value: string, terms: string[]): boolean {
  return terms.some((term) => includesTerm(value, term));
}

function countMatchingTerms(value: string, terms: string[]): number {
  return terms.filter((term) => includesTerm(value, term)).length;
}

export function isJobDescriptionMatchQuestion(rawQuestion: string): boolean {
  const question = normalize(rawQuestion);
  if (
    includesAny(question, [
      "job description",
      "job posting",
      "role description",
      "fit for this role",
      "match this role",
      "match this job",
      "match hany",
      "jd",
    ])
  ) {
    return true;
  }

  const postingSignals = [
    "job title",
    "key responsibilities",
    "required skills",
    "preferred skills",
    "responsibilities",
    "requirements",
    "internship",
    "co-op",
    "co op",
    "full-time",
    "full time",
    "hybrid",
    "vacancy",
    "work hours",
    "pay details",
    "location",
    "start end",
  ];
  const skillSignals = [
    "python",
    "powershell",
    "javascript",
    "typescript",
    "groovy",
    "sql",
    "rest api",
    "rest apis",
    "jira",
    "service desk",
    "git",
    "bitbucket",
    "ci cd",
    "jenkins",
    "aws",
    "cloud",
    "power bi",
    "dashboard",
    "dashboards",
    "scripting",
    "automation",
    "data migration",
    "data validation",
    "documentation",
  ];

  return (
    rawQuestion.trim().length > 300 &&
    countMatchingTerms(question, postingSignals) >= 2 &&
    countMatchingTerms(question, skillSignals) >= 1
  );
}

function isExplicitLocationQuestion(question: string): boolean {
  return includesAny(question, [
    "where is hany based",
    "where is he based",
    "where are you based",
    "where does hany live",
    "where does he live",
    "hany location",
    "hany's location",
    "based in",
    "located in",
  ]);
}

function mentionsKnownLocation(question: string): boolean {
  return includesAny(question, ["waterloo", "waterloo ontario", "waterloo canada"]);
}

export function isEducationQuestion(rawQuestion: string): boolean {
  const question = normalize(rawQuestion);
  return includesAny(question, [
    "education",
    "school",
    "university",
    "waterloo",
    "program",
    "student",
    "study",
    "studying",
    "major",
    "year",
    "2024",
    "2029",
  ]);
}

export function isCourseworkQuestion(rawQuestion: string): boolean {
  const question = normalize(rawQuestion);
  return includesAny(question, [
    "course",
    "courses",
    "coursework",
    "grade",
    "grades",
    "gpa",
    "transcript",
  ]);
}

export function isCertificatesQuestion(rawQuestion: string): boolean {
  const question = normalize(rawQuestion);
  return includesAny(question, [
    "certificate",
    "certificates",
    "certification",
    "certifications",
    "linkedin learning",
  ]);
}

export function isTechStackQuestion(rawQuestion: string): boolean {
  const question = normalize(rawQuestion);
  if (includesAny(question, ["full stack", "full-stack"])) {
    return false;
  }

  return includesAny(question, [
    "tech stack",
    "stack",
    "technology",
    "technologies",
    "tools",
    "toolkit",
    "language",
    "languages",
    "framework",
    "frameworks",
    "use",
    "uses",
  ]);
}

function isLocationQuestion(question: string): boolean {
  if (isJobDescriptionMatchQuestion(question)) {
    return false;
  }

  return isExplicitLocationQuestion(question) || mentionsKnownLocation(question);
}

function formatProject(project: AgentProject): string {
  return `${project.title}: ${project.subtitle} Category: ${project.category}. Role: ${project.role}. Stack: ${project.stack.join(", ")}.`;
}

function projectSearchText(project: AgentProject): string {
  return normalize(
    `${project.title} ${project.subtitle} ${project.category} ${project.role} ${project.stack.join(" ")}`,
  );
}

function findProjectsByTerms(
  projects: AgentProject[],
  terms: string[],
  limit: number,
): AgentProject[] {
  return projects
    .filter((project) => includesAny(projectSearchText(project), terms))
    .slice(0, limit);
}

function findNamedProject(
  question: string,
  projects: AgentProject[],
): AgentProject | undefined {
  return projects.find((project) => {
    const title = normalize(project.title);
    const slug = normalize(project.slug);
    const shortTitle = title.split(" - ")[0] ?? title;
    return question.includes(slug) || question.includes(shortTitle);
  });
}

function getJobDescriptionMatches(
  question: string,
  projects: AgentProject[],
): AgentProject[] {
  const scored = projects.map((project) => {
    const projectText = normalize(
      `${project.title} ${project.subtitle} ${project.role} ${project.stack.join(" ")}`,
    );
    const terms = Array.from(new Set(projectText.split(/\s+/u))).filter(
      (term) => term.length > 2,
    );
    const stackScore = project.stack.filter((item) =>
      includesTerm(question, item),
    ).length;
    const textScore = terms.filter((term) => includesTerm(question, term)).length;

    return {
      project,
      score: stackScore * 4 + textScore,
    };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.project.order - b.project.order)
    .slice(0, 3)
    .map((item) => item.project);
}

export function answerPortfolioQuestion(
  rawQuestion: string,
  projects: AgentProject[],
): AgentAnswer {
  const question = normalize(rawQuestion);
  const namedProject = findNamedProject(question, projects);
  const christCityProject = projects.find(
    (project) => project.slug === "christ-city-ministry",
  );

  if (isJobDescriptionMatchQuestion(rawQuestion)) {
    const matches = getJobDescriptionMatches(question, projects);

    if (matches.length === 0 || rawQuestion.trim().length < 80) {
      return {
        content: `Paste a job description or role requirements and I can map it to ${profilePossessive} strongest supporting projects. I will cite the project pages I use.`,
        sources: [aboutSource, allWorkSource],
      };
    }

    return {
      content: `Best matching case studies: ${matches
        .map((project) => project.title)
        .join(
          ", ",
        )}. Open the linked case studies below; those pages are the proof to use for this role.`,
      sources: matches.map(projectSource),
    };
  }

  if (isLocationQuestion(question)) {
    return {
      content: `${profile.name} is based in ${profile.location}. He studies ${profile.program} at the ${profile.school} and is recruiting for ${profile.seeking} roles.`,
      sources: [aboutSource, profileSource],
    };
  }

  if (
    includesAny(question, [
      "certificate",
      "certificates",
      "certification",
      "certifications",
      "certified",
      "credential",
      "credentials",
      "license",
      "licence",
    ])
  ) {
    return {
      content:
        certificates.length > 0
          ? `${profilePossessive} certificates: ${formatCertificates()}. They are listed in the Certificates section on the About page.`
          : `There are no certificates listed on the site yet. The Certificates section on the About page will list them as ${profile.name} earns them.`,
      sources: [certificatesSource, aboutSource],
    };
  }

  if (
    includesAny(question, [
      "course",
      "courses",
      "class",
      "classes",
      "coursework",
      "gpa",
      "grade",
      "grades",
      "mark",
      "marks",
      "transcript",
      "academic",
      "academics",
      "calculus",
      "combinatorics",
      "took",
      "taken",
      "taking",
    ])
  ) {
    return {
      content: `${profile.name} studies ${program.degree} at ${program.school} (${program.years}). ${gpaStats[0]?.label} grade ${gpaStats[0]?.value} (${gpaStats[0]?.detail}); CS average ${gpaStats[1]?.value}, math and statistics average ${gpaStats[2]?.value}. The Courses page lists every term and grade, from first-year calculus and CS through the planned upper-year machine learning and statistics courses.`,
      sources: [coursesSource],
    };
  }

  if (
    includesAny(question, [
      "education",
      "school",
      "university",
      "waterloo",
      "program",
      "student",
      "study",
      "studying",
      "major",
      "year",
      "2024",
      "2029",
    ])
  ) {
    return {
      content: `${profile.name} is a ${profile.program} student at the ${profile.school}. The site profile lists education dates as ${profile.educationDates}.`,
      sources: [aboutSource, profileSource],
    };
  }

  if (
    !namedProject &&
    includesAny(question, [
      "who is hany",
      "about hany",
      "tell me about hany",
      "introduce hany",
      "profile",
    ])
  ) {
    return {
      content: `${profile.name} is a ${profile.program} student at the ${profile.school}, based in ${profile.location}. This site presents ${profile.focus.toLowerCase()} work, with personal project case studies separated from formal work experience.`,
      sources: [profileSource, aboutSource, allWorkSource, workExperienceSource],
    };
  }

  if (
    !namedProject &&
    includesAny(question, [
      "strength",
      "strengths",
      "specialize",
      "specializes",
      "good at",
      "focus",
      "best at",
    ])
  ) {
    return {
      content: `The site positions ${profile.name} around ${profile.focus.toLowerCase()}. For the exact tools, open the Skillset section; for proof, start with the featured case studies.`,
      sources: [aboutSource, skillsetSource, allWorkSource],
    };
  }

  if (
    includesAny(question, ["christ city ministry"]) ||
    (includesAny(question, ["experience", "work"]) &&
      includesAny(question, ["christ city", "ministry"]))
  ) {
    if (!christCityProject) {
      return {
        content:
          "I do not have a published Christ City Ministry case study in the current site index.",
        sources: [workExperienceSource],
      };
    }

    return {
      content: `${christCityProject.title}: ${christCityProject.subtitle} Category: ${christCityProject.category}. Role: ${christCityProject.role}. Stack: ${christCityProject.stack.join(", ")}.`,
      sources: [projectSource(christCityProject)],
    };
  }

  if (namedProject) {
    return {
      content: formatProject(namedProject),
      sources: [projectSource(namedProject)],
    };
  }

  if (includesAny(question, ["linkedin"])) {
    return {
      content: `This site links to ${profilePossessive} LinkedIn profile, but the agent does not index or answer from LinkedIn page contents. I can answer from the profile, about, projects, work, contact, and resume links available on this site.`,
      sources: [contactSource, aboutSource],
    };
  }

  if (includesAny(question, ["contact", "email", "reach", "github", "message"])) {
    return {
      content: `Employers can leave their contact information through the contact form on this site, and ${profile.name} will message back by email. His direct email, GitHub, LinkedIn, and resume are also linked in the footer.`,
      sources: [contactSource, resumeSource],
    };
  }

  if (includesAny(question, ["resume", "cv"])) {
    return {
      content:
        "The resume is available from the navigation and footer. The strongest supporting proof on the site is the selected work section, especially SPIKE for AI/data systems and TrueCost for product engineering.",
      sources: [resumeSource, ...projects.slice(0, 2).map(projectSource)],
    };
  }

  if (
    includesAny(question, [
      "ai",
      "ml",
      "openai",
      "gemini",
      "agent",
      "llm",
      "machine learning",
    ])
  ) {
    const aiProjects = projects.filter((project) => {
      const haystack = normalize(
        `${project.title} ${project.subtitle} ${project.stack.join(" ")}`,
      );
      return includesAny(haystack, ["ai", "ml", "openai", "gemini"]);
    });
    return {
      content:
        aiProjects.length > 0
          ? `${profilePossessive} clearest AI project is ${aiProjects.map((project) => project.title).join(", ")}. ${aiProjects
              .map(formatProject)
              .join("\n")}`
          : "The current project list does not include a dedicated AI project beyond the AI agent interface on this homepage.",
      sources: aiProjects.length > 0 ? aiProjects.map(projectSource) : [profileSource],
    };
  }

  if (
    !namedProject &&
    includesAny(question, [
      "backend",
      "serverless",
      "aws",
      "api",
      "database",
      "data engineering",
      "websocket",
      "websockets",
    ])
  ) {
    const backendProjects = findProjectsByTerms(
      projects,
      [
        "backend",
        "flask",
        "aws lambda",
        "dynamodb",
        "api",
        "websocket",
        "websockets",
        "sqlite",
        "drizzle",
        "docker",
      ],
      4,
    );
    return {
      content:
        backendProjects.length > 0
          ? `Good backend proof on the site: ${backendProjects
              .map((project) => project.title)
              .join(", ")}. ${backendProjects.map(formatProject).join("\n")}`
          : "The site emphasizes backend and data engineering, but I do not see a matching backend case study in the current index.",
      sources:
        backendProjects.length > 0
          ? [skillsetSource, ...backendProjects.map(projectSource)]
          : [skillsetSource, allWorkSource],
    };
  }

  if (
    includesAny(question, [
      "full stack",
      "full-stack",
      "frontend",
      "backend",
      "web app",
      "built",
    ])
  ) {
    const fullStackProjects = projects.filter((project) => {
      const haystack = normalize(
        `${project.role} ${project.stack.join(" ")} ${project.subtitle}`,
      );
      return includesAny(haystack, [
        "full-stack",
        "next.js",
        "react",
        "flask",
        "hono",
        "postgres",
      ]);
    });
    return {
      content: `The strongest full-stack examples are ${fullStackProjects
        .slice(0, 3)
        .map((project) => project.title)
        .join(", ")}. ${fullStackProjects.slice(0, 3).map(formatProject).join("\n")}`,
      sources: fullStackProjects.slice(0, 3).map(projectSource),
    };
  }

  if (
    includesAny(question, ["project", "portfolio", "work", "case study", "case studies"])
  ) {
    const personalProjects = projects.filter(
      (project) => project.category.toLowerCase() === "personal project",
    );
    const workExperience = projects.filter(
      (project) => project.category.toLowerCase() === "work experience",
    );
    return {
      content: `${profile.name} has ${personalProjects.length} personal project case studies and ${workExperience.length} work experience case studies on the site. Featured projects include ${projects
        .filter((project) => project.featured)
        .map((project) => project.title)
        .join(", ")}.`,
      sources: [
        allWorkSource,
        workExperienceSource,
        ...projects.filter((project) => project.featured).map(projectSource),
      ],
    };
  }

  if (isTechStackQuestion(rawQuestion)) {
    return {
      content: `The clearest overview is the Skillset section on the About page. It groups ${profilePossessive} tools as ${formatSkillsetGroups()}.`,
      sources: [skillsetSource],
    };
  }

  if (
    includesAny(question, [
      "coop",
      "co-op",
      "intern",
      "internship",
      "hire",
      "winter 2027",
      "summer 2026",
      "fit",
    ])
  ) {
    return {
      content: `${profile.name} is open to ${profile.seeking} roles across software engineering, data, and ML. The current case studies are personal projects, separated from formal work experience on the work page.`,
      sources: [profileSource, ...projects.slice(0, 3).map(projectSource)],
    };
  }

  if (includesAny(question, ["now", "current", "learning", "reading"])) {
    return {
      content: `The site is currently focused on ${profilePossessive} profile and project work. For current recruiting context, ${profile.name} is open to ${profile.seeking} roles; for technical proof, start with the project pages.`,
      sources: [aboutSource, allWorkSource],
    };
  }

  return {
    content: `I can answer from the site content about ${profilePossessive} projects, tech stack, education, courses and grades, certificates, location, resume, contact info, current work, and co-op fit. Try asking about SPIKE, his GPA, AI projects, or ${profile.seeking}.`,
    sources: [profileSource, aboutSource, coursesSource, allWorkSource],
  };
}
