import certificatesContent from "@/content/certificates.json";

/**
 * Certificates / certifications shown on the About page.
 *
 * Edit content/certificates.json to add, remove, or reorder certificates.
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

export const certificates = certificatesContent as Certificate[];

/**
 * Single-string summary of certificates for the portfolio assistant's
 * grounding context. Returns an explicit "none yet" sentence when empty so the
 * agent answers honestly instead of guessing.
 */
export function formatCertificates(): string {
  if (certificates.length === 0) {
    return "No certificates or certifications are listed on the site yet.";
  }

  return certificates
    .map((cert) =>
      [
        `${cert.name} - ${cert.issuer} (${cert.date})`,
        cert.credentialId ? `credential ID ${cert.credentialId}` : "",
      ]
        .filter(Boolean)
        .join(", "),
    )
    .join("; ");
}
