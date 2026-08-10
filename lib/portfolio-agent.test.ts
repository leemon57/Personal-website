import { describe, expect, it } from "vitest";
import { gpaStats } from "@/lib/courses";
import {
  answerPortfolioQuestion,
  isEmptyJobDescription,
  isJobDescriptionMatchQuestion,
  type AgentProject,
} from "@/lib/portfolio-agent";

describe("answerPortfolioQuestion course gating", () => {
  const gpaValue = gpaStats[0]?.value ?? "";

  it("withholds the GPA for locked (public) visitors", () => {
    const answer = answerPortfolioQuestion("What is Hany's GPA?", []);
    expect(gpaValue).not.toBe("");
    expect(answer.content).not.toContain(gpaValue);
    expect(answer.content.toLowerCase()).toContain("recruiter");
  });

  it("returns the GPA once unlocked", () => {
    const answer = answerPortfolioQuestion("What is Hany's GPA?", [], true);
    expect(answer.content).toContain(gpaValue);
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
