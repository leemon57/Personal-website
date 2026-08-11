/**
 * Estimates reading time from plain text at a conservative 220 words per minute.
 */
export function getReadingTime(source: string): string {
  const words = source.trim().split(/\s+/u).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}
