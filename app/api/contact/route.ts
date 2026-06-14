import { NextResponse } from "next/server";
import { profile } from "@/lib/profile";

export const runtime = "nodejs";

const resendEndpoint = "https://api.resend.com/emails";
const maxMessageLength = 3000;
const rateLimitWindowMs = 10 * 60_000;
const rateLimitMaxRequests = 5;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

interface ContactSubmission {
  name: string;
  email: string;
  company: string;
  role: string;
  message: string;
  website: string;
}

interface ValidationResult {
  submission?: ContactSubmission;
  error?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(data: Record<string, unknown>, key: string): string {
  const value = data[key];
  return typeof value === "string" ? value.trim() : "";
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/gu, " ").trim();
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value) && value.length <= 254;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getClientId(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return (
    forwardedFor?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "local"
  );
}

function isRateLimited(request: Request): boolean {
  const clientId = getClientId(request);
  const now = Date.now();
  const current = requestCounts.get(clientId);

  if (!current || current.resetAt <= now) {
    requestCounts.set(clientId, { count: 1, resetAt: now + rateLimitWindowMs });
    return false;
  }

  current.count += 1;
  return current.count > rateLimitMaxRequests;
}

function validateSubmission(payload: unknown): ValidationResult {
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

function buildPlainTextEmail(submission: ContactSubmission, pageUrl: string): string {
  return [
    "New portfolio contact message",
    "",
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Company: ${submission.company || "Not provided"}`,
    `Role / team: ${submission.role || "Not provided"}`,
    `Page: ${pageUrl || "Not provided"}`,
    "",
    "Message:",
    submission.message,
  ].join("\n");
}

function buildHtmlEmail(submission: ContactSubmission, pageUrl: string): string {
  const rows: Array<[string, string]> = [
    ["Name", submission.name],
    ["Email", submission.email],
    ["Company", submission.company || "Not provided"],
    ["Role / team", submission.role || "Not provided"],
    ["Page", pageUrl || "Not provided"],
  ];

  return `
    <div style="font-family: ui-serif, Georgia, serif; color: #1a1a1a; line-height: 1.6;">
      <p style="font: 12px ui-monospace, SFMono-Regular, Consolas, monospace; letter-spacing: .12em; text-transform: uppercase; color: #8b2635;">Portfolio contact</p>
      <h1 style="font-size: 24px; font-weight: 500; margin: 0 0 20px;">New message from ${escapeHtml(submission.name)}</h1>
      <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
        <tbody>
          ${rows
            .map(
              ([label, value]) => `
                <tr>
                  <th style="border-top: 1px solid #e5e5e0; color: #6b6b6b; font: 12px ui-monospace, SFMono-Regular, Consolas, monospace; padding: 8px 12px 8px 0; text-align: left; text-transform: uppercase; width: 130px;">${escapeHtml(label)}</th>
                  <td style="border-top: 1px solid #e5e5e0; padding: 8px 0;">${escapeHtml(value)}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
      <div style="border-top: 1px solid #e5e5e0; margin-top: 24px; max-width: 640px; padding-top: 18px; white-space: pre-wrap;">${escapeHtml(submission.message)}</div>
    </div>
  `;
}

export async function POST(request: Request) {
  if (isRateLimited(request)) {
    return NextResponse.json(
      { error: "Too many contact attempts. Try again shortly." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON request body." }, { status: 400 });
  }

  const { submission, error } = validateSubmission(payload);
  if (!submission) {
    return NextResponse.json({ error }, { status: 400 });
  }

  if (submission.website) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? profile.email;
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL ?? `${profile.name} <onboarding@resend.dev>`;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Contact form is not configured yet." },
      { status: 503 },
    );
  }

  const pageUrl = request.headers.get("referer") ?? "";
  const subject = `Portfolio contact from ${submission.company || submission.name}`;
  const response = await fetch(resendEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: submission.email,
      subject,
      text: buildPlainTextEmail(submission, pageUrl),
      html: buildHtmlEmail(submission, pageUrl),
      tags: [{ name: "source", value: "portfolio-contact" }],
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("Contact email request failed:", response.status, details);
    return NextResponse.json(
      { error: "Message could not be sent right now." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
