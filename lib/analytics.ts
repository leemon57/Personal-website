/**
 * Thin wrapper over Vercel Analytics custom events.
 *
 * `@vercel/analytics` is a browser module; importing it at module scope drags it
 * into the server render of any (client) component that calls this — which
 * crashes SSR of dynamic routes on Vercel's runtime. So we load it lazily and
 * only in the browser. No-ops safely on the server or when analytics is
 * unavailable, so call sites never need to guard.
 *
 * Used for lightweight recruiter signal: what people ask the assistant and which
 * projects they open.
 */
export function trackEvent(
  name: string,
  props?: Record<string, string | number | boolean | null>,
): void {
  if (typeof window === "undefined") {
    return;
  }
  void import("@vercel/analytics")
    .then(({ track }) => {
      track(name, props);
    })
    .catch(() => {
      // Analytics unavailable — ignore.
    });
}
