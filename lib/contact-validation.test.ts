import { describe, expect, it } from "vitest";
import { escapeHtml, isValidEmail, validateSubmission } from "./contact-validation";

describe("isValidEmail", () => {
  it("accepts valid addresses", () => {
    expect(isValidEmail("a@b.co")).toBe(true);
    expect(isValidEmail("hany.jiang@example.com")).toBe(true);
  });

  it("rejects invalid addresses", () => {
    const invalid = ["", "no-at", "a@b", "a@@b.co", "a b@c.com", `${"x".repeat(250)}@b.co`];
    for (const value of invalid) {
      expect(isValidEmail(value), value).toBe(false);
    }
  });
});

describe("escapeHtml", () => {
  it("escapes HTML-significant characters", () => {
    expect(escapeHtml(`<script>"&'`)).toBe("&lt;script&gt;&quot;&amp;&#39;");
  });
});

describe("validateSubmission", () => {
  const valid = {
    name: "Jane Recruiter",
    email: "jane@corp.com",
    company: "Corp",
    role: "Eng Manager",
    message: "Hello Hany, I'd love to chat about a backend role on our team.",
    website: "",
  };

  it("accepts a complete submission", () => {
    const { submission, error } = validateSubmission(valid);
    expect(error).toBeUndefined();
    expect(submission?.name).toBe("Jane Recruiter");
  });

  it("requires name, valid email, and a long-enough message", () => {
    expect(validateSubmission({ ...valid, name: "a" }).error).toBeTruthy();
    expect(validateSubmission({ ...valid, email: "bad" }).error).toBeTruthy();
    expect(validateSubmission({ ...valid, message: "too short" }).error).toBeTruthy();
  });

  it("rejects non-object payloads", () => {
    expect(validateSubmission(null).error).toBeTruthy();
    expect(validateSubmission("oops").error).toBeTruthy();
  });

  it("trims names and truncates over-long messages", () => {
    const { submission } = validateSubmission({
      ...valid,
      name: "  Jane  ",
      message: "x".repeat(5000),
    });
    expect(submission?.name).toBe("Jane");
    expect(submission?.message.length).toBe(3000);
  });

  it("preserves the honeypot field for the route to inspect", () => {
    const { submission } = validateSubmission({ ...valid, website: "spam.example" });
    expect(submission?.website).toBe("spam.example");
  });
});
