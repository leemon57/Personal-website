import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  isEmailAllowed,
  SESSION_MAX_AGE,
  SESSION_TTL,
  signToken,
} from "@/lib/access";
import { profile } from "@/lib/profile";

export const runtime = "nodejs";

const resendEndpoint = "https://api.resend.com/emails";
const rateLimitWindowMs = 10 * 60_000;
const rateLimitMaxRequests = 5;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function getClientId(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return (
    forwardedFor?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "local"
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

function escapeHtml(value: string): string {
  return value
    .replace(/&/gu, "&amp;")
    .replace(/</gu, "&lt;")
    .replace(/>/gu, "&gt;");
}

async function notifyOwner(
  apiKey: string,
  fields: { email: string; name: string; message: string },
): Promise<void> {
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL ?? `${profile.name} <onboarding@resend.dev>`;
  const ownerEmail = process.env.CONTACT_TO_EMAIL ?? profile.email;
  const who = fields.name ? `${fields.name} (${fields.email})` : fields.email;

  const response = await fetch(resendEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [ownerEmail],
      reply_to: fields.email,
      subject: `Portfolio unlocked by ${who}`,
      text: `${who} unlocked your courses/resume and left a message:\n\n${fields.message}`,
      html: `<div style="font-family: ui-serif, Georgia, serif; color:#121212; line-height:1.6;"><p><strong>${escapeHtml(
        who,
      )}</strong> unlocked your courses/resume and left a message:</p><blockquote style="border-left:2px solid #e8e2df; margin:0; padding-left:12px; color:#57534e; white-space:pre-wrap;">${escapeHtml(
        fields.message,
      )}</blockquote></div>`,
      tags: [{ name: "source", value: "portfolio-access" }],
    }),
  });
  if (!response.ok) {
    console.error("Access email failed:", response.status, await response.text());
  }
}

export async function POST(request: Request) {
  if (isRateLimited(request)) {
    return NextResponse.json(
      { error: "Too many requests. Try again shortly." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const body = (payload ?? {}) as Record<string, unknown>;

  // Honeypot: a filled hidden field means a bot — look successful, do nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true, granted: false });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const message =
    typeof body.message === "string" ? body.message.trim().slice(0, 2000) : "";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }
  if (message.length < 2) {
    return NextResponse.json(
      { error: "Leave a short message so I know who you are." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    await notifyOwner(apiKey, { email, name, message });
  } else {
    // Dev convenience: no Resend configured, so log the request locally.
    console.log(`[access] request from ${name || email} <${email}>: ${message}`);
  }

  // Optional allowlist: when set, only matching emails are granted access.
  if (!isEmailAllowed(email)) {
    return NextResponse.json({ ok: true, granted: false });
  }

  const session = await signToken(email, "session", SESSION_TTL);
  const response = NextResponse.json({ ok: true, granted: true });
  response.cookies.set(ACCESS_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
