/**
 * Joins conditional class names without pulling a runtime dependency.
 */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}
