"use client";

import Link from "next/link";
import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  allWorkSource,
  answerPortfolioQuestion,
  profileSource,
  type AgentAnswer,
  type AgentHistoryMessage,
  type AgentProject,
  type SourceLink,
} from "@/lib/portfolio-agent";

interface AgentMessage extends AgentHistoryMessage {
  id: number;
  sources?: SourceLink[];
}

interface PortfolioAgentProps {
  projects: AgentProject[];
}

const suggestedQuestions = [
  "What has Hany built with AI?",
  "Which project shows full-stack work?",
  "What courses has Hany taken?",
  "What is Hany's GPA?",
  "Match Hany to a job description",
  "Is Hany open to Winter 2027 co-op?",
  "What tech stack does Hany use?",
  "How can I contact Hany?",
];

/**
 * Renders an assistant/user message body, turning lines that begin with a
 * bullet marker into a real list and the rest into paragraphs. Plain text only
 * (no HTML), so it is safe to render model output directly.
 */
function renderMessageBody(content: string, id: number): ReactNode[] {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const blocks: ReactNode[] = [];
  let bullets: string[] = [];
  let blockIndex = 0;

  const flushBullets = () => {
    if (bullets.length > 0) {
      const items = bullets;
      blocks.push(
        <ul className="agent-list" key={`${id}-ul-${blockIndex++}`}>
          {items.map((item, itemIndex) => (
            <li key={`${id}-li-${blockIndex}-${itemIndex}`}>{item}</li>
          ))}
        </ul>,
      );
      bullets = [];
    }
  };

  for (const line of lines) {
    const bullet = /^[-*•]\s+(.*)$/u.exec(line);
    if (bullet) {
      bullets.push(bullet[1] ?? "");
    } else {
      flushBullets();
      blocks.push(<p key={`${id}-p-${blockIndex++}`}>{line}</p>);
    }
  }

  flushBullets();
  return blocks;
}

function SourceAnchor({ source }: { source: SourceLink }) {
  if (source.href.startsWith("/")) {
    return <Link href={source.href}>{source.label}</Link>;
  }

  return <a href={source.href}>{source.label}</a>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readSourceLinks(value: unknown): SourceLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (
      !isRecord(item) ||
      typeof item.label !== "string" ||
      typeof item.href !== "string"
    ) {
      return [];
    }

    return [
      {
        id: typeof item.id === "string" ? item.id : `${item.label}:${item.href}`,
        label: item.label,
        href: item.href,
      },
    ];
  });
}

function readAgentAnswer(value: unknown): AgentAnswer | undefined {
  if (!isRecord(value) || typeof value.content !== "string") {
    return undefined;
  }

  return {
    content: value.content,
    sources: readSourceLinks(value.sources),
  };
}

export function PortfolioAgent({ projects }: PortfolioAgentProps) {
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hi — I'm Hany's portfolio assistant. Ask me about his projects, tech stack, courses and grades, certificates, resume, or Winter 2027 co-op fit. I answer only from this site and cite the sources I used.",
      sources: [profileSource, allWorkSource],
    },
  ]);
  const [input, setInput] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const nextId = useRef(2);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const projectCount = useMemo(() => projects.length, [projects.length]);

  // Keep the latest message (the question, "thinking", and the reply) in view
  // so it is obvious the assistant responded. Respects reduced-motion via the
  // transcript's CSS scroll-behavior.
  useEffect(() => {
    const el = transcriptRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isAsking]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isAsking) {
      return;
    }

    const history = messages.slice(-6).map(({ role, content }) => ({ role, content }));
    const userMessage: AgentMessage = {
      id: nextId.current++,
      role: "user",
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsAsking(true);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: trimmed, history }),
      });

      if (!response.ok) {
        throw new Error(`Agent request failed with ${response.status}`);
      }

      const answer = readAgentAnswer(await response.json());
      if (!answer) {
        throw new Error("Agent response did not match the expected shape");
      }

      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          role: "assistant",
          content: answer.content,
          sources: answer.sources,
        },
      ]);
    } catch {
      const answer = answerPortfolioQuestion(trimmed, projects);
      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          role: "assistant",
          content: `I could not reach the AI endpoint, so I am using the local site index.\n${answer.content}`,
          sources: answer.sources,
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(input);
  }

  return (
    <section aria-labelledby="agent-title" className="agent-card" id="ask-hany">
      <div className="agent-topline">
        <div className="agent-id">
          <span aria-hidden="true" className="agent-avatar">
            <span className="agent-avatar-core" />
          </span>
          <div>
            <p className="caps" id="agent-title">
              Portfolio assistant
            </p>
            <h2>Ask Hany</h2>
          </div>
        </div>
        <p className="agent-fact">
          {projectCount} case studies · courses · skills indexed
        </p>
      </div>

      <div
        aria-busy={isAsking}
        aria-live="polite"
        className="agent-transcript"
        ref={transcriptRef}
      >
        {messages.map((message) => (
          <article className={`agent-message ${message.role}`} key={message.id}>
            <p className="agent-role">
              {message.role === "assistant" ? "Assistant" : "You"}
            </p>
            {renderMessageBody(message.content, message.id)}
            {message.sources && message.sources.length > 0 ? (
              <div className="agent-sources" aria-label="Sources">
                {message.sources.map((source) => (
                  <SourceAnchor
                    key={`${message.id}-${source.id}-${source.href}`}
                    source={source}
                  />
                ))}
              </div>
            ) : null}
          </article>
        ))}

        {isAsking ? (
          <article aria-hidden="true" className="agent-message assistant typing-bubble">
            <p className="agent-role">Assistant</p>
            <div className="typing">
              <span />
              <span />
              <span />
            </div>
          </article>
        ) : null}
      </div>

      <div className="agent-suggestions" aria-label="Suggested questions">
        {suggestedQuestions.map((question) => (
          <button
            disabled={isAsking}
            key={question}
            onClick={() => void ask(question)}
            type="button"
          >
            {question}
          </button>
        ))}
      </div>

      {isAsking ? (
        <p className="sr-only" role="status">
          Searching the site and writing an answer…
        </p>
      ) : null}

      <form className="agent-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="agent-question">
          Ask a question about Hany
        </label>
        <input
          autoComplete="off"
          disabled={isAsking}
          id="agent-question"
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about projects, stack, resume, or co-op fit..."
          type="text"
          value={input}
        />
        <button disabled={isAsking} type="submit">
          {isAsking ? "Thinking" : "Ask"}
        </button>
      </form>
    </section>
  );
}
