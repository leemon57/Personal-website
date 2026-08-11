import { describe, expect, it } from "vitest";
import {
  answerPortfolioQuestion,
  isEmptyJobDescription,
  isJobDescriptionMatchQuestion,
  type AgentProject,
} from "@/lib/portfolio-agent";

describe("answerPortfolioQuestion coursework (grades removed)", () => {
  const questions = [
    "What is your GPA?",
    "What grades did you get?",
    "Tell me about your coursework",
  ];

  it("answers coursework questions without revealing any grade or GPA", () => {
    for (const question of questions) {
      const answer = answerPortfolioQuestion(question, []);
      expect(answer.content).not.toMatch(/\bGPA\b/iu);
      expect(answer.content).not.toMatch(/\d\.\d{1,2}\b/u); // any "x.xx GPA"
      expect(answer.content).not.toMatch(/\d{2}\s*%/u); // e.g. 78%
      // Still points to the coursework / Courses page.
      expect(answer.content.toLowerCase()).toContain("course");
    }
  });
});

describe("job-description matching (deterministic fallback)", () => {
  const jd =
    "Software Developer Intern. Key responsibilities: build backend services and REST APIs. Requirements: strong Python and SQL, experience shipping data pipelines and Power BI dashboards, plus AWS, Git, and automation scripting. This is a Winter 2027 co-op position (hybrid).";

  const projects: AgentProject[] = [
    {
      title: "Tickermate - Discord market data bot",
      subtitle: "Serverless bot for market and macro data.",
      slug: "tickermate",
      category: "personal project",
      status: "shipped",
      role: "Full-stack",
      timeline: "2025",
      stack: ["Python", "AWS Lambda", "DynamoDB"],
      featured: true,
      order: 2,
    },
  ];

  it("detects a pasted job description", () => {
    expect(isJobDescriptionMatchQuestion(jd)).toBe(true);
  });

  it("maps the role to concrete project evidence with sources", () => {
    const answer = answerPortfolioQuestion(jd, projects);
    expect(answer.content.toLowerCase()).toContain("fit");
    expect(answer.content).toContain("Tickermate - Discord market data bot");
    expect(answer.sources.length).toBeGreaterThan(0);
  });

  it("falls back to skills when no project matches", () => {
    const answer = answerPortfolioQuestion(jd, []);
    // No projects supplied, but the JD's skills (Python, SQL, AWS, Power BI…)
    // should still surface a skills-based case rather than a dead end.
    expect(answer.content.length).toBeGreaterThan(40);
    expect(answer.sources.length).toBeGreaterThan(0);
  });

  it("flags an empty JD-match intent (chip clicked with nothing pasted)", () => {
    expect(isEmptyJobDescription("Match yourself to a job description")).toBe(true);
    expect(isEmptyJobDescription("Match yourself to this job description: ")).toBe(
      true,
    );
    // A real posting is not treated as empty.
    expect(isEmptyJobDescription(jd)).toBe(false);
  });

  it("asks for the posting when the JD is empty instead of inventing a fit", () => {
    const answer = answerPortfolioQuestion(
      "Match yourself to this job description:",
      projects,
    );
    // Should not fabricate a scorecard / fit verdict from nothing.
    expect(answer.content.toLowerCase()).toContain("paste");
    expect(answer.content).not.toContain("✓");
    expect(answer.content).not.toContain("Tickermate - Discord market data bot");
  });
});
