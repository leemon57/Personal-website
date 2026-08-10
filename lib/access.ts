import { SignJWT, jwtVerify } from "jose";

/**
 * Recruiter access-gate token.
 *
 * A stateless signed JWT (HS256) gates the /courses grades and the resume PDF.
 * A visitor unlocks by leaving a short message; on submit the server sets this
 * long-lived signed "session" cookie. This module is dependency-light (jose
 * only, no next/headers) so it works in both Node route handlers and Edge
 * middleware.
 *
 * Secret: process.env.ACCESS_SECRET.
 */

export const ACCESS_COOKIE = "hj-access";
export const SESSION_TTL = "365d";
/**
 * Session cookie Max-Age in seconds (1 year). Kept under the browsers' 400-day
 * cookie-lifetime cap. The signed token's expiry (SESSION_TTL) is matched to
 * this so a recruiter who unlocks once effectively never has to re-enter.
 */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 365;

type Purpose = "session";

export interface AccessClaims {
  email: string;
  purpose: Purpose;
}

function secret(): Uint8Array {
  const value = process.env.ACCESS_SECRET;
  if (!value) {
    throw new Error("ACCESS_SECRET is not set");
  }
  return new TextEncoder().encode(value);
}

export async function signToken(
  email: string,
  purpose: Purpose,
  ttl: string,
): Promise<string> {
  return new SignJWT({ email, purpose })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ttl)
    .sign(secret());
}

export async function verifyToken(
  token: string | undefined | null,
): Promise<AccessClaims | null> {
  if (!token) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, secret());
    const email = payload.email;
    if (typeof email !== "string") {
      return null;
    }
    if (payload.purpose !== "session") {
      return null;
    }
    return { email, purpose: "session" };
  } catch {
    return null;
  }
}

/** True only for a valid, unexpired **session** token (not a magic token). */
export async function isSessionUnlocked(
  token: string | undefined | null,
): Promise<boolean> {
  const claims = await verifyToken(token);
  return claims?.purpose === "session";
}

/** Minimal cookie-header parser (for route handlers reading raw headers). */
export function parseCookieHeader(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) {
    return out;
  }
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index === -1) {
      continue;
    }
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key) {
      out[key] = decodeURIComponent(value);
    }
  }
  return out;
}

export async function isUnlockedFromCookieHeader(
  header: string | null,
): Promise<boolean> {
  const token = parseCookieHeader(header)[ACCESS_COOKIE];
  return isSessionUnlocked(token);
}

/**
 * Allowlist gate. When ACCESS_ALLOWED_EMAILS is empty, any email is granted
 * (soft gate + lead capture). When set (comma-separated exact addresses or
 * `@domain` suffixes), only matching emails are granted.
 */
export function isEmailAllowed(email: string): boolean {
  const raw = process.env.ACCESS_ALLOWED_EMAILS?.trim();
  if (!raw) {
    return true;
  }
  const normalized = email.trim().toLowerCase();
  return raw
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
    .some((entry) =>
      entry.startsWith("@") ? normalized.endsWith(entry) : normalized === entry,
    );
}
