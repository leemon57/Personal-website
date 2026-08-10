import Link from "next/link";
import type { ReactNode } from "react";
import type { AgentProject, SourceLink } from "@/lib/portfolio-agent";

/**
 * Rich rendering for assistant answers ("Serene Bento" skin):
 *  - AgentAnswerBody: renders answer text as light markdown (bold / italic /
 *    inline code / links / bullet + numbered lists), or as a visual fit
 *    scorecard (meter + ✓/~/✗ checklist) when the answer is a job-match.
 *  - AgentAnswerSources: renders cited project sources as rich cards (title,
 *    subtitle, stack) and everything else as small source chips.
 *
 * All output is built from React nodes (never dangerouslySetInnerHTML), so
 * model text can't inject markup.
 */

function renderLink(url: string, label: string, key: string): ReactNode {
  if (url.startsWith("/")) {
    return (
      <Link href={url} key={key}>
        {label}
      </Link>
    );
  }
  return (
    <a href={url} key={key} rel="noreferrer" target="_blank">
      {label}
    </a>
  );
}

/** Parse inline markdown: **bold**, *italic*, `code`, [text](url), bare URLs. */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let buffer = "";
  let index = 0;
  let key = 0;

  const flush = () => {
    if (buffer) {
      nodes.push(buffer);
      buffer = "";
    }
  };

  while (index < text.length) {
    if (text.startsWith("**", index)) {
      const end = text.indexOf("**", index + 2);
      if (end !== -1) {
        flush();
        nodes.push(
          <strong key={`${keyPrefix}-b-${key++}`}>
            {text.slice(index + 2, end)}
          </strong>,
        );
        index = end + 2;
        continue;
      }
    }
    if (text[index] === "`") {
      const end = text.indexOf("`", index + 1);
      if (end !== -1) {
        flush();
        nodes.push(
          <code key={`${keyPrefix}-c-${key++}`}>{text.slice(index + 1, end)}</code>,
        );
        index = end + 1;
        continue;
      }
    }
    if (text[index] === "[") {
      const closeBracket = text.indexOf("]", index + 1);
      if (closeBracket !== -1 && text[closeBracket + 1] === "(") {
        const closeParen = text.indexOf(")", closeBracket + 2);
        if (closeParen !== -1) {
          const label = text.slice(index + 1, closeBracket);
          const url = text.slice(closeBracket + 2, closeParen);
          if (/^(https?:\/\/|\/)/u.test(url)) {
            flush();
            nodes.push(renderLink(url, label, `${keyPrefix}-l-${key++}`));
            index = closeParen + 1;
            continue;
          }
        }
      }
    }
    if (text[index] === "*") {
      const end = text.indexOf("*", index + 1);
      if (end > index + 1 && !text.slice(index + 1, end).includes("\n")) {
        flush();
        nodes.push(
          <em key={`${keyPrefix}-i-${key++}`}>{text.slice(index + 1, end)}</em>,
        );
        index = end + 1;
        continue;
      }
    }
    if (text.startsWith("http://", index) || text.startsWith("https://", index)) {
      const match = /^https?:\/\/[^\s)]+/u.exec(text.slice(index));
      if (match) {
        flush();
        const url = match[0];
        nodes.push(
          renderLink(url, url.replace(/^https?:\/\//u, ""), `${keyPrefix}-u-${key++}`),
        );
        index += url.length;
        continue;
      }
    }
    buffer += text[index];
    index += 1;
  }
  flush();
  return nodes;
}

function renderBlocks(content: string): ReactNode[] {
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  let block = 0;

  const flushList = () => {
    if (list.length > 0) {
      const items = list;
      blocks.push(
        <ul className="agent-list" key={`ul-${block++}`}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item, `li-${block}-${itemIndex}`)}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };

  for (const raw of content.split("\n")) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }
    const bullet = /^[-*•]\s+(.*)$/u.exec(line) ?? /^\d+\.\s+(.*)$/u.exec(line);
    if (bullet) {
      list.push(bullet[1] ?? "");
      continue;
    }
    const heading = /^#{1,6}\s+(.*)$/u.exec(line);
    if (heading) {
      flushList();
      blocks.push(
        <p className="agent-heading" key={`h-${block++}`}>
          {renderInline(heading[1] ?? "", `h-${block}`)}
        </p>,
      );
      continue;
    }
    flushList();
    blocks.push(
      <p key={`p-${block++}`}>{renderInline(line, `p-${block}`)}</p>,
    );
  }
  flushList();
  return blocks;
}

