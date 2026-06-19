/**
 * Pure validation + sanitization helpers for the contact route.
 *
 * Extracted from app/api/contact/route.ts so the rules (required fields, email
 * format, length caps, HTML escaping) can be unit-tested without spinning up
 * the route or Resend. No I/O — safe to import anywhere.
 */

export const maxMessageLength = 3000;

export interface ContactSubmission {
  name: string;
  email: string;
  company: string;
  role: string;
  message: string;
  website: string;
}

export interface ValidationResult {
  submission?: ContactSubmission;
  error?: string;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function readString(data: Record<string, unknown>, key: string): string {
  const value = data[key];
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/gu, " ").trim();
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value) && value.length <= 254;
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function validateSubmission(payload: unknown): ValidationResult {
  if (!isRecord(payload)) {
    return { error: "Expected a JSON request body." };
  }

  const submission = {
    name: normalizeWhitespace(readString(payload, "name")).slice(0, 120),
    email: readString(payload, "email").slice(0, 254),
    company: normalizeWhitespace(readString(payload, "company")).slice(0, 140),
    role: normalizeWhitespace(readString(payload, "role")).slice(0, 160),
    message: readString(payload, "message").slice(0, maxMessageLength),
    website: readString(payload, "website").slice(0, 200),
  };

  if (submission.name.length < 2) {
    return { error: "Name is required." };
  }

  if (!isValidEmail(submission.email)) {
    return { error: "A valid email is required." };
  }

  if (submission.message.length < 20) {
    return { error: "Message must be at least 20 characters." };
  }

  return { submission };
}
