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
    <dl className="meta-strip">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>
            {item.label === "status" ? <span className={`status ${status}`}>{item.value}</span> : item.value}
          </dd>
        </div>
      ))}
      {(repo ?? demo) && (
        <div className="links" style={{ gridColumn: "1 / -1" }}>
          <dt>links</dt>
          <dd>
            {repo ? <a href={repo}>repo</a> : null}
            {demo ? <a href={demo}>demo</a> : null}
          </dd>
        </div>
      )}
    </dl>
  );
}
