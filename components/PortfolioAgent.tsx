"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useMemo, useRef, useState } from "react";

export interface AgentProject {
  title: string;
  subtitle: string;
  slug: string;
  status: string;
  role: string;
  timeline: string;
  stack: string[];
  repo?: string;
  demo?: string;
  featured: boolean;
  order: number;
}

interface SourceLink {
  label: string;
  href: string;
}

interface AgentMessage {
  id: number;
  role: "assistant" | "user";
  content: string;
  sources?: SourceLink[];
}

interface AgentAnswer {
  content: string;
  sources: SourceLink[];
}

interface PortfolioAgentProps {
  projects: AgentProject[];
}

const suggestedQuestions = [
  "What has Hany built with AI?",
  "Which project shows full-stack work?",
  "Is Hany open to Summer 2026 co-op?",
  "What tech stack does Hany use?",
  "How can I contact Hany?",
];

const profileSource = { label: "Home", href: "/" };
const contactSource = { label: "Email", href: "mailto:hanyjiang@gmail.com" };
const nowSource = { label: "Now", href: "/now" };
const usesSource = { label: "Uses", href: "/uses" };
const resumeSource = { label: "Resume", href: "/resume.pdf" };

function projectSource(project: AgentProject): SourceLink {
  return { label: project.title, href: `/work/${project.slug}` };
}

function SourceAnchor({ source }: { source: SourceLink }) {
  if (source.href.startsWith("/")) {
    return <Link href={source.href}>{source.label}</Link>;
  }

  return <a href={source.href}>{source.label}</a>;
}