const scoreMarker = /(^|\n)\s*(?:[-*•]\s*)?[✓~✗]/gu;

function isScorecard(content: string): boolean {
  return (content.match(scoreMarker) ?? []).length >= 2;
}

type ScoreStatus = "met" | "partial" | "gap";

function Scorecard({ content }: { content: string }) {
  const items: { status: ScoreStatus; text: string }[] = [];
  const intro: string[] = [];
  const outro: string[] = [];
  let seenMark = false;

  for (const raw of content.split("\n")) {
    const line = raw.trim();
    if (!line) {
      continue;
    }
    const match = /^[-*•]?\s*([✓~✗])\s*(.*)$/u.exec(line);
    if (match) {
      seenMark = true;
      const symbol = match[1];
      const status: ScoreStatus =
        symbol === "✓" ? "met" : symbol === "~" ? "partial" : "gap";
      items.push({ status, text: match[2] ?? "" });
    } else if (seenMark) {
      outro.push(line);
    } else {
      intro.push(line);
    }
  }

  const met = items.filter((item) => item.status === "met").length;
  const partial = items.filter((item) => item.status === "partial").length;
  const total = items.length;
  const percent =
    total > 0 ? Math.round(((met + partial * 0.5) / total) * 100) : 0;

  return (
    <div className="scorecard">
      {intro.length > 0 ? (
        <p className="scorecard-verdict">
          {renderInline(intro.join(" "), "score-intro")}
        </p>
      ) : null}
      <div className="scorecard-meter">
        <div className="scorecard-meter-track">
          <div className="scorecard-meter-fill" style={{ width: `${percent}%` }} />
        </div>
        <span className="scorecard-meter-label">
          {met}/{total} met{partial > 0 ? ` · ${partial} partial` : ""}
        </span>
      </div>
      <ul className="scorecard-list">
        {items.map((item, index) => (
          <li className="scorecard-item" data-status={item.status} key={index}>
            <span aria-hidden="true" className="scorecard-badge">
              {item.status === "met" ? "✓" : item.status === "partial" ? "~" : "✗"}
            </span>
            <span>{renderInline(item.text, `score-${index}`)}</span>
          </li>
        ))}
      </ul>
      {outro.length > 0 ? (
        <p className="scorecard-outro">
          {renderInline(outro.join(" "), "score-outro")}
        </p>
      ) : null}
    </div>
  );
}

export function AgentAnswerBody({ content }: { content: string }) {
  if (isScorecard(content)) {
    return <Scorecard content={content} />;
  }
  return <>{renderBlocks(content)}</>;
}

export function AgentAnswerSources({
  sources,
  projects,
}: {
  sources?: SourceLink[];
  projects: AgentProject[];
}) {
  if (!sources || sources.length === 0) {
    return null;
  }
  const projectBySlug = new Map(projects.map((project) => [project.slug, project]));
  const projectSources = sources.filter((source) => source.id.startsWith("work:"));
  const otherSources = sources.filter((source) => !source.id.startsWith("work:"));

  return (
    <>
      {projectSources.length > 0 ? (
        <div className="agent-project-cards">
          {projectSources.map((source) => {
            const project = projectBySlug.get(source.id.replace("work:", ""));
            return (
              <Link className="agent-project-card" href={source.href} key={source.id}>
                <span className="agent-project-card-title">{source.label}</span>
                {project?.subtitle ? (
                  <span className="agent-project-card-sub">{project.subtitle}</span>
                ) : null}
                {project?.stack && project.stack.length > 0 ? (
                  <span className="agent-project-card-stack">
                    {project.stack.slice(0, 4).map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </span>
                ) : null}
                <span className="agent-project-card-cta">Open case study →</span>
              </Link>
            );
          })}
        </div>
      ) : null}
      {otherSources.length > 0 ? (
        <div aria-label="Sources" className="agent-sources">
          {otherSources.map((source) =>
            source.href.startsWith("/") ? (
              <Link href={source.href} key={`${source.id}-${source.href}`}>
                {source.label}
              </Link>
            ) : (
              <a href={source.href} key={`${source.id}-${source.href}`}>
                {source.label}
              </a>
            ),
          )}
        </div>
      ) : null}
    </>
  );
}
