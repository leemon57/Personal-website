/**
 * MetadataStrip
 *
 * Renders the role / timeline / stack / status / links row at the top of a
 * case study page, immediately below the title and subtitle.
 *
 * Used by: app/work/[slug]/page.tsx
 */
export interface MetadataStripProps {
  role: string;
  timeline: string;
  stack: string[];
  status: string;
  repo?: string;
  demo?: string;
}

export function MetadataStrip({ role, timeline, stack, status, repo, demo }: MetadataStripProps) {
  const items = [
    { label: "role", value: role },
    { label: "timeline", value: timeline },
    { label: "status", value: status },
    { label: "stack", value: stack.join(", ") },
  ];

  return (
    <dl className="grid gap-4 border-y border-rule py-4 font-mono text-[0.8125rem] leading-normal sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-ink-faint">{item.label}</dt>
          <dd className="mt-1 text-ink-muted">{item.value}</dd>
        </div>
      ))}
      {(repo ?? demo) && (
        <div className="sm:col-span-2">
          <dt className="text-ink-faint">links</dt>
          <dd className="mt-1 flex gap-4 text-ink-muted">
            {repo ? <a href={repo}>repo</a> : null}
            {demo ? <a href={demo}>demo</a> : null}
          </dd>
        </div>
      )}
    </dl>
  );
}
