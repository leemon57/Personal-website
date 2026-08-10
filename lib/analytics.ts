import { track } from "@vercel/analytics";

/**
 * Thin wrapper over Vercel Analytics custom events. No-ops safely when analytics
 * is unavailable (e.g. local dev) so call sites never need to guard. Client-only.
 *
 * Used for lightweight recruiter signal: what people ask the assistant and which
 * projects they open.
 */
export function trackEvent(
  name: string,
  props?: Record<string, string | number | boolean | null>,
): void {
  try {
    track(name, props);
  } catch {
    // Analytics not initialized — ignore.
  }
}