function normalize(value: string): string {
  return value.toLowerCase().replaceAll(/[^a-z0-9+#.\s-]/g, " ");
}

function includesAny(value: string, terms: string[]): boolean {
  return terms.some((term) => value.includes(term));
}

function formatProject(project: AgentProject): string {
  return `${project.title}: ${project.subtitle} Role: ${project.role}. Stack: ${project.stack.join(", ")}.`;
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

function getCommonStacks(projects: AgentProject[]): string[] {
  const counts = new Map<string, number>();
  for (const project of projects) {
    for (const item of project.stack) {
      counts.set(item, (counts.get(item) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([item]) => item);
}

function answerQuestion(rawQuestion: string, projects: AgentProject[]): AgentAnswer {
  const question = normalize(rawQuestion);
  const namedProject = findNamedProject(question, projects);

  if (namedProject) {
    return {
      content: formatProject(namedProject),
      sources: [projectSource(namedProject)],
    };
  }

  if (
    includesAny(question, ["contact", "email", "reach", "linkedin", "github", "message"])
  ) {
    return {
      content:
        "You can reach Hany at hanyjiang@gmail.com. His GitHub and LinkedIn are linked in the footer, and the resume link is in the navigation.",
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

  if (includesAny(question, ["ai", "ml", "openai", "agent", "llm", "machine learning"])) {
    const aiProjects = projects.filter((project) => {
      const haystack = normalize(
        `${project.title} ${project.subtitle} ${project.stack.join(" ")}`,
      );
      return includesAny(haystack, ["ai", "ml", "openai"]);
    });
    return {
      content:
        aiProjects.length > 0
          ? `Hany's clearest AI project is ${aiProjects.map((project) => project.title).join(", ")}. ${aiProjects
              .map(formatProject)
              .join("\n")}`
          : "The current project list does not include a dedicated AI project beyond the AI agent interface on this homepage.",
      sources: aiProjects.length > 0 ? aiProjects.map(projectSource) : [profileSource],
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
    return {
      content: `Hany has ${projects.length} case studies on the site. Featured work includes ${projects
        .filter((project) => project.featured)
        .map((project) => project.title)
        .join(", ")}.`,
      sources: [
        { label: "All work", href: "/work" },
        ...projects.filter((project) => project.featured).map(projectSource),
      ],
    };
  }

  if (
    includesAny(question, [
      "stack",
      "technology",
      "tools",
      "language",
      "framework",
      "uses",
    ])
  ) {
    const stacks = getCommonStacks(projects);
    return {
      content: `Across the current case studies, Hany's recurring stack includes ${stacks.join(
        ", ",
      )}. The /uses page has his day-to-day editor, frontend, data, and hardware setup.`,
      sources: [usesSource, { label: "All work", href: "/work" }],
    };
  }

  if (
    includesAny(question, [
      "coop",
      "co-op",
      "intern",
      "internship",
      "hire",
      "summer 2026",
      "fit",
    ])
  ) {
    return {
      content:
        "Hany is open to Summer 2026 co-op roles across software engineering, data, and ML. The best evidence is project work around AI research search, offline-first finance, ETL/schema validation, and full-stack product interfaces.",
      sources: [profileSource, ...projects.slice(0, 3).map(projectSource)],
    };
  }

  if (includesAny(question, ["now", "current", "learning", "reading"])) {
    return {
      content:
        "The /now page says Hany is recruiting for Summer 2026 co-op, extending SPIKE with another schema variant, rereading Designing Data-Intensive Applications, and learning enough Rust to ship the logbook CLI.",
      sources: [nowSource],
    };
  }

  return {
    content:
      "I can answer from the site content about Hany's projects, tech stack, resume, contact info, current work, and co-op fit. Try asking about SPIKE, full-stack work, AI projects, or Summer 2026 co-op.",
    sources: [profileSource, { label: "All work", href: "/work" }, nowSource, usesSource],
  };
}

export function PortfolioAgent({ projects }: PortfolioAgentProps) {
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Ask me about Hany's projects, stack, resume, or co-op fit. I answer from the content on this site and link the sources I used.",
      sources: [profileSource, { label: "All work", href: "/work" }],
    },
  ]);
  const [input, setInput] = useState("");
  const nextId = useRef(2);
  const projectCount = useMemo(() => projects.length, [projects.length]);

  function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed) {
      return;
    }

    const answer = answerQuestion(trimmed, projects);
    setMessages((current) => [
      ...current,
      { id: nextId.current++, role: "user", content: trimmed },
      {
        id: nextId.current++,
        role: "assistant",
        content: answer.content,
        sources: answer.sources,
      },
    ]);
    setInput("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(input);
  }

  return (
    <section aria-labelledby="agent-title" className="agent-card" id="ask-hany">
      <div className="agent-topline">
        <div>
          <p className="caps" id="agent-title">
            Portfolio assistant
          </p>
          <h2>Ask Hany</h2>
        </div>
        <p className="agent-fact">{projectCount} case studies indexed</p>
      </div>

      <div className="agent-transcript" aria-live="polite">
        {messages.map((message) => (
          <article className={`agent-message ${message.role}`} key={message.id}>
            <p className="agent-role">
              {message.role === "assistant" ? "Assistant" : "You"}
            </p>
            {message.content.split("\n").map((line, index) => (
              <p key={`${message.id}-line-${index}`}>{line}</p>
            ))}
            {message.sources && message.sources.length > 0 ? (
              <div className="agent-sources" aria-label="Sources">
                {message.sources.map((source) => (
                  <SourceAnchor
                    key={`${message.id}-${source.href}-${source.label}`}
                    source={source}
                  />
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <div className="agent-suggestions" aria-label="Suggested questions">
        {suggestedQuestions.map((question) => (
          <button key={question} onClick={() => ask(question)} type="button">
            {question}
          </button>
        ))}
      </div>

      <form className="agent-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="agent-question">
          Ask a question about Hany
        </label>
        <input
          autoComplete="off"
          id="agent-question"
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about projects, stack, resume, or co-op fit..."
          type="text"
          value={input}
        />
        <button type="submit">Ask</button>
      </form>
    </section>
  );
}
