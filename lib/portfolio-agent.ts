import { certificates, formatCertificates } from "@/lib/certificates";
import { program } from "@/lib/courses";
import { profile } from "@/lib/profile";
import { assistantContent } from "@/lib/site";
import { formatSkillsetGroups, skillsetGroups } from "@/lib/skillset";

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

  const length = rawQuestion.trim().length;
  const posting = countMatchingTerms(question, postingSignals);
  const skills = countMatchingTerms(question, skillSignals);
  // A shorter paste still reads as a JD when it has clear posting + skill
  // signals; a longer paste needs only a single skill hit.
  return (
    (length > 140 && posting >= 2 && skills >= 2) ||
    (length > 220 && posting >= 2 && skills >= 1)
  );
}

/**
 * True when a job-description-match intent carries no actual posting — e.g. the
 * recruiter clicked the "Match a job description" chip (or the suggested
 * question) and sent it with nothing pasted. Strips the assistant's own
 * "match … job description:" lead-in, then checks whether any real posting text
 * remains. Used to prompt for the JD instead of letting the model invent a
 * scorecard from nothing.
 */
export function isEmptyJobDescription(rawQuestion: string): boolean {
  const stripped = normalize(rawQuestion)
    .replaceAll(
      /\b(match|assess|evaluate|rate|score|yourself|hany|me|my|i|to|for|against|how|well|would|do|does|you|your|fit|are|is|the|a|an|this|that|these|role|roles|position|job description|job posting|role description|jd)\b/g,
      " ",
    )
    .replaceAll(/[\s:.,-]+/g, " ")
    .trim();
  // A genuine posting leaves plenty of surviving words; an empty click leaves
  // essentially nothing.
  return stripped.length < 16;
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

const courseworkKeywords = [
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
];

/** True when a question is about coursework (course topics only; no grades). */
export function isCourseworkQuestion(rawQuestion: string): boolean {
  return includesAny(normalize(rawQuestion), courseworkKeywords);
}

// Standard recruiter screening topics, answered from editable presets in
// content/site.json (assistant.screening) so the answer is instant and precise.
const availabilityKeywords = [
  "available",
  "availability",
  "start date",
  "when can",
  "when will he",
  "when is he available",
  "which term",
  "what term",
  "notice period",
  "how soon",
  "open to",
  "open for",
];
const workAuthKeywords = [
  "work authorization",
  "authorized to work",
  "work permit",
  "sponsorship",
  "sponsor",
  "visa",
  "eligible to work",
  "legally allowed",
  "right to work",
  "citizen",
  "permanent resident",
];
const relocationKeywords = [
  "relocate",
  "relocation",
  "willing to move",
  "remote",
  "on-site",
  "on site",
  "onsite",
  "hybrid",
  "which cities",
];
const roleTypeKeywords = [
  "full-time",
  "full time",
  "permanent role",
  "co-op or full",
  "internship or full",
  "type of role",
  "kind of role",
];

/** True for standard recruiter screening questions (availability, work auth…). */
export function isScreeningQuestion(rawQuestion: string): boolean {
  const question = normalize(rawQuestion);
  return (
    includesAny(question, workAuthKeywords) ||
    includesAny(question, availabilityKeywords) ||
    includesAny(question, relocationKeywords) ||
    includesAny(question, roleTypeKeywords)
  );
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

function isWorkExperience(project: AgentProject): boolean {
  return project.category.toLowerCase() === "work experience";
}

/** Skills from the skillset that the pasted job description mentions. */
function matchedSkillsFor(question: string): string[] {
  const all = skillsetGroups.flatMap((group) => group.items);
  return Array.from(new Set(all.filter((skill) => includesTerm(question, skill)))).slice(
    0,
    8,
  );
}

/**
 * Deterministic job-description matcher used as the fallback when the LLM is
 * unavailable. Prioritizes work experience, then projects, then skills, and
 * frames a confident but truthful case. Never invents experience.
 */
function buildJobMatchAnswer(
  rawQuestion: string,
  question: string,
  projects: AgentProject[],
): AgentAnswer {
  if (isEmptyJobDescription(rawQuestion)) {
    return {
      content: `Paste the role's requirements or the full job description and I'll map it to my strongest work, projects, and skills — with links to the proof.`,
      sources: [workExperienceSource, allWorkSource],
    };
  }

  const matches = getJobDescriptionMatches(question, projects);
  const ordered = [
    ...matches.filter(isWorkExperience),
    ...matches.filter((project) => !isWorkExperience(project)),
  ];
  const skills = matchedSkillsFor(question);

  if (ordered.length > 0) {
    const verdict =
      ordered.length >= 2
        ? "I'm a strong fit for this role."
        : "I'm a solid fit for this role.";
    const bullets = ordered
      .map(
        (project) =>
          `• ${project.title} (${project.role}) — ${project.stack.slice(0, 4).join(", ")}`,
      )
      .join("\n");
    const skillLine =
      skills.length > 0
        ? ` On the skills you need, I already work hands-on with ${skills.join(", ")}.`
        : "";
    return {
      content: `${verdict} The closest proof on my site:\n${bullets}${skillLine}\nThe linked case studies below are the evidence to take into the loop.`,
      sources: [...ordered.map(projectSource), skillsetSource].slice(0, 5),
    };
  }

  if (skills.length > 0) {
    return {
      content: `I don't have a one-to-one case study for this exact role yet, but the skill overlap is real — I already work with ${skills.join(", ")}. My core strengths in backend systems, data engineering and analytics, and applied ML carry over directly; the Skillset and projects below are the starting points.`,
      sources: [skillsetSource, allWorkSource, aboutSource],
    };
  }

  return {
    content: `The strongest areas on my site are backend and data engineering, data analytics, applied ML, and full-stack builds. Paste the specific requirements and I'll line them up against my projects and skills, with links.`,
    sources: [aboutSource, skillsetSource, allWorkSource],
  };
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
    return buildJobMatchAnswer(rawQuestion, question, projects);
  }

  // Recruiter screening presets (instant, precise answers from site content).
  // Order: work auth, then relocation, then availability — "relocate/remote"
  // must win over the broad "open to" availability trigger.
  if (includesAny(question, workAuthKeywords)) {
    return {
      content: assistantContent.screening.workAuthorization,
      sources: [aboutSource, profileSource],
    };
  }
  if (includesAny(question, relocationKeywords)) {
    return {
      content: assistantContent.screening.location,
      sources: [aboutSource, profileSource],
    };
  }
  if (includesAny(question, availabilityKeywords)) {
    return {
      content: assistantContent.screening.availability,
      sources: [profileSource, aboutSource],
    };
  }
  if (includesAny(question, roleTypeKeywords)) {
    return {
      content: assistantContent.screening.roleType,
      sources: [aboutSource, allWorkSource],
    };
  }

  if (isLocationQuestion(question)) {
    return {
      content: `I'm based in ${profile.location}. I study ${profile.program} at the ${profile.school} and I'm looking for ${profile.seeking} roles.`,
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
          ? `My certificates: ${formatCertificates()}. They're in the Certificates section on my About page.`
          : `I don't have any certificates listed yet - the Certificates section on my About page will show them as I earn them.`,
      sources: [certificatesSource, aboutSource],
    };
  }

  if (includesAny(question, courseworkKeywords)) {
    return {
      content: `I'm in ${program.degree} at ${program.school} (${program.years}). My coursework spans core CS, math, and statistics — from first-year calculus and functional programming through upper-year machine learning, databases, and statistical modeling. The Courses page lists every term.`,
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
      content: `I'm a ${profile.program} student at the ${profile.school}. My education dates are ${profile.educationDates}.`,
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
      content: `I'm a ${profile.program} student at the ${profile.school}, based in ${profile.location}. My site shows ${profile.focus.toLowerCase()} work, with personal project case studies kept separate from formal work experience.`,
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
      content: `I focus on ${profile.focus.toLowerCase()}. For the exact tools, open my Skillset section; for proof, start with the featured case studies.`,
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
          "I don't have a published Christ City Ministry case study on the site right now.",
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
      content: `My site links to my LinkedIn, but I don't index or answer from LinkedIn's contents here. I can answer from my profile, about, projects, work, contact, and resume links on this site.`,
      sources: [contactSource, aboutSource],
    };
  }

  if (includesAny(question, ["contact", "email", "reach", "github", "message"])) {
    return {
      content: `The quickest way to reach me is email: ${profile.email}. You can also leave your info through the contact form and I'll get back to you by email. My GitHub, LinkedIn, and resume are linked in the footer.`,
      sources: [contactSource, resumeSource],
    };
  }

  if (includesAny(question, ["resume", "cv"])) {
    return {
      content:
        "My resume is in the navigation and footer. The strongest supporting proof is my selected work - especially SPIKE for AI/data systems and TrueCost for product engineering.",
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
          ? `My clearest AI project is ${aiProjects.map((project) => project.title).join(", ")}. ${aiProjects
              .map(formatProject)
              .join("\n")}`
          : "I don't have a dedicated AI project beyond this assistant on my homepage right now.",
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
          ? `Good backend proof on my site: ${backendProjects
              .map((project) => project.title)
              .join(", ")}. ${backendProjects.map(formatProject).join("\n")}`
          : "My site leans backend and data engineering, but I don't see a matching backend case study right now.",
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
      content: `My strongest full-stack examples are ${fullStackProjects
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
      content: `I have ${personalProjects.length} personal project case studies and ${workExperience.length} work experience case studies on the site. Featured ones include ${projects
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
      content: `The clearest overview is my Skillset section on the About page - it groups my tools as ${formatSkillsetGroups()}.`,
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
      content: `I'm open to ${profile.seeking} roles across software engineering, data, and ML. My current case studies are personal projects, kept separate from formal work experience on my work page.`,
      sources: [profileSource, ...projects.slice(0, 3).map(projectSource)],
    };
  }

  if (includesAny(question, ["now", "current", "learning", "reading"])) {
    return {
      content: `Right now my site focuses on my profile and project work. For recruiting: I'm open to ${profile.seeking} roles; for technical proof, start with my project pages.`,
      sources: [aboutSource, allWorkSource],
    };
  }

  return {
    content: `I can answer about my projects, tech stack, education, coursework, certificates, location, resume, contact info, current work, and co-op fit. Try asking about SPIKE, my AI projects, my tech stack, or ${profile.seeking}.`,
    sources: [profileSource, aboutSource, coursesSource, allWorkSource],
  };
}
