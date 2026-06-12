/**
 * Certificates / certifications shown on the About page.
 *
 * Add an entry per certificate. `url` (verification link) and `credentialId`
 * are optional; when `url` is set the row links out to it.
 *
 * Example:
 *   {
 *     name: "AWS Certified Cloud Practitioner",
 *     issuer: "Amazon Web Services",
 *     date: "2025",
 *     url: "https://www.credly.com/...",
 *     credentialId: "ABC123",
 *   }
 *
 * Used by: app/about/page.tsx
 */

export interface Certificate {
  name: string;
  issuer: string;
  /** Display date, e.g. "2025" or "Mar 2025". */
  date: string;
  /** Optional verification / credential link. */
  url?: string;
  /** Optional credential id shown as a small mono label. */
  credentialId?: string;
}

export const certificates: Certificate[] = [];
